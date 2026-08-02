from typing import Optional, List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from db.session import get_session
from db.schema import Organization
from auth.utils import require_hr, CurrentUser

router = APIRouter(prefix="/organizations", tags=["organizations"])

class OrganizationSetupRequest(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    departments: Optional[List[str]] = None
    review_cycle_start: Optional[str] = None
    review_cycle_end: Optional[str] = None

@router.get("/me")
def get_my_organization(
    current_user: CurrentUser = Depends(require_hr),
    session: Session = Depends(get_session)
):
    org = session.get(Organization, current_user.org_id)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "not_found", "message": "Organization not found."}
        )

    import json
    dept_list = json.loads(org.departments_json) if org.departments_json else ["Engineering", "Product", "Design", "HR", "Sales"]

    return {
        "id": org.id,
        "name": org.name,
        "industry": org.industry or "Technology",
        "size": org.size or "50-200",
        "departments": dept_list,
        "review_cycle_start": org.review_cycle_start,
        "review_cycle_end": org.review_cycle_end,
        "created_at": org.created_at.isoformat() + "Z"
    }

@router.post("/setup")
def setup_organization(
    req: OrganizationSetupRequest,
    current_user: CurrentUser = Depends(require_hr),
    session: Session = Depends(get_session)
):
    org = session.get(Organization, current_user.org_id)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "not_found", "message": "Organization not found."}
        )

    import json
    if req.name:
        org.name = req.name
    if req.industry:
        org.industry = req.industry
    if req.size:
        org.size = req.size
    if req.departments:
        org.departments_json = json.dumps(req.departments)
    if req.review_cycle_start:
        org.review_cycle_start = req.review_cycle_start
    if req.review_cycle_end:
        org.review_cycle_end = req.review_cycle_end

    session.add(org)
    session.commit()
    session.refresh(org)

    dept_list = json.loads(org.departments_json) if org.departments_json else ["Engineering", "Product", "Design", "HR", "Sales"]

    return {
        "status": "updated",
        "organization": {
            "id": org.id,
            "name": org.name,
            "industry": org.industry,
            "size": org.size,
            "departments": dept_list
        }
    }
