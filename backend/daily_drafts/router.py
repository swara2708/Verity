import uuid
from datetime import datetime
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db.session import get_session
from db.schema import DailyDraft
from auth.utils import get_current_user, CurrentUser

router = APIRouter(prefix="/daily-drafts", tags=["daily_drafts"])

class CreateDailyDraftRequest(BaseModel):
    employee_id: str
    content: str

@router.post("", status_code=status.HTTP_201_CREATED)
def submit_daily_draft(
    req: CreateDailyDraftRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    draft_id = f"dd_{uuid.uuid4().hex[:8]}"
    today_str = datetime.utcnow().strftime("%Y-%m-%d")

    draft = DailyDraft(
        id=draft_id,
        org_id=current_user.org_id,
        user_id=current_user.id,
        employee_id=req.employee_id,
        content=req.content,
        entry_date=today_str
    )
    session.add(draft)
    session.commit()

    return {"draft_id": draft.id, "entry_date": today_str}

@router.get("/{employee_id}")
def get_daily_drafts(
    employee_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    drafts = session.exec(
        select(DailyDraft).where(
            DailyDraft.org_id == current_user.org_id,
            DailyDraft.employee_id == employee_id
        ).order_by(DailyDraft.entry_date.desc())
    ).all()

    return {
        "drafts": [
            {
                "id": d.id,
                "entry_date": d.entry_date,
                "content": d.content
            }
            for d in drafts
        ]
    }
