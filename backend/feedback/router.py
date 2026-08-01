import uuid
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db.session import get_session
from db.schema import FeedbackEntry
from auth.utils import get_current_user, CurrentUser

router = APIRouter(prefix="/feedback", tags=["feedback"])

class CreateFeedbackRequest(BaseModel):
    employee_id: str
    source_type: str  # self | peer | manager
    content: str

@router.post("", status_code=status.HTTP_201_CREATED)
def submit_feedback(
    req: CreateFeedbackRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    feedback_id = f"fb_{uuid.uuid4().hex[:8]}"
    fb = FeedbackEntry(
        id=feedback_id,
        org_id=current_user.org_id,
        employee_id=req.employee_id,
        source_type=req.source_type,
        content=req.content
    )
    session.add(fb)
    session.commit()

    return {"feedback_id": fb.id}

@router.get("/{employee_id}")
def get_employee_feedback(
    employee_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Scope query strictly by current_user.org_id
    entries = session.exec(
        select(FeedbackEntry).where(
            FeedbackEntry.org_id == current_user.org_id,
            FeedbackEntry.employee_id == employee_id
        )
    ).all()

    return {
        "feedback": [
            {
                "id": f.id,
                "source_type": f.source_type,
                "content": f.content,
                "created_at": f.created_at.isoformat() + "Z"
            }
            for f in entries
        ]
    }
