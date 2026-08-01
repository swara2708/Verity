-- Migration 002: Update Evidence Table Schema & RLS

CREATE TABLE IF NOT EXISTS evidence_new (
    id VARCHAR(64) PRIMARY KEY,
    org_id VARCHAR(64) NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    evidence_type VARCHAR(64) NOT NULL DEFAULT 'general' CHECK (evidence_type IN ('project_outcome', 'metric', 'link', 'goal_progress', 'general')),
    description TEXT NOT NULL,
    link_url TEXT,
    date VARCHAR(32) NOT NULL,
    submitted_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL
);

-- Copy existing evidence data if present
INSERT INTO evidence_new (id, org_id, employee_id, evidence_type, description, link_url, date, submitted_by)
SELECT id, org_id, employee_id, 'general', description, NULL, date, employee_id FROM evidence WHERE EXISTS (SELECT 1 FROM evidence);

DROP TABLE IF EXISTS evidence;
ALTER TABLE evidence_new RENAME TO evidence;

-- Enable Row Level Security (RLS) Policy
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org_isolation_evidence" ON evidence;
CREATE POLICY "org_isolation_evidence" ON evidence
    FOR ALL
    USING (
        org_id = (auth.jwt() ->> 'org_id')::text
        AND (auth.jwt() ->> 'status')::text = 'active'
    );
