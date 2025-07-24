import { useState } from 'react';
import { ShieldCheckIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import SecurityTips from './SecurityTips';
import RiskMeter from './RiskMeter';
import History from './History';
import AnalysisDashboard from './AnalysisDashboard';
import InfoTooltip from './InfoTooltip';

export default function URLChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recentChecks, setRecentChecks] = useState([]);
  const [error, setError] = useState(null);

  const validateUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate URL format
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // Add https:// if not present
    let checkedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      checkedUrl = 'https://' + url;
    }

    if (!validateUrl(checkedUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/check-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: checkedUrl }),
      });

      if (!response.ok) {
        throw new Error('Server error: ' + response.statusText);
      }

      const data = await response.json();
      
      // Format the result
      const formattedResult = {
        status: data.status || 'error',
        risk_score: data.risk_score || 1.0,
        analysis: {
          url_analysis: {
            length: data.features?.url_length || 0,
            special_chars: data.features?.special_chars || 0,
            numbers: data.features?.numeric_chars || 0
          },
          domain_analysis: {
            has_ssl: data.features?.has_ssl || false,
            age_days: data.features?.domain_age_days || 0
          },
          security_checks: {
            redirect_count: data.features?.redirect_count || 0
          }
        }
      };

      setResult(formattedResult);
      
      // Add to recent checks
      setRecentChecks(prev => [{
        url: checkedUrl,
        status: formattedResult.status,
        timestamp: new Date().toISOString()
      }, ...prev].slice(0, 5));
      
    } catch (error) {
      console.error('Error checking URL:', error);
      setError('Failed to check URL. Please try again.');
      setResult({
        status: 'error',
        risk_score: 1.0,
        message: 'Failed to analyze URL'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'safe':
        return 'text-[#00FF9D]';
      case 'suspicious':
        return 'text-yellow-400';
      case 'phishing':
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'safe':
        return 'bg-[#00FF9D]';
      case 'suspicious':
        return 'bg-yellow-400';
      case 'phishing':
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status?.toLowerCase()) {
      case 'safe':
        return <CheckCircleIcon className="w-8 h-8 text-[#00FF9D]" />;
      case 'suspicious':
        return <ExclamationTriangleIcon className="w-8 h-8 text-yellow-400" />;
      case 'phishing':
      case 'error':
        return <XCircleIcon className="w-8 h-8 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-20 px-4 bg-[#0A0A1F]">
      {/* Title Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#00FF9D] to-[#00FF9D] drop-shadow-[0_0_10px_rgba(0,255,157,0.8)]">
          URL Checker
        </h1>
        <p className="text-xl text-gray-400">
          Enter a URL to check if it's potentially malicious or safe
        </p>
      </div>

      {/* URL Input Section */}
      <div className="w-full max-w-4xl mb-8">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF9D] to-[#00FF9D] rounded-lg blur-lg opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL (e.g., https://example.com)"
                className="w-full px-6 py-4 bg-[#14143C] text-white rounded-lg border-2 border-[#00FF9D] shadow-[0_0_15px_rgba(0,255,157,0.3)] focus:shadow-[0_0_20px_rgba(0,255,157,0.5)] outline-none transition-all duration-300 pr-36"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#14143C] text-[#00FF9D] border-2 border-[#00FF9D] rounded-lg hover:bg-[#00FF9D] hover:text-[#14143C] transition-all duration-300 flex items-center gap-2 shadow-[0_0_10px_rgba(0,255,157,0.3)] hover:shadow-[0_0_15px_rgba(0,255,157,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShieldCheckIcon className="w-5 h-5" />
                {loading ? 'Checking...' : 'Check'}
              </button>
            </div>
          </div>
        </form>
        {error && (
          <div className="mt-4 text-red-400 text-sm">{error}</div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="w-full max-w-4xl mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF9D] to-[#00FF9D] rounded-lg blur-lg opacity-30"></div>
            <div className="relative bg-[#14143C] border-2 border-[#00FF9D] rounded-lg p-6 shadow-[0_0_15px_rgba(0,255,157,0.2)]">
              <div className="flex items-start gap-4">
                <StatusIcon status={result.status} />
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold mb-2 capitalize ${getStatusColor(result.status)}`}>
                    {result.status}
                  </h3>
                  
                  {/* Risk Score with RiskMeter component */}
                  <div className="mb-6">
                    <RiskMeter score={Math.round((1 - result.risk_score) * 100)} status={result.status} />
                  </div>

                  {/* Analysis Dashboard */}
                  <AnalysisDashboard result={result} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sections */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Checks using History component */}
        <History checks={recentChecks} />

        {/* Security Tips component */}
        <SecurityTips />
      </div>
    </div>
  );
} 