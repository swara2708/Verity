from datetime import datetime, timedelta

def analyze_bias(evidence_data: dict, report: dict, claim_evidence: list[dict] = None) -> dict:
    """
    Computes deterministic bias scores (recency %, source diversity %, unsupported-claim count)
    using pure Python logic.
    """
    feedback = evidence_data.get("feedback", [])
    
    # 1. Recency score calculation
    now = datetime.utcnow()
    two_weeks_ago = now - timedelta(days=14)
    
    recent_count = 0
    total_feedback = len(feedback)
    
    source_types = set()
    for fb in feedback:
        source_types.add(fb.get("source_type", "peer"))
        dt = fb.get("created_at")
        if isinstance(dt, str):
            try:
                dt = datetime.fromisoformat(dt.replace("Z", ""))
            except Exception:
                dt = now
        if dt and dt >= two_weeks_ago:
            recent_count += 1
            
    recency_score = round(recent_count / total_feedback, 2) if total_feedback > 0 else 0.0

    # 2. Source diversity score
    num_sources = len(source_types)
    if num_sources >= 3:
        diversity_score = 0.85
    elif num_sources == 2:
        diversity_score = 0.50
    elif num_sources == 1:
        diversity_score = 0.20
    else:
        diversity_score = 0.0

    # 3. Unsupported claims count from claim_evidence matching
    if claim_evidence is not None:
        unsupported_claims = sum(1 for item in claim_evidence if not item.get("supported"))
    else:
        # Fallback check
        all_evidence_text = " ".join(
            [f.get("content", "") for f in feedback] +
            [d.get("content", "") for d in evidence_data.get("daily_drafts", [])] +
            [e.get("description", "") for e in evidence_data.get("evidence", [])]
        ).lower()
        unsupported_claims = 0
        claims_to_check = (
            report.get("strengths", []) +
            report.get("growth_areas", []) +
            report.get("impact_highlights", [])
        )
        for claim in claims_to_check:
            words = [w.lower() for w in claim.split() if len(w) > 4]
            if words and not any(word in all_evidence_text for word in words):
                unsupported_claims += 1

    # 4. Generate human-readable flags
    flags = []
    if recency_score >= 0.70:
        flags.append(f"{int(recency_score * 100)}% of feedback is from the last 2 weeks")
        
    if num_sources <= 1:
        src_name = list(source_types)[0] if source_types else "manager"
        flags.append(f"Only 1 feedback source ({src_name}) — no peer input")
    elif num_sources == 2 and "peer" not in source_types:
        flags.append("Missing peer feedback (only self and manager input)")

    if unsupported_claims > 0:
        flags.append(f"{unsupported_claims} claims in the draft have no matching evidence")

    return {
        "recency_score": recency_score,
        "diversity_score": diversity_score,
        "unsupported_claims": unsupported_claims,
        "flags": flags
    }
