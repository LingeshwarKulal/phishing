import firebase_admin
from firebase_admin import credentials, messaging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import Optional

# Initialize Firebase Admin SDK
try:
    cred = credentials.Certificate("firebase-credentials.json")
    firebase_admin.initialize_app(cred)
    FIREBASE_ENABLED = True
except Exception as e:
    print(f"Warning: Firebase initialization failed: {e}")
    FIREBASE_ENABLED = False

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", "noreply@phishguard.com")

async def send_notification(
    notification_type: str,
    recipient: str,
    title: str,
    message: str,
    data: Optional[dict] = None
):
    """Send notification via email or push"""
    
    if notification_type == "email":
        return await send_email(recipient, title, message)
    elif notification_type == "push":
        return await send_push_notification(recipient, title, message, data)
    else:
        raise ValueError(f"Invalid notification type: {notification_type}")

async def send_email(recipient: str, subject: str, body: str):
    """Send email notification"""
    
    if not all([SMTP_SERVER, SMTP_USERNAME, SMTP_PASSWORD]):
        print("Warning: Email configuration missing")
        return False
    
    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_FROM
        msg['To'] = recipient
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

async def send_push_notification(
    token: str,
    title: str,
    body: str,
    data: Optional[dict] = None
):
    """Send push notification via Firebase"""
    
    if not FIREBASE_ENABLED:
        print("Warning: Firebase not initialized")
        return False
    
    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body
            ),
            data=data,
            token=token
        )
        
        response = messaging.send(message)
        return True
    except Exception as e:
        print(f"Error sending push notification: {e}")
        return False

def create_notification_template(template_type: str, **kwargs) -> dict:
    """Create notification content from template"""
    
    templates = {
        "phishing_detected": {
            "title": "Phishing Site Detected",
            "message": f"The URL {kwargs.get('url')} has been identified as a potential phishing site."
        },
        "domain_blocked": {
            "title": "Domain Blocked",
            "message": f"The domain {kwargs.get('domain')} has been blocked for: {kwargs.get('reason')}"
        },
        "new_report": {
            "title": "New URL Report",
            "message": f"A new {kwargs.get('report_type')} report has been submitted for {kwargs.get('url')}"
        }
    }
    
    return templates.get(template_type, {
        "title": "PhishGuard Notification",
        "message": "You have a new notification"
    }) 