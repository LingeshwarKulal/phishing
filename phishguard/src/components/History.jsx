import { ClockIcon } from '@heroicons/react/24/outline';

export default function History({ checks }) {
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

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF9D] to-[#00FF9D] rounded-lg blur opacity-30"></div>
      <div className="relative bg-[#14143C] border-2 border-[#00FF9D] rounded-lg p-6 shadow-[0_0_15px_rgba(0,255,157,0.2)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#1A1B4B]">
            <ClockIcon className="w-6 h-6 text-[#00FF9D]" />
          </div>
          <h2 className="text-xl font-semibold text-white">Recent Checks</h2>
        </div>
        {checks.length > 0 ? (
          <div className="space-y-4">
            {checks.map((check, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-400 truncate flex-1">{check.url}</span>
                <span className={`ml-4 ${getStatusColor(check.status)}`}>
                  {check.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400">No recent checks</p>
          </div>
        )}
      </div>
    </div>
  );
} 