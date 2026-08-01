import os
import resend

def send_invite_email(to_email: str, invite_url: str, org_name: str):
    """
    Sends transactional invite email via Resend API.
    """
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        print("[Email] RESEND_API_KEY not set. Skipping invite email delivery.")
        return

    resend.api_key = api_key
    resend.Emails.send({
        "from": "Verity <onboarding@resend.dev>",
        "to": to_email,
        "subject": f"You've been invited to join {org_name} on Verity",
        "html": f"""
            <p>You've been invited to join <b>{org_name}</b> on Verity.</p>
            <p><a href="{invite_url}">Click here to accept your invite</a></p>
            <p>This link expires in 7 days.</p>
        """
    })

def send_review_status_email(to_email: str, employee_name: str, status: str, reason: str = ""):
    """
    Sends transactional performance review status notification email via Resend API.
    """
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        print("[Email] RESEND_API_KEY not set. Skipping review status email delivery.")
        return

    resend.api_key = api_key
    if status == "approved":
        subject = "Your performance review has been finalized"
        body = f"<p>Hi {employee_name}, your review has been approved and finalized.</p>"
    else:  # needs_input
        subject = "Your performance review needs more input"
        body = f"<p>Hi {employee_name}, your review was sent back for more input.</p><p>{reason}</p>"

    resend.Emails.send({
        "from": "Verity <onboarding@resend.dev>",
        "to": to_email,
        "subject": subject,
        "html": body
    })
