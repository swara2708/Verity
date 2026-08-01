from sqlmodel import Session, select
from backend.db.schema import FeedbackEntry, DailyDraft, Evidence

def gather_evidence(employee_id: str, org_id: str, session: Session):
    """
    Collects feedback entries, daily draft entries, and updated formal evidence
    items for an employee scoped by org_id.
    """
    feedback = session.exec(
        select(FeedbackEntry).where(
            FeedbackEntry.org_id == org_id,
            FeedbackEntry.employee_id == employee_id
        )
    ).all()

    daily_drafts = session.exec(
        select(DailyDraft).where(
            DailyDraft.org_id == org_id,
            DailyDraft.employee_id == employee_id
        )
    ).all()

    evidence_items = session.exec(
        select(Evidence).where(
            Evidence.org_id == org_id,
            Evidence.employee_id == employee_id
        )
    ).all()

    return {
        "feedback": [
            {
                "id": f.id,
                "source_type": f.source_type,
                "content": f.content,
                "created_at": f.created_at.isoformat() + "Z" if hasattr(f.created_at, "isoformat") else str(f.created_at)
            }
            for f in feedback
        ],
        "daily_drafts": [
            {
                "id": d.id,
                "entry_date": d.entry_date,
                "content": d.content,
                "created_at": d.created_at.isoformat() + "Z" if hasattr(d.created_at, "isoformat") else str(d.created_at)
            }
            for d in daily_drafts
        ],
        "evidence": [
            {
                "id": e.id,
                "evidence_type": e.evidence_type,
                "description": e.description,
                "link_url": e.link_url,
                "date": e.date,
                "submitted_by": e.submitted_by
            }
            for e in evidence_items
        ]
    }

def match_claims_to_evidence(claims: list[str], evidence_data: dict) -> list[dict]:
    """
    For each claim, searches across evidence items AND daily_drafts for the employee.
    Tags each claim as supported (with matched evidence_id + link_url if present) or unsupported.
    """
    evidence_list = evidence_data.get("evidence", [])
    drafts_list = evidence_data.get("daily_drafts", [])

    results = []

    for claim in claims:
        claim_clean = claim.strip()
        if not claim_clean:
            continue

        words = [w.lower() for w in claim_clean.split() if len(w) > 3]
        matched_item = None

        # 1. Search across formal evidence items
        for ev in evidence_list:
            ev_text = (ev.get("description", "") + " " + ev.get("evidence_type", "")).lower()
            if any(word in ev_text for word in words):
                matched_item = {
                    "claim": claim_clean,
                    "supported": True,
                    "evidence_id": ev.get("id"),
                    "link_url": ev.get("link_url")
                }
                break

        # 2. Search across daily_drafts if not matched in formal evidence
        if not matched_item:
            for dd in drafts_list:
                dd_text = dd.get("content", "").lower()
                if any(word in dd_text for word in words):
                    matched_item = {
                        "claim": claim_clean,
                        "supported": True,
                        "evidence_id": dd.get("id"),
                        "link_url": None
                    }
                    break

        # 3. Unsupported fallback
        if not matched_item:
            matched_item = {
                "claim": claim_clean,
                "supported": False,
                "evidence_id": None,
                "link_url": None
            }

        results.append(matched_item)

    return results
