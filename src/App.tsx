import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Heart, Activity, Users, Radio, Salad, Calculator,
  Network, ShieldCheck, ShieldAlert, Settings, Sparkles,
  Menu, X, Moon, Sun, TrendingUp, HelpCircle, FileText
} from 'lucide-react';
import { Language, Theme, getTranslation } from './types.js';

// Import All Views
import HomeView from './components/HomeView.js';
import MedicalAIView from './components/MedicalAIView.js';
import MaternalHealthView from './components/MaternalHealthView.js';
import HealthWorkerHub from './components/HealthWorkerHub.js';
import TelehealthOfflineView from './components/TelehealthOfflineView.js';
import NutritionAIView from './components/NutritionAIView.js';
import RiskPredictionView from './components/RiskPredictionView.js';
import InteroperabilityView from './components/InteroperabilityView.js';
import EthicalAICenter from './components/EthicalAICenter.js';
import EmergencyAIView from './components/EmergencyAIView.js';
import AdminAnalyticsView from './components/AdminAnalyticsView.js';
import SettingsView from './components/SettingsView.js';
import { LogoIcon, LogoFull } from './components/Logo.js';

type Tab = 
  | 'HOME' 
  | 'MEDICAL_AI' 
  | 'MATERNAL' 
  | 'HEALTH_WORKER' 
  | 'OFFLINE_SYNC' 
  | 'NUTRITION' 
  | 'RISK_PREDICT' 
  | 'INTEROPERABILITY' 
  | 'ETHICAL_AI' 
  | 'EMERGENCY'
  | 'ADMIN_ANALYTICS'
  | 'SETTINGS';

interface NavItem {
  id: Tab;
  label: string;
  icon: any;
  badge?: string;
  highlight?: boolean;
}

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('theme');
      return (saved === 'dark' || saved === 'light') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });
  const [activeTab, setActiveTab] = useState<Tab>('HOME');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Sync theme to root element
  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (e) {
      console.error("Theme sync failed", e);
    }
  }, [theme]);

  const t = getTranslation(lang);

  // Sidebar link details
  const navigationItems: NavItem[] = [
    { id: 'HOME', label: t.home, icon: Home },
    { id: 'MEDICAL_AI', label: t.medicalAi, icon: Sparkles, badge: "AI" },
    { id: 'MATERNAL', label: t.maternalHealth, icon: Heart, badge: "Fetal" },
    { id: 'HEALTH_WORKER', label: t.healthWorker, icon: Users, badge: "WHO" },
    { id: 'OFFLINE_SYNC', label: t.telehealthOffline, icon: Radio, badge: "2G" },
    { id: 'NUTRITION', label: t.nutritionAi, icon: Salad },
    { id: 'RISK_PREDICT', label: t.riskPrediction, icon: Calculator },
    { id: 'INTEROPERABILITY', label: t.apiInteroperability, icon: Network, badge: "FHIR" },
    { id: 'ETHICAL_AI', label: t.ethicalAi, icon: ShieldCheck },
    { id: 'EMERGENCY', label: t.emergencyAi, icon: ShieldAlert, badge: "SOS" },
    { id: 'ADMIN_ANALYTICS', label: t.adminAnalytics, icon: TrendingUp },
    { id: 'SETTINGS', label: t.settings, icon: Settings }
  ];

  return (
    <div className={`h-screen overflow-hidden transition-colors duration-300 bg-gradient-to-tr from-[#FAF8FF] via-white to-[#F2EBFF] dark:from-black dark:via-black dark:to-black font-sans text-slate-800 dark:text-slate-100 flex relative cosmic-grid ${theme === 'dark' ? 'dark' : 'light'}`}>
      
      {/* Decorative ambient glowing beams inspired by the Proxima and Cawar mockups */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute -top-[150px] left-[15%] w-[130%] h-[400px] bg-gradient-to-r from-purple-500/0 via-purple-500/15 to-purple-500/0 rotate-[-12deg] blur-3xl beam-sweep pointer-events-none"></div>
        <div className="absolute top-[40px] left-[35%] w-[120px] h-[350px] bg-purple-500/8 dark:bg-purple-600/15 rounded-full blur-[110px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[20px] right-[10%] w-[250px] h-[250px] bg-indigo-500/5 dark:bg-purple-800/8 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      {/* 2. Left side persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 glass-card-light dark:glass-card-dark border-r border-slate-200/60 dark:border-purple-950/40 h-full overflow-y-auto p-5 z-20 relative">
        
        {/* Logo and Brand Identity */}
        <div className="select-none pb-4 border-b border-slate-100 dark:border-purple-950/40">
          <LogoFull brandName={t.brandName} lang={lang} size="md" />
        </div>

        {/* Navigation lists */}
        <nav className="flex-1 space-y-1.5 pt-5 overflow-y-auto pr-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all select-none group border ${
                  isActive 
                    ? 'bg-purple-600 border-purple-500 text-white shadow shadow-purple-500/20' 
                    : item.highlight
                      ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/25'
                      : 'border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-900/60 text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4.5 h-4.5 group-hover:scale-105 transition-transform ${
                    isActive ? 'text-white' : item.highlight ? 'text-purple-500' : 'text-slate-400'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && !isActive && (
                  <span className="text-[9px] bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/15 px-1.5 py-0.5 rounded font-mono uppercase">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info lockup */}
        <div className="border-t border-slate-100 dark:border-slate-900 pt-3 text-[10px] text-slate-450 font-mono flex items-center justify-between">
          <span>PORTAL VER: 2.1.2</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
        </div>

      </aside>

      {/* 2. Main content compartment */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden flex flex-col relative z-10">
        
        {/* Dynamic Navigation Topbar */}
        <header className="p-4 px-6 glass-card-light dark:glass-card-dark border-b border-slate-200/60 dark:border-slate-850/80 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md shadow-sm">
          
          <div className="flex items-center gap-3">
            {/* Mobile trigger hamburger button */}
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Selected segment indicator label */}
            <div className="hidden sm:block">
              <span className="text-[10px] uppercase font-mono tracking-wider text-purple-600 dark:text-purple-400 font-black">
                {t.dashboardActive}
              </span>
              <h2 className="text-sm font-black text-slate-800 dark:text-white capitalize">
                {navigationItems.find(n => n.id === activeTab)?.label}
              </h2>
            </div>
          </div>

          {/* Quick controls row */}
          <div className="flex items-center gap-3">
            
            {/* Connectivity online/offline toggle indicator */}
            <button
              id="global-connectivity-indicator"
              onClick={() => {
                setIsOnline(!isOnline);
                alert(
                  isOnline 
                    ? "Offline mode engaged! Local records are cached on SIM database." 
                    : "Back online. Continuous HTTPS API synchronization active."
                );
              }}
              className={`p-1.5 px-3 rounded-xl border text-[10px] font-bold tracking-wider font-mono flex items-center gap-1.5 select-none transition-all ${
                isOnline 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-bounce'}`}></span>
              {isOnline ? t.onlineMode : t.offlineMode}
            </button>

            {/* Language switch button */}
            <button
              id="hdr-lang-toggle"
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="p-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/30 text-xs font-mono font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none"
            >
              {lang === 'en' ? "BN" : "EN"}
            </button>

            {/* Theme switch button */}
            <button
              id="hdr-theme-toggle"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/30 text-slate-600 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
            </button>

          </div>

        </header>

        {/* Sliding drawer navigation layout for mobile screen sizes with ultra-premium styling */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-30 lg:hidden flex"
            >
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-80 bg-white/95 dark:bg-black/95 border-r border-slate-200 dark:border-purple-500/25 p-6 h-full overflow-y-auto space-y-6 flex flex-col z-40 relative shadow-2xl"
              >
                {/* Beautiful mobile background cosmic grid overlay */}
                <div className="absolute inset-0 cosmic-grid opacity-35 dark:opacity-60 pointer-events-none z-0"></div>

                <div className="relative z-10 flex justify-between items-center pb-5 border-b border-slate-150 dark:border-purple-950/40">
                  <LogoFull brandName={t.brandName} lang={lang} size="sm" />
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-purple-950/40 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation List */}
                <div className="relative z-10 flex-1 space-y-1.5 overflow-y-auto pr-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`mob-link-${item.id}`}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-all select-none group border ${
                          isActive 
                            ? 'bg-purple-600 border-purple-500 text-white shadow shadow-purple-500/20' 
                            : item.highlight
                              ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/15'
                              : 'border-transparent hover:bg-slate-100 dark:hover:bg-purple-950/30 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4.5 h-4.5 group-hover:scale-105 transition-transform ${
                            isActive ? 'text-white' : item.highlight ? 'text-purple-500' : 'text-slate-400'
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge && !isActive && (
                          <span className="text-[8px] bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/15 px-1.5 py-0.5 rounded font-mono uppercase">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Additional controls inside mobile drawer */}
                <div className="relative z-10 border-t border-slate-150 dark:border-purple-950/45 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">THEME & ACCESS</span>
                    <button 
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="p-1 px-3 rounded-lg bg-slate-100 dark:bg-purple-950/40 text-xs font-semibold text-purple-600 dark:text-purple-300 border border-purple-500/10 hover:border-purple-500/30 transition-all flex items-center gap-1.5"
                    >
                      {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                      {theme === 'dark' ? t.lightMode : t.darkMode}
                    </button>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Main Views router space */}
        <div id="main-view-router-compartment" className="flex-1 p-6 pt-6 max-w-[1500px] mx-auto w-full space-y-6 pb-24 lg:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'HOME' && (
                <HomeView 
                  lang={lang} 
                  online={isOnline} 
                  onNavigate={(p) => {
                    if (p === 'chat') setActiveTab('MEDICAL_AI');
                    else if (p === 'maternal') setActiveTab('MATERNAL');
                    else if (p === 'healthworker') setActiveTab('HEALTH_WORKER');
                    else if (p === 'telehealth') setActiveTab('OFFLINE_SYNC');
                    else if (p === 'emergency') setActiveTab('EMERGENCY');
                  }} 
                />
              )}
              {activeTab === 'MEDICAL_AI' && <MedicalAIView lang={lang} />}
              {activeTab === 'MATERNAL' && <MaternalHealthView lang={lang} />}
              {activeTab === 'HEALTH_WORKER' && <HealthWorkerHub lang={lang} />}
              {activeTab === 'OFFLINE_SYNC' && <TelehealthOfflineView lang={lang} />}
              {activeTab === 'NUTRITION' && <NutritionAIView lang={lang} />}
              {activeTab === 'RISK_PREDICT' && <RiskPredictionView lang={lang} />}
              {activeTab === 'INTEROPERABILITY' && <InteroperabilityView lang={lang} />}
              {activeTab === 'ETHICAL_AI' && <EthicalAICenter lang={lang} />}
              {activeTab === 'EMERGENCY' && <EmergencyAIView lang={lang} />}
              {activeTab === 'ADMIN_ANALYTICS' && <AdminAnalyticsView lang={lang} />}
              {activeTab === 'SETTINGS' && <SettingsView lang={lang} setLang={setLang} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Medical Disclaimer Banner footer */}
        <footer className="relative border-t border-slate-200/50 dark:border-[#484082]/20 bg-white dark:bg-[#100C20] pt-16 pb-24 lg:pb-12 w-full px-6 sm:px-10 lg:px-16 mt-auto overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#6A74FF]/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-[1500px] mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-12">
            
            {/* Brand Column */}
            <div className="lg:col-span-2 flex flex-col items-start pr-4">
              <div className="mb-5">
                <LogoFull brandName={t.brandName} lang={lang} size="sm" />
              </div>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-6 max-w-sm">
                Next-generation Clinician AI OS empowering healthcare professionals with ethical, accessible, and high-precision clinical intelligence. Let's build a healthier tomorrow.
              </p>
              
              <div className="flex gap-3 mb-6">
                {[
                  { icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>, label: "Twitter" },
                  { icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, label: "LinkedIn" },
                  { icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>, label: "GitHub" }
                ].map((social, i) => (
                  <a key={i} href="#" aria-label={social.label} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-[#1A1535] text-slate-500 dark:text-[#A9B1FF] hover:bg-[#6A74FF] hover:text-white dark:hover:bg-[#6A74FF] dark:hover:text-white transition-all">
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-1">
              <h4 className="font-bold text-slate-900 dark:text-white mb-5 text-[13px] tracking-wide uppercase">OS Modules</h4>
              <ul className="space-y-3.5 text-[13.5px] text-slate-600 dark:text-slate-400 font-medium">
                <li><button onClick={() => setActiveTab('MEDICAL_AI')} className="hover:text-[#6A74FF] dark:hover:text-[#A9B1FF] transition-colors">Clinical AI</button></li>
                <li><button onClick={() => setActiveTab('MATERNAL')} className="hover:text-[#6A74FF] dark:hover:text-[#A9B1FF] transition-colors">Maternal Care</button></li>
                <li><button onClick={() => setActiveTab('HEALTH_WORKER')} className="hover:text-[#6A74FF] dark:hover:text-[#A9B1FF] transition-colors">Worker Hub</button></li>
                <li><button onClick={() => setActiveTab('RISK_PREDICT')} className="hover:text-[#6A74FF] dark:hover:text-[#A9B1FF] transition-colors">Risk Prediction</button></li>
              </ul>
            </div>

            <div className="lg:col-span-1">
              <h4 className="font-bold text-slate-900 dark:text-white mb-5 text-[13px] tracking-wide uppercase">Ecosystem</h4>
              <ul className="space-y-3.5 text-[13.5px] text-slate-600 dark:text-slate-400 font-medium">
                <li><button onClick={() => setActiveTab('INTEROPERABILITY')} className="hover:text-[#6A74FF] dark:hover:text-[#A9B1FF] transition-colors">APIs & FHIR</button></li>
                <li><button onClick={() => setActiveTab('ETHICAL_AI')} className="hover:text-[#6A74FF] dark:hover:text-[#A9B1FF] transition-colors">Ethics Board</button></li>
                <li><a href="#" className="hover:text-[#6A74FF] dark:hover:text-[#A9B1FF] transition-colors">Research</a></li>
                <li><a href="#" className="hover:text-[#6A74FF] dark:hover:text-[#A9B1FF] transition-colors">Open Source</a></li>
              </ul>
            </div>

            <div className="lg:col-span-1">
              <h4 className="font-bold text-slate-900 dark:text-white mb-5 text-[13px] tracking-wide uppercase">Company</h4>
              <ul className="space-y-3.5 text-[13.5px] text-slate-600 dark:text-slate-400 font-medium">
                <li><a href="#" className="hover:text-[#6A74FF] dark:hover:text-[#A9B1FF] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#6A74FF] dark:hover:text-[#A9B1FF] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#6A74FF] dark:hover:text-[#A9B1FF] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#6A74FF] dark:hover:text-[#A9B1FF] transition-colors">Trust Center</a></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="lg:col-span-1">
              <h4 className="font-bold text-slate-900 dark:text-white mb-5 text-[13px] tracking-wide uppercase">Stay Updated</h4>
              <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Get the latest clinical AI research, platform updates, and insights directly to your inbox.
              </p>
              <form className="mt-2 flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="name@hospital.org" 
                  className="bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 dark:bg-[#1A1535]/50 dark:border-[#484082]/50 dark:text-white dark:placeholder:text-slate-500 text-[13px] rounded-lg px-3.5 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-[#6A74FF]/50 transition-all" 
                />
                <button type="submit" className="bg-[#6A74FF] hover:bg-[#5C65DF] text-white text-[13px] font-bold px-3.5 py-2.5 rounded-lg transition-colors w-full shadow-md shadow-[#6A74FF]/20">
                  Subscribe
                </button>
              </form>
            </div>
            
          </div>

          <div className="max-w-[1500px] mx-auto border-t border-slate-200 dark:border-[#484082]/30 pt-8 flex flex-col-reverse md:flex-row items-center justify-between gap-6 relative z-10 w-full">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
              <p className="text-[12px] text-slate-500 font-medium">
                © {new Date().getFullYear()} {t.brandName}. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-[12px] text-slate-500 font-medium">
                <a href="#" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">Privacy</a>
                <a href="#" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">Terms</a>
                <a href="#" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">Security</a>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center md:text-right max-w-xl leading-relaxed">
              <strong className="font-semibold text-slate-500 dark:text-slate-400">Clinical Disclaimer:</strong> {t.medicalDisclaimer}
            </p>
          </div>
        </footer>

        {/* 4. Desktop-first precision: Responsive Mobile bottom navigation menu bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-850/80 z-20 flex justify-around select-none">
          <button
            id="mobile-bottom-link-home"
            onClick={() => setActiveTab('HOME')}
            className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'HOME' ? 'text-purple-600' : 'text-slate-400'}`}
          >
            <Home className="w-4.5 h-4.5" />
            <span>Home</span>
          </button>
          <button
            id="mobile-bottom-link-ai"
            onClick={() => setActiveTab('MEDICAL_AI')}
            className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'MEDICAL_AI' ? 'text-purple-600' : 'text-slate-400'}`}
          >
            <Sparkles className="w-4.5 h-4.5" />
            <span>AI Care</span>
          </button>
          <button
            id="mobile-bottom-link-maternal"
            onClick={() => setActiveTab('MATERNAL')}
            className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'MATERNAL' ? 'text-purple-600' : 'text-slate-400'}`}
          >
            <Heart className="w-4.5 h-4.5" />
            <span>Maternal</span>
          </button>
          <button
            id="mobile-bottom-link-worker"
            onClick={() => setActiveTab('HEALTH_WORKER')}
            className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'HEALTH_WORKER' ? 'text-purple-600' : 'text-slate-400'}`}
          >
            <Users className="w-4.5 h-4.5" />
            <span>WHO Scribe</span>
          </button>
          <button
            id="mobile-bottom-link-emergency"
            onClick={() => setActiveTab('EMERGENCY')}
            className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'EMERGENCY' ? 'text-purple-600' : 'text-slate-400'}`}
          >
            <ShieldAlert className="w-4.5 h-4.5" />
            <span>SOS</span>
          </button>
        </div>

      </main>

    </div>
  );
}
