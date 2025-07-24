import { useEffect, useState } from 'react';
import { ShieldCheckIcon, ShieldExclamationIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function RiskMeter({ score, status }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Animate the meter
    const timer = setTimeout(() => {
      setWidth(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'safe':
        return { bg: 'bg-[#00FF9D]', text: 'text-[#00FF9D]' };
      case 'suspicious':
        return { bg: 'bg-yellow-400', text: 'text-yellow-400' };
      case 'phishing':
      case 'error':
        return { bg: 'bg-red-400', text: 'text-red-400' };
      default:
        return { bg: 'bg-gray-400', text: 'text-gray-400' };
    }
  };

  const colors = getStatusColor(status);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400">Risk Score</span>
        <span className={`font-semibold ${colors.text}`}>
          {score}%
        </span>
      </div>
      <div className="h-2 bg-[#1A1B4B] rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${colors.bg}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
} 