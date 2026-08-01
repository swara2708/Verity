from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class Organization(SQLModel, table=True):
    __tablename__ = "organizations"

    id: str = Field(primary_key=True)
    name: str
    logo_url: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    departments_json: Optional[str] = None
    review_cycle_start: Optional[str] = None
    review_cycle_end: Optional[str] = None
    bias_thresholds_json: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(primary_key=True)
    org_id: str = Field(foreign_key="organizations.id", index=True)
    name: str
    email: str = Field(index=True)
    password_hash: str
    role: str  # hr_admin | manager | employee | peer
    status: str  # pending | active | rejected | disabled
    manager_id: Optional[str] = Field(default=None, foreign_key="users.id")
    department: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Invite(SQLModel, table=True):
    __tablename__ = "invites"

    id: str = Field(primary_key=True)
    org_id: str = Field(foreign_key="organizations.id", index=True)
    email: str
    role: str
    token: str = Field(unique=True, index=True)
    invited_by: str = Field(foreign_key="users.id")
    status: str  # pending | accepted | rejected | expired
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FeedbackEntry(SQLModel, table=True):
    __tablename__ = "feedback_entries"

    id: str = Field(primary_key=True)
    org_id: str = Field(foreign_key="organizations.id", index=True)
    employee_id: str = Field(foreign_key="users.id", index=True)
    source_type: str  # self | peer | manager
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DailyDraft(SQLModel, table=True):
    __tablename__ = "daily_drafts"

    id: str = Field(primary_key=True)
    org_id: str = Field(foreign_key="organizations.id", index=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    employee_id: str = Field(foreign_key="users.id", index=True)
    content: str
    entry_date: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Evidence(SQLModel, table=True):
    __tablename__ = "evidence"

    id: str = Field(primary_key=True)
    org_id: str = Field(foreign_key="organizations.id", index=True)
    employee_id: str = Field(foreign_key="users.id", index=True)
    evidence_type: str = Field(default="general")  # project_outcome | metric | link | goal_progress | general
    description: str
    link_url: Optional[str] = None
    date: str
    submitted_by: Optional[str] = Field(default=None, foreign_key="users.id")

class Review(SQLModel, table=True):
    __tablename__ = "reviews"

    id: str = Field(primary_key=True)
    org_id: str = Field(foreign_key="organizations.id", index=True)
    employee_id: str = Field(foreign_key="users.id", index=True)
    status: str  # draft | needs_input | approved | rejected | processing
    report_json: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None

class BiasReport(SQLModel, table=True):
    __tablename__ = "bias_reports"

    id: str = Field(primary_key=True)
    review_id: str = Field(foreign_key="reviews.id", index=True)
    recency_score: float
    diversity_score: float
    unsupported_claims: int
    flags_json: Optional[str] = None
