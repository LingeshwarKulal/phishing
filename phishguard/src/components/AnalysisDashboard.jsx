import { useState } from 'react';
import { 
  ChartBarIcon, 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  DocumentTextIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const SecurityIndicator = ({ title, value, description, type = 'neutral' }) => {
  const getColor = () => {
    switch (type) {
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'danger':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getColor()}`}>
      <h3 className="font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <p className="text-sm opacity-75">{description}</p>
    </div>
  );
};

const SecurityFeature = ({ title, status, description }) => {
  const getIcon = () => {
    if (status === 'good') return <ShieldCheckIcon className="w-5 h-5 text-green-500" />;
    if (status === 'warning') return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
    return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex-shrink-0">{getIcon()}</div>
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
};

export default function AnalysisDashboard({ result }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Add null checks and default values
  const details = result?.details || {};
  const riskScore = result?.risk_score || 0;
  const recommendations = result?.recommendations || [];
  const usesHttps = details?.uses_https || false;
  const domainAge = details?.domain_age_days || 0;
  const containsIp = details?.contains_ip || false;
  const suspiciousTld = details?.suspicious_tld || false;
  const containsAtSymbol = details?.contains_at_symbol || false;
  const subdomainCount = details?.subdomain_count || 0;
  const domainLength = details?.domain_length || 0;

  const exportReport = () => {
    const report = {
      url: details?.original_url || '',
      analysis_time: details?.analysis_time || new Date().toISOString(),
      status: result?.status || 'unknown',
      risk_score: riskScore,
      details: details,
      recommendations: recommendations
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishguard-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!result) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Analysis</h2>
        <button
          onClick={exportReport}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SecurityIndicator
          title="Risk Score"
          value={`${Math.round((1 - riskScore) * 100)}%`}
          description="Overall security assessment"
          type={riskScore <= 0.2 ? 'good' : riskScore <= 0.5 ? 'warning' : 'danger'}
        />
        <SecurityIndicator
          title="Security Features"
          value={usesHttps ? 'HTTPS Enabled' : 'HTTPS Missing'}
          description="Connection security status"
          type={usesHttps ? 'good' : 'danger'}
        />
        <SecurityIndicator
          title="Domain Age"
          value={`${domainAge} days`}
          description="Time since domain registration"
          type={domainAge > 365 ? 'good' : domainAge > 30 ? 'warning' : 'danger'}
        />
      </div>

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'details'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Technical Details
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'recommendations'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Recommendations
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid gap-4">
            <SecurityFeature
              title="Connection Security"
              status={usesHttps ? 'good' : 'danger'}
              description={usesHttps ? 'Secure HTTPS connection available' : 'No secure HTTPS connection'}
            />
            <SecurityFeature
              title="Domain Structure"
              status={containsIp ? 'danger' : suspiciousTld ? 'warning' : 'good'}
              description={
                containsIp
                  ? 'IP address used instead of domain name'
                  : suspiciousTld
                  ? 'Suspicious top-level domain detected'
                  : 'Normal domain structure'
              }
            />
            <SecurityFeature
              title="URL Characteristics"
              status={
                containsAtSymbol || subdomainCount > 3
                  ? 'danger'
                  : domainLength > 50
                  ? 'warning'
                  : 'good'
              }
              description={
                containsAtSymbol
                  ? 'Contains potentially deceptive characters'
                  : subdomainCount > 3
                  ? 'Excessive number of subdomains'
                  : 'Normal URL structure'
              }
            />
          </div>
        )}

        {activeTab === 'details' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700 dark:text-gray-300">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <DocumentTextIcon className="w-5 h-5 text-blue-500" />
                  <span>{rec}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 