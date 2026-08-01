import uuid
from typing import Optional
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db.session import get_session
from db.schema import Organization, User
from auth.utils import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    CurrentUser
)

router = APIRouter(prefix="/auth", tags=["auth"])

class SignupHRRequest(BaseModel):
    org_name: str
    hr_name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup-hr", status_code=status.HTTP_201_CREATED)
def signup_hr(req: SignupHRRequest, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.email == req.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "already_exists", "message": "Email already registered."}
        )

    org_id = f"org_{uuid.uuid4().hex[:8]}"
    org = Organization(
        id=org_id,
        name=req.org_name,
        departments_json='["Engineering", "Product", "Design", "HR", "Sales"]'
    )
    session.add(org)

    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    user = User(
        id=user_id,
        org_id=org_id,
        name=req.hr_name,
        email=req.email,
        password_hash=hash_password(req.password),
        role="hr_admin",
        status="active"
    )
    session.add(user)
    session.commit()

    token = create_access_token(user_id=user.id, org_id=user.org_id, role=user.role)
    return {
        "user_id": user.id,
        "org_id": user.org_id,
        "role": user.role,
        "token": token
    }

@router.post("/login/hr")
def login_hr(req: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == req.email)).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "unauthorized", "message": "Invalid email or password."}
        )

    if user.role != "hr_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": "not_authorized_for_hr_login"}
        )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": "account_pending", "message": "Account pending HR approval."}
        )

    token = create_access_token(user_id=user.id, org_id=user.org_id, role=user.role)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "org_id": user.org_id,
            "role": user.role,
            "name": user.name
        }
    }

@router.post("/login")
def login_user(req: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == req.email)).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "unauthorized", "message": "Invalid email or password."}
        )

    if user.role == "hr_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": "use_hr_login_instead", "message": "HR accounts must log in via HR portal."}
        )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": "account_pending", "message": "Account pending HR approval."}
        )

    token = create_access_token(user_id=user.id, org_id=user.org_id, role=user.role)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "org_id": user.org_id,
            "role": user.role,
            "name": user.name
        }
    }

@router.get("/me")
def get_me(current_user: CurrentUser = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "org_id": current_user.org_id,
        "role": current_user.role,
        "name": current_user.name,
        "status": current_user.status
    }
