import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, Activity, Heart, MapPin, Phone, 
  RefreshCw, CheckCircle, Smartphone as PhoneIcon, Landmark, Info
} from 'lucide-react';
import { getTranslation, Language } from '../types.js';

interface EmergencyAIViewProps {
  lang: Language;
}

export default function EmergencyAIView({ lang }: EmergencyAIViewProps) {
  const t = getTranslation(lang);
  
  // States
  const [sosActive, setSosActive] = useState(false);
  const [heartRate, setHeartRate] = useState(78);
  const [spo2, setSpo2] = useState(98);

  // Fluctuating vitals emulator
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(Math.max(prev + delta, 72), 85);
      });
      setSpo2(prev => {
        if (Math.random() > 0.8) {
          const delta = Math.floor(Math.random() * 3) - 1;
          return Math.min(Math.max(prev + delta, 95), 100);
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const triggerSOSAlarm = () => {
    setSosActive(!sosActive);
  };

  const hospitals = [
    { name: lang === 'en' ? "Sylhet Community Clinic Hub" : "সিলেট কমিউনিটি ক্লিনিক হাব", distance: "0.8 km", phone: "+880-1712-329402", type: "Primary evacuation" },
    { name: lang === 'en' ? "DMCH Satellite Clinic 4" : "ডিএমসিএইচ স্যাটেলাইট নং ৪", distance: "3.2 km", phone: "+880-1923-112930", type: "Tertiary surgery" },
    { name: lang === 'en' ? "NGO HealthAid Cox's Bazar Core" : "এনজিও হেলথএইড কক্সবাজার সেন্টার", distance: "11.6 km", phone: "+880-1811-940392", type: "Emergency ICU triage" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Alert Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xl shadow-red-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-black text-lg md:text-xl uppercase tracking-wider">
            <ShieldAlert className="w-6 h-6 animate-ping shrink-0" />
            <h2>{lang === 'en' ? "Disaster Evacuation Mode & SOS AI" : "জরুরি দুর্যোগ চিকিৎসা এবং এসওএস প্যানেল"}</h2>
          </div>
          <p className="text-xs text-red-100 max-w-xl">
            {lang === 'en' 
              ? "Triggering immediate medical SOS broadcasts coordinates to nearest NGO responders via low-bandwidth emergency frequencies."
              : "দুর্যোগকালীন সংকটে বা প্রসবকালীন গুরুতর জটিলতায় একটি ক্লিকে আপনার অবস্থান ট্র্যাক করে এনজিও রেসকিউ টিম ডেকে নিন।"}
          </p>
        </div>

        <button
          id="sos-trigger-alert-btn"
          onClick={triggerSOSAlarm}
          className={`px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest border-2 transition-all shrink-0 ${
            sosActive 
              ? 'bg-white text-red-600 border-white font-black animate-pulse' 
              : 'bg-red-700 hover:bg-red-800 text-white border-red-500'
          }`}
        >
          {sosActive ? (lang === 'en' ? "STOP SOS ALARM" : "এসওএস এলার্ম বন্ধ করুন") : (lang === 'en' ? "TRIGGER MEDICAL SOS" : "জরুরি এসওএস এলার্ম দিন")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Cardiac telemetry widget (7-cols) */}
        <div className="md:col-span-7 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-6">
          <div className="flex justify-between items-center text-red-500 font-bold">
            <h3 className="text-xs uppercase font-mono tracking-widest flex items-center gap-2">
              <Activity className="w-5 h-5 animate-pulse" />
              {lang === 'en' ? "Integrated Cardiac Telemetry Stream" : "রিয়েল-টাইম হার্ট-রেট ও রক্ত সংবহন"}
            </h3>
            <span className="text-[10px] bg-red-500/10 text-red-600 px-2.5 py-0.5 rounded-full font-mono">
              Smartwatch synced
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-center space-y-1">
              <Heart className="w-6 h-6 text-red-500 mx-auto animate-pulse" />
              <p className="text-[10px] text-slate-400 font-mono">PULSE bpm</p>
              <p className="text-3xl font-black text-slate-800 dark:text-white pt-1">{heartRate}</p>
            </div>
            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-center space-y-1">
              <Activity className="w-6 h-6 text-cyan-500 mx-auto" />
              <p className="text-[10px] text-slate-400 font-mono">SPO2 Oxygen %</p>
              <p className="text-3xl font-black text-slate-800 dark:text-white pt-1">{spo2}%</p>
            </div>
          </div>

          {/* SVG representation of standard cardiac pulse graph */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-850 h-28 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 400 100" className="w-full h-full text-red-500 stroke-2 overflow-visible">
              <path
                d="M 0 50 L 50 50 L 60 20 L 70 80 L 80 50 L 150 50 L 160 10 L 170 90 L 180 50 L 250 50 L 260 20 L 270 80 L 280 50 L 350 50 L 360 10 L 370 90 L 380 50 L 400 50"
                fill="none"
                stroke="currentColor"
                strokeDasharray="400"
                strokeDashoffset={sosActive ? "200" : "0"}
                className="transition-all duration-1000"
                style={{ animation: 'auraPulse 2s infinite linear' }}
              />
            </svg>
          </div>
        </div>

        {/* Closest clinics lists (5-cols) */}
        <div className="md:col-span-5 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
            <MapPin className="w-4.5 h-4.5 text-cyan-500" />
            {lang === 'en' ? "Closest Emergency Hospital Nodes" : "নিকটবর্তী স্বাস্থ্য কেন্দ্র ও হাসপাতালের খোঁজ"}
          </h3>
          <div className="space-y-3">
            {hospitals.map((hosp, idx) => (
              <div key={idx} className="p-3 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs transition-colors hover:bg-red-500/5">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 dark:text-white">{hosp.name}</p>
                  <p className="text-[10.5px] text-slate-400 capitalize">{hosp.type}</p>
                  <a href={`tel:${hosp.phone}`} className="text-[10px] text-purple-500 font-mono flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" /> {hosp.phone}
                  </a>
                </div>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-500 shrink-0 select-none">
                  {hosp.distance}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
