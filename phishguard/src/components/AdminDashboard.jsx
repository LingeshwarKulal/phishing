import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  GlobeAltIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [blockedDomains, setBlockedDomains] = useState([]);
  const [reports, setReports] = useState([]);
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDomain, setNewDomain] = useState({ domain: '', reason: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      const mockStats = {
        total_scans: 1250,
        safe_urls: 980,
        suspicious_urls: 180,
        phishing_urls: 90,
        recent_scans: [
          { id: 1, url: 'https://example.com', status: 'safe', risk_score: 0.1, scanned_at: '2023-06-01T10:30:00Z' },
          { id: 2, url: 'https://suspicious-site.com', status: 'suspicious', risk_score: 0.6, scanned_at: '2023-06-01T11:20:00Z' },
          { id: 3, url: 'https://phishing-attempt.com', status: 'phishing', risk_score: 0.9, scanned_at: '2023-06-01T12:15:00Z' }
        ]
      };
      
      const mockBlockedDomains = [
        { domain: 'malicious-site.com', reason: 'Known phishing domain', blocked_at: '2023-05-28T09:15:00Z' },
        { domain: 'fake-bank.com', reason: 'Banking credential theft', blocked_at: '2023-05-30T14:20:00Z' }
      ];
      
      const mockReports = [
        { id: 1, url: 'https://false-positive.com', report_type: 'false_positive', comment: 'This is actually my legitimate site', created_at: '2023-06-01T08:30:00Z' },
        { id: 2, url: 'https://missed-phishing.com', report_type: 'confirmed_phishing', comment: 'This site stole my credentials', created_at: '2023-06-01T09:45:00Z' }
      ];
      
      const mockScanHistory = [
        { date: '2023-05-25', total: 150, safe: 120, suspicious: 20, phishing: 10 },
        { date: '2023-05-26', total: 180, safe: 140, suspicious: 25, phishing: 15 },
        { date: '2023-05-27', total: 200, safe: 160, suspicious: 30, phishing: 10 },
        { date: '2023-05-28', total: 190, safe: 150, suspicious: 25, phishing: 15 },
        { date: '2023-05-29', total: 210, safe: 170, suspicious: 20, phishing: 20 },
        { date: '2023-05-30', total: 230, safe: 180, suspicious: 30, phishing: 20 },
        { date: '2023-05-31', total: 220, safe: 175, suspicious: 25, phishing: 20 }
      ];
      
      setStats(mockStats);
      setBlockedDomains(mockBlockedDomains);
      setReports(mockReports);
      setScanHistory(mockScanHistory);
      setLoading(false);
    }, 1000);
  }, []);

  const handleBlockDomain = async (e) => {
    e.preventDefault();
    try {
      // Simulate API call
      setBlockedDomains([
        ...blockedDomains,
        {
          domain: newDomain.domain,
          reason: newDomain.reason,
          blocked_at: new Date().toISOString()
        }
      ]);
      setNewDomain({ domain: '', reason: '' });
    } catch (err) {
      setError('Failed to block domain');
      console.error(err);
    }
  };

  const handleUnblockDomain = async (domain) => {
    try {
      // Simulate API call
      setBlockedDomains(blockedDomains.filter(block => block.domain !== domain));
    } catch (err) {
      setError('Failed to unblock domain');
      console.error(err);
    }
  };

  const handleLogout = () => {
    // In a real application, you would clear the auth token/session
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    // In a real application, this would send a password reset email
    setResetSent(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetSent(false);
      setEmail('');
    }, 3000);
  };

  // Chart data
  const chartData = {
    labels: scanHistory.map(day => day.date),
    datasets: [
      {
        label: 'Safe',
        data: scanHistory.map(day => day.safe),
        borderColor: '#00FF9D',
        backgroundColor: 'rgba(0, 255, 157, 0.1)',
        tension: 0.4
      },
      {
        label: 'Suspicious',
        data: scanHistory.map(day => day.suspicious),
        borderColor: '#FBBF24',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        tension: 0.4
      },
      {
        label: 'Phishing',
        data: scanHistory.map(day => day.phishing),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(26, 27, 75, 0.8)'
        },
        ticks: {
          color: '#9CA3AF'
        }
      },
      x: {
        grid: {
          color: 'rgba(26, 27, 75, 0.8)'
        },
        ticks: {
          color: '#9CA3AF'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#9CA3AF'
        }
      }
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-12">{error}</div>;
  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with Admin Controls */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-[#00FF9D]">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1B4B] text-[#00FF9D] border-2 border-[#00FF9D] rounded-lg hover:bg-[#1A1B4B]/80 transition-all duration-300"
          >
            <KeyIcon className="w-5 h-5" />
            Reset Password
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[#00FF9D] text-[#14143C] rounded-lg font-medium hover:bg-[#00FF9D]/80 transition-all duration-300"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#14143C] border-2 border-[#00FF9D] rounded-xl p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            {resetSent ? (
              <div className="text-[#00FF9D] mb-4">
                Password reset link has been sent to your email!
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-[#1A1B4B] border-2 border-[#00FF9D] rounded-lg text-white mb-4"
                  required
                />
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setEmail('');
                    }}
                    className="px-4 py-2 text-gray-300 hover:text-[#00FF9D] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00FF9D] text-[#14143C] rounded-lg font-medium hover:bg-[#00FF9D]/80 transition-colors"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Total Scans"
          value={stats.total_scans}
          icon={ChartBarIcon}
          color="text-[#00FF9D]"
        />
        <StatCard
          title="Safe URLs"
          value={stats.safe_urls}
          icon={ShieldCheckIcon}
          color="text-green-400"
        />
        <StatCard
          title="Suspicious URLs"
          value={stats.suspicious_urls}
          icon={ExclamationTriangleIcon}
          color="text-yellow-400"
        />
        <StatCard
          title="Phishing URLs"
          value={stats.phishing_urls}
          icon={XCircleIcon}
          color="text-red-400"
        />
      </div>

      {/* Recent Activity and Domain Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Recent Scans */}
        <div className="card bg-[#14143C] border-2 border-[#00FF9D] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <ClockIcon className="w-6 h-6 text-[#00FF9D]" />
            Recent Scans
          </h2>
          <div className="space-y-4">
            {stats.recent_scans.map((scan, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-300 truncate flex-1">{scan.url}</span>
                <span className={`ml-4 ${getStatusColor(scan.status)}`}>
                  {scan.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Management */}
        <div className="card bg-[#14143C] border-2 border-[#00FF9D] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <GlobeAltIcon className="w-6 h-6 text-[#00FF9D]" />
            Domain Management
          </h2>
          
          <form onSubmit={handleBlockDomain} className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={newDomain.domain}
                onChange={(e) => setNewDomain({ ...newDomain, domain: e.target.value })}
                placeholder="Enter domain"
                className="flex-1 px-4 py-2 bg-[#1A1B4B] border border-[#00FF9D] rounded-lg text-white"
              />
              <input
                type="text"
                value={newDomain.reason}
                onChange={(e) => setNewDomain({ ...newDomain, reason: e.target.value })}
                placeholder="Reason"
                className="flex-1 px-4 py-2 bg-[#1A1B4B] border border-[#00FF9D] rounded-lg text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#00FF9D] text-[#14143C] rounded-lg font-medium hover:bg-[#00FF9D]/80"
              >
                Block
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {blockedDomains.map((block, index) => (
              <div key={index} className="flex items-center justify-between bg-[#1A1B4B] p-4 rounded-lg">
                <div>
                  <div className="text-white font-medium">{block.domain}</div>
                  <div className="text-sm text-gray-400">{block.reason}</div>
                </div>
                <button
                  onClick={() => handleUnblockDomain(block.domain)}
                  className="text-red-400 hover:text-red-300"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Reports */}
      <div className="card bg-[#14143C] border-2 border-[#00FF9D] rounded-xl p-6 mb-12">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <BellIcon className="w-6 h-6 text-[#00FF9D]" />
          Recent Reports
        </h2>
        <div className="space-y-4">
          {reports.map((report, index) => (
            <div key={index} className="bg-[#1A1B4B] p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{report.url}</span>
                <span className={`text-sm ${report.report_type === 'false_positive' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {report.report_type}
                </span>
              </div>
              {report.comment && (
                <p className="text-sm text-gray-400">{report.comment}</p>
              )}
              <div className="text-xs text-gray-500 mt-2">
                {new Date(report.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scan History Chart */}
      <div className="card bg-[#14143C] border-2 border-[#00FF9D] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Scan History</h2>
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-[#14143C] border-2 border-[#00FF9D] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-[#1A1B4B] rounded-lg">
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <h3 className="text-lg font-medium text-white">{title}</h3>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}

function getStatusColor(status) {
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
} 