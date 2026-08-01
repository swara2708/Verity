# Verity — API Contract (v2 with Supabase + RLS)

All endpoints are prefixed with `/api`. All responses are JSON. All authenticated endpoints require a `Authorization: Bearer <jwt>` header (Supabase JWT or verified app JWT).

**Golden rule:** Every JWT encodes `user_id`, `org_id`, `role`, and `status`. Every database table has Row Level Security (RLS) policies enabled in Postgres/Supabase that enforce `org_id = (auth.jwt() ->> 'org_id')::uuid` and `status = 'active'`, guaranteeing cross-tenant isolation at the database layer.

---

## 1. Auth

### `POST /auth/signup-hr`
First HR user creates their organization.

**Request**
```json
{
  "org_name": "Acme Corp",
  "hr_name": "Priya Shah",
  "email": "priya@acme.com",
  "password": "••••••••"
}
```

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

**Request**
```json
{ "email": "priya@acme.com", "password": "••••••••" }
```

**Response `200`**
```json
{ "token": "eyJhbGciOi...", "user": { "id": "usr_1", "org_id": "org_1", "role": "hr_admin", "name": "Priya Shah" } }
```

**Response `403`** — if a non-HR account tries this endpoint
```json
{ "error": "not_authorized_for_hr_login" }
```

---

### `POST /auth/login`
Employee / manager / peer login. Same shape as above, but rejects `hr_admin` accounts with `403 use_hr_login_instead`.

---

### `GET /auth/me`
Returns the current user's profile from the JWT claims / database profile.

**Response `200`**
```json
{ "id": "usr_4", "org_id": "org_1", "role": "employee", "name": "Dev Patel", "status": "active" }
```

---

## 2. Invites

### `POST /invites` — HR only
Creates and returns an invite link.

**Response `201`**
```json
{
  "invite_id": "inv_9",
  "token": "sig_abc123...",
  "invite_url": "https://verity.app/join/sig_abc123...",
  "expires_at": "2026-08-08T18:00:00Z"
}
```

---

### `POST /invites/:token/register`
Invitee submits registration. Creates a `pending` user gated from RLS data access until HR approves.

---

## 3. HR Approval Queue

### `GET /hr/requests` — HR only
### `POST /hr/requests/:userId/approve` — HR only
### `POST /hr/requests/:userId/reject` — HR only
