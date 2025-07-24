from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict
from services.ml_service import PhishingDetector
from utils.url_utils import (
    analyze_url_structure,
    check_ssl_certificate,
    extract_domain_features,
    extract_links_from_page
)
import validators
from urllib.parse import urlparse

router = APIRouter()
phishing_detector = PhishingDetector()

class URLCheckRequest(BaseModel):
    url: str
    scan_content: Optional[bool] = False

class URLAnalysisResponse(BaseModel):
    status: str
    risk_score: float
    features: Dict
    analysis: Dict
    content_analysis: Optional[Dict] = None

def clean_url(url: str) -> str:
    """Clean and normalize URL"""
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    return url

def is_known_safe_domain(domain: str) -> bool:
    """Check if domain is a known safe domain"""
    safe_domains = {
        'google.com', 'microsoft.com', 'apple.com', 'amazon.com',
        'facebook.com', 'github.com', 'linkedin.com', 'twitter.com',
        'instagram.com', 'youtube.com', 'netflix.com', 'spotify.com'
    }
    return any(domain.endswith('.' + safe) or domain == safe for safe in safe_domains)

@router.post("/check-url", response_model=URLAnalysisResponse)
async def check_url(request: URLCheckRequest, background_tasks: BackgroundTasks):
    """
    Check if a URL is potentially malicious
    """
    try:
        # Clean and validate URL
        url = clean_url(request.url)
        if not validators.url(url):
            raise HTTPException(status_code=400, detail="Invalid URL format")

        # Extract domain
        domain = urlparse(url).netloc.lower()
        if not domain:
            raise HTTPException(status_code=400, detail="Invalid domain")

        # Check known safe domains first
        if is_known_safe_domain(domain):
            return {
                "status": "safe",
                "risk_score": 0.0,
                "features": {
                    "url_length": len(url),
                    "special_chars": len([c for c in url if not c.isalnum()]),
                    "numeric_chars": len([c for c in url if c.isdigit()]),
                    "has_ssl": True,
                    "domain_age_days": 1000,  # Placeholder for known safe domains
                    "redirect_count": 0
                },
                "analysis": {
                    "url_analysis": {
                        "length": len(url),
                        "special_chars": len([c for c in url if not c.isalnum()]),
                        "numeric_chars": len([c for c in url if c.isdigit()])
                    },
                    "domain_analysis": {
                        "has_ssl": True,
                        "age_days": 1000  # Placeholder for known safe domains
                    },
                    "security_checks": {
                        "redirect_count": 0,
                        "is_shortened": False
                    }
                }
            }

        # Get ML prediction and features
        features = await phishing_detector.extract_features(url)
        
        # Determine status based on features
        risk_score = sum([
            features['suspicious_words'] * 0.3,
            features['shortened_url'] * 0.2,
            (features['redirect_count'] > 2) * 0.15,
            (not features['has_dns_record']) * 0.1,
            (features['domain_age_days'] < 30) * 0.15,
            (not features['has_ssl']) * 0.05,
            features['blacklisted_ip'] * 0.05
        ])

        status = "safe" if risk_score < 0.3 else "suspicious" if risk_score < 0.6 else "phishing"
        
        # Get additional analysis
        url_structure = analyze_url_structure(url)
        domain_features = extract_domain_features(url)
        
        # Combine all analyses
        analysis = {
            "url_analysis": {
                "length": features['url_length'],
                "special_chars": features['special_chars'],
                "numeric_chars": features['numeric_chars']
            },
            "domain_analysis": {
                "has_ssl": features['has_ssl'],
                "age_days": features['domain_age_days'],
                "has_dns_record": features['has_dns_record']
            },
            "security_checks": {
                "redirect_count": features['redirect_count'],
                "is_shortened": features['shortened_url'],
                "blacklisted": features['blacklisted_ip']
            }
        }
        
        # If content scanning is requested
        content_analysis = None
        if request.scan_content:
            content_analysis = await phishing_detector.analyze_page_content(url)
            analysis["content_analysis"] = content_analysis
        
        return URLAnalysisResponse(
            status=status,
            risk_score=risk_score,
            features=features,
            analysis=analysis,
            content_analysis=content_analysis
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

class URLBatchCheckRequest(BaseModel):
    urls: List[str]

@router.post("/check-urls-batch")
async def check_urls_batch(request: URLBatchCheckRequest):
    """
    Check multiple URLs in batch
    """
    results = {}
    for url in request.urls:
        try:
            prediction = await phishing_detector.predict_url(url)
            results[url] = prediction
        except Exception as e:
            results[url] = {"error": str(e)}
    return results

class URLReport(BaseModel):
    url: str
    is_phishing: bool
    comment: Optional[str] = None

@router.post("/report-url")
async def report_url(report: URLReport):
    """
    Allow users to report false positives or confirmed phishing
    """
    # TODO: Store report in database
    # TODO: Use this data to retrain the model
    return {"message": "Report received", "status": "success"}

@router.get("/url-stats")
async def get_url_stats():
    """
    Get statistics about URL checks (for admin panel)
    """
    # TODO: Implement statistics gathering
    return {
        "total_checks": 0,
        "phishing_detected": 0,
        "safe_urls": 0,
        "suspicious_urls": 0
    } 