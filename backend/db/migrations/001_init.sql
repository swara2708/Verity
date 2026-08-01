-- Migration 001: Initial Schema for Verity 360° Review System (PostgreSQL / Supabase)

CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    industry VARCHAR(128),
    size VARCHAR(64),
    departments_json TEXT,
    review_cycle_start VARCHAR(32),
    review_cycle_end VARCHAR(32),
    bias_thresholds_json TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('hr_admin', 'manager', 'employee', 'peer')),
    status VARCHAR(32) NOT NULL CHECK (status IN ('pending', 'active', 'rejected', 'disabled')),
    manager_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    department VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invites (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    invited_by VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback_entries (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_type VARCHAR(32) NOT NULL CHECK (source_type IN ('self', 'peer', 'manager')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_drafts (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    entry_date VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    source_type VARCHAR(32) NOT NULL,
    date VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL CHECK (status IN ('draft', 'needs_input', 'approved', 'rejected', 'processing')),
    report_json TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS bias_reports (
    id VARCHAR(64) PRIMARY KEY,
    review_id VARCHAR(64) NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    recency_score REAL NOT NULL,
    diversity_score REAL NOT NULL,
    unsupported_claims INTEGER NOT NULL,
    flags_json TEXT
);
