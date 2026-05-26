import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, ShieldAlert, Cpu, Database, Network, Key, 
  RefreshCw, CheckCircle, Smartphone as PhoneIcon, Landmark, Info
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
        "POST /api/sms-callback - GSM rural USSD packet queued"
      ];
      const randomPath = paths[Math.floor(Math.random() * paths.length)];
      setLogs(prev => [ `[${new Date().toLocaleTimeString()}] ${randomPath}`, ...prev ].slice(0, 8));
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const triggerMockTransmission = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setLogs(prev => [ `[${new Date().toLocaleTimeString()}] SECURE_HANDSHAKE: DMCH Endpoint authenticated in 12ms.`, ...prev ]);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Simulation Grid Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Connection health stats */}
        <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-5">
          <div className="flex justify-between items-center text-purple-600 dark:text-purple-400 font-bold">
            <h3 className="text-xs uppercase font-mono tracking-widest flex items-center gap-2">
              <Network className="w-4.5 h-4.5" />
              {lang === 'en' ? "Central HL7 FHIR Router Stats" : "কেন্দ্রীয় এইচএল৭ এফএইচআইআর গেটওয়ে"}
            </h3>
            <span className="text-[10px] bg-purple-500/10 text-purple-600 px-2 rounded-full font-mono">
              Interoperable Core
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-500/5 border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 font-mono">ENCRYPTION LEVEL</p>
              <p className="text-md font-extrabold text-slate-800 dark:text-white pt-1">AES-GCM-256</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-500/5 border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 font-mono">HL7 PROTOCOL</p>
              <p className="text-md font-extrabold text-slate-800 dark:text-white pt-1">FHIR v4.0.1</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-500/5 border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 font-mono">TRANSACTION THROUGHPUT</p>
              <p className="text-md font-extrabold text-purple-500 pt-1">{fhirStats.throughput}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-500/5 border border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 font-mono">RESPONSE LATENCY</p>
              <p className="text-md font-extrabold text-cyan-500 pt-1">{fhirStats.latency}</p>
            </div>
          </div>

          <button
            id="btn-transmit-sync"
            onClick={triggerMockTransmission}
            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow"
          >
            {isTransmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
            {lang === 'en' ? "Execute Handshake with DMCH Node" : "হাসপাতাল নোডের সাথে সিকিউর হ্যান্ডশেক"}
          </button>
        </div>

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
