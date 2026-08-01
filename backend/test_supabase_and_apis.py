import os
import sys
import json
from dotenv import load_dotenv

load_dotenv('backend/.env')

from sqlmodel import Session, select
from backend.db.session import engine
from backend.db.schema import Organization, User, Invite, Evidence, Review, FeedbackEntry, DailyDraft

print("=== 1. TESTING HOSTED SUPABASE POSTGRESQL DATABASE ===")
try:
    with Session(engine) as session:
        org_count = len(session.exec(select(Organization)).all())
        user_count = len(session.exec(select(User)).all())
        evidence_count = len(session.exec(select(Evidence)).all())
        review_count = len(session.exec(select(Review)).all())
        print(f"[Supabase Postgres DB]: CONNECTED & ACTIVE!")
        print(f"  - Organizations in Supabase: {org_count}")
        print(f"  - Users in Supabase: {user_count}")
        print(f"  - Formal Evidence Items in Supabase: {evidence_count}")
        print(f"  - Reviews in Supabase: {review_count}")
except Exception as e:
    print(f"[Supabase Postgres DB]: ERROR connecting to Supabase: {e}")

print("\n=== 2. TESTING ALL BACKEND API ENDPOINTS ===")
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

endpoints_status = []

def test_endpoint(method, path, expected_status, json_data=None, headers=None):
    try:
        if method == "GET":
            res = client.get(path, headers=headers)
        elif method == "POST":
            res = client.post(path, json=json_data, headers=headers)
        
        status_ok = res.status_code == expected_status
        status_str = "PASS" if status_ok else "FAIL"
        endpoints_status.append({"method": method, "path": path, "status": status_str, "code": res.status_code})
        print(f"[{status_str}] {method} {path} -> HTTP {res.status_code} (Expected {expected_status})")
        return res
    except Exception as e:
        endpoints_status.append({"method": method, "path": path, "status": "FAIL", "code": str(e)})
        print(f"[FAIL] {method} {path} -> Error: {e}")
        return None

# Health
test_endpoint("GET", "/api/health", 200)

# Auth Signup HR
rand_suffix = os.urandom(3).hex()
hr_signup_res = test_endpoint("POST", "/api/auth/signup-hr", 201, {
    "org_name": f"Verity Supabase Test {rand_suffix}",
    "hr_name": "Test HR",
    "email": f"hr_supa_{rand_suffix}@verity.com",
    "password": "Password123!"
})

hr_token = hr_signup_res.json()["token"] if hr_signup_res and hr_signup_res.status_code == 201 else None
hr_headers = {"Authorization": f"Bearer {hr_token}"} if hr_token else None

# Auth HR Login
test_endpoint("POST", "/api/auth/login/hr", 200, {
    "email": f"hr_supa_{rand_suffix}@verity.com",
    "password": "Password123!"
})

# Auth Me
test_endpoint("GET", "/api/auth/me", 200, headers=hr_headers)

# Invites Create
inv_res = test_endpoint("POST", "/api/invites", 201, {
    "email": f"emp_supa_{rand_suffix}@verity.com",
    "role": "employee",
    "department": "Engineering"
}, headers=hr_headers)

inv_token = inv_res.json()["token"] if inv_res and inv_res.status_code == 201 else None

# Invites Token Get
if inv_token:
    test_endpoint("GET", f"/api/invites/{inv_token}", 200)

# Invites Register
if inv_token:
    reg_res = test_endpoint("POST", f"/api/invites/{inv_token}/register", 201, {
        "name": "Supa Employee",
        "password": "EmpPassword123!"
    })
    emp_user_id = reg_res.json()["user_id"] if reg_res and reg_res.status_code == 201 else None
else:
    emp_user_id = None

# HR Requests List
test_endpoint("GET", "/api/hr/requests", 200, headers=hr_headers)

# HR Approve User
if emp_user_id:
    test_endpoint("POST", f"/api/hr/requests/{emp_user_id}/approve", 200, headers=hr_headers)

# User Login
emp_login_res = test_endpoint("POST", "/api/auth/login", 200, {
    "email": f"emp_supa_{rand_suffix}@verity.com",
    "password": "EmpPassword123!"
})
emp_token = emp_login_res.json()["token"] if emp_login_res and emp_login_res.status_code == 200 else None
emp_headers = {"Authorization": f"Bearer {emp_token}"} if emp_token else None

# Feedback Submit & Get
if emp_user_id:
    test_endpoint("POST", "/api/feedback", 201, {
        "employee_id": emp_user_id,
        "source_type": "self",
        "content": "Shipped Supabase PostgreSQL integration."
    }, headers=emp_headers)
    test_endpoint("GET", f"/api/feedback/{emp_user_id}", 200, headers=emp_headers)

# Daily Draft Submit & Get
if emp_user_id:
    test_endpoint("POST", "/api/daily-drafts", 201, {
        "employee_id": emp_user_id,
        "content": "Tested end-to-end Supabase DB persistence."
    }, headers=emp_headers)
    test_endpoint("GET", f"/api/daily-drafts/{emp_user_id}", 200, headers=emp_headers)

# Evidence Submit & Get
if emp_user_id:
    test_endpoint("POST", "/api/evidence", 201, {
        "description": "Hosted Supabase DB migration PR",
        "evidence_type": "project_outcome",
        "link_url": "https://github.com/acme/verity/pull/99",
        "employee_id": emp_user_id
    }, headers=emp_headers)
    test_endpoint("GET", f"/api/evidence/{emp_user_id}", 200, headers=emp_headers)

# Review Generate & Get & Approve & Reject
if emp_user_id:
    rev_gen = test_endpoint("POST", "/api/reviews/generate", 202, {"employee_id": emp_user_id}, headers=hr_headers)
    rev_id = rev_gen.json()["review_id"] if rev_gen and rev_gen.status_code == 202 else None
    if rev_id:
        test_endpoint("GET", f"/api/reviews/{rev_id}", 200, headers=hr_headers)
        test_endpoint("POST", f"/api/reviews/{rev_id}/approve", 200, headers=hr_headers)
        test_endpoint("POST", f"/api/reviews/{rev_id}/reject", 200, {"reason": "Re-audit evidence"}, headers=hr_headers)

# HR Overview
test_endpoint("GET", "/api/hr/overview", 200, headers=hr_headers)

print("\n=== SUMMARY OF API ENDPOINT CHECKS ===")
passed = sum(1 for e in endpoints_status if e['status'] == 'PASS')
total = len(endpoints_status)
print(f"Total APIs Tested: {total} | Passed: {passed} | Failed: {total - passed}")
