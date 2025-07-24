import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function SecurityTips() {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF9D] to-[#00FF9D] rounded-lg blur opacity-30"></div>
      <div className="relative bg-[#14143C] border-2 border-[#00FF9D] rounded-lg p-6 shadow-[0_0_15px_rgba(0,255,157,0.2)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#1A1B4B]">
            <ShieldCheckIcon className="w-6 h-6 text-[#00FF9D]" />
          </div>
          <h2 className="text-xl font-semibold text-white">Security Tips</h2>
        </div>
        <ul className="space-y-4 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-[#00FF9D] text-2xl leading-none">•</span>
            Always check for HTTPS in the URL
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00FF9D] text-2xl leading-none">•</span>
            Be wary of misspelled domain names
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00FF9D] text-2xl leading-none">•</span>
            Avoid clicking on shortened URLs
          </li>
        </ul>
      </div>
    </div>
  );
} 