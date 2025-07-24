import { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function InfoTooltip({ content }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="ml-1 text-gray-400 hover:text-[#00FF9D] transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <InformationCircleIcon className="h-4 w-4" />
      </button>
      
      {isVisible && (
        <div className="absolute z-10 w-72 px-3 py-2 text-sm text-gray-300 bg-[#14143C] border-2 border-[#00FF9D] rounded-lg shadow-[0_0_15px_rgba(0,255,157,0.2)] -right-2 top-6">
          <div className="absolute -top-2 right-3 w-3 h-3 bg-[#14143C] border-t-2 border-l-2 border-[#00FF9D] transform rotate-45" />
          {content}
        </div>
      )}
    </div>
  );
} 