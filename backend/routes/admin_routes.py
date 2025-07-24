from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from models.database import get_db, URLScan, BlockedDomain, URLReport, User
from services.auth_service import get_current_admin_user
from pydantic import BaseModel
import json

router = APIRouter()

class Stats(BaseModel):
    total_scans: int
    safe_urls: int
    suspicious_urls: int
    phishing_urls: int
    recent_scans: List[dict]
    top_domains: List[dict]

class DomainBlock(BaseModel):
    domain: str
    reason: str

class URLReportResponse(BaseModel):
    id: int
    url: str
    report_type: str
    comment: Optional[str]
    created_at: datetime

@router.get("/stats")
async def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get dashboard statistics"""
    
    # Get counts
    total_scans = db.query(URLScan).count()
    safe_urls = db.query(URLScan).filter(URLScan.status == "safe").count()
    suspicious_urls = db.query(URLScan).filter(URLScan.status == "suspicious").count()
    phishing_urls = db.query(URLScan).filter(URLScan.status == "phishing").count()
    
    # Get recent scans
    recent_scans = db.query(URLScan)\
        .order_by(URLScan.scanned_at.desc())\
        .limit(10)\
        .all()
    
    recent_scans_list = []
    for scan in recent_scans:
        scan_dict = {
            "id": scan.id,
            "url": scan.url,
            "status": scan.status,
            "risk_score": scan.risk_score,
            "scanned_at": scan.scanned_at.isoformat()
        }
        recent_scans_list.append(scan_dict)
    
    # Get top scanned domains
    from sqlalchemy import func
    top_domains = db.query(
        URLScan.domain,
        func.count(URLScan.id).label('count'),
        func.avg(URLScan.risk_score).label('avg_risk')
    ).group_by(URLScan.domain)\
     .order_by(func.count(URLScan.id).desc())\
     .limit(5)\
     .all()
    
    top_domains_list = [
        {
            "domain": domain,
            "scan_count": count,
            "average_risk": float(avg_risk)
        }
        for domain, count, avg_risk in top_domains
    ]
    
    return Stats(
        total_scans=total_scans,
        safe_urls=safe_urls,
        suspicious_urls=suspicious_urls,
        phishing_urls=phishing_urls,
        recent_scans=recent_scans_list,
        top_domains=top_domains_list
    )

@router.post("/block-domain")
async def block_domain(
    domain_block: DomainBlock,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Block a domain"""
    
    # Check if domain is already blocked
    existing_block = db.query(BlockedDomain)\
        .filter(BlockedDomain.domain == domain_block.domain)\
        .first()
    
    if existing_block:
        raise HTTPException(
            status_code=400,
            detail="Domain is already blocked"
        )
    
    # Create new block
    new_block = BlockedDomain(
        domain=domain_block.domain,
        reason=domain_block.reason,
        blocked_by=current_user.id
    )
    
    db.add(new_block)
    db.commit()
    
    return {"message": f"Domain {domain_block.domain} has been blocked"}

@router.delete("/unblock-domain/{domain}")
async def unblock_domain(
    domain: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Unblock a domain"""
    
    block = db.query(BlockedDomain)\
        .filter(BlockedDomain.domain == domain)\
        .first()
    
    if not block:
        raise HTTPException(
            status_code=404,
            detail="Domain is not blocked"
        )
    
    db.delete(block)
    db.commit()
    
    return {"message": f"Domain {domain} has been unblocked"}

@router.get("/blocked-domains")
async def get_blocked_domains(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get list of blocked domains"""
    
    blocks = db.query(BlockedDomain).all()
    return [
        {
            "domain": block.domain,
            "reason": block.reason,
            "blocked_at": block.blocked_at.isoformat()
        }
        for block in blocks
    ]

@router.get("/reports")
async def get_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get user reports"""
    
    reports = db.query(URLReport)\
        .join(URLScan)\
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

@router.get("/scan-history")
async def get_scan_history(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get scan history for the last X days"""
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    scans = db.query(
        URLScan.scanned_at.date(),
        func.count(URLScan.id).label('total'),
        func.sum(case([(URLScan.status == 'safe', 1)], else_=0)).label('safe'),
        func.sum(case([(URLScan.status == 'suspicious', 1)], else_=0)).label('suspicious'),
        func.sum(case([(URLScan.status == 'phishing', 1)], else_=0)).label('phishing')
    ).filter(URLScan.scanned_at >= start_date)\
     .group_by(URLScan.scanned_at.date())\
     .order_by(URLScan.scanned_at.date())\
     .all()
    
    return [
        {
            "date": date.isoformat(),
            "total": total,
            "safe": safe or 0,
            "suspicious": suspicious or 0,
            "phishing": phishing or 0
        }
        for date, total, safe, suspicious, phishing in scans
    ] 