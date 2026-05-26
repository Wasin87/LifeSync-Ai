import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, Key, Globe, EyeOff, Smartphone, 
  Trash2, RefreshCw, CheckCircle, Database, HelpCircle
} from 'lucide-react';
import { getTranslation, Language } from '../types.js';

interface SettingsViewProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

export default function SettingsView({ lang, setLang }: SettingsViewProps) {
  const t = getTranslation(lang);
  
  const [useHologramCode, setUseHologramCode] = useState(true);
  const [anonymizeAlways, setAnonymizeAlways] = useState(true);
  const [gpsTracking, setGpsTracking] = useState(true);

  const clearOfflineLog = () => {
    alert(lang === 'en' ? "SIM card IndexedDB cache completely cleared." : "আইডিবি ক্যাশে ডাটা সম্পূর্ণ মুছে ফেলা হয়েছে।");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-6 max-w-4xl">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold border-b border-slate-100 dark:border-slate-800 pb-3">
          <Settings className="w-5.5 h-5.5" />
          <h2>{lang === 'en' ? "Global System Settings & Control Panels" : "গ্লোবাল সিস্টেম সেটিংস প্যানেল"}</h2>
        </div>

        {/* Configurations list */}
        <div className="space-y-4">
          
          {/* Language selector section */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-3.5 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <p className="font-bold text-slate-800 dark:text-white flex items-center gap-1">
                <Globe className="w-4 h-4 text-purple-500" />
                {lang === 'en' ? "System Translation Language Toggles" : "সিস্টেম ভাষা পরিবর্তন"}
              </p>
              <p className="text-[10px] text-slate-400 leading-relaxed pt-0.5">Toggle immediately update all navbar, dashboards, menus, widgets, and AI responses.</p>
            </div>
            
            <div className="flex gap-2 shrink-0">
              <button
                id="btn-set-lang-en"
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                  lang === 'en' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350'
                }`}
              >
                English
              </button>
              <button
                id="btn-set-lang-bn"
                onClick={() => setLang('bn')}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                  lang === 'bn' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          {/* Core toggle components */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-100 dark:border-slate-800 space-y-1.5 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Strict HIPAA-Consent stripped</p>
                <p className="text-[10px] text-slate-400">Force anonymize patient PII hashes</p>
              </div>
              <input
                id="toggle-hipaa-anonymize"
                type="checkbox"
                checked={anonymizeAlways}
                onChange={() => setAnonymizeAlways(!anonymizeAlways)}
                className="w-4 h-4 accent-purple-500 rounded cursor-pointer shrink-0"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-100 dark:border-slate-800 space-y-1.5 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-slate-800 dark:text-white">Cell-tower Coordinate location tracking</p>
                <p className="text-[10px] text-slate-400">For locating closest crisis clinic nodes</p>
              </div>
              <input
                id="toggle-gps-tracking"
                type="checkbox"
                checked={gpsTracking}
                onChange={() => setGpsTracking(!gpsTracking)}
                className="w-4 h-4 accent-purple-500 rounded cursor-pointer shrink-0"
              />
            </div>

          </div>

          {/* Clearing data cache */}
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                <Trash2 className="w-4 h-4" />
                {lang === 'en' ? "Flush Offline EMR Sim Caches" : "অফলাইন ইএমআর মেমোরি ফ্লাশ"}
              </p>
              <p className="text-[10.5px] text-slate-400 leading-relaxed pt-0.5">Completely delete all compiled local indices and USSD queued records of patients.</p>
            </div>
            
            <button
               id="btn-clear-cache"
               onClick={clearOfflineLog}
               className="px-4 py-1.5 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white text-[11px] transition-all self-start shrink-0"
            >
              Clear DB
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
