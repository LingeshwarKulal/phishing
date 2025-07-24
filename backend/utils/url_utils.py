import aiohttp
from typing import List, Dict
import re
from urllib.parse import urlparse

# Optional imports with fallbacks
try:
    import dns.resolver
    DNS_AVAILABLE = True
except ImportError:
    DNS_AVAILABLE = False
    print("Warning: dns.resolver not available. DNS checks will be skipped.")

# List of known URL shortening services
SHORTENER_DOMAINS = [
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd',
    'cli.gs', 'pic.gd', 'DwarfURL.com', 'ow.ly', 'yfrog.com',
    'migre.me', 'ff.im', 'tiny.cc', 'url4.eu', 'tr.im',
    'twit.ac', 'su.pr', 'twurl.nl', 'snipurl.com', 'short.to',
    'budurl.com', 'ping.fm', 'post.ly', 'Just.as', 'bkite.com',
    'snipr.com', 'fic.kr', 'loopt.us', 'doiop.com', 'tinyurl.com'
]

async def is_shortened_url(url: str) -> bool:
    """Check if URL uses a shortening service"""
    try:
        domain = urlparse(url).netloc.lower()
        return any(shortener in domain for shortener in SHORTENER_DOMAINS)
    except:
        return False

async def count_redirects(url: str) -> int:
    """Count number of redirects for a URL"""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, allow_redirects=True) as response:
                return len(response.history)
    except:
        return 0

async def extract_links_from_page(url: str) -> List[str]:
    """Extract all links from a webpage"""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                html = await response.text()
                urls = re.findall(r'href=[\'"]?([^\'" >]+)', html)
                return urls
    except:
        return []

def analyze_url_structure(url: str) -> Dict[str, any]:
    """Analyze URL structure for suspicious patterns"""
    try:
        parsed = urlparse(url)
        analysis = {
            "uses_https": parsed.scheme == "https",
            "subdomain_count": len(parsed.netloc.split('.')) - 2 if parsed.netloc else 0,
            "path_depth": len([x for x in parsed.path.split('/') if x]),
            "has_port": bool(parsed.port),
            "has_credentials": bool(parsed.username or parsed.password),
            "suspicious_patterns": []
        }
        
        suspicious_patterns = [
            (r'@', 'URL contains @ symbol'),
            (r'//.*/', 'Multiple forward slashes'),
            (r'[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}', 'IP address in URL'),
            (r'(password|login|signin|bank|account|secure|update|verify)', 'Suspicious keywords'),
            (r'[^a-zA-Z0-9-._~:/?#\[\]@!$&\'()*+,;=]', 'Unusual characters in URL')
        ]
        
        for pattern, message in suspicious_patterns:
            if re.search(pattern, url, re.IGNORECASE):
                analysis["suspicious_patterns"].append(message)
        
        return analysis
    except Exception as e:
        return {
            "error": str(e),
            "uses_https": False,
            "suspicious_patterns": []
        }

async def check_ssl_certificate(url: str) -> Dict[str, any]:
    """Check SSL certificate details"""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f'https://{urlparse(url).netloc}') as response:
                return {
                    "has_ssl": True,
                    "ssl_version": response.headers.get('Strict-Transport-Security'),
                    "server": response.headers.get('Server'),
                }
    except:
        return {
            "has_ssl": False,
            "ssl_version": None,
            "server": None
        }

def extract_domain_features(url: str) -> Dict[str, any]:
    """Extract domain-related features from URL"""
    try:
        parsed = urlparse(url)
        domain = parsed.netloc
        
        return {
            "domain": domain,
            "tld": domain.split('.')[-1] if domain else None,
            "subdomain": '.'.join(domain.split('.')[:-2]) if len(domain.split('.')) > 2 else None,
            "path": parsed.path,
            "query": parsed.query,
            "fragment": parsed.fragment
        }
    except Exception as e:
        return {
            "error": str(e),
            "domain": None
        } 