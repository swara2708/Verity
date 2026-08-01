import os
import time
import hashlib
import jwt
from typing import Optional
from pydantic import BaseModel
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select

from db.session import get_session
from db.schema import User

SECRET_KEY = os.environ.get("JWT_SECRET", "verity-secret-key-360-review-intelligence-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 60 * 60 * 24 * 7  # 7 days

security = HTTPBearer(auto_error=False)

class CurrentUser(BaseModel):
    id: str
    org_id: str
    role: str
    name: str
    email: str
    status: str

def hash_password(password: str) -> str:
    """Hash password securely using SHA-256 with salt."""
    salt = "verity_salt_2026_"
    return hashlib.sha256((salt + password).encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(user_id: str, org_id: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "org_id": org_id,
        "role": role,
        "exp": int(time.time()) + ACCESS_TOKEN_EXPIRE_SECONDS
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "invalid_token", "message": "Invalid or expired token."}
        )

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    session: Session = Depends(get_session)
) -> CurrentUser:
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "unauthorized", "message": "Authentication token missing."}
        )
    token = credentials.credentials
    payload = decode_token(token)
    
    user_id = payload.get("user_id")
    org_id = payload.get("org_id")
    
    if not user_id or not org_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "invalid_token", "message": "Malformed token payload."}
        )
        
    user = session.get(User, user_id)
    if not user or user.org_id != org_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "unauthorized", "message": "User not found or org mismatch."}
        )
        
    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": "account_pending", "message": "Account requires HR approval before login."}
        )
        
    return CurrentUser(
        id=user.id,
        org_id=user.org_id,
        role=user.role,
        name=user.name,
        email=user.email,
        status=user.status
    )

def require_hr(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if current_user.role != "hr_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": "not_authorized_for_hr_login", "message": "HR Admin privileges required."}
        )
    return current_user
