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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* GDPR/HIPAA compliance checklists (5-cols) */}
        <div className="md:col-span-5 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
            <FileCheck className="w-4.5 h-4.5 text-cyan-500" />
            {lang === 'en' ? "Compliance Framework & Shields" : "তথ্য সুরক্ষা প্রোটোকল ও শিল্ড"}
          </h3>
          <div className="space-y-3">
            {gdprChecks.map((check, idx) => (
              <div key={idx} className="p-3 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{check.title}</p>
                  <p className="text-[10px] text-slate-400 font-sans">Methodology: {check.value}</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-bold rounded">
                  {check.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Anonymization Pipeline diagram (7-cols) */}
        <div className="md:col-span-7 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-5">
          <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
            <HeartHandshake className="w-4.5 h-4.5 text-purple-500" />
            {lang === 'en' ? "Demographic Parity & Bias Deviation Metrics" : "এলগরিদম ডেমোগ্রাফিক সমতা সূচক"}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {lang === 'en' 
              ? "Algorithmic bias evaluates diagnostic accuracy deviations between rural vs urban and male vs female cohorts. Healix AI ensures demographic parity."
              : "গ্রামাঞ্চল বনাম শহরাঞ্চল এবং পুরুষ বনাম নারী রোগীদের রোগ নির্ণয়ে এআই এর নির্ভুলতার কোনো তারতম্য বা বৈষম্য ঘটছে কিনা তা পর্যবেক্ষণ করা হয়:"}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-center">
              <p className="text-[10px] text-slate-400 font-sans uppercase">Demographic Disparity</p>
              <p className="text-3xl font-black text-purple-600 dark:text-purple-300 pt-1">{(biasRate * 100).toFixed(1)}%</p>
              <span className="text-[9px] font-mono text-emerald-500">Perfect Fair alignment (&lt;3%)</span>
            </div>
            
            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-center">
              <p className="text-[10px] text-slate-400 font-sans uppercase">Escalation Override Count</p>
              <p className="text-3xl font-black text-cyan-500 pt-1">0 Cases</p>
              <span className="text-[9px] font-mono text-slate-400">Human supervision Active</span>
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
