import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true); // Default to dark mode

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme !== 'light');
    document.documentElement.classList.toggle('dark', savedTheme !== 'light');
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-[#1A1B4B] hover:bg-[#1A1B4B]/80 border-2 border-[#00FF9D] transition-all duration-300 group"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <SunIcon className="w-5 h-5 text-[#00FF9D] group-hover:drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
      ) : (
        <MoonIcon className="w-5 h-5 text-[#00FF9D] group-hover:drop-shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
      )}
    </button>
  );
} 