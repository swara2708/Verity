-- Row Level Security (RLS) Policies for Multi-Tenant Isolation & Status Gating

-- 1. Enable RLS on all sensitive tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bias_reports ENABLE ROW LEVEL SECURITY;

-- 2. Organization Isolation Policy on feedback_entries
CREATE POLICY "org_isolation_feedback" ON feedback_entries
    FOR ALL
    USING (
        org_id = (auth.jwt() ->> 'org_id')::text
        AND (auth.jwt() ->> 'status')::text = 'active'
    );

-- 3. Organization Isolation Policy on daily_drafts
CREATE POLICY "org_isolation_daily_drafts" ON daily_drafts
    FOR ALL
    USING (
        org_id = (auth.jwt() ->> 'org_id')::text
        AND (auth.jwt() ->> 'status')::text = 'active'
    );

-- 4. Organization Isolation Policy on evidence (Updated schema)
CREATE POLICY "org_isolation_evidence" ON evidence
    FOR ALL
    USING (
        org_id = (auth.jwt() ->> 'org_id')::text
        AND (auth.jwt() ->> 'status')::text = 'active'
    );

-- 5. Organization Isolation Policy on reviews
CREATE POLICY "org_isolation_reviews" ON reviews
    FOR ALL
    USING (
        org_id = (auth.jwt() ->> 'org_id')::text
        AND (auth.jwt() ->> 'status')::text = 'active'
    );

-- 6. User Table Access Policy
CREATE POLICY "org_isolation_users" ON users
    FOR ALL
    USING (
        org_id = (auth.jwt() ->> 'org_id')::text
    );
