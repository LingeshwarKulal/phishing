import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShieldCheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import URLChecker from './components/URLChecker';
import About from './components/About';
import AdminDashboard from './components/AdminDashboard';
import DarkModeToggle from './components/DarkModeToggle';
import History from './components/History';
import AnalysisDashboard from './components/AnalysisDashboard';
import './i18n';

export default function App() {
  const { t, i18n } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);

  // Language options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
  ];

  // Check if PWA is installed
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setIsPWAInstalled(false);
    });

    window.addEventListener('appinstalled', () => {
      window.deferredPrompt = null;
      setIsPWAInstalled(true);
    });
  }, []);

  // Handle PWA installation
  const handleInstallClick = async () => {
    if (!window.deferredPrompt) return;
    
    const promptEvent = window.deferredPrompt;
    promptEvent.prompt();
    
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      window.deferredPrompt = null;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A1F] text-white">
        {/* Navigation */}
        <nav className="bg-[#14143C] border-b border-[#00FF9D]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Brand */}
              <Link 
                to="/" 
                className="flex items-center gap-2 text-[#00FF9D] hover:text-[#00FF9D]/80 transition-colors group"
              >
                <ShieldCheckIcon className="w-8 h-8 group-hover:drop-shadow-[0_0_8px_rgba(0,255,157,0.8)] transition-all" />
                <span className="text-xl font-bold group-hover:drop-shadow-[0_0_8px_rgba(0,255,157,0.8)] transition-all">
                  {t('brand')}
                </span>
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center gap-8">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-[#00FF9D] transition-colors"
                >
                  {t('nav.urlChecker')}
                </Link>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-[#00FF9D] transition-colors"
                >
                  {t('nav.about')}
                </Link>

                {/* Language Selector */}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-300 hover:text-[#00FF9D] transition-colors">
                    <GlobeAltIcon className="w-5 h-5" />
                    <span>{languages.find(lang => lang.code === i18n.language)?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-[#14143C] border-2 border-[#00FF9D] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className="block w-full px-4 py-2 text-left text-gray-300 hover:text-[#00FF9D] hover:bg-[#1A1B4B] transition-colors"
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dark Mode Toggle */}
                <DarkModeToggle />

                {/* PWA Install Button */}
                {!isPWAInstalled && (
                  <button
                    onClick={handleInstallClick}
                    className="px-4 py-2 bg-[#00FF9D] text-[#14143C] rounded-lg font-medium hover:bg-[#00FF9D]/80 transition-colors"
                  >
                    {t('install')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<URLChecker />} />
            <Route path="/about" element={<About />} />
            <Route path="/phishguard-admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-[#14143C] border-t border-[#00FF9D]/20 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-400">
              <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
              <p className="mt-2 text-sm">
                {t('footer.tagline')}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
