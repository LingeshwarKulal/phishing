import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
from typing import Dict, List, Tuple
import re
from urllib.parse import urlparse
import tld
import whois
from datetime import datetime
import requests
import aiohttp
import asyncio
from utils.url_utils import is_shortened_url, count_redirects

# Optional imports with fallbacks
try:
    import dns.resolver
    DNS_AVAILABLE = True
except ImportError:
    DNS_AVAILABLE = False
    print("Warning: dns.resolver not available. DNS checks will be skipped.")

try:
    from bs4 import BeautifulSoup
    BS4_AVAILABLE = True
except ImportError:
    BS4_AVAILABLE = False
    print("Warning: BeautifulSoup4 not available. HTML parsing will be limited.")

class PhishingDetector:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.feature_names = [
            'url_length', 'dots_count', 'numeric_chars', 'special_chars',
            'suspicious_words', 'shortened_url', 'redirect_count', 'has_dns_record',
            'domain_age_days', 'has_ssl', 'blacklisted_ip'
        ]
        
    async def extract_features(self, url: str) -> Dict[str, float]:
        """Extract features from URL for ML model"""
        features = {}
        
        # Basic URL features
        features['url_length'] = len(url)
        features['dots_count'] = url.count('.')
        features['numeric_chars'] = len(re.findall(r'\d', url))
        features['special_chars'] = len(re.findall(r'[^a-zA-Z0-9.]', url))
        
        # Suspicious words check
        suspicious_words = ['login', 'signin', 'account', 'bank', 'confirm', 'secure', 'paypal']
        features['suspicious_words'] = sum(1 for word in suspicious_words if word in url.lower())
        
        # URL shortening check
        features['shortened_url'] = 1 if await is_shortened_url(url) else 0
        
        # Redirect count
        features['redirect_count'] = await count_redirects(url)
        
        # DNS and WHOIS checks
        try:
            domain = tld.get_fld(url)
            # DNS record check
            if DNS_AVAILABLE:
                try:
                    dns.resolver.resolve(domain, 'A')
                    features['has_dns_record'] = 1
                except:
                    features['has_dns_record'] = 0
            else:
                # Fallback DNS check using socket
                try:
                    import socket
                    socket.gethostbyname(domain)
                    features['has_dns_record'] = 1
                except:
                    features['has_dns_record'] = 0
                
            # Domain age
            try:
                w = whois.whois(domain)
                if w.creation_date:
                    creation_date = w.creation_date[0] if isinstance(w.creation_date, list) else w.creation_date
                    age_days = (datetime.now() - creation_date).days
                    features['domain_age_days'] = age_days
                else:
                    features['domain_age_days'] = 0
            except:
                features['domain_age_days'] = 0
                
        except:
            features['has_dns_record'] = 0
            features['domain_age_days'] = 0
        
        # SSL check
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f'https://{domain}', ssl=True) as response:
                    features['has_ssl'] = 1
        except:
            features['has_ssl'] = 0
            
        # IP reputation check (simplified)
        features['blacklisted_ip'] = 0  # Default to 0 if API key not available
        if DNS_AVAILABLE:
            try:
                ip = dns.resolver.resolve(domain, 'A')[0].to_text()
                async with aiohttp.ClientSession() as session:
                    async with session.get(f'https://api.abuseipdb.com/api/v2/check?ipAddress={ip}', 
                                        headers={'Key': 'YOUR_ABUSEIPDB_KEY'}) as response:
                        data = await response.json()
                        features['blacklisted_ip'] = 1 if data.get('data', {}).get('abuseConfidenceScore', 0) > 50 else 0
            except:
                pass
            
        return features

    async def predict_url(self, url: str) -> Dict[str, any]:
        """Predict if a URL is phishing"""
        try:
            # Extract features
            features = await self.extract_features(url)
            
            # Convert features to array
            feature_array = np.array([[
                features[feature] for feature in self.feature_names
            ]])
            
            # Make prediction (in production, use the loaded model)
            # For now, using a simple heuristic
            risk_score = sum([
                features['suspicious_words'] * 0.3,
                features['shortened_url'] * 0.2,
                (features['redirect_count'] > 2) * 0.15,
                (not features['has_dns_record']) * 0.1,
                (features['domain_age_days'] < 30) * 0.15,
                (not features['has_ssl']) * 0.05,
                features['blacklisted_ip'] * 0.05
            ])
            
            # Determine status based on risk score
            if risk_score < 0.3:
                status = "safe"
            elif risk_score < 0.6:
                status = "suspicious"
            else:
                status = "phishing"
                
            return {
                "status": status,
                "risk_score": risk_score,
                "features": features,
                "analysis": {
                    "url_analysis": {
                        "length": features['url_length'],
                        "dots": features['dots_count'],
                        "numbers": features['numeric_chars'],
                        "special_chars": features['special_chars']
                    },
                    "domain_analysis": {
                        "age_days": features['domain_age_days'],
                        "has_dns": features['has_dns_record'],
                        "has_ssl": features['has_ssl']
                    },
                    "security_checks": {
                        "is_shortened": features['shortened_url'],
                        "redirect_count": features['redirect_count'],
                        "blacklisted": features['blacklisted_ip']
                    }
                }
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "risk_score": 1.0
            }

    async def analyze_page_content(self, url: str) -> Dict[str, any]:
        """Analyze the content of the webpage"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    html = await response.text()
                    
                    if BS4_AVAILABLE:
                        # Use BeautifulSoup for detailed HTML parsing
                        soup = BeautifulSoup(html, 'html.parser')
                        
                        # Extract all links
                        links = soup.find_all('a')
                        external_links = []
                        for link in links:
                            href = link.get('href')
                            if href and href.startswith(('http://', 'https://')):
                                external_links.append(href)
                        
                        # Check for suspicious forms
                        forms = soup.find_all('form')
                        suspicious_forms = []
                        for form in forms:
                            if form.find('input', {'type': 'password'}):
                                suspicious_forms.append({
                                    'action': form.get('action'),
                                    'method': form.get('method'),
                                    'has_password': True
                                })
                        
                        return {
                            "external_links": external_links,
                            "suspicious_forms": suspicious_forms,
                            "total_links": len(links),
                            "forms_count": len(forms)
                        }
                    else:
                        # Fallback to regex-based parsing
                        links = re.findall(r'href=[\'"]?([^\'" >]+)', html)
                        forms = re.findall(r'<form[^>]*>.*?</form>', html, re.DOTALL)
                        password_fields = re.findall(r'<input[^>]*type=[\'"]password[\'"]', html)
                        
                        return {
                            "external_links": [link for link in links if link.startswith(('http://', 'https://'))],
                            "suspicious_forms": [{"has_password": True}] if password_fields else [],
                            "total_links": len(links),
                            "forms_count": len(forms)
                        }
                    
        except Exception as e:
            return {
                "error": str(e),
                "external_links": [],
                "suspicious_forms": []
            }

    def save_model(self, path: str):
        """Save the trained model"""
        joblib.dump(self.model, path)

    def load_model(self, path: str):
        """Load a trained model"""
        self.model = joblib.load(path) 