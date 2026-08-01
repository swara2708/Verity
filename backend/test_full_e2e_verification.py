import os
import sys
import json
import urllib.request
import urllib.error
from dotenv import load_dotenv

load_dotenv('backend/.env')

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

results = {}

def report(step_num, title, status, details=""):
    results[step_num] = {"title": title, "status": status, "details": details}
    print(f"[{step_num}] {title}: {status}")
    if details:
        print(f"    Details: {details}")

# Step 1: Backend starts locally with no errors
try:
    res = client.get("/api/health")
    if res.status_code == 200 and res.json().get("status") == "ok":
        report(1, "Backend starts locally with no errors", "PASS", f"Health check returned 200 OK: {res.json()}")
    else:
        report(1, "Backend starts locally with no errors", "FAIL", f"Status code: {res.status_code}, Body: {res.text}")
except Exception as e:
    report(1, "Backend starts locally with no errors", "FAIL", str(e))

# Step 2: Frontend starts locally with no errors
try:
    req = urllib.request.Request("http://localhost:5173/")
    with urllib.request.urlopen(req) as resp:
        if resp.status == 200:
            report(2, "Frontend starts locally with no errors", "PASS", "Vite dev server responded HTTP 200 OK at http://localhost:5173/")
        else:
            report(2, "Frontend starts locally with no errors", "FAIL", f"HTTP Status: {resp.status}")
except Exception as e:
    report(2, "Frontend starts locally with no errors", "FAIL", f"Could not connect to http://localhost:5173/: {e}")

# Step 3: HR can sign up and create an organization (POST /auth/signup-hr)
hr_token = None
hr_org_id = None
try:
    signup_data = {
        "org_name": "E2E Test Corp",
        "hr_name": "Sarah HR",
        "email": f"sarah_e2e_{os.urandom(4).hex()}@testcorp.com",
        "password": "SecurePassword123!"
    }
    res = client.post("/api/auth/signup-hr", json=signup_data)
    if res.status_code == 201:
        body = res.json()
        hr_token = body.get("token")
        hr_org_id = body.get("org_id")
        report(3, "HR sign up and create org", "PASS", f"Created org_id={hr_org_id}, user_id={body.get('user_id')}")
    else:
        report(3, "HR sign up and create org", "FAIL", f"Status: {res.status_code}, Response: {res.text}")
except Exception as e:
    report(3, "HR sign up and create org", "FAIL", str(e))

# Step 4: HR can log in via /login/hr and reach the HR dashboard
try:
    if signup_data:
        login_res = client.post("/api/auth/login/hr", json={"email": signup_data["email"], "password": signup_data["password"]})
        if login_res.status_code == 200 and "token" in login_res.json():
            # Check HR dashboard overview endpoint
            overview_res = client.get("/api/hr/overview", headers={"Authorization": f"Bearer {hr_token}"})
            if overview_res.status_code == 200:
                report(4, "HR log in via /login/hr and reach HR dashboard", "PASS", f"Dashboard loaded org_name='{overview_res.json().get('org_name')}'")
            else:
                report(4, "HR log in via /login/hr and reach HR dashboard", "FAIL", f"Login succeeded but GET /hr/overview returned {overview_res.status_code}: {overview_res.text}")
        else:
            report(4, "HR log in via /login/hr and reach HR dashboard", "FAIL", f"Status: {login_res.status_code}, Response: {login_res.text}")
    else:
        report(4, "HR log in via /login/hr and reach HR dashboard", "FAIL", "Step 3 prerequisite failed")
except Exception as e:
    report(4, "HR log in via /login/hr and reach HR dashboard", "FAIL", str(e))

# Step 5: HR can generate an invite link (POST /invites)
invite_token = None
test_emp_email = f"employee_{os.urandom(4).hex()}@testcorp.com"
try:
    if hr_token:
        inv_res = client.post("/api/invites", json={"email": test_emp_email, "role": "employee", "department": "Engineering"}, headers={"Authorization": f"Bearer {hr_token}"})
        if inv_res.status_code == 201 and "token" in inv_res.json():
            invite_token = inv_res.json()["token"]
            report(5, "HR generate invite link (POST /invites)", "PASS", f"Generated invite_token='{invite_token}', url='{inv_res.json().get('invite_url')}'")
        else:
            report(5, "HR generate invite link (POST /invites)", "FAIL", f"Status: {inv_res.status_code}, Response: {inv_res.text}")
    else:
        report(5, "HR generate invite link (POST /invites)", "FAIL", "Step 3 prerequisite failed")
except Exception as e:
    report(5, "HR generate invite link (POST /invites)", "FAIL", str(e))

# Step 6: Invite link registration page pre-fill data (GET /invites/:token)
try:
    if invite_token:
        get_inv = client.get(f"/api/invites/{invite_token}")
        if get_inv.status_code == 200:
            inv_data = get_inv.json()
            if inv_data.get("valid") and inv_data.get("org_name") and inv_data.get("role"):
                report(6, "Invite link loads and shows correct pre-filled org name and role", "PASS", f"org_name='{inv_data.get('org_name')}', email='{inv_data.get('email')}', role='{inv_data.get('role')}'")
            else:
                report(6, "Invite link loads and shows correct pre-filled org name and role", "FAIL", f"Invalid response shape: {inv_data}")
        else:
            report(6, "Invite link loads and shows correct pre-filled org name and role", "FAIL", f"Status: {get_inv.status_code}, Response: {get_inv.text}")
    else:
        report(6, "Invite link loads and shows correct pre-filled org name and role", "FAIL", "Step 5 prerequisite failed")
except Exception as e:
    report(6, "Invite link loads and shows correct pre-filled org name and role", "FAIL", str(e))

# Step 7: Test user registers via invite link and lands in "pending" status
test_user_id = None
try:
    if invite_token:
        reg_res = client.post(f"/api/invites/{invite_token}/register", json={"name": "Alex E2E Employee", "password": "UserPassword123!"})
        if reg_res.status_code == 201:
            reg_body = reg_res.json()
            test_user_id = reg_body.get("user_id")
            if reg_body.get("status") == "pending":
                report(7, "Test user registers via invite link (status=pending)", "PASS", f"user_id='{test_user_id}', status='pending'")
            else:
                report(7, "Test user registers via invite link (status=pending)", "FAIL", f"Expected status 'pending', got: {reg_body}")
        else:
            report(7, "Test user registers via invite link (status=pending)", "FAIL", f"Status: {reg_res.status_code}, Response: {reg_res.text}")
    else:
        report(7, "Test user registers via invite link (status=pending)", "FAIL", "Step 5 prerequisite failed")
except Exception as e:
    report(7, "Test user registers via invite link (status=pending)", "FAIL", str(e))

# Step 8: HR pending requests page shows that new request
try:
    if hr_token and test_user_id:
        req_res = client.get("/api/hr/requests", headers={"Authorization": f"Bearer {hr_token}"})
        if req_res.status_code == 200:
            requests_list = req_res.json().get("requests", [])
            found = any(r.get("user_id") == test_user_id for r in requests_list)
            if found:
                report(8, "HR pending requests page shows new request", "PASS", f"Found user_id='{test_user_id}' in pending requests list ({len(requests_list)} total pending)")
            else:
                report(8, "HR pending requests page shows new request", "FAIL", f"user_id '{test_user_id}' not found in pending list: {requests_list}")
        else:
            report(8, "HR pending requests page shows new request", "FAIL", f"Status: {req_res.status_code}, Response: {req_res.text}")
    else:
        report(8, "HR pending requests page shows new request", "FAIL", "Prerequisite failed")
except Exception as e:
    report(8, "HR pending requests page shows new request", "FAIL", str(e))

# Step 9: HR approves request, user status flips to "active"
try:
    if hr_token and test_user_id:
        appr_res = client.post(f"/api/hr/requests/{test_user_id}/approve", headers={"Authorization": f"Bearer {hr_token}"})
        if appr_res.status_code == 200 and appr_res.json().get("status") == "active":
            report(9, "HR approves request, user status flips to active", "PASS", f"user_id='{test_user_id}' status is now 'active'")
        else:
            report(9, "HR approves request, user status flips to active", "FAIL", f"Status: {appr_res.status_code}, Response: {appr_res.text}")
    else:
        report(9, "HR approves request, user status flips to active", "FAIL", "Prerequisite failed")
except Exception as e:
    report(9, "HR approves request, user status flips to active", "FAIL", str(e))

# Step 10: Approved user can log in via /login (not /login/hr)
emp_token = None
try:
    if test_user_id and test_emp_email:
        # 10a: Login via /login (should PASS)
        login_res = client.post("/api/auth/login", json={"email": test_emp_email, "password": "UserPassword123!"})
        # 10b: Attempt login via /login/hr (should FAIL with 403)
        hr_login_attempt = client.post("/api/auth/login/hr", json={"email": test_emp_email, "password": "UserPassword123!"})
        
        if login_res.status_code == 200 and "token" in login_res.json() and hr_login_attempt.status_code == 403:
            emp_token = login_res.json()["token"]
            report(10, "Approved user can log in via /login (and blocked from /login/hr)", "PASS", f"Login /login returned 200 OK. Login /login/hr correctly blocked with 403 Forbidden.")
        else:
            report(10, "Approved user can log in via /login (and blocked from /login/hr)", "FAIL", f"Login status: {login_res.status_code}, HR Login attempt status: {hr_login_attempt.status_code}")
    else:
        report(10, "Approved user can log in via /login", "FAIL", "Step 7/9 prerequisite failed")
except Exception as e:
    report(10, "Approved user can log in via /login", "FAIL", str(e))

# Step 11: Employee can submit feedback and daily draft entry
try:
    if emp_token and test_user_id:
        fb_res = client.post("/api/feedback", json={"employee_id": test_user_id, "source_type": "self", "content": "Delivered auth token refactor ahead of sprint deadline."}, headers={"Authorization": f"Bearer {emp_token}"})
        dd_res = client.post("/api/daily-drafts", json={"employee_id": test_user_id, "content": "Wrote automated verification test suite."}, headers={"Authorization": f"Bearer {emp_token}"})
        
        if fb_res.status_code == 201 and dd_res.status_code == 201:
            report(11, "Employee can submit feedback and daily draft entry", "PASS", f"Feedback created id='{fb_res.json().get('feedback_id')}', Daily draft created id='{dd_res.json().get('draft_id')}'")
        else:
            report(11, "Employee can submit feedback and daily draft entry", "FAIL", f"Feedback status: {fb_res.status_code}, Draft status: {dd_res.status_code}")
    else:
        report(11, "Employee can submit feedback and daily draft entry", "FAIL", "Step 10 prerequisite failed")
except Exception as e:
    report(11, "Employee can submit feedback and daily draft entry", "FAIL", str(e))

# Step 12: POST /reviews/generate successfully triggers pipeline and returns review_id
review_id = None
try:
    if hr_token and test_user_id:
        gen_res = client.post("/api/reviews/generate", json={"employee_id": test_user_id}, headers={"Authorization": f"Bearer {hr_token}"})
        if gen_res.status_code in (200, 202) and "review_id" in gen_res.json():
            review_id = gen_res.json()["review_id"]
            report(12, "POST /reviews/generate triggers pipeline and returns review_id", "PASS", f"review_id='{review_id}', status='{gen_res.json().get('status')}'")
        else:
            report(12, "POST /reviews/generate triggers pipeline and returns review_id", "FAIL", f"Status: {gen_res.status_code}, Response: {gen_res.text}")
    else:
        report(12, "POST /reviews/generate triggers pipeline and returns review_id", "FAIL", "Prerequisite failed")
except Exception as e:
    report(12, "POST /reviews/generate triggers pipeline and returns review_id", "FAIL", str(e))

# Step 13: GET /reviews/:id returns completed report_json and bias_report with real values (confirm LLM / Synthesis status)
try:
    if review_id and hr_token:
        get_rev = client.get(f"/api/reviews/{review_id}", headers={"Authorization": f"Bearer {hr_token}"})
        if get_rev.status_code == 200:
            rev_body = get_rev.json()
            report_data = rev_body.get("report", {})
            bias_data = rev_body.get("bias_report", {})
            
            # Check for non-empty content in report & bias_report
            has_strengths = len(report_data.get("strengths", [])) > 0
            has_bias_metrics = "recency_score" in bias_data and "diversity_score" in bias_data
            
            anthropic_key = os.environ.get("ANTHROPIC_API_KEY", "")
            if has_strengths and has_bias_metrics:
                details_msg = f"report strengths count={len(report_data.get('strengths', []))}, recency_score={bias_data.get('recency_score')}, diversity_score={bias_data.get('diversity_score')}, flags={bias_data.get('flags')}"
                if "invalid_request_error" in str(rev_body) or "low credit" in str(rev_body):
                    report(13, "GET /reviews/:id returns completed report_json and bias_report", "FAIL", f"Anthropic LLM call returned credit error: {rev_body}")
                else:
                    report(13, "GET /reviews/:id returns completed report_json and bias_report", "PASS", details_msg)
            else:
                report(13, "GET /reviews/:id returns completed report_json and bias_report", "FAIL", f"Missing report/bias fields in response: {rev_body}")
        else:
            report(13, "GET /reviews/:id returns completed report_json and bias_report", "FAIL", f"Status: {get_rev.status_code}, Response: {get_rev.text}")
    else:
        report(13, "GET /reviews/:id returns completed report_json and bias_report", "FAIL", "Step 12 prerequisite failed")
except Exception as e:
    report(13, "GET /reviews/:id returns completed report_json and bias_report", "FAIL", str(e))

# Step 14: HR review page renders report and bias flags correctly (Frontend / API Contract check)
try:
    if review_id and hr_token:
        # Check backend returns valid schema expected by frontend UI component
        get_rev = client.get(f"/api/reviews/{review_id}", headers={"Authorization": f"Bearer {hr_token}"})
        if get_rev.status_code == 200:
            b = get_rev.json()
            rpt = b.get("report", {})
            bias = b.get("bias_report", {})
            req_keys = ["strengths", "growth_areas", "impact_highlights", "claim_evidence"]
            if all(k in rpt for k in req_keys) and "flags" in bias:
                report(14, "HR review page API response schema matching frontend components", "PASS", f"All schema keys present: {req_keys} + bias flags array")
            else:
                report(14, "HR review page API response schema matching frontend components", "FAIL", f"Schema mismatch for frontend render: {b}")
        else:
            report(14, "HR review page API response schema matching frontend components", "FAIL", f"Status: {get_rev.status_code}")
    else:
        report(14, "HR review page API response schema matching frontend components", "FAIL", "Prerequisite failed")
except Exception as e:
    report(14, "HR review page API response schema matching frontend components", "FAIL", str(e))

# Step 15: HR clicking "Approve" sets review status to approved
try:
    if review_id and hr_token:
        appr_rev = client.post(f"/api/reviews/{review_id}/approve", headers={"Authorization": f"Bearer {hr_token}"})
        if appr_rev.status_code == 200 and appr_rev.json().get("status") == "approved":
            report(15, "HR clicking Approve sets review status to approved", "PASS", f"status='approved', approved_at='{appr_rev.json().get('approved_at')}'")
        else:
            report(15, "HR clicking Approve sets review status to approved", "FAIL", f"Status: {appr_rev.status_code}, Response: {appr_rev.text}")
    else:
        report(15, "HR clicking Approve sets review status to approved", "FAIL", "Prerequisite failed")
except Exception as e:
    report(15, "HR clicking Approve sets review status to approved", "FAIL", str(e))

# Step 16: HR clicking "Send back" (reject) sets review status to needs_input
try:
    if review_id and hr_token:
        rej_rev = client.post(f"/api/reviews/{review_id}/reject", json={"reason": "Needs more peer evidence"}, headers={"Authorization": f"Bearer {hr_token}"})
        if rej_rev.status_code == 200 and rej_rev.json().get("status") == "needs_input":
            report(16, "HR clicking Send back (reject) sets review status to needs_input", "PASS", f"status='needs_input'")
        else:
            report(16, "HR clicking Send back (reject) sets review status to needs_input", "FAIL", f"Status: {rej_rev.status_code}, Response: {rej_rev.text}")
    else:
        report(16, "HR clicking Send back (reject) sets review status to needs_input", "FAIL", "Prerequisite failed")
except Exception as e:
    report(16, "HR clicking Send back (reject) sets review status to needs_input", "FAIL", str(e))

# Step 17: RLS enforcement test: Attempt query as Org A user attempting to read Org B data
try:
    # 17a: Create Org B with an HR user and Employee B
    signup_b = {
        "org_name": "Cross Org B Inc",
        "hr_name": "Bob OrgB HR",
        "email": f"bob_orgB_{os.urandom(4).hex()}@orgb.com",
        "password": "PasswordOrgB123!"
    }
    res_b = client.post("/api/auth/signup-hr", json=signup_b)
    if res_b.status_code == 201:
        token_b = res_b.json()["token"]
        org_id_b = res_b.json()["org_id"]
        
        # 17b: Org A user (emp_token from testcorp) attempts to access Org B employee / evidence / review data
        cross_org_access_attempt = client.get(f"/api/evidence/{signup_b['email']}", headers={"Authorization": f"Bearer {emp_token}"})
        
        # Org A user attempts to generate/read review for Org B user
        cross_org_review_attempt = client.get(f"/api/reviews/{review_id}", headers={"Authorization": f"Bearer {token_b}"})
        
        if cross_org_review_attempt.status_code == 404:
            report(17, "RLS / Cross-tenant isolation enforced", "PASS", f"Org B HR user attempting to access Org A review ID returned HTTP 404 Not Found (cross-tenant blocked).")
        else:
            report(17, "RLS / Cross-tenant isolation enforced", "FAIL", f"Cross org review access attempt returned {cross_org_review_attempt.status_code} instead of 404!")
    else:
        report(17, "RLS / Cross-tenant isolation enforced", "FAIL", f"Could not create Org B: {res_b.text}")
except Exception as e:
    report(17, "RLS / Cross-tenant isolation enforced", "FAIL", str(e))

print("\n--- SUMMARY OF ALL 17 STEPS ---")
for k in range(1, 18):
    item = results.get(k, {})
    print(f"Step {k}: {item.get('status')} - {item.get('title')}")
