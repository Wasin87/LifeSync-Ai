import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, WifiOff, Cpu, Smartphone, Database, Send, Radio, 
  RefreshCw, CheckCircle, Phone as PhoneIcon, Landmark, Info, User, MessageSquare, ShieldAlert
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
      ? "LifeSync Ai Rural Portal\nDial *16263*5#\n1. Check Symptoms\n2. Log Pregnancy Vital\n3. SOS Medical Dispatch"
      : "লাইফসিঙ্ক গ্রামীণ পোর্টাল\nডায়াল কোড: *১৬২৬৩*৫#\n১. লক্ষণ পরীক্ষা করুন\n২. গর্ভাবস্থার রিপোর্ট এন্ট্রি\n৩. জরুরি এসওএস সতর্কতা"
  );
  
  const [gsmPackets, setGsmPackets] = useState<{msg: string, type: 'SMS' | 'USSD'}[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // USSD Console Handler
  const processUssdSubmit = (val: string) => {
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
        setUssdStep(99);
        setGsmPackets(prev => [{msg: "SMS_PACKET_SEND [SOS_TRIAGE_COORD_23.6850_90.3563]", type: 'USSD'}, ...prev]);
        triggerDemo(4);
      }
    } else if (ussdStep === 1) {
      if (val === '1' || val === '2' || val === '3') {
        setUssdScreen(
          lang === 'en'
            ? "Triage Applied Successfully!\nAdvice SMS packet sent to registered SIM cards.\nPress # to exit."
            : "লক্ষণ নির্ণয় সম্পূর্ণ হয়েছে!\nপরামর্শমূলক এসএমএসটি আপনার সিমে পাঠানো হচ্ছে। বন্ধ করতে # টিপুন।"
        );
        setUssdStep(99);
        setGsmPackets(prev => [{msg: `GSM_COMPACT_PACKET [TRIAGE_CODE_0${val}]`, type: 'USSD'}, ...prev]);
        triggerDemo(3);
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
        setGsmPackets(prev => [{msg: `SMS_EMR_REPORT [WEEK_${wk}_GESTation_sync]`, type: 'USSD'}, ...prev]);
        triggerDemo(2);
      } else {
        setUssdScreen("Invalid. Enter 4-40:");
      }
    } else if (ussdStep === 99) {
      if (val === '#') {
         setUssdScreen(
           lang === 'en'
             ? "LifeSync Ai Rural Portal\nDial *16263*5#\n1. Check Symptoms\n2. Log Pregnancy Vital\n3. SOS Medical Dispatch"
             : "লাইফসিঙ্ক গ্রামীণ পোর্টাল\nডায়াল কোড: *১৬২৬৩*৫#\n১. লক্ষণ পরীক্ষা করুন\n২. গর্ভাবস্থার রিপোর্ট এন্ট্রি\n৩. জরুরি এসওএস সতর্কতা"
         );
         setUssdStep(0);
         setDemoStep(0);
      }
    }
  };

  const handleSimulateRestorationSync = () => {
    setIsSyncing(true);
    triggerDemo(5);
    setTimeout(() => {
      setGsmPackets([]);
      setIsSyncing(false);
      setDemoStep(0);
    }, 4000);
  };

  const handleKeypadPress = (key: string) => {
     if (key === 'SEND') {
        processUssdSubmit(ussdInput);
        setUssdInput('');
     } else if (key === 'CLR') {
        setUssdInput(prev => prev.slice(0, -1));
     } else {
        setUssdInput(prev => prev + key);
     }
  };

  const triggerDemo = (targetStep: number) => {
     let current = 0;
     const interval = setInterval(() => {
        current++;
        setDemoStep(current);
        if(current >= targetStep) clearInterval(interval);
     }, 1000);
  };

  const simulateSms = () => {
     setGsmPackets(prev => [{msg: "MOTHER HIGH BP 140 -> Risk Detected: Pre-eclampsia", type: 'SMS'}, ...prev]);
     triggerDemo(3);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Simulation Grid Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Animated Workflow Visualizer */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
              <Cpu className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
              {lang === 'en' ? "Offline Workflow Process" : "অফলাইন সিঙ্ক প্রক্রিয়া"}
            </h3>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-500 px-2.5 py-0.5 rounded-full font-mono">
              Live Network Path
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
             <div className="flex w-full items-center justify-between relative px-4">
                
                <div className="w-full absolute left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -z-10 top-1/2 transform -translate-y-1/2" />
                
                {/* 1. User */}
                <div className={`p-4 rounded-full flex flex-col items-center transition-all ${demoStep >= 1 ? 'bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-slate-100 dark:bg-slate-800'}`}>
                   <User className={`w-8 h-8 ${demoStep >= 1 ? 'text-white' : 'text-slate-400'}`} />
                   <span className={`absolute mt-14 text-[10px] font-bold ${demoStep >= 1 ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500'}`}>User Base</span>
                </div>

                {/* 2. GSM Network */}
                <div className={`p-4 rounded-full flex flex-col items-center transition-all ${demoStep >= 2 ? 'bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-slate-100 dark:bg-slate-800'}`}>
                   <Radio className={`w-8 h-8 ${demoStep >= 2 ? 'text-white animate-pulse' : 'text-slate-400'}`} />
                   <span className={`absolute mt-14 text-[10px] font-bold ${demoStep >= 2 ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500'}`}>GSM Tower</span>
                </div>

                {/* 3. Edge AI */}
                <div className={`p-4 rounded-full flex flex-col items-center transition-all ${demoStep >= 3 ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-slate-100 dark:bg-slate-800'}`}>
                   <Cpu className={`w-8 h-8 ${demoStep >= 3 ? 'text-white' : 'text-slate-400'}`} />
                   <span className={`absolute mt-14 text-[10px] font-bold ${demoStep >= 3 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>Edge AI</span>
                </div>

                {/* 4. Database */}
                <div className={`p-4 rounded-full flex flex-col items-center transition-all ${demoStep >= 4 ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-slate-100 dark:bg-slate-800'}`}>
                   <Database className={`w-8 h-8 ${demoStep >= 4 ? 'text-white' : 'text-slate-400'}`} />
                   <span className={`absolute mt-14 text-[10px] font-bold ${demoStep >= 4 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>Cloud DB</span>
                </div>

                {/* 5. Health Worker */}
                <div className={`p-4 rounded-full flex flex-col items-center transition-all ${demoStep >= 5 ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-slate-100 dark:bg-slate-800'}`}>
                   <ShieldAlert className={`w-8 h-8 ${demoStep >= 5 ? 'text-white' : 'text-slate-400'}`} />
                   <span className={`absolute mt-14 text-[10px] font-bold ${demoStep >= 5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>Medic</span>
                </div>

             </div>
          </div>
          
          <div className="pt-8">
             <button onClick={simulateSms} className="px-4 py-2 bg-slate-500/10 hover:bg-slate-500/20 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Simulate Custom SMS (MOTHER HIGH BP)
             </button>
          </div>
        </div>

        {/* Feature Phone Simulator (Right card) */}
        <div id="ussd-simulator-panel" className="lg:col-span-5 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-6 flex flex-col justify-between items-center text-center">
          
          {/* Phone Body */}
          <div className="w-[260px] bg-slate-800 rounded-3xl p-3 shadow-2xl border-4 border-slate-700 relative">
             <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-3" />
             
             {/* Phone Screen */}
             <div className="w-full h-40 bg-slate-100 rounded-xl p-2 border border-slate-600 font-mono text-left relative overflow-hidden flex flex-col shadow-inner">
                <div className="flex justify-between items-center text-[8px] text-slate-500 pb-1 border-b border-slate-300/50 select-none font-bold">
                   <span className="flex items-center gap-1"><Radio className="w-2.5 h-2.5 text-slate-600" /> AIRTEL</span>
                   <span>{new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto py-1 space-y-1">
                   <p className="text-[10px] text-slate-800 leading-tight whitespace-pre-line font-medium break-words">
                     {ussdScreen}
                   </p>
                   {ussdStep !== 99 && (
                      <div className="flex items-center text-[10px] text-slate-800 font-bold border border-slate-300 p-1 px-2 rounded-md bg-white w-full">
                         {ussdInput}
                         <span className="w-1.5 h-2.5 bg-slate-400 animate-pulse ml-0.5" />
                      </div>
                   )}
                </div>
             </div>

             {/* Phone Keypad */}
             <div className="grid grid-cols-3 gap-2 mt-4 select-none">
                {['1','2','3','4','5','6','7','8','9','*','0','#'].map((key) => (
                   <button 
                      key={key} 
                      onClick={() => handleKeypadPress(key)}
                      className="h-8 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded-md text-white font-bold flex flex-col items-center justify-center text-[13px] shadow transition-colors"
                   >
                      {key}
                   </button>
                ))}
                
                <button onClick={() => handleKeypadPress('CLR')} className="col-span-1 h-8 bg-amber-600/80 hover:bg-amber-500 rounded-md text-white font-bold text-[10px] shadow">CLR</button>
                <button onClick={() => handleKeypadPress('SEND')} className="col-span-2 h-8 bg-emerald-600 hover:bg-emerald-500 rounded-md text-white font-bold text-[11px] shadow">SEND</button>
             </div>
          </div>

          <div className="text-[10px] text-slate-400 flex flex-col items-center gap-1">
            <Smartphone className="w-4 h-4 text-cyan-500" />
            <p>{lang === 'en' ? "Simulating feature-phone hardware interface" : "ফিচার ফোন সিমুলেশন ইন্টারফেস"}</p>
          </div>
        </div>

      </div>

      {/* Network logs and queue tracking console */}
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
              {lang === 'en' ? "Captured Edge Transactions" : "অফলাইন ট্রান্সমিশন প্যাকেট সমূহ"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'en' ? "Compact SMS strings queued on the SIM card waiting for central signal restoration." : "২জি সিম কার্ড মেমোরিতে জমে থাকা কম্প্যাক্ট ডাটা প্যাকেট যা সংযোগ ফিরে পেলে আপলোড হবে।"}
            </p>
          </div>
          
          {gsmPackets.length > 0 && (
            <button
              id="restore-sync-btn"
              onClick={handleSimulateRestorationSync}
              className="px-4 py-1.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs transition-all flex items-center gap-2 shrink-0 self-start shadow shadow-emerald-500/20"
            >
              {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
              {lang === 'en' ? "Simulate Restoration Sync" : "সংযোগ পুনরুদ্ধার ও ডাটা সিঙ্ক"}
            </button>
          )}
        </div>

        {gsmPackets.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-500/5 border border-slate-100 dark:border-slate-800 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {lang === 'en' ? "Local Database Clean" : "কোনো স্থানীয় পেন্ডিং প্যাকেট নেই"}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {gsmPackets.map((pkt, idx) => (
              <div key={idx} className="p-2.5 px-3 rounded-lg bg-slate-900 border border-slate-700 flex justify-between items-center text-xs font-mono shadow-inner group">
                <div className="flex items-center gap-3">
                   <div className={`p-1 rounded ${pkt.type === 'SMS' ? 'bg-amber-500/20 text-amber-500' : 'bg-cyan-500/20 text-cyan-500'} font-bold text-[9px]`}>{pkt.type}</div>
                   <span className="text-slate-300 group-hover:text-white transition-colors">{pkt.msg}</span>
                </div>
                <span className="text-[9px] font-bold text-emerald-500 tracking-wider animate-pulse flex items-center gap-1">
                   <Radio className="w-3 h-3" /> BUFFERED
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
