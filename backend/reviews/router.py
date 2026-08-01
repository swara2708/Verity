import uuid
import json
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from backend.db.session import get_session
from backend.db.schema import Review, BiasReport, User
from backend.auth.utils import get_current_user, require_hr, CurrentUser
from backend.reviews.agents.evidence_agent import gather_evidence
from backend.reviews.agents.synthesis_agent import synthesize_review
from backend.reviews.agents.bias_agent import analyze_bias

router = APIRouter(prefix="/reviews", tags=["reviews"])

class GenerateReviewRequest(BaseModel):
    employee_id: str

class RejectReviewRequest(BaseModel):
    reason: Optional[str] = None

@router.post("/generate", status_code=status.HTTP_202_ACCEPTED)
def generate_review(
    req: GenerateReviewRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Verify target employee exists in caller's org
    target_user = session.get(User, req.employee_id)
    if not target_user or target_user.org_id != current_user.org_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "not_found", "message": "Employee not found in your organization."}
        )

    # Gather evidence using Evidence Agent
    evidence_data = gather_evidence(req.employee_id, current_user.org_id, session)

    # Synthesize report using Synthesis Agent
    report = synthesize_review(target_user.name, evidence_data)

    # Extract claims from feedback entries and report strengths/growth/impact
    claims_to_match = (
        [f.get("content", "") for f in evidence_data.get("feedback", [])] +
        report.get("strengths", []) +
        report.get("growth_areas", []) +
        report.get("impact_highlights", [])
    )

    # Match claims using Evidence Retrieval Agent
    from backend.reviews.agents.evidence_agent import match_claims_to_evidence
    claim_evidence = match_claims_to_evidence(claims_to_match, evidence_data)
    report["claim_evidence"] = claim_evidence

    # Fetch Organization to check for custom bias_thresholds_json
    from backend.db.schema import Organization
    org = session.get(Organization, current_user.org_id)
    bias_thresholds = json.loads(org.bias_thresholds_json) if org and org.bias_thresholds_json else None

    # Compute deterministic bias scores using Bias Agent
    bias_metrics = analyze_bias(evidence_data, report, claim_evidence, bias_thresholds=bias_thresholds)

    # Check for existing review or create new
    existing_review = session.exec(
        select(Review).where(
            Review.org_id == current_user.org_id,
            Review.employee_id == req.employee_id
        )
    ).first()

    review_id = existing_review.id if existing_review else f"rev_{uuid.uuid4().hex[:8]}"

    if existing_review:
        existing_review.status = "draft"
        existing_review.report_json = json.dumps(report)
        review_obj = existing_review
    else:
        review_obj = Review(
            id=review_id,
            org_id=current_user.org_id,
            employee_id=req.employee_id,
            status="draft",
            report_json=json.dumps(report)
        )
        session.add(review_obj)
    
    session.commit()

    # Create/update bias report
    existing_bias = session.exec(
        select(BiasReport).where(BiasReport.review_id == review_id)
    ).first()

    bias_id = existing_bias.id if existing_bias else f"br_{uuid.uuid4().hex[:8]}"

    if existing_bias:
        existing_bias.recency_score = bias_metrics["recency_score"]
        existing_bias.diversity_score = bias_metrics["diversity_score"]
        existing_bias.unsupported_claims = bias_metrics["unsupported_claims"]
        existing_bias.flags_json = json.dumps({
            "flags": bias_metrics["flags"],
            "explainability_trail": bias_metrics["explainability_trail"]
        })
    else:
        bias_obj = BiasReport(
            id=bias_id,
            review_id=review_id,
            recency_score=bias_metrics["recency_score"],
            diversity_score=bias_metrics["diversity_score"],
            unsupported_claims=bias_metrics["unsupported_claims"],
            flags_json=json.dumps({
                "flags": bias_metrics["flags"],
                "explainability_trail": bias_metrics["explainability_trail"]
            })
        )
        session.add(bias_obj)

    session.commit()

    return {
        "review_id": review_id,
        "status": "draft"
    }

@router.get("/{id}")
def get_review(
    id: str,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    review = session.get(Review, id)
    if not review:
        # Fallback check by employee_id if id is passed as employee_id
        review = session.exec(
            select(Review).where(
                Review.org_id == current_user.org_id,
                Review.employee_id == id
            )
        ).first()

    if not review or review.org_id != current_user.org_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "not_found", "message": "Review not found."}
        )

    bias = session.exec(
        select(BiasReport).where(BiasReport.review_id == review.id)
    ).first()

    report_dict = json.loads(review.report_json) if review.report_json else {}
    
    parsed_flags_json = json.loads(bias.flags_json) if bias and bias.flags_json else {}
    if isinstance(parsed_flags_json, list):
        flags_array = parsed_flags_json
        trail_dict = {}
    else:
        flags_array = parsed_flags_json.get("flags", [])
        trail_dict = parsed_flags_json.get("explainability_trail", {})

    bias_dict = {
        "recency_score": bias.recency_score if bias else 0.0,
        "diversity_score": bias.diversity_score if bias else 0.0,
        "unsupported_claims": bias.unsupported_claims if bias else 0,
        "flags": flags_array,
        "explainability_trail": trail_dict
    }

    return {
        "review_id": review.id,
        "employee_id": review.employee_id,
        "status": review.status,
        "report": report_dict,
        "bias_report": bias_dict
    }

from backend.utils.email import send_review_status_email

@router.post("/{id}/approve")
def approve_review(
    id: str,
    current_user: CurrentUser = Depends(require_hr),
    session: Session = Depends(get_session)
):
    review = session.get(Review, id)
    if not review or review.org_id != current_user.org_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "not_found", "message": "Review not found."}
        )

    review.status = "approved"
    review.approved_by = current_user.id
    review.approved_at = datetime.utcnow()
    session.add(review)
    session.commit()

    # Send status email notification (failsafe try/except)
    employee = session.get(User, review.employee_id)
    if employee and employee.email:
        try:
            send_review_status_email(to_email=employee.email, employee_name=employee.name, status="approved")
        except Exception as e:
            print(f"[Email Error] Failed to send approval email to {employee.email}: {e}")

    return {
        "review_id": review.id,
        "status": "approved",
        "approved_at": review.approved_at.isoformat() + "Z"
    }

@router.post("/{id}/reject")
def reject_review(
    id: str,
    req: RejectReviewRequest,
    current_user: CurrentUser = Depends(require_hr),
    session: Session = Depends(get_session)
):
    review = session.get(Review, id)
    if not review or review.org_id != current_user.org_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "not_found", "message": "Review not found."}
        )

    review.status = "needs_input"
    session.add(review)
    session.commit()

    # Send status email notification (failsafe try/except)
    employee = session.get(User, review.employee_id)
    if employee and employee.email:
        try:
            send_review_status_email(to_email=employee.email, employee_name=employee.name, status="needs_input", reason=req.reason or "")
        except Exception as e:
            print(f"[Email Error] Failed to send rejection email to {employee.email}: {e}")

    return {
        "review_id": review.id,
        "status": "needs_input"
    }
