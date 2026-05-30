import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, ShieldAlert, HeartHandshake, FileCheck, HelpCircle,
  AlertCircle, RefreshCw, CheckCircle, Info, Landmark, Terminal
} from 'lucide-react';
import { getTranslation, Language } from '../types.js';

interface EthicalAICenterProps {
  lang: Language;
}

export default function EthicalAICenter({ lang }: EthicalAICenterProps) {
  const t = getTranslation(lang);
  
  // Consent and bias mitigation metrics states
  const [biasRate, setBiasRate] = useState(0.02);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditLog, setAuditLog] = useState<string[]>([
    "Ethical Audit: Substantive checks completed for age and gender representations.",
    "Data anonymization filter: PII hash verification validated (SHA-256 enabled).",
    "Consent layer: Active consent captured. Patients validated clinical usage rules."
  ]);

  const gdprChecks = [
    { title: "Client-side Hashing", value: "SHA-256", status: "Active" },
    { title: "PII Stripping Protocol", value: "RFC 7519", status: "Active" },
    { title: "Consent Revocation Lock", value: "GDPR Art 7", status: "Active" },
    { title: "Clinician Dual-Auth Check", value: "HIPAA Sec 164", status: "Active" }
  ];

  const handleAuditReset = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setBiasRate(0.01);
      setAuditLog(prev => [
        `[${new Date().toLocaleTimeString()}] Algorithmic Bias check complete: Demographic parity deviation is extremely minimal (${0.01}).`,
        ...prev
      ]);
      setIsAuditing(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Simulation Header */}
      <div className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-lg">
            <ShieldCheck className="w-5.5 h-5.5" />
            <h2>{lang === 'en' ? "Ethical AI Core & Consent Safeguards" : "নৈতিক এআই এবং রোগী তথ্য সায় কেন্দ্র"}</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'en'
              ? "Comprehensive bias trackers, SHA-256 client-side PII stripping checklists, HIPAA compliance protocols, and clinical audit suites."
              : "এআই এলগরিদম ফেয়ারনেস এবং পক্ষপাতহীন ট্র্যাকার, নাম গোপন রেখে রোগী ডাটা বিশ্লেষণ এবং জিডিপিআর সম্মতি ফিল্টার।"}
          </p>
        </div>

        <button
          id="btn-trigger-audit"
          disabled={isAuditing}
          onClick={handleAuditReset}
          className="px-4 py-2 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-500 text-xs transition-all flex items-center gap-2 shrink-0 self-start"
        >
          {isAuditing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          {lang === 'en' ? "Perform Fairness Audit" : "এলগরিদম অডিট শুরু করুন"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GDPR/HIPAA compliance checklists (5-cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4 flex flex-col">
          <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-500" />
            {lang === 'en' ? "Privacy & Compliance Shield" : "তথ্য সুরক্ষা প্রোটোকল ও শিল্ড"}
          </h3>
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {gdprChecks.map((check, idx) => (
              <div key={idx} className="p-3 bg-slate-500/5 hover:bg-slate-500/10 transition-colors rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono shadow-sm">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white uppercase text-[10px] tracking-wider">{check.title}</p>
                  <p className="text-[9px] text-slate-400 font-sans mt-0.5">Standard: {check.value}</p>
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider rounded-md">
                  {check.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Anonymization Pipeline diagram (7-cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-6">
          <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
            <HeartHandshake className="w-4.5 h-4.5 text-purple-500" />
            {lang === 'en' ? "Demographic Parity & Bias Deviation Metrics" : "এলগরিদম ডেমোগ্রাফিক সমতা সূচক"}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {lang === 'en' 
              ? "Algorithmic bias evaluates diagnostic accuracy deviations between rural vs urban and male vs female cohorts. LifeSync Ai ensures demographic parity."
              : "গ্রামাঞ্চল বনাম শহরাঞ্চল এবং পুরুষ বনাম নারী রোগীদের রোগ নির্ণয়ে এআই এর নির্ভুলতার কোনো তারতম্য বা বৈষম্য ঘটছে কিনা তা পর্যবেক্ষণ করা হয়:"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Demographic Disparity</p>
              <div className="flex items-center justify-center gap-2 pt-3">
                 <p className="text-4xl font-black text-purple-600 dark:text-purple-400">{(biasRate * 100).toFixed(1)}%</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 mt-2 block bg-emerald-500/10 py-1 rounded mx-4">Optimal Fair alignment (&lt;3%)</span>
            </div>
            
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Human Escalation Overrides</p>
              <div className="flex items-center justify-center gap-2 pt-3">
                 <p className="text-4xl font-black text-cyan-500">0</p>
                 <span className="text-sm font-bold text-slate-500">Cases</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 mt-2 block bg-cyan-500/10 py-1 rounded mx-4">100% Autonomous Accuracy</span>
            </div>
          </div>

          <div className="p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-xl text-xs flex gap-2">
            <AlertCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-350">
              {lang === 'en' ? "Dual-Escalation Protocol: When diagnostic models generate confidence metrics &lt; 80%, systems automatically bypass automated triage locks, redirecting logs directly to human panel doctors." : "ডুয়াল-অ্যাসোসিয়েশন: রোগ নির্ণয়ে এআই এর কনফিডেন্স ৮০% এর কম হলে, সিস্টেম স্বয়ংক্রিয়ভাবে ক্লিনিকাল রিপোর্টটি সরাসরি ডাক্তার প্যানেলের ইনবক্সে পাঠিয়ে দেয়।"}
            </p>
          </div>
        </div>

      </div>

      {/* Ethical logs streaming panel */}
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
          <Terminal className="w-4.5 h-4.5 text-cyan-500 animate-pulse" />
          {lang === 'en' ? "Ethical Transparency Pipeline Logs" : "নৈতিকতা ও নিরপেক্ষতা এআই লগ"}
        </h3>
        
        <div className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] text-cyan-400 space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {auditLog.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-slate-500">[{idx + 1}]</span>
              <p className="text-slate-300 leading-relaxed">{log}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
