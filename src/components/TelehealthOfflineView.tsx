import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wifi, WifiOff, Cpu, Smartphone, Database, Send, Radio, 
  RefreshCw, CheckCircle, Smartphone as PhoneIcon, Landmark, Info
} from 'lucide-react';
import { getTranslation, Language } from '../types.js';

interface TelehealthOfflineViewProps {
  lang: Language;
}

export default function TelehealthOfflineView({ lang }: TelehealthOfflineViewProps) {
  const t = getTranslation(lang);
  
  // States
  const [ussdStep, setUssdStep] = useState(0); 
  const [ussdInput, setUssdInput] = useState("");
  const [ussdScreen, setUssdScreen] = useState(
    lang === 'en'
      ? "LifeSync AI Rural Portal\nDial *16263*5#\n1. Check Symptoms\n2. Log Pregnancy Vital\n3. SOS Medical Dispatch"
      : "লাইফসিঙ্ক গ্রামীণ পোর্টাল\nডায়াল কোড: *১৬২৬৩*৫#\n১. লক্ষণ পরীক্ষা করুন\n২. গর্ভাবস্থার রিপোর্ট এন্ট্রি\n৩. জরুরি এসওএস সতর্কতা"
  );
  
  const [gsmPackets, setGsmPackets] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // USSD Console Handler
  const handleUssdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = ussdInput.trim();
    if (!val) return;

    if (ussdStep === 0) {
      if (val === '1') {
        setUssdScreen(
          lang === 'en'
            ? "Enter core indicator:\n1. Severe Fever\n2. Blurred Vision\n3. General Cough"
            : "প্রধান লক্ষণটি লিখুন:\n১. অতিরিক্ত জ্বর\n২. চোখে ঝাপসা দেখা\n৩. সাধারণ কাশি"
        );
        setUssdStep(1);
      } else if (val === '2') {
        setUssdScreen(
          lang === 'en'
            ? "Enter Gestation Week (4-40):"
            : "গর্ভধারণের সপ্তাহটি সংখ্যায় লিখুন (৪-৪০):"
        );
        setUssdStep(2);
      } else if (val === '3') {
        setUssdScreen(
          lang === 'en'
            ? "DISPATCHING SOS!\nSending rural cell towers coordinates...\nNGO medic ambulance dispatched."
            : "জরুরি সতর্ক সংকেত প্রেরণ সম্পূর্ণ!\nআপনার অবস্থান ট্র্যাক করা হচ্ছে। এনজিও মেডিক্যাল টিম রওনা দিয়েছে।"
        );
        setUssdStep(99); // Final step
        setGsmPackets(prev => ["SMS_PACKET_SEND [SOS_TRIAGE_COORD_23.6850_90.3563]", ...prev]);
      } else {
        setUssdInput("");
      }
    } else if (ussdStep === 1) {
      if (val === '1' || val === '2' || val === '3') {
        setUssdScreen(
          lang === 'en'
            ? "Triage Applied Successfully!\nAdvice SMS packet sent to registered SIM cards.\nPress # to exit."
            : "লক্ষণ নির্ণয় সম্পূর্ণ হয়েছে!\nপরামর্শমূলক এসএমএসটি আপনার সিমে পাঠানো হচ্ছে। বন্ধ করতে # টিপুন।"
        );
        setUssdStep(99);
        setGsmPackets(prev => [`GSM_COMPACT_PACKET [TRIAGE_CODE_0${val}]`, ...prev]);
      }
    } else if (ussdStep === 2) {
      const wk = parseInt(val);
      if (wk >= 4 && wk <= 40) {
        setUssdScreen(
          lang === 'en'
            ? `Logged Gestation Week: ${wk}\nWeekly fetal updates queued on local SIM card database.\nPress # to exit.`
            : `গর্ভকালীন সপ্তাহ ${wk} এন্ট্রি সম্পন্ন!\nআপনার সাপ্তাহিক শিশুর আপডেট মেমোরিতে সংরক্ষণ হয়েছে। বন্ধ করতে # টিপুন।`
        );
        setUssdStep(99);
        setGsmPackets(prev => [`SMS_EMR_REPORT [WEEK_${wk}_GESTation_sync]`, ...prev]);
      } else {
        setUssdScreen("Invalid. Enter 4-40:");
      }
    } else if (ussdStep === 99) {
      // Reset USSD
      setUssdScreen(
        lang === 'en'
          ? "LifeSync AI Rural Portal\nDial *16263*5#\n1. Check Symptoms\n2. Log Pregnancy Vital\n3. SOS Medical Dispatch"
          : "লাইফসিঙ্ক গ্রামীণ পোর্টাল\nডায়াল কোড: *১৬২৬৩*৫#\n১. লক্ষণ পরীক্ষা করুন\n২. গর্ভাবস্থার রিপোর্ট এন্ট্রি\n৩. জরুরি এসওএস সতর্কতা"
      );
      setUssdStep(0);
    }
    setUssdInput("");
  };

  const handleSimulateRestorationSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setGsmPackets([]);
      setIsSyncing(false);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Simulation Grid Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Edge AI processing visualizer (Left card) */}
        <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
              <Cpu className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
              {lang === 'en' ? "Modular Edge AI Pipeline (2G-Ready)" : "এআই কম্প্রেশন ও ২জি ট্রান্সমিশন ডায়াগ্রাম"}
            </h3>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-500 px-2.5 py-0.5 rounded-full font-mono">
              9.6 kbps throughput
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {lang === 'en' 
              ? "For remote rural community hubs without cellular 4G grids, patient vitals are compressed into compact 160-character binary SMS strings mapped dynamically via Edge logic."
              : "প্রত্যন্ত চরাঞ্চলে বা পাহাড়ি এলাকায় যেখানে কোনো ফোরজি (4G) নেটওয়ার্ক নেই, সেখানে রোগীর জটিল ভাইটাল এবং রিপোর্ট এআই দ্বারা সংকুচিত হয়ে ক্ষুদ্র এসএমএস প্যাকেটে রূপান্তর হয়।"}
          </p>

          {/* Interactive Flow Visualizer */}
          <div className="space-y-4 pt-1">
            <div className="relative p-3.5 rounded-xl bg-slate-500/5 border border-purple-500/15 text-xs flex items-center gap-3">
              <Database className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-bold text-slate-800 dark:text-white">1. Local IndexedDB Cache</p>
                <p className="text-[10px] text-slate-500">Immediate local EMR entry backup</p>
              </div>
            </div>

            <div className="flex justify-center">
              <RefreshCw className="w-4 h-4 text-purple-500 animate-spin" />
            </div>

            <div className="relative p-3.5 rounded-xl bg-slate-500/5 border border-purple-500/15 text-xs flex items-center gap-3">
              <Radio className="w-5 h-5 text-cyan-500 animate-pulse" />
              <div>
                <p className="font-bold text-slate-800 dark:text-white">2. Low-Baud GSM Compression</p>
                <p className="text-[10px] text-slate-500">Vitals encoded as a 160-char SMS vector packet</p>
              </div>
            </div>

            <div className="flex justify-center">
              <RefreshCw className="w-4 h-4 text-purple-500 animate-spin" />
            </div>

            <div className="relative p-3.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/5 border border-purple-500/20 text-xs flex items-center gap-3">
              <Wifi className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="font-bold text-slate-800 dark:text-white">3. NGO Cellular Network Sync</p>
                <p className="text-[10px] text-slate-500">Autonomic parsing upon receiving cell signals</p>
              </div>
            </div>
          </div>
        </div>

        {/* SMS / USSD Mobile simulator (Right card) */}
        <div id="ussd-simulator-panel" className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
              <Smartphone className="w-4.5 h-4.5 text-cyan-500" />
              {lang === 'en' ? "GSM USSD Offline Clinical Portal" : "গ্রামীণ ২জি জিএসএম ইউএসএসডি (USSD) পোর্টাল সিমুলেটর"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'en' 
                ? "Input numerical menu commands representing typical button prompts on standard feature-phones."
                : "বাটন ফোন ব্যবহারকারী গ্রামীণ রোগীরা নিচের কনসোলের মাধ্যমে মেনু এন্ট্রি করে এআই পরামর্শ নিতে পারেন:"}
            </p>
          </div>

          {/* Interactive Screen */}
          <div className="p-5 rounded-2xl bg-slate-900 border-4 border-slate-700 font-mono shadow-inner space-y-4">
            <div className="flex justify-between items-center text-[9px] text-slate-400 pb-2 border-b border-slate-800 select-none">
              <span className="flex items-center gap-1"><Radio className="w-3 h-3 text-emerald-400" /> Airtel BD</span>
              <span>17:00</span>
            </div>
            
            {/* Screen Content */}
            <p className="text-xs text-emerald-400 whitespace-pre-line leading-relaxed min-h-24">
              {ussdScreen}
            </p>

            <form onSubmit={handleUssdSubmit} className="flex gap-2">
              <input
                id="ussd-input-box"
                type="text"
                value={ussdInput}
                onChange={(e) => setUssdInput(e.target.value)}
                placeholder="Enter command (e.g. 1)"
                className="flex-1 p-2 bg-slate-850 rounded border border-slate-800 text-xs text-emerald-400 focus:outline-none"
              />
              <button
                id="ussd-submit-btn"
                type="submit"
                className="p-2 bg-slate-800 hover:bg-slate-750 text-[11px] text-emerald-400 border border-slate-700 font-bold rounded"
              >
                Send
              </button>
            </form>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center gap-2 bg-slate-500/5 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <Info className="w-4 h-4 text-purple-500 shrink-0" />
            <p>{lang === 'en' ? "Fully functional backup pathway ensuring 100% rural inclusion." : "সুবিধাবঞ্চিত অঞ্চলে সেবা পৌঁছে দেয়ার জন্য এটি একটি চমৎকার ব্যাকআপ মেকানিজম।"}</p>
          </div>
        </div>

      </div>

      {/* Network logs and queue tracking console */}
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
              {lang === 'en' ? "Buffered GSM Packets Sync Queue" : "অফলাইন ট্রান্সমিশন প্যাকেট সমূহ"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'en' ? "Compact SMS strings queued on the SIM card waiting for central signal restoration." : "২জি সিম কার্ড মেমোরিতে জমে থাকা কম্প্যাক্ট ডাটা প্যাকেট যা সংযোগ ফিরে পেলে আপলোড হবে।"}
            </p>
          </div>
          
          {gsmPackets.length > 0 && (
            <button
              id="restore-sync-btn"
              onClick={handleSimulateRestorationSync}
              className="px-4 py-1.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs transition-all flex items-center gap-2 shrink-0 self-start"
            >
              {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              {lang === 'en' ? "Simulate Restoration & Synchronize" : "সংযোগ পুনরুদ্ধার ও ডাটা সিঙ্ক ট্রায়াল"}
            </button>
          )}
        </div>

        {gsmPackets.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-500/5 border border-slate-100 dark:border-slate-800 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {lang === 'en' ? "Local SIM Cache is Clean" : "কোনো স্থানীয় পেন্ডিং প্যাকেট নেই"}
            </p>
            <p className="text-[10.5px] text-slate-400">
              {lang === 'en' ? "Try interacting with the USSD phone simulator above to queue clinical reports!" : "উপরে দেওয়া ২জি বাটন ফোনটি ব্যবহার করে কোনো তথ্য এন্ট্রি করুন এবং প্যাকেট তৈরি দেখুন!"}
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {gsmPackets.map((pkt, idx) => (
              <div key={idx} className="p-2 px-3 rounded bg-slate-900 border border-slate-850 flex justify-between items-center text-xs font-mono">
                <span className="text-cyan-400">{pkt}</span>
                <span className="text-[9px] font-bold text-amber-500 tracking-wider">CELLULAR_WAITING</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
