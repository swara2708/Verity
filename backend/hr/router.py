from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from backend.db.session import get_session
from backend.db.schema import Organization, User, Review, Evidence
from backend.auth.utils import require_hr, CurrentUser

router = APIRouter(prefix="/hr", tags=["hr"])

@router.get("/requests")
def get_pending_requests(
    current_user: CurrentUser = Depends(require_hr),
    session: Session = Depends(get_session)
):
    # Filter strictly by org_id from JWT
    pending_users = session.exec(
        select(User).where(User.org_id == current_user.org_id, User.status == "pending")
    ).all()

    requests = [
        {
            "user_id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "department": u.department or "General",
            "requested_at": u.created_at.isoformat() + "Z"
        }
        for u in pending_users
    ]
    return {"requests": requests}

@router.post("/requests/{user_id}/approve")
def approve_user_request(
    user_id: str,
    current_user: CurrentUser = Depends(require_hr),
    session: Session = Depends(get_session)
):
    user = session.get(User, user_id)
    if not user or user.org_id != current_user.org_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "not_found", "message": "Pending request not found in your organization."}
        )

    user.status = "active"
    session.add(user)
    session.commit()
    return {"user_id": user.id, "status": "active"}

@router.post("/requests/{user_id}/reject")
def reject_user_request(
    user_id: str,
    current_user: CurrentUser = Depends(require_hr),
    session: Session = Depends(get_session)
):
    user = session.get(User, user_id)
    if not user or user.org_id != current_user.org_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "not_found", "message": "Pending request not found in your organization."}
        )

    user.status = "rejected"
    session.add(user)
    session.commit()
    return {"user_id": user.id, "status": "rejected"}

@router.get("/overview")
def get_hr_overview(
    current_user: CurrentUser = Depends(require_hr),
    session: Session = Depends(get_session)
):
    org = session.get(Organization, current_user.org_id)
    org_name = org.name if org else "Organization"

    # Fetch all active users in current user's org except hr_admin
    employees = session.exec(
        select(User).where(User.org_id == current_user.org_id, User.role != "hr_admin")
    ).all()

    emp_list = []
    for emp in employees:
        # Find latest review status for employee
        latest_review = session.exec(
            select(Review).where(Review.org_id == current_user.org_id, Review.employee_id == emp.id)
        ).first()
        
        status_val = latest_review.status if latest_review else "pending"
        emp_list.append({
            "id": emp.id,
            "name": emp.name,
            "department": emp.department or "Engineering",
            "role": emp.role,
            "status": emp.status,
            "review_status": status_val
        })

    return {
        "org_name": org_name,
        "employees": emp_list
    }

@router.get("/audit-trail")
def get_audit_trail(
    current_user: CurrentUser = Depends(require_hr),
    session: Session = Depends(get_session)
):
    """
    Returns an audit log trail showing who submitted what evidence,
    user approval actions, and HR review decision history.
    """
    logs = []

    # 1. User approval / creation activity
    users = session.exec(
        select(User).where(User.org_id == current_user.org_id)
    ).all()

    for u in users:
        logs.append({
            "timestamp": u.created_at.isoformat() + "Z" if hasattr(u.created_at, "isoformat") else str(u.created_at),
            "actor": u.name,
            "action": f"User Account ({u.role}) registered in status '{u.status}'",
            "target": f"User: {u.email}",
            "type": "governance"
        })

    # 2. Evidence activity
    evidence_items = session.exec(
        select(Evidence).where(Evidence.org_id == current_user.org_id)
    ).all()

    for ev in evidence_items:
        logs.append({
            "timestamp": ev.date,
            "actor": ev.submitted_by or "System",
            "action": f"Submitted formal evidence item ({ev.evidence_type}): {ev.description}",
            "target": f"Employee ID: {ev.employee_id}",
            "type": "evidence"
        })

    # 3. Review decision activity
    reviews = session.exec(
        select(Review).where(Review.org_id == current_user.org_id)
    ).all()

    for rev in reviews:
        if rev.approved_at:
            logs.append({
                "timestamp": rev.approved_at.isoformat() + "Z",
                "actor": rev.approved_by or current_user.name,
                "action": f"HR Approved performance review report ({rev.id})",
                "target": f"Employee ID: {rev.employee_id}",
                "type": "review_approval"
            })

    # Sort logs chronologically descending
    logs.sort(key=lambda x: x["timestamp"], reverse=True)

    return {"audit_trail": logs}
