import sys
from dotenv import load_dotenv
load_dotenv()

from fastapi.testclient import TestClient
from main import app
from db.session import init_db

init_db()
client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
    print("[OK] Health check passed")

def test_hr_signup_and_invites_flow():
    # 1. Signup HR
    signup_payload = {
        "org_name": "Test Acme Corp",
        "hr_name": "Alice HR",
        "email": "alice_test@acme.com",
        "password": "securepassword123"
    }
    res = client.post("/api/auth/signup-hr", json=signup_payload)
    assert res.status_code == 201, res.text
    data = res.json()
    assert "token" in data
    token = data["token"]
    org_id = data["org_id"]
    print(f"[OK] HR Signup passed (org_id: {org_id})")

    # 2. Create Invite as HR
    headers = {"Authorization": f"Bearer {token}"}
    invite_payload = {
        "email": "bob_employee@acme.com",
        "role": "employee",
        "department": "Engineering"
    }
    res = client.post("/api/invites", json=invite_payload, headers=headers)
    assert res.status_code == 201, res.text
    inv_data = res.json()
    invite_token = inv_data["token"]
    print(f"[OK] Create Invite passed (token: {invite_token})")

    # 3. Get Invite Details (Public)
    res = client.get(f"/api/invites/{invite_token}")
    assert res.status_code == 200, res.text
    details = res.json()
    assert details["valid"] is True
    assert details["email"] == "bob_employee@acme.com"
    print("[OK] Get Invite details passed")

    # 4. Register via Invite Token
    reg_payload = {
        "name": "Bob Employee",
        "password": "password123"
    }
    res = client.post(f"/api/invites/{invite_token}/register", json=reg_payload)
    assert res.status_code == 201, res.text
    reg_data = res.json()
    user_id = reg_data["user_id"]
    assert reg_data["status"] == "pending"
    print(f"[OK] Register via Invite passed (user_id: {user_id})")

    # 5. HR Listing Pending Requests
    res = client.get("/api/hr/requests", headers=headers)
    assert res.status_code == 200, res.text
    reqs = res.json()["requests"]
    assert any(r["user_id"] == user_id for r in reqs)
    print("[OK] HR Pending Requests listed successfully")

    # 6. HR Approves User Request
    res = client.post(f"/api/hr/requests/{user_id}/approve", headers=headers)
    assert res.status_code == 200, res.text
    assert res.json()["status"] == "active"
    print("[OK] HR User Approval passed")

    # 7. User Login (Bob)
    login_payload = {
        "email": "bob_employee@acme.com",
        "password": "password123"
    }
    res = client.post("/api/auth/login", json=login_payload)
    assert res.status_code == 200, res.text
    bob_token = res.json()["token"]
    bob_headers = {"Authorization": f"Bearer {bob_token}"}
    print("[OK] Approved User Login passed")

    # 8. Submit Evidence as Bob
    ev_payload = {
        "description": "Shipped backend invite feature",
        "evidence_type": "project_outcome",
        "link_url": "https://github.com/acme/verity/pull/42",
        "employee_id": user_id
    }
    res = client.post("/api/evidence", json=ev_payload, headers=bob_headers)
    assert res.status_code == 201, res.text
    ev_id = res.json()["evidence_id"]
    print(f"[OK] Evidence Submission passed (evidence_id: {ev_id})")

    # 9. Get Evidence for Bob
    res = client.get(f"/api/evidence/{user_id}", headers=bob_headers)
    assert res.status_code == 200, res.text
    ev_list = res.json()["evidence"]
    assert len(ev_list) > 0
    print("[OK] Get Evidence passed")

    # 10. Generate Review for Bob
    res = client.post("/api/reviews/generate", json={"employee_id": user_id}, headers=headers)
    assert res.status_code == 202, res.text
    rev_id = res.json()["review_id"]
    print(f"[OK] Review Generation passed (review_id: {rev_id})")

    # 11. Get Review Details
    res = client.get(f"/api/reviews/{rev_id}", headers=headers)
    assert res.status_code == 200, res.text
    rev_data = res.json()
    assert rev_data["review_id"] == rev_id
    assert "report" in rev_data
    assert "bias_report" in rev_data
    print("[OK] Get Review passed")

    print("\nALL VERIFICATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_health()
    test_hr_signup_and_invites_flow()
