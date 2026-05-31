import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, ShieldAlert, HeartHandshake, FileCheck, 
  AlertCircle, RefreshCw, CheckCircle, Info, Landmark, Terminal,
  Users, Lock, History, Eye, EyeOff, Sliders, UserCheck, Activity, Brain
} from 'lucide-react';
import { getTranslation, Language } from '../types.js';

interface EthicalAICenterProps {
  lang: Language;
}

export default function EthicalAICenter({ lang }: EthicalAICenterProps) {
  const t = getTranslation(lang);

  // Core state pointers for simulator
  const [isAnonymized, setIsAnonymized] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [fairnessScore, setFairnessScore] = useState(98.4);
  const [biasIntensity, setBiasIntensity] = useState(25); // Range: 0 - 100
  const [demographicParity, setDemographicParity] = useState(99.1);
  const [epsilonValue, setEpsilonValue] = useState(0.08);
  const [auditIndex, setAuditIndex] = useState(0);

  // Interactive HIPAA / GDPR trackers
  const [checkedRules, setCheckedRules] = useState({
    businessAssociateContract: true,
    encryptedPHITransport: true,
    patientRightToErasure: true,
    dualAuthorizationActive: true,
    differentialPrivacyActive: true,
  });

  // Responsible AI Activity Feed
  const [activityLogs, setActivityLogs] = useState<Array<{ id: number; msg: string; type: 'success' | 'warn' | 'info'; time: string }>>([
    { id: 1, msg: "Rotated differential privacy cryptographic rotation keys successfully.", type: 'success', time: "10:14:22" },
    { id: 2, msg: "GDPR Art 17 verification: Cleared ephemeral caching across EU Server node-0421.", type: 'info', time: "10:09:41" },
    { id: 3, msg: "Completed demographic parity scan: Male/Female bias offset minimized below threshold.", type: 'success', time: "10:04:12" },
    { id: 4, msg: "Compliance scan: PHI dual-auth logging verified on centralized HealthWorker Node.", type: 'success', time: "09:58:30" }
  ]);

  // Human Escalation monitoring state
  const [escalations, setEscalations] = useState([
    { id: "ESC-9082", patient: "Cohort Sylhet-B", trigger: "Diagnostic Confidence < 78%", state: "Assigned Bioethicist", nurse: "Prof. Ahmed Karim" },
    { id: "ESC-4103", patient: "Cohort Chittagong-E", trigger: "Biochemical Outlier Flag", state: "Completed Review", nurse: "Dr. Farhana Yasmin" }
  ]);

  const [simulationStatus, setSimulationStatus] = useState(lang === 'en' ? "AI Trust Governance operational" : "এআই ট্রাস্ট গভর্ন্যান্স সক্রিয় রয়েছে");

  // Dynamic noise simulator for realistic live metrics
  useEffect(() => {
    const timer = setInterval(() => {
      // Gently drift fairness and parity scores based on slider value
      setFairnessScore(() => {
        const base = 100 - (biasIntensity * 0.15);
        const drift = (Math.random() * 0.4) - 0.2;
        return parseFloat(Math.min(Math.max(base + drift, 60), 100).toFixed(1));
      });

      setDemographicParity(() => {
        const base = 100 - (biasIntensity * 0.11);
        const drift = (Math.random() * 0.3) - 0.15;
        return parseFloat(Math.min(Math.max(base + drift, 70), 100).toFixed(1));
      });
    }, 2800);

    return () => clearInterval(timer);
  }, [biasIntensity]);

  // Run a complete compliance scan simulation
  const triggerComplianceScan = () => {
    setIsScanning(true);
    setSimulationStatus(lang === 'en' ? "Re-scanning fairness algorithms..." : "ফেয়ারনেস অ্যালগরিদম পুনরায় বিশ্লেষণ করা হচ্ছে...");
    
    // Add audio element feedback conceptually if appropriate, or immediately trigger state
    setTimeout(() => {
      setIsScanning(false);
      setFairnessScore(parseFloat((100 - (biasIntensity * 0.1) + Math.random() * 0.5).toFixed(1)));
      setDemographicParity(parseFloat((100 - (biasIntensity * 0.08) + Math.random() * 0.4).toFixed(1)));
      
      const newLog = {
        id: Date.now(),
        msg: `Bias mitigations initialized. Parity ratio set to ${(100 - (biasIntensity * 0.08)).toFixed(1)}% with Epsilon adjustment.`,
        type: biasIntensity > 40 ? 'warn' : 'success' as any,
        time: new Date().toLocaleTimeString()
      };

      setActivityLogs(prev => [newLog, ...prev.slice(0, 5)]);
      setSimulationStatus(lang === 'en' ? "Fairness & Trust indexes re-optimized" : "ফেয়ারনেস ও ট্রাস্ট ইনডেক্স ঠিক করা হয়েছে");
    }, 2000);
  };

  const toggleRule = (key: keyof typeof checkedRules) => {
    setCheckedRules(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const addManualEscalation = () => {
    const randomId = "ESC-" + Math.floor(1000 + Math.random() * 9000);
    const newEsc = {
      id: randomId,
      patient: `Cohort Dhaka-${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`,
      trigger: "Manual Nurse Escalation",
      state: "Assigned Bioethicist",
      nurse: "Bioethics Board Panel-01"
    };

    setEscalations(prev => [newEsc, ...prev]);
    setActivityLogs(prev => [
      { id: Date.now(), msg: `Bypassed machine auto-triage. Escalated case ${randomId} manually to Chief Panel Doctor.`, type: 'warn', time: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Simulation Master Header Banner */}
      <div className="relative p-6 md:p-8 rounded-3xl overflow-hidden glass-card-light dark:glass-card-dark border border-purple-500/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Glow grid background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] animate-pulse">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight uppercase">
                {lang === 'en' ? "AI TRUST & GOVERNANCE CENTER" : "এআই ট্রাস্ট ও মেডিকেল গভর্ন্যান্স সেন্টার"}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{simulationStatus}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {lang === 'en'
              ? "Autonomous algorithmic fairness trackers, patient consent ledger registries, cryptographically enforced differential privacy, and manual high-risk physician dual-auth overrides."
              : "এআই ফেয়ারনেস ট্র্যাকার, নাম গোপনীয়তা নিরাপত্তা লেজার, এবং রোগীর তথ্য প্রসেসিং অডিট প্যানেল।"}
          </p>
        </div>

        <button
          id="trigger-compliance-re-audit"
          disabled={isScanning}
          onClick={triggerComplianceScan}
          className="relative px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 active:scale-95 shrink-0 z-10 self-stretch md:self-auto text-center justify-center cursor-pointer"
        >
          {isScanning ? <RefreshCw className="w-4.5 h-4.5 animate-spin" /> : <ShieldCheck className="w-4.5 h-4.5" />}
          {lang === 'en' ? "Run Trust/Bias Scan" : "ফেয়ারনেস পুনরায় অডিট করুন"}
        </button>
      </div>

      {/* Main Grid for Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Column Left (7-cols): Bias Detection Simulator & AI Fairness Monitor */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* AI Fairness Monitor & Mitigation Console */}
          <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-6 relative overflow-hidden">
            <div className="flex justify-between items-center pb-3 border-b border-purple-500/10 z-10 relative">
              <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2 uppercase tracking-wider">
                <Sliders className="w-4.5 h-4.5 text-purple-500" />
                {lang === 'en' ? "Bias Detection & Demographic Parity Simulator" : "এলগরিদম বায়াস ডিটেকশন ও সমতা সিমুলেটর"}
              </h3>
              <span className="text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded border border-purple-505/20 h-5 flex items-center">
                ACTIVE MITIGATOR ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed z-10 relative">
              {lang === 'en'
                ? "Modulate cohort sample distributions to simulate demographic bias, then trigger algorithmic sweeps to re-align demographic parity values instantly."
                : "জরিপ ডাটার বৈষম্য বাড়িয়ে দিয়ে লাইভ এআই পক্ষপাতদুষ্ট করার ক্ষমতা কেমন তা পরীক্ষা করুন। এরপর সিঙ্ক বাটনে প্রেস করে বায়াস কারেকশন শুরু করুন।"}
            </p>

            {/* Simulated Live Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Brain className="w-16 h-16 text-purple-500" />
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">AI FAIRNESS MATRIX</span>
                <span className="text-3xl font-black text-purple-600 dark:text-purple-400 block pt-1">{fairnessScore}%</span>
                
                {/* Visual score dynamic bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
                  <motion.div 
                    className="h-full bg-purple-500 shadow-[0_0_10px_#a855f7]" 
                    animate={{ width: `${fairnessScore}%` }} 
                    transition={{ duration: 0.8 }} 
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-2 block font-semibold">Goal Constraint: &gt; 95% For NGO Approval</span>
              </div>

              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/15 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Users className="w-16 h-16 text-cyan-500" />
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">DEMOGRAPHIC PARITY</span>
                <span className="text-3xl font-black text-cyan-500 block pt-1">{demographicParity}%</span>

                {/* Visual score dynamic bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
                  <motion.div 
                    className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" 
                    animate={{ width: `${demographicParity}%` }} 
                    transition={{ duration: 0.8 }} 
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-2 block font-semibold">Equitable parity split across gender/district</span>
              </div>
            </div>

            {/* Slider to trigger algorithmic deviation */}
            <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-850 space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-705 dark:text-slate-350">
                <span className="font-bold flex items-center gap-1.5"><Sliders className="w-4 h-4 text-purple-500"/> Disparity Simulation Slider</span>
                <span className="font-mono text-[11px] font-black">{biasIntensity}% Outlier Volume</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={biasIntensity} 
                onChange={(e) => setBiasIntensity(Number(e.target.value))}
                className="w-full accent-purple-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer" 
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-400 uppercase">
                <span>0% Optimal Fair Grid</span>
                <span className="text-red-500 font-bold">100% Extremist Outlier bias</span>
              </div>
            </div>
          </div>

          {/* Core Data Privacy Shield Module */}
          <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2 uppercase tracking-wider">
                <Lock className="w-4.5 h-4.5 text-cyan-500" />
                {lang === 'en' ? "Data Privacy Shield & Differential Key metrics" : "ডাটা প্রাইভেসি এবং ডিফারেনশিয়াল কি মেট্রিক্স"}
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setIsAnonymized(!isAnonymized);
                    setActivityLogs(prev => [
                      { id: Date.now(), msg: `Toggle Anonymization Shield: ${!isAnonymized ? 'ARMED' : 'DISARMED'}.`, type: !isAnonymized ? 'success' : 'warn', time: new Date().toLocaleTimeString() },
                      ...prev
                    ]);
                  }}
                  className="px-2.5 py-1 text-[9px] font-mono font-bold bg-slate-500/10 rounded-md hover:bg-purple-500/10 text-purple-500 cursor-pointer"
                >
                  {isAnonymized ? "Anonymization: Active" : "Anonymization: Off"}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Applying cryptographically added additive Laplace noise to safeguard patient identities while maintaining statistical epidemiological utility for maternal health reports.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="text-[9px] text-slate-400 font-bold font-mono tracking-wide uppercase block">EPSILON RATING</span>
                <span className="text-xl font-mono font-extrabold text-cyan-500 block pt-1">&epsilon; = {epsilonValue}</span>
                <span className="text-[8px] text-emerald-500 font-semibold block mt-1 uppercase">Ultra-Secure</span>
              </div>

              <div className="p-3 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="text-[9px] text-slate-400 font-bold font-mono tracking-wide uppercase block">K-ANONYMITY</span>
                <span className="text-xl font-mono font-extrabold text-purple-500 block pt-1">k = 15</span>
                <span className="text-[8px] text-emerald-500 font-semibold block mt-1 uppercase">High Grouping</span>
              </div>

              <div className="p-3 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="text-[9px] text-slate-400 font-bold font-mono tracking-wide uppercase block">SHA-256 STRIP</span>
                <span className="text-xl font-mono font-extrabold text-slate-800 dark:text-slate-350 block pt-1">Armed</span>
                <span className="text-[8px] text-emerald-500 font-semibold block mt-1 uppercase">PII Redacted</span>
              </div>

              <div className="p-3 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="text-[9px] text-slate-400 font-bold font-mono tracking-wide uppercase block">AUDIT PROOF</span>
                <span className="text-lg font-mono font-extrabold text-slate-800 dark:text-slate-350 block pt-1.5 truncate">0xDF81...C2A</span>
                <span className="text-[8px] text-emerald-500 font-semibold block mt-0.5 uppercase">Validated hash</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column Right (5-cols): HIPAA Compliance Tracker & Responsible AI Activity Feed */}
        <div className="lg:col-span-5 space-y-6">

          {/* HIPAA & GDPR Auditing Checklists */}
          <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2 uppercase tracking-wider">
              <FileCheck className="w-5 h-5 text-cyan-500" />
              {lang === 'en' ? "Privacy Legals Auditing & Checklists" : "গভর্ন্যান্স সম্মতি এবং চেক-লিস্ট"}
            </h3>
            
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Interactive audit checkpoints conforming with international data transfer mandates: GDPR Article 7, and HIPAA Security Rule Section 164.
            </p>

            <div className="space-y-2.5">
              <div 
                onClick={() => toggleRule('businessAssociateContract')}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-550/5 hover:bg-slate-500/10 cursor-pointer transition-colors flex items-center justify-between text-xs select-none"
              >
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={checkedRules.businessAssociateContract} readOnly className="accent-purple-650 h-3.5 w-3.5 rounded" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Business Associate Contract Verified</span>
                </div>
                <span className="text-[9px] font-mono text-purple-500 font-extrabold uppercase">HIPAA §164</span>
              </div>

              <div 
                onClick={() => toggleRule('encryptedPHITransport')}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-550/5 hover:bg-slate-500/10 cursor-pointer transition-colors flex items-center justify-between text-xs select-none"
              >
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={checkedRules.encryptedPHITransport} readOnly className="accent-purple-650 h-3.5 w-3.5 rounded" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Encrypted AES-256 PHI Flight Cache</span>
                </div>
                <span className="text-[9px] font-mono text-purple-500 font-extrabold uppercase">SECURE-TLS</span>
              </div>

              <div 
                onClick={() => toggleRule('patientRightToErasure')}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-550/5 hover:bg-slate-500/10 cursor-pointer transition-colors flex items-center justify-between text-xs select-none"
              >
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={checkedRules.patientRightToErasure} readOnly className="accent-purple-650 h-3.5 w-3.5 rounded" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Right-to-be-Forgotten EU Callback Node</span>
                </div>
                <span className="text-[9px] font-mono text-cyan-500 font-extrabold uppercase">GDPR ART 17</span>
              </div>

              <div 
                onClick={() => toggleRule('dualAuthorizationActive')}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-550/5 hover:bg-slate-500/10 cursor-pointer transition-colors flex items-center justify-between text-xs select-none"
              >
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={checkedRules.dualAuthorizationActive} readOnly className="accent-purple-650 h-3.5 w-3.5 rounded" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Clinician Dual-Auth Multi-layer Lock</span>
                </div>
                <span className="text-[9px] font-mono text-cyan-500 font-extrabold uppercase">ACTIVE GATE</span>
              </div>
            </div>
          </div>

          {/* Human Bioethicist Escalation Overrides Panel */}
          <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
            <div className="flex justify-between items-center text-red-500 font-bold border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xs uppercase font-mono tracking-widest flex items-center gap-2 font-black select-none">
                <Activity className="w-5 h-5 animate-pulse" />
                {lang === 'en' ? "Human-In-The-Loop Bioethics" : "হিউম্যান বায়োএথিক্স এস্কেলেশন"}
              </h3>
              <button 
                onClick={addManualEscalation}
                className="px-2.5 py-1 text-[9px] font-mono font-bold bg-red-500/10 text-red-500 border border-red-500/20 rounded hover:bg-red-500/20 transition-all font-black"
              >
                + ESCALATE CASE
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              When confidence indicators drop below safety limits, NGO algorithms automatically flag reports to human clinicians for manual board reviews.
            </p>

            <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1">
              {escalations.map((esc, index) => (
                <div key={index} className="p-2.5 rounded-xl border border-red-500/10 bg-red-500/5 text-xs flex justify-between items-center transition-all hover:bg-red-500/10">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                      <span className="text-[10px] font-mono text-red-500 font-black">{esc.id}</span>
                      <span>({esc.patient})</span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-mono">Condition: {esc.trigger}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-650 dark:text-red-400 font-mono text-[8.5px] font-bold rounded block uppercase">
                      {esc.state}
                    </span>
                    <span className="text-[8.5px] text-slate-400 italic block mt-0.5">{esc.nurse}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsible AI Activity Feed (Bottom full width logs) */}
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2 uppercase tracking-wide">
            <Terminal className="w-4.5 h-4.5 text-cyan-500 animate-pulse" />
            {lang === 'en' ? "Responsible AI Live Activity Feed Logs" : "রেসপন্সিবল এআই ও ট্রান্সপ্যারেন্সি লগ তালিকা"}
          </h3>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">REALTIME TELEMETRY CONNECTED</span>
        </div>
        
        <div className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] text-cyan-400 space-y-2 max-h-48 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {activityLogs.map((log) => (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="flex items-start gap-2.5 border-b border-white/5 pb-2 last:border-b-0"
              >
                <span className="text-slate-500 text-[10px] shrink-0 pt-0.5">[{log.time}]</span>
                <span className={`px-1.5 py-0.5 text-[8px] rounded font-black shrink-0 ${
                  log.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/15' :
                  log.type === 'warn' ? 'bg-red-500/20 text-red-450 border border-red-505/15' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/15'
                }`} uppercase>
                  {log.type}
                </span>
                <p className="text-slate-3 font-semibold text-xs leading-normal select-all">{log.msg}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
