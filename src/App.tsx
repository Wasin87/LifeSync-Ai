import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Heart, Activity, Users, Radio, Salad, Calculator,
  Network, ShieldCheck, ShieldAlert, Settings, Sparkles,
  Menu, X, Moon, Sun, TrendingUp, HelpCircle, FileText
} from 'lucide-react';
import { Language, Theme, getTranslation } from './types.js';
import { Logo } from './components/Logo.js';
import { InstallPWA } from './components/InstallPWA.js';

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
    <div className={`min-h-screen transition-colors duration-300 bg-gradient-to-tr from-[#FAF8FF] via-white to-[#F2EBFF] dark:from-black dark:via-black dark:to-black font-sans text-slate-800 dark:text-slate-100 flex relative overflow-x-hidden cosmic-grid ${theme === 'dark' ? 'dark' : 'light'}`}>
      
      <InstallPWA />

      {/* Decorative ambient glowing beams inspired by the Proxima and Cawar mockups */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute -top-[150px] left-[15%] w-[130%] h-[400px] bg-gradient-to-r from-purple-500/0 via-purple-500/15 to-purple-500/0 rotate-[-12deg] blur-3xl beam-sweep pointer-events-none"></div>
        <div className="absolute top-[40px] left-[35%] w-[120px] h-[350px] bg-purple-500/8 dark:bg-purple-600/15 rounded-full blur-[110px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[20px] right-[10%] w-[250px] h-[250px] bg-indigo-500/5 dark:bg-purple-800/8 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      {/* 2. Left side persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 glass-card-light dark:glass-card-dark border-r border-slate-200/60 dark:border-purple-950/40 sticky top-0 h-screen overflow-y-auto p-5 z-20">
        
        {/* Logo and Brand Identity */}
        <div className="space-y-1 select-none pb-4 border-b border-slate-100 dark:border-purple-950/40">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-2xl bg-[#0f0e17] border border-indigo-500/20 shadow-lg shadow-indigo-900/40 flex items-center justify-center overflow-hidden">
              <Logo className="w-8 h-8 scale-110 drop-shadow-md" isDark={true} />
            </span>
            <div>
              <h1 className="font-extrabold tracking-tight text-md text-slate-900 dark:text-white font-sans flex items-center gap-1.5 leading-none">
                {t.brandName}
              </h1>
              <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold tracking-wider pt-1 font-mono uppercase">
                {lang === 'en' ? "Clinician AI OS" : "এআই ক্লিনিক্যাল ওএস"}
              </p>
            </div>
          </div>
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
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Dynamic Navigation Topbar */}
        <header className="p-4 px-6 glass-card-light dark:glass-card-dark border-b border-slate-200/60 dark:border-slate-850/80 flex items-center justify-between gap-4 fixed top-0 left-0 right-0 lg:left-72 z-30 backdrop-blur-md shadow-sm">
          
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
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-2xl bg-[#0f0e17] border border-indigo-500/20 shadow-lg shadow-indigo-900/40 flex items-center justify-center overflow-hidden">
                      <Logo className="w-8 h-8 scale-110 drop-shadow-md" isDark={true} />
                    </span>
                    <div>
                      <span className="font-extrabold tracking-tight text-slate-950 dark:text-white text-sm font-sans">{t.brandName}</span>
                      <p className="text-[9px] text-purple-600 dark:text-purple-400 font-bold tracking-widest font-mono">
                        {lang === 'en' ? "Clinician AI OS" : "এআই ক্লিনিক্যাল ওএস"}
                      </p>
                    </div>
                  </div>
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
        <div id="main-view-router-compartment" className="flex-1 p-6 pt-[88px] lg:pt-[96px] max-w-[1500px] mx-auto w-full space-y-6 pb-24 lg:pb-6">
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
        <footer className="p-3 text-center text-[10px] md:text-[11px] text-slate-450 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/40 border-t border-slate-200/50 dark:border-slate-850 select-none pb-20 lg:pb-3 max-w-[1500px] mx-auto w-full">
          {t.medicalDisclaimer}
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
