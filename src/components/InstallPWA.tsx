import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X } from 'lucide-react';
import { Logo } from './Logo.js';

export const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Show iOS prompt after a short delay so it doesn't just instantly annoy
      const timer = setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem('ios_pwa_prompt_seen');
        if (!hasSeenPrompt) {
          setShowIOSPrompt(true);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!promptInstall) return;
    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;
    if (outcome === 'accepted') {
      setSupportsPWA(false);
    }
  };

  const closeIOSPrompt = () => {
    setShowIOSPrompt(false);
    localStorage.setItem('ios_pwa_prompt_seen', 'true');
  };

  if (isStandalone) return null;

  return (
    <>
      {/* Android/Standard PWA Floating Button */}
      <AnimatePresence>
        {supportsPWA && !isIOS && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-50"
          >
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-5 py-3 rounded-full shadow-lg shadow-purple-500/30 transition-all transform hover:scale-105 active:scale-95 font-semibold backdrop-blur-md"
            >
              <span className="p-1 rounded-lg bg-[#0f0e17] border border-indigo-500/20 shadow flex items-center justify-center">
                <Logo className="w-4 h-4 scale-110" isDark={true} />
              </span>
              <span>Install App</span>
              <Download className="w-4 h-4 ml-1" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Modal */}
      <AnimatePresence>
        {isIOS && showIOSPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl relative border border-slate-200 dark:border-slate-800"
            >
              <button 
                onClick={closeIOSPrompt}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center text-center mt-2">
                <div className="p-3 rounded-2xl bg-[#0f0e17] border border-indigo-500/20 shadow-lg shadow-indigo-900/40 mb-4 overflow-hidden">
                  <Logo className="w-16 h-16 scale-110 drop-shadow-md" isDark={true} />
                </div>
                <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white mb-2">Install LifeSync AI</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                  Install this app on your iPhone for quick access, offline resilience, and a better full-screen experience.
                </p>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 w-full text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-blue-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">1. Tap the Share button at the bottom</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">2. Tap "Add to Home Screen"</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
