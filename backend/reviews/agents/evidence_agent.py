import os
import json
from sqlmodel import Session, select
from db.schema import FeedbackEntry, DailyDraft, Evidence
from reviews.agents.llm_client import call_llm, parse_json_response

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
    Tags each claim as supported (with confidence high/medium/low + evidence_id + link_url if present).
    """
    evidence_list = evidence_data.get("evidence", [])
    drafts_list = evidence_data.get("daily_drafts", [])

    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        try:
            prompt = f"""You are an evidence retrieval and claim-matching agent.
For each claim in the list below, determine if it is supported by the provided evidence items or daily draft logs.

Claims to verify:
{json.dumps(claims, indent=2)}

Formal Evidence Items:
{json.dumps(evidence_list, indent=2)}

Daily Draft Logs:
{json.dumps(drafts_list, indent=2)}

Return ONLY valid JSON, no extra text, no markdown code fences.
Target JSON structure:
[
  {{
    "claim": "exact claim text",
    "supported": true,
    "confidence": "high | medium | low",
    "evidence_id": "matched_evidence_id_or_null",
    "link_url": "matched_link_url_or_null"
  }}
]
"""
            raw_response = call_llm(prompt)
            parsed = parse_json_response(raw_response)
            if isinstance(parsed, list):
                # Ensure confidence tag is populated
                for item in parsed:
                    if "confidence" not in item:
                        item["confidence"] = "high" if item.get("supported") and item.get("evidence_id") else ("medium" if item.get("supported") else "low")
                return parsed
        except Exception as e:
            print(f"[Evidence Agent] Gemini API claim matching call failed, using rule-based matching: {e}")

    # Fallback rule-based matching across formal evidence and daily drafts
    results = []

    for claim in claims:
        claim_clean = claim.strip()
        if not claim_clean:
            continue

        words = [w.lower() for w in claim_clean.split() if len(w) > 3]
        matched_item = None

        # 1. Search across formal evidence items (HIGH confidence)
        for ev in evidence_list:
            ev_text = (ev.get("description", "") + " " + ev.get("evidence_type", "")).lower()
            if any(word in ev_text for word in words):
                matched_item = {
                    "claim": claim_clean,
                    "supported": True,
                    "confidence": "high",
                    "evidence_id": ev.get("id"),
                    "link_url": ev.get("link_url")
                }
                break

        # 2. Search across daily_drafts if not matched in formal evidence (MEDIUM confidence)
        if not matched_item:
            for dd in drafts_list:
                dd_text = dd.get("content", "").lower()
                if any(word in dd_text for word in words):
                    matched_item = {
                        "claim": claim_clean,
                        "supported": True,
                        "confidence": "medium",
                        "evidence_id": dd.get("id"),
                        "link_url": None
                    }
                    break

        # 3. Unsupported fallback (LOW confidence)
        if not matched_item:
            matched_item = {
                "claim": claim_clean,
                "supported": False,
                "confidence": "low",
                "evidence_id": None,
                "link_url": None
            }

        results.append(matched_item)

    return results
