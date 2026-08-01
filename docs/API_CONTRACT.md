# Verity — API Contract (v2 with Evidence Claim Matching & RLS)

All endpoints are prefixed with `/api`. All responses are JSON. All authenticated endpoints require a `Authorization: Bearer <jwt>` header (Supabase JWT or verified app JWT).

**Golden rule:** Every JWT encodes `user_id`, `org_id`, `role`, and `status`. Every database table has Row Level Security (RLS) policies enabled in Postgres/Supabase that enforce `org_id = (auth.jwt() ->> 'org_id')::uuid` and `status = 'active'`, guaranteeing cross-tenant isolation at the database layer.

---

## 1. Auth

### `POST /auth/signup-hr`
First HR user creates their organization.

**Response `201`**
```json
{
  "user_id": "usr_1",
  "org_id": "org_1",
  "role": "hr_admin",
  "token": "eyJhbGciOi..."
}
```

---

### `POST /auth/login/hr`
HR/admin login.

---

### `POST /auth/login`
Employee / manager / peer login.

---

## 2. Invites

### `POST /invites` — HR only
Creates and returns an invite link.

### `GET /invites/:token`
Public endpoint — invite landing page calls this to pre-fill registration form.

### `POST /invites/:token/register`
Invitee submits registration. Creates a `pending` user gated from RLS data access until HR approves.

---

## 3. HR Approval Queue & Overview

### `GET /hr/requests` — HR only
### `POST /hr/requests/:userId/approve` — HR only
### `POST /hr/requests/:userId/reject` — HR only
### `GET /hr/overview` — HR only

---

## 4. Evidence Management

### `POST /evidence`
Submit formal evidence item (project outcome, metric improvement, PR link, etc.).

**Request**
```json
{
  "description": "Shipped invite-token backend and database refactoring",
  "evidence_type": "project_outcome",
  "link_url": "https://github.com/acme/verity/pull/42",
  "employee_id": "usr_4"
}
```

**Response `201`**
```json
{ "evidence_id": "ev_12", "date": "2026-08-01" }
```

### `GET /evidence/:employeeId`
Returns all formal evidence items recorded for an employee.

---

## 5. Review Pipeline & Claim Matching

### `POST /reviews/generate`
Triggers evidence retrieval -> claim matching -> synthesis -> bias detection pipeline.

### `GET /reviews/:id`
Returns review report, bias analysis, and `claim_evidence` array linking claims to evidence items.

**Response `200`**
```json
{
  "review_id": "rev_55",
  "employee_id": "usr_4",
  "status": "draft",
  "report": {
    "strengths": ["Consistently unblocks teammates", "Strong ownership of API migration"],
    "growth_areas": ["Could delegate component tasks earlier"],
    "impact_highlights": ["Shipped invite-token backend ahead of schedule"],
    "goal_progress": [{ "goal": "Own auth system", "status": "on_track" }],
    "claim_evidence": [
      {
        "claim": "Shipped invite-token backend ahead of schedule",
        "supported": true,
        "evidence_id": "ev_12",
        "link_url": "https://github.com/acme/verity/pull/42"
      },
      {
        "claim": "Needs to improve attendance at morning standups",
        "supported": false,
        "evidence_id": null,
        "link_url": null
      }
    ]
  },
  "bias_report": {
    "recency_score": 0.25,
    "diversity_score": 0.85,
    "unsupported_claims": 1,
    "flags": []
  }
}
```
