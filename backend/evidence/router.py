import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db.session import get_session
from db.schema import Evidence
from auth.utils import get_current_user, CurrentUser

router = APIRouter(prefix="/evidence", tags=["evidence"])

class CreateEvidenceRequest(BaseModel):
    description: str
    link_url: Optional[str] = None
    evidence_type: Optional[str] = "general"  # project_outcome | metric | link | goal_progress | general
    employee_id: Optional[str] = None

@router.post("", status_code=status.HTTP_201_CREATED)
def submit_evidence(
    req: CreateEvidenceRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    ev_id = f"ev_{uuid.uuid4().hex[:8]}"
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    target_emp = req.employee_id.strip() if req.employee_id and req.employee_id.strip() else current_user.id

    ev = Evidence(
        id=ev_id,
        org_id=current_user.org_id,
        employee_id=target_emp,
        evidence_type=req.evidence_type or "general",
        description=req.description,
        link_url=req.link_url,
        date=today_str,
        submitted_by=current_user.id
    )
    session.add(ev)
    session.commit()

    return {
        "evidence_id": ev.id,
        "date": today_str
    }

@router.get("/{employee_id}")
def get_employee_evidence(
    employee_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    items = session.exec(
        select(Evidence).where(
            Evidence.org_id == current_user.org_id,
            Evidence.employee_id == employee_id
        ).order_by(Evidence.date.desc())
    ).all()

    return {
        "evidence": [
            {
                "id": e.id,
                "evidence_type": e.evidence_type,
                "description": e.description,
                "link_url": e.link_url,
                "date": e.date,
                "submitted_by": e.submitted_by
            }
            for e in items
        ]
    }
