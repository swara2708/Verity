import os
import json
from datetime import datetime, timedelta
from sqlmodel import Session, select

from db.session import engine, init_db
from db.schema import Organization, User, FeedbackEntry, DailyDraft, Evidence, Review, BiasReport
from auth.utils import hash_password

def seed():
    init_db()
    with Session(engine) as session:
        # Check if already seeded
        existing_org = session.get(Organization, "org_1")
        if existing_org:
            print("[Seed] Database already seeded.")
            return

        print("[Seed] Seeding Acme Corp demo data...")
        
        # 1. Organization
        org = Organization(
            id="org_1",
            name="Acme Corp",
            industry="Software & AI",
            size="50-200 employees",
            departments_json=json.dumps(["Engineering", "Design", "Product", "HR", "Sales"]),
            review_cycle_start="2026-06-01",
            review_cycle_end="2026-08-31",
            bias_thresholds_json=json.dumps({"max_recency_pct": 70, "min_sources": 2})
        )
        session.add(org)

        # 2. Users
        password_hash = hash_password("password123")

        hr = User(
            id="usr_1",
            org_id="org_1",
            name="Priya Shah",
            email="priya@acme.com",
            password_hash=password_hash,
            role="hr_admin",
            status="active",
            department="HR"
        )
        session.add(hr)

        manager = User(
            id="usr_2",
            org_id="org_1",
            name="Marcus Vance",
            email="marcus@acme.com",
            password_hash=password_hash,
            role="manager",
            status="active",
            department="Engineering"
        )
        session.add(manager)

        # Employee 1: Dev Patel (Clean case)
        dev = User(
            id="usr_4",
            org_id="org_1",
            name="Dev Patel",
            email="dev@acme.com",
            password_hash=password_hash,
            role="employee",
            status="active",
            manager_id="usr_2",
            department="Engineering"
        )
        session.add(dev)

        # Employee 2: Mia Chen (Biased case)
        mia = User(
            id="usr_5",
            org_id="org_1",
            name="Mia Chen",
            email="mia@acme.com",
            password_hash=password_hash,
            role="employee",
            status="active",
            manager_id="usr_2",
            department="Design"
        )
        session.add(mia)

        # Pending User: Alex Vance (Join request)
        alex = User(
            id="usr_6",
            org_id="org_1",
            name="Alex Vance",
            email="alex@acme.com",
            password_hash=password_hash,
            role="employee",
            status="pending",
            department="Product"
        )
        session.add(alex)
        session.commit()

        # 3. Feedback Entries for Dev Patel (Clean case: well-distributed over time & sources)
        now = datetime.utcnow()
        fb_dev_1 = FeedbackEntry(
            id="fb_d1",
            org_id="org_1",
            employee_id="usr_4",
            source_type="self",
            content="Self-assessment: Led the backend architectural refactoring for auth tokens and documented API contracts.",
            created_at=now - timedelta(days=45)
        )
        fb_dev_2 = FeedbackEntry(
            id="fb_d2",
            org_id="org_1",
            employee_id="usr_4",
            source_type="peer",
            content="Dev consistently helped unblock our team on API migration and actively mentored two new engineers.",
            created_at=now - timedelta(days=30)
        )
        fb_dev_3 = FeedbackEntry(
            id="fb_d3",
            org_id="org_1",
            employee_id="usr_4",
            source_type="peer",
            content="Excellent collaboration during sprint planning and clear technical design specs.",
            created_at=now - timedelta(days=15)
        )
        fb_dev_4 = FeedbackEntry(
            id="fb_d4",
            org_id="org_1",
            employee_id="usr_4",
            source_type="manager",
            content="Dev executed the API refactor ahead of schedule and demonstrated strong reliability throughout the quarter.",
            created_at=now - timedelta(days=5)
        )
        session.add_all([fb_dev_1, fb_dev_2, fb_dev_3, fb_dev_4])

        # 4. Daily Drafts for Dev Patel
        dd_1 = DailyDraft(
            id="dd_98",
            org_id="org_1",
            user_id="usr_4",
            employee_id="usr_4",
            content="Shipped the invite-token backend endpoints and wrote unit test suite.",
            entry_date=(now - timedelta(days=20)).strftime("%Y-%m-%d")
        )
        dd_2 = DailyDraft(
            id="dd_99",
            org_id="org_1",
            user_id="usr_4",
            employee_id="usr_4",
            content="Paired with frontend team on JWT flow and error response contracts.",
            entry_date=(now - timedelta(days=10)).strftime("%Y-%m-%d")
        )
        dd_3 = DailyDraft(
            id="dd_101",
            org_id="org_1",
            user_id="usr_4",
            employee_id="usr_4",
            content="Finalized role middleware and multi-tenant org_id validation.",
            entry_date=now.strftime("%Y-%m-%d")
        )
        session.add_all([dd_1, dd_2, dd_3])

        # Formal Evidence Items for Dev Patel
        ev_12 = Evidence(
            id="ev_12",
            org_id="org_1",
            employee_id="usr_4",
            evidence_type="project_outcome",
            description="Shipped invite-token backend and database refactoring",
            link_url="https://github.com/acme/verity/pull/42",
            date=(now - timedelta(days=15)).strftime("%Y-%m-%d"),
            submitted_by="usr_4"
        )
        session.add(ev_12)

        # 5. Feedback Entries for Mia Chen (Biased case: 85% in last 2 weeks, single manager source)
        fb_mia_1 = FeedbackEntry(
            id="fb_m1",
            org_id="org_1",
            employee_id="usr_5",
            source_type="manager",
            content="Mia seemed distracted during yesterday's design critique session.",
            created_at=now - timedelta(days=4)
        )
        fb_mia_2 = FeedbackEntry(
            id="fb_m2",
            org_id="org_1",
            employee_id="usr_5",
            source_type="manager",
            content="Missed minor deadline on final UI mockups during high-volume week.",
            created_at=now - timedelta(days=2)
        )
        session.add_all([fb_mia_1, fb_mia_2])

        session.commit()

        # 6. Reviews & Bias Reports
        # Clean Review for Dev Patel
        dev_report = {
            "strengths": ["Consistently unblocks teammates", "Strong ownership of API migration", "Proactive technical mentorship"],
            "growth_areas": ["Could delegate component tasks earlier during crunch periods"],
            "impact_highlights": ["Shipped invite-token backend ahead of schedule", "Led database refactoring"],
            "goal_progress": [{"goal": "Own auth and multi-tenant system", "status": "on_track"}]
        }
        rev_dev = Review(
            id="rev_55",
            org_id="org_1",
            employee_id="usr_4",
            status="draft",
            report_json=json.dumps(dev_report)
        )
        session.add(rev_dev)
        session.commit()

        bias_dev = BiasReport(
            id="br_55",
            review_id="rev_55",
            recency_score=0.25,
            diversity_score=0.85,
            unsupported_claims=0,
            flags_json=json.dumps([])
        )
        session.add(bias_dev)

        # Biased Review for Mia Chen
        mia_report = {
            "strengths": ["Strong visual design skills when focused"],
            "growth_areas": ["Needs to improve time management and attendance at morning standups"],
            "impact_highlights": ["Redesigned main dashboard components"],
            "goal_progress": [{"goal": "Design System Modernization", "status": "needs_attention"}]
        }
        rev_mia = Review(
            id="rev_56",
            org_id="org_1",
            employee_id="usr_5",
            status="draft",
            report_json=json.dumps(mia_report)
        )
        session.add(rev_mia)
        session.commit()

        bias_mia = BiasReport(
            id="br_56",
            review_id="rev_56",
            recency_score=0.85,
            diversity_score=0.20,
            unsupported_claims=3,
            flags_json=json.dumps([
                "85% of feedback is from the last 2 weeks",
                "Only 1 feedback source (manager) — no peer input",
                "3 claims in the draft have no matching evidence"
            ])
        )
        session.add(bias_mia)
        session.commit()

        print("[Seed] Successfully seeded Acme Corp demo database!")

if __name__ == "__main__":
    seed()
