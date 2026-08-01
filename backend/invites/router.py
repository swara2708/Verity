import uuid
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from backend.db.session import get_session
from backend.db.schema import Organization, User, Invite
from backend.auth.utils import require_hr, CurrentUser, hash_password

router = APIRouter(prefix="/invites", tags=["invites"])

class CreateInviteRequest(BaseModel):
    email: str
    role: str  # employee | manager | peer
    manager_id: Optional[str] = None
    department: Optional[str] = None

class RegisterInviteRequest(BaseModel):
    name: str
    password: str

@router.post("", status_code=status.HTTP_201_CREATED)
def create_invite(
    req: CreateInviteRequest,
    current_user: CurrentUser = Depends(require_hr),
    session: Session = Depends(get_session)
):
    token = f"sig_{uuid.uuid4().hex}"
    invite_id = f"inv_{uuid.uuid4().hex[:8]}"
    expires_at = datetime.utcnow() + timedelta(days=7)

    invite = Invite(
        id=invite_id,
        org_id=current_user.org_id,
        email=req.email,
        role=req.role,
        token=token,
        invited_by=current_user.id,
        status="pending",
        expires_at=expires_at
    )
    session.add(invite)
    session.commit()

    return {
        "invite_id": invite.id,
        "token": token,
        "invite_url": f"/join/{token}",
        "expires_at": expires_at.isoformat() + "Z"
    }

@router.get("/{token}")
def get_invite_details(token: str, session: Session = Depends(get_session)):
    invite = session.exec(select(Invite).where(Invite.token == token)).first()
    if not invite:
        return {"valid": False, "reason": "not_found"}

    if invite.status != "pending" or datetime.utcnow() > invite.expires_at:
        return {"valid": False, "reason": "expired"}

    org = session.get(Organization, invite.org_id)
    return {
        "org_name": org.name if org else "Organization",
        "email": invite.email,
        "role": invite.role,
        "valid": True
    }

@router.post("/{token}/register", status_code=status.HTTP_201_CREATED)
def register_via_invite(
    token: str,
    req: RegisterInviteRequest,
    session: Session = Depends(get_session)
):
    invite = session.exec(select(Invite).where(Invite.token == token)).first()
    if not invite or invite.status != "pending" or datetime.utcnow() > invite.expires_at:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail={"error": "invalid_token", "message": "This invite link has expired or already been used."}
        )

    existing_user = session.exec(select(User).where(User.email == invite.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "already_pending", "message": "User with this email already registered."}
        )

    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    new_user = User(
        id=user_id,
        org_id=invite.org_id,
        name=req.name,
        email=invite.email,
        password_hash=hash_password(req.password),
        role=invite.role,
        status="pending",
        department="Engineering"
    )
    session.add(new_user)
    
    invite.status = "accepted"
    session.add(invite)
    session.commit()

    return {
        "user_id": user_id,
        "status": "pending"
    }
