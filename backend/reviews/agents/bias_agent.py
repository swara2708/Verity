import json
from datetime import datetime, timedelta

def analyze_bias(
    evidence_data: dict,
    report: dict,
    claim_evidence: list[dict] = None,
    bias_thresholds: dict = None
) -> dict:
    """
    Computes deterministic bias scores (recency %, source diversity %, unsupported-claim count)
    with explicit Explainability Trails and HR-configurable threshold tuning.
    """
    feedback = evidence_data.get("feedback", [])
    
    # HR Threshold Tuning (defaults if not custom configured)
    max_recency_pct = bias_thresholds.get("max_recency_pct", 70) if bias_thresholds else 70
    min_sources = bias_thresholds.get("min_sources", 2) if bias_thresholds else 2

    # 1. Recency score calculation
    now = datetime.utcnow()
    two_weeks_ago = now - timedelta(days=14)
    start_str = two_weeks_ago.strftime("%b %d")
    end_str = now.strftime("%b %d")
    
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
    recency_pct = int(recency_score * 100)

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

    # 4. Explainability Trail (Traceable Reasoning behind Priority & Action Scores)
    recency_explanation = (
        f"{recent_count} of {total_feedback} feedback entries ({recency_pct}%) were submitted between {start_str}–{end_str}."
        if total_feedback > 0 else "No feedback entries recorded for recency analysis."
    )

    sources_str = ", ".join(sorted(source_types)) if source_types else "none"
    diversity_explanation = (
        f"{num_sources} source type(s) detected ({sources_str}). Target minimum is {min_sources} sources."
    )

    evidence_explanation = (
        f"{unsupported_claims} claim(s) in the draft report could not be matched to formal evidence items or daily draft logs."
        if unsupported_claims > 0 else "All synthesized claims are supported by verified evidence or daily draft logs."
    )

    explainability_trail = {
        "recency_explanation": recency_explanation,
        "diversity_explanation": diversity_explanation,
        "evidence_explanation": evidence_explanation
    }

    # 5. Generate human-readable flags based on HR thresholds
    flags = []
    if recency_pct >= max_recency_pct:
        flags.append(f"Recency Warning: {recency_pct}% of feedback is from the last 2 weeks ({recency_explanation})")
        
    if num_sources < min_sources:
        src_name = list(source_types)[0] if source_types else "manager"
        flags.append(f"Source Diversity Warning: Only {num_sources} feedback source ({src_name}) — minimum configured is {min_sources} sources")
    elif num_sources == 2 and "peer" not in source_types:
        flags.append("Missing Peer Input: Feedback consists of self and manager input without peer review")

    if unsupported_claims > 0:
        flags.append(f"Evidence Warning: {unsupported_claims} claims in the review draft have no matching evidence")

    return {
        "recency_score": recency_score,
        "diversity_score": diversity_score,
        "unsupported_claims": unsupported_claims,
        "flags": flags,
        "explainability_trail": explainability_trail
    }
