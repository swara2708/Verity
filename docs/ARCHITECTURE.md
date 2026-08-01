# Verity — Architecture Spec (v2 Evidence & RLS Edition)
### Bias-Aware 360° Performance Review Intelligence System

---

## 1. Multi-Tenant Architecture & Row Level Security (RLS)

In Verity, every company is an **Organization**. All data — employees, feedback, daily drafts, evidence, reviews — is scoped to an `org_id`.

Instead of relying solely on application-level `WHERE org_id = ...` filters, Verity uses PostgreSQL **Row Level Security (RLS)** in Supabase to enforce cross-tenant isolation at the database layer.

---

## 2. Updated Database Schema

```
organizations (id, name, logo_url, industry, size, departments_json, review_cycle_start, review_cycle_end, bias_thresholds_json, created_at)

users (id, org_id FK, name, email, password_hash, role, status, manager_id FK, department, created_at)

invites (id, org_id FK, email, role, token, invited_by FK, status, expires_at, created_at)

feedback_entries (id, org_id FK, employee_id FK, source_type, content, created_at)

daily_drafts (id, org_id FK, user_id FK, employee_id FK, content, entry_date, created_at)

evidence (id, org_id FK, employee_id FK, evidence_type [project_outcome | metric | link | goal_progress | general], description, link_url, date, submitted_by FK)

reviews (id, org_id FK, employee_id FK, status, report_json, created_at, approved_by FK, approved_at)

bias_reports (id, review_id FK, recency_score, diversity_score, unsupported_claims, flags_json)
```

---

## 3. Evidence Claim-Matching Engine

The Evidence Retrieval Agent performs claim-level matching:
1. For every claim extracted from feedback entries and draft review reports, the engine searches across formal `evidence` items and `daily_drafts` for the target employee.
2. Claims are tagged with support metadata (`supported = true/false`, `evidence_id`, `link_url`).
3. Unsupported claims count directly feeds into `bias_agent.py`'s unsupported claims score and audit flags.
