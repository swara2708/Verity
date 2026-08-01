# Verity — Architecture Spec (v2 Supabase + RLS Edition)
### Bias-Aware 360° Performance Review Intelligence System

---

## 1. Multi-Tenant Architecture & Row Level Security (RLS)

In Verity, every company is an **Organization**. All data — employees, feedback, daily drafts, evidence, reviews — is scoped to an `org_id`.

Instead of relying solely on application-level `WHERE org_id = ...` filters, Verity uses PostgreSQL **Row Level Security (RLS)** in Supabase to enforce cross-tenant isolation at the database layer.

```sql
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_isolation" ON reviews
  FOR ALL
  USING (org_id = (auth.jwt() ->> 'org_id')::text);
```

---

## 2. Auth & GATED Invite Flow

1. **HR Signup**: First HR user creates the Organization -> becomes `hr_admin`.
2. **HR Invite Link**: HR issues a signed invite token containing `org_id`, `role`, `email`, and `expires_at`.
3. **Invitee Registration**: Invitee submits full name + password via `/join/:token`.
4. **Pending User Gating**: The user row is created with `status = 'pending'`. RLS policies block `pending` users from accessing organization feedback or reviews until approved.
5. **HR Approval Queue**: HR clicks **Approve** on `/hr/requests` -> `status` flips to `'active'`.

---

## 3. Database Folder Structure (Supabase-Connected)

```
backend/db/
├── migrations/
│   └── 001_init.sql        (Postgres DDL table definitions)
├── rls_policies.sql        (Row Level Security policies & org isolation)
├── seed_data.py            (Seeds demo org + 3 employees via DB/Supabase client)
└── supabase_client.py      (Supabase Python client initialization & fallbacks)
```
