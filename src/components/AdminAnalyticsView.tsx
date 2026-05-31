import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Activity, Users, ShieldAlert, Sparkles, 
  Landmark, RefreshCw, Cpu, PhoneCall, Zap, Wifi, Database, Globe, Heart, CheckCircle
} from 'lucide-react';
import { getTranslation, Language } from '../types.js';

interface AdminAnalyticsViewProps {
  lang: Language;
}

export default function AdminAnalyticsView({ lang }: AdminAnalyticsViewProps) {
  const t = getTranslation(lang);

  // Live drift timers simulation
  const [activeTelehealth, setActiveTelehealth] = useState(14);
  const [successfulQueries, setSuccessfulQueries] = useState(4812);
  const [syncTimestamp, setSyncTimestamp] = useState<string>("10:24:15");
  const [avgLatency, setAvgLatency] = useState(15); // ms
  const [syncState, setSyncState] = useState<'Synced' | 'Synchronizing'>('Synced');

  useEffect(() => {
    const timer = setInterval(() => {
      // Small randomized drifts for live feedback feel
      setActiveTelehealth(prev => {
        const drift = Math.random() > 0.5 ? 1 : -1;
        return Math.min(Math.max(prev + drift, 8), 24);
      });

      setSuccessfulQueries(prev => prev + (Math.random() > 0.7 ? 1 : 0));
      
      setAvgLatency(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(Math.max(prev + delta, 12), 25);
      });

      if (Math.random() > 0.85) {
        setSyncState('Synchronizing');
        setTimeout(() => {
          setSyncState('Synced');
          setSyncTimestamp(new Date().toLocaleTimeString());
        }, 1200);
      }
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  // Recharts Dataset 1: Disease trends by district
  const diseaseData = [
    { name: 'Dhaka', Dengue: 240, Influenza: 320, Malaria: 45 },
    { name: 'Sylhet', Dengue: 85, Influenza: 410, Malaria: 160 },
    { name: 'Chittagong', Dengue: 195, Influenza: 280, Malaria: 90 },
    { name: 'Rajshahi', Dengue: 60, Influenza: 190, Malaria: 30 }
  ];

  // Recharts Dataset 2: Monthly Maternal risk incidents logged
  const maternalTrendData = [
    { month: 'Jan', preEclampsia: 12, anemia: 34, normal: 120 },
    { month: 'Feb', preEclampsia: 18, anemia: 28, normal: 145 },
    { month: 'Mar', preEclampsia: 15, anemia: 45, normal: 160 },
    { month: 'Apr', preEclampsia: 24, anemia: 31, normal: 175 },
    { month: 'May', preEclampsia: 28, anemia: 52, normal: 190 }
  ];

  // Recharts Dataset 3: Diagnostic triage breakdown
  const demographicData = [
    { name: 'High Risk (RED)', value: 12, color: '#ef4444' },
    { name: 'Moderate Risk (YELLOW)', value: 34, color: '#f59e0b' },
    { name: 'Optimal Healthy (GREEN)', value: 154, color: '#10b981' }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Simulation Header / Master Controller */}
      <div className="p-6 md:p-8 rounded-3xl glass-card-light dark:glass-card-dark border border-purple-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -left-32 -bottom-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight uppercase">
                {lang === 'en' ? "Executive Healthcare Intelligence Center" : "এক্সিকিউটিভ হেলথকেয়ার ইন্টেলিজেন্স সেন্ট্রাল"}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">Global NGO Audit Sync Online</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            {lang === 'en' 
              ? "Comprehensive platform health KPIs analyzing active telehealth engagement, P2P offline queue performance, AI query token rates, and live maternal epidemiological surveillance pipelines."
              : "সারাদেশের গ্রামীণ ক্লিনিক, স্যানিটারি কোয়ার্টার এবং টেলিকম গ্রিডের সংযুক্ত লাইভ ডাটা পর্যবেক্ষণ প্যানেল।"}
          </p>
        </div>

        <div className="flex items-center gap-3.5 shrink-0 z-10">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 block font-mono">P2P DATA SYNC STATUS</span>
            <span className="text-[11px] font-extrabold text-emerald-500 flex items-center gap-1 mt-0.5 justify-end">
              <Wifi className="w-3.5 h-3.5" /> Synced at {syncTimestamp}
            </span>
          </div>
          <button
            id="analytics-force-resync"
            className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${syncState === 'Synchronizing' ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid of 4 Interactive KPI Modules (Investor-Grade Quality) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Module 1: User Growth Analytics */}
        <div className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4 relative overflow-hidden group hover:border-purple-500/20 transition-all duration-350 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Cohort Growth</span>
            <Users className="w-4.5 h-4.5 text-purple-550" />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">12,840</span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-extrabold text-emerald-500">+18% MoM Growth</span>
              <span className="text-[10px] text-slate-400">Enrolled Patients</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400 font-mono relative z-10">
            <span>Clinicians: <span className="text-slate-805 dark:text-white font-extrabold">142 Active</span></span>
            <span className="text-purple-500 font-bold">12 NGO Hubs</span>
          </div>
        </div>

        {/* Module 2: AI Query Analytics */}
        <div className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4 relative overflow-hidden group hover:border-purple-500/20 transition-all duration-350 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">AI Inference Core</span>
            <Cpu className="w-4.5 h-4.5 text-cyan-500" />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{successfulQueries}</span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-extrabold text-cyan-500">Peak Latency: {avgLatency}ms</span>
              <span className="text-[10px] text-slate-400">99.9% Success</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400 font-mono relative z-10">
            <span>Token Volume: <span className="text-slate-805 dark:text-white font-extrabold">2.4M</span></span>
            <span className="text-cyan-500 font-bold">SHA-256 Armed</span>
          </div>
        </div>

        {/* Module 3: Maternal Registrar Outcomes */}
        <div className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4 relative overflow-hidden group hover:border-purple-500/20 transition-all duration-350 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Maternal Registries</span>
            <Heart className="w-4.5 h-4.5 text-rose-500" />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">892</span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-extrabold text-emerald-500">98.9% Birth Safety Check</span>
              <span className="text-[10px] text-slate-400">Active</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400 font-mono relative z-10">
            <span>High Risk Alert Level: <span className="text-rose-500 font-extrabold">45 Active</span></span>
            <span className="text-rose-500 font-bold">100% Monitored</span>
          </div>
        </div>

        {/* Module 4: Emergency SOS Triage Dispatch */}
        <div className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4 relative overflow-hidden group hover:border-purple-500/20 transition-all duration-350 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Crisis Triage Dispatch</span>
            <ShieldAlert className="w-4.5 h-4.5 text-red-500 animate-pulse" />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">4.2 <span className="text-xs text-red-500 font-mono">MINS</span></span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-extrabold text-emerald-500">99.8% Dispatch Safety</span>
              <span className="text-[10px] text-slate-400">Response Mean</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400 font-mono relative z-10">
            <span>Ambulance NGO fleet: <span className="text-slate-805 dark:text-white font-extrabold">18 Units</span></span>
            <span className="text-red-500 font-bold font-mono">LEVEL 1 GATE</span>
          </div>
        </div>

      </div>

      {/* Middle Row Layout: Outbreak Charts & Triage Donuts bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* District disease outbreak trends barchart (7-cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-purple-500/10">
            <h4 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider font-mono">
              {lang === 'en' ? "Epidemiological Outbreak Density (recharts)" : "জেলা ভিত্তিক মহামালী ছড়ানোর তীব্রতা"}
            </h4>
            <span className="text-[9.5px] font-mono text-purple-500 font-bold uppercase">Surveillance Active</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#0a0518', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px' }} 
                  labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }} 
                  itemStyle={{ fontSize: '11px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '10px', pt: 10 }} />
                <Bar dataKey="Dengue" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Influenza" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Malaria" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Diagnostic Triage classification donut (5-cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-2 border-b border-purple-500/10">
            <h4 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider font-mono">
              {lang === 'en' ? "Triage Split distribution" : "রোগীর সামগ্রিক ঝুঁকির কন্ডিশন বিভাজন"}
            </h4>
            <span className="text-[9.5px] font-mono text-cyan-500 font-bold uppercase">Dynamic audit</span>
          </div>

          <div className="h-56 relative flex items-center justify-center">
            {/* Center annotation */}
            <div className="absolute text-center">
              <span className="text-xs text-slate-400 block font-mono">TOTAL REPORTED</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white">200 <span className="text-xs">Cases</span></span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#0a0518', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px' }} 
                  itemStyle={{ color: '#fff', fontSize: '11px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono font-bold">
            {demographicData.map((d, i) => (
              <div key={i} className="p-2 rounded-xl bg-slate-500/5 border border-slate-100 dark:border-slate-850">
                <span className="block h-2.5 w-2.5 rounded-full mx-auto mb-1" style={{ backgroundColor: d.color }}></span>
                <p className="text-slate-800 dark:text-slate-200 mt-1">{d.value} Cases</p>
                <span className="text-[8.5px] text-slate-400 uppercase font-medium block mt-0.5 truncate">{d.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Maternal-Fetal risk trends linechart */}
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-purple-500/10">
          <h4 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider font-mono">
            {lang === 'en' ? "Demographic Maternal Risk Incidents log metrics" : "গর্ভকালীন জটিলতা রিপোর্টিং টাইমলাইন"}
          </h4>
          <span className="text-[9.5px] font-mono text-rose-500 font-bold uppercase">Time series analysis</span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={maternalTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: '#0a0518', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px' }} 
                labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }} 
                itemStyle={{ fontSize: '11px' }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', pt: 10 }} />
              <Line type="monotone" dataKey="preEclampsia" stroke="#f43f5e" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="anemia" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="normal" stroke="#34d399" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technical API Throughput & Telehealth Latency (Bento Splitting bottom) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Telehealth Monitoring KPI */}
        <div className="md:col-span-6 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-purple-505/10 pb-3">
            <h4 className="font-bold text-slate-805 dark:text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
              <PhoneCall className="w-4.5 h-4.5 text-cyan-500 animate-pulse" /> Telehealth Live Connection Metrics
            </h4>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
            Track active clinical consultations over satellite connection layers. Monitors communication latency levels to protect patient video diagnostics.
          </p>

          <div className="grid grid-cols-3 gap-3 text-center py-2">
            <div className="p-3 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">Sessions Active</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white block pt-1 animate-pulse">{activeTelehealth}</span>
              <span className="text-[8px] text-slate-400 font-mono">Satellite channels</span>
            </div>

            <div className="p-3 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">Connection rate</span>
              <span className="text-2xl font-black text-cyan-500 block pt-1">99.1%</span>
              <span className="text-[8px] text-emerald-500 font-mono font-bold">Excellent SLA</span>
            </div>

            <div className="p-3 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">AV Latency Mean</span>
              <span className="text-2xl font-black text-purple-500 block pt-1">34 ms</span>
              <span className="text-[8px] text-purple-500 font-mono font-bold">&lt;50ms target</span>
            </div>
          </div>
        </div>

        {/* API payload statistics */}
        <div className="md:col-span-6 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-purple-505/10 pb-3">
            <h4 className="font-bold text-slate-805 dark:text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-purple-550" /> FHIR Interoperability payload core
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">HL7 READY</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
            Aggregated transactions transmitted to governmental records repositories. Validated schemas compliant with health regulatory standards.
          </p>

          <div className="grid grid-cols-2 gap-3 text-center py-2">
            <div className="p-3 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">FHIR Payloads Processed</span>
              <span className="text-xl font-black text-emerald-500 block pt-1">1,248,912</span>
              <span className="text-[8px] text-slate-405 font-mono">JSON Outlets Compliant</span>
            </div>

            <div className="p-3 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">HL7 Transmission rate</span>
              <span className="text-xl font-black text-slate-800 dark:text-white block pt-1">12,410 q/s</span>
              <span className="text-[8px] text-slate-405 font-mono">Throughput speed</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
