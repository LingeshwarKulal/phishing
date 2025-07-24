from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from models.database import get_db, URLScan, URLReport, User, NotificationHistory
from services.auth_service import get_current_user
from services.notification_service import send_notification
from pydantic import BaseModel

router = APIRouter()

class URLReportCreate(BaseModel):
    scan_id: int
    report_type: str  # false_positive, confirmed_phishing
    comment: Optional[str] = None

@router.post("/report")
async def create_report(
    report: URLReportCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new URL report"""
    
    # Validate scan exists
    scan = db.query(URLScan).filter(URLScan.id == report.scan_id).first()
    if not scan:
        raise HTTPException(
            status_code=404,
            detail="Scan not found"
        )
    
    # Validate report type
    if report.report_type not in ["false_positive", "confirmed_phishing"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid report type"
        )
    
    # Create report
    new_report = URLReport(
        scan_id=report.scan_id,
        reported_by=current_user.id,
        report_type=report.report_type,
        comment=report.comment
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    # Notify admins in background
    background_tasks.add_task(
        notify_admins_of_report,
        db,
        new_report.id,
        scan.url,
        report.report_type
    )
    
    return {
        "message": "Report submitted successfully",
        "report_id": new_report.id
    }

@router.get("/my-reports")
async def get_my_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's reports"""
    
    reports = db.query(URLReport)\
        .join(URLScan)\
        .filter(URLReport.reported_by == current_user.id)\
        .order_by(URLReport.created_at.desc())\
        .all()
    
    return [
        {
            "id": report.id,
            "url": report.scan.url,
            "report_type": report.report_type,
            "comment": report.comment,
            "created_at": report.created_at.isoformat()
        }
        for report in reports
    ]

async def notify_admins_of_report(db: Session, report_id: int, url: str, report_type: str):
    """Notify admins about new reports"""
    
    # Get all admin users
    admins = db.query(User).filter(User.is_admin == True).all()
    
    for admin in admins:
        # Create notification
        notification = NotificationHistory(
            user_id=admin.id,
            notification_type=admin.notification_preferences,
            title="New URL Report",
            message=f"New {report_type} report for URL: {url}"
        )
        db.add(notification)
        
        # Send notification based on preference
        if admin.notification_preferences in ["email", "both"]:
            background_tasks.add_task(
                send_notification,
                "email",
                admin.email,
                "New URL Report",
                f"New {report_type} report for URL: {url}"
            )
        
        if admin.notification_preferences in ["push", "both"] and admin.fcm_token:
            background_tasks.add_task(
                send_notification,
                "push",
                admin.fcm_token,
                "New URL Report",
                f"New {report_type} report for URL: {url}"
            )
    
    db.commit() 