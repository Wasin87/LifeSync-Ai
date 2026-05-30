import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, ShieldAlert, Cpu, Database, Network, Key, 
  RefreshCw, CheckCircle, Smartphone as PhoneIcon, Landmark, Info, Activity
} from 'lucide-react';
import { getTranslation, Language } from '../types.js';

interface InteroperabilityViewProps {
  lang: Language;
}

export default function InteroperabilityView({ lang }: InteroperabilityViewProps) {
  const t = getTranslation(lang);
  
  // States
  const [fhirStats, setFhirStats] = useState({
    activeConnections: ["Dhaka Medical College", " NGO Medical Centre", "Remote Rural Core"],
    throughput: "128 txn/sec",
    hl7v3_compliance: "99.8%",
    latency: "45ms"
  });

  const [logs, setLogs] = useState<string[]>([
    "GET /fhir/Patient/PAT-102 HTTP/1.1 (Success, 200 OK)",
    "POST /fhir/Observation - Encrypting payload with TLS_1.3...",
    "HL7-FHIR validator: No compliance issues detected. Strict rules applied."
  ]);

  const [activeTab, setActiveTab] = useState<'SANDBOX' | 'SECURITY'>('SANDBOX');
  const [isTransmitting, setIsTransmitting] = useState(false);

  // Live log streamer simulator
  useEffect(() => {
    const timer = setInterval(() => {
      const paths = [
        "GET /fhir/Patient/PAT-OFF-1204 - 200 OK",
        "POST /fhir/MaternalEncounter - Structuring FHIR v4 Bundle",
        "PUT /fhir/Observation/LIPID-329 - TLS Encrypted",
        "GET /fhir/Patient/$everything - Extraction completed successfully",
        "POST /api/sms-callback - GSM rural USSD packet queued",
        "SYNC /fhir/Immunization - Blockchain hash verified",
        "AUTH /oauth2/token - MOHFW Central Server access granted"
      ];
      const randomPath = paths[Math.floor(Math.random() * paths.length)];
      setLogs(prev => [ `[${new Date().toLocaleTimeString()}] ${randomPath}`, ...prev ].slice(0, 15));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const triggerMockTransmission = () => {
    setIsTransmitting(true);
    setLogs(prev => [ `[${new Date().toLocaleTimeString()}] INITIATING SECURE HANDSHAKE PIPELINE...`, ...prev ]);
    setTimeout(() => {
      setIsTransmitting(false);
      setLogs(prev => [ 
         `[${new Date().toLocaleTimeString()}] SECURE_HANDSHAKE: DMCH Endpoint authenticated in 12ms.`, 
         `[${new Date().toLocaleTimeString()}] 142 PATIENT RECORDS SYNCED VIA FHIR BUNDLE.`,
         ...prev 
      ]);
    }, 3500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Simulation Grid Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Connection health stats */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-center text-purple-600 dark:text-purple-400 font-bold">
            <h3 className="text-sm uppercase font-mono tracking-widest flex items-center gap-2">
              <Network className="w-5 h-5" />
              {lang === 'en' ? "FHIR Command Center" : "কেন্দ্রীয় এফএইচআইআর গেটওয়ে"}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-100 dark:border-slate-800 text-center shadow-inner">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Encryption Shield</p>
              <p className="text-sm lg:text-md font-black text-slate-800 dark:text-white pt-2">AES-GCM-256</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-100 dark:border-slate-800 text-center shadow-inner">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Health Standard</p>
              <p className="text-sm lg:text-md font-black text-slate-800 dark:text-white pt-2">FHIR R4 / HL7v3</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-100 dark:border-slate-800 text-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-purple-500/5 animate-pulse"></div>
              <p className="text-[10px] text-slate-400 font-mono uppercase relative z-10">Data Throughput</p>
              <div className="flex items-center justify-center gap-2 pt-2 relative z-10">
                 <Activity className="w-4 h-4 text-purple-500 animate-bounce" />
                 <p className="text-sm lg:text-md font-black text-purple-600 dark:text-purple-400">{fhirStats.throughput}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-100 dark:border-slate-800 text-center shadow-inner">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Gateway Latency</p>
              <p className="text-sm lg:text-md font-black text-cyan-600 dark:text-cyan-400 pt-2">{fhirStats.latency}</p>
            </div>
          </div>

          <button
            id="btn-transmit-sync"
            onClick={triggerMockTransmission}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/25"
          >
            {isTransmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
            {lang === 'en' ? "Execute API Handshake Payload" : "হাসপাতাল নোডের সাথে ডাটা সিকিউর সিঙ্ক"}
          </button>
        </div>

        {/* Data Transmission Pipeline Animation */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4 relative overflow-hidden flex flex-col justify-between">
           <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2 relative z-10">
              <RefreshCw className={`w-4.5 h-4.5 text-cyan-500 ${isTransmitting ? 'animate-spin' : ''}`} />
              {lang === 'en' ? "Live Data Pipeline Stream" : "লাইভ ডাটা পাইপলাইন ট্রান্সমিশন"}
           </h3>
           
           <div className="flex-1 flex items-center justify-center py-10 relative">
              {/* Background connection track */}
              <div className="absolute left-10 right-10 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
              
              {/* Animated data packets */}
              {isTransmitting && (
                 <>
                   <motion.div 
                     initial={{ left: '10%' }} animate={{ left: '90%' }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                     className="absolute w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-10" 
                   />
                   <motion.div 
                     initial={{ left: '10%' }} animate={{ left: '90%' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.4 }}
                     className="absolute w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_15px_#c084fc] z-10" 
                   />
                   <motion.div 
                     initial={{ left: '10%' }} animate={{ left: '90%' }} transition={{ duration: 1.1, repeat: Infinity, ease: 'linear', delay: 0.8 }}
                     className="absolute w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_15px_#818cf8] z-10" 
                   />
                 </>
              )}

              <div className="flex w-full justify-between relative z-20 px-2 sm:px-0">
                 <div className={`p-2 sm:p-4 rounded-xl border-2 bg-white dark:bg-black flex flex-col items-center gap-1 sm:gap-2 transition-all ${isTransmitting ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'border-slate-200 dark:border-slate-800'}`}>
                    <PhoneIcon className={`w-5 h-5 sm:w-8 sm:h-8 ${isTransmitting ? 'text-purple-500' : 'text-slate-500'}`} />
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase text-slate-500 whitespace-nowrap text-center">Rural Node</span>
                 </div>
                 <div className={`p-2 sm:p-4 rounded-xl border-2 bg-white dark:bg-black flex flex-col items-center gap-1 sm:gap-2 transition-all z-20 ${isTransmitting ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-110' : 'border-slate-200 dark:border-slate-800'}`}>
                    <Network className={`w-5 h-5 sm:w-8 sm:h-8 ${isTransmitting ? 'text-cyan-500' : 'text-slate-500'}`} />
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase text-slate-500 whitespace-nowrap text-center">HL7 Engine</span>
                 </div>
                 <div className={`p-2 sm:p-4 rounded-xl border-2 bg-white dark:bg-black flex flex-col items-center gap-1 sm:gap-2 transition-all ${isTransmitting ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'border-slate-200 dark:border-slate-800'}`}>
                    <Landmark className={`w-5 h-5 sm:w-8 sm:h-8 ${isTransmitting ? 'text-indigo-500' : 'text-slate-500'}`} />
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase text-slate-500 whitespace-nowrap text-center">Govt DB</span>
                 </div>
              </div>
           </div>

           <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 text-xs font-mono text-purple-600 dark:text-purple-400 flex items-center justify-between z-10">
              <span className="flex items-center gap-2"><Key className="w-4 h-4"/> Token: 0x8F9B2...A94</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Validated</span>
           </div>
        </div>

      </div>

      {/* Grid below */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* FHIR Schema Sandbox panel */}
        <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-cyan-500" />
              FHIR Patient Resource Schema
            </h3>
            <span className="text-[9px] font-mono text-slate-400">JSON-LD representation</span>
          </div>

          <pre className="p-4 rounded-xl bg-slate-900 border border-slate-850 text-[11px] font-mono text-cyan-300 overflow-x-auto select-all leading-relaxed">
{`{
  "resourceType": "Patient",
  "id": "PAT-102",
  "active": true,
  "name": [{ "text": "Rahima Begum" }],
  "gender": "female",
  "extension": [{
    "url": "http://hl7.org/fhir/USCoreMaternalRisk",
    "valueString": "Pre-eclampsia Risk detected"
  }]
}`}
          </pre>
        </div>

      </div>

      {/* API interaction log streamer */}
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
          <Terminal className="w-4.5 h-4.5 text-purple-500 animate-pulse" />
          {t.apiLogs}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {lang === 'en' ? "Live streaming transactional logs reflecting automated connections between clinics, NGOs, and central authorities." : "গ্রামীণ ক্লিনিক, বেসরকারি এনজিও এবং সরকারি ডাটা সেন্টারের মধ্যে ঘটে থাকা লাইভ এপিআই আদান-প্রদান লগ:"}
        </p>

        <div className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] text-purple-400 space-y-2 max-h-48 overflow-y-auto pr-1">
          {logs.map((log, index) => (
            <div key={index} className="flex gap-2">
              <span className="text-slate-500">[{index + 1}]</span>
              <p className="text-slate-300 leading-relaxed">{log}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
