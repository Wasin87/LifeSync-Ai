import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, WifiOff, Cpu, Smartphone, Database, Send, Radio, 
  RefreshCw, CheckCircle, Phone as PhoneIcon, Landmark, Info, User, MessageSquare, ShieldAlert, ChevronRight
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
  
  const [gsmPackets, setGsmPackets] = useState<{msg: string, type: 'SMS' | 'USSD', simulationData?: any}[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // Dynamic response logic for real-time simulation
  const analyzeSymptoms = (inputStr: string) => {
     const str = inputStr.toLowerCase();
     if (str.includes("bp") || str.includes("pressure") || str.includes("preeclampsia")) {
        return {
           riskLevel: "CRITICAL",
           score: 95,
           action: "Dispatching emergency maternal transport. Administer Magnesium Sulfate per protocol.",
           clinical: "Pre-eclampsia indicators detected dynamically."
        };
     } else if (str.includes("fever") || str.includes("jidd")) {
        return {
           riskLevel: "MODERATE",
           score: 65,
           action: "Advised paracetamol. Monitored for 24hrs for Dengue vectors.",
           clinical: "High body temperature detected, potential viral."
        };
     } else {
        return {
           riskLevel: "LOW",
           score: 25,
           action: "Log normal vitals in routine cache.",
           clinical: "Standard update recorded."
        };
     }
  };

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
     const customMsg = "MOTHER HIGH BP 140";
     const sim = analyzeSymptoms(customMsg);
     setGsmPackets(prev => [{msg: `${customMsg} -> Risk: ${sim.riskLevel}`, type: 'SMS', simulationData: sim}, ...prev]);
     triggerDemo(5);
  };
  
  const handleCustomSmsPrompt = () => {
     const testMsgs = ["MOTHER HIGH BP 140", "CHILD HIGH FEVER 102", "NORMAL CHECKUP DB 120"];
     const picked = testMsgs[Math.floor(Math.random() * testMsgs.length)];
     const sim = analyzeSymptoms(picked);
     setGsmPackets(prev => [{msg: `${picked}`, type: 'SMS', simulationData: sim}, ...prev]);
     triggerDemo(5);
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
             <div className="flex flex-row w-full items-center justify-between relative px-2 sm:px-4 gap-2 sm:gap-0">
                
                <div className="w-full absolute left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -z-10 top-1/2 transform -translate-y-1/2" />
                
                {/* 1. User */}
                <div className={`p-2.5 sm:p-4 rounded-full flex flex-col items-center transition-all duration-500 relative z-10 ${demoStep >= 1 ? 'bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)] scale-110' : 'bg-slate-100 dark:bg-slate-800 shadow-xl'}`}>
                   <User className={`w-4 h-4 sm:w-8 sm:h-8 ${demoStep >= 1 ? 'text-white' : 'text-slate-400'}`} />
                   <span className={`absolute mt-10 sm:mt-14 text-[8px] sm:text-xs font-bold whitespace-nowrap bg-white/80 dark:bg-black/60 px-1.5 sm:px-2 py-0.5 rounded-md ${demoStep >= 1 ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500'}`}>Patient</span>
                </div>
                {demoStep >= 1 && <motion.div initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} className="hidden md:block text-purple-500"><ChevronRight className="w-3 h-3 sm:w-5 sm:h-5"/></motion.div>}
                
                {/* 2. GSM Network */}
                <div className={`p-2.5 sm:p-4 rounded-full flex flex-col items-center transition-all duration-500 relative z-10 ${demoStep >= 2 ? 'bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)] scale-110' : 'bg-slate-100 dark:bg-slate-800 shadow-xl'}`}>
                   <Radio className={`w-4 h-4 sm:w-8 sm:h-8 ${demoStep >= 2 ? 'text-white animate-pulse' : 'text-slate-400'}`} />
                   <span className={`absolute mt-10 sm:mt-14 text-[8px] sm:text-xs font-bold whitespace-nowrap bg-white/80 dark:bg-black/60 px-1.5 sm:px-2 py-0.5 rounded-md ${demoStep >= 2 ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500'}`}>USSD/SMS</span>
                </div>
                {demoStep >= 2 && <motion.div initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} className="hidden md:block text-cyan-500"><ChevronRight className="w-3 h-3 sm:w-5 sm:h-5"/></motion.div>}

                {/* 3. Edge AI */}
                <div className={`p-2.5 sm:p-4 rounded-full flex flex-col items-center transition-all duration-500 relative z-10 ${demoStep >= 3 ? 'bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.5)] scale-110' : 'bg-slate-100 dark:bg-slate-800 shadow-xl'}`}>
                   <Cpu className={`w-4 h-4 sm:w-8 sm:h-8 ${demoStep >= 3 ? 'text-white' : 'text-slate-400'}`} />
                   <span className={`absolute mt-10 sm:mt-14 text-[8px] sm:text-xs font-bold whitespace-nowrap bg-white/80 dark:bg-black/60 px-1.5 sm:px-2 py-0.5 rounded-md ${demoStep >= 3 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>Edge AI Node</span>
                </div>
                {demoStep >= 3 && <motion.div initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} className="hidden md:block text-indigo-500"><ChevronRight className="w-3 h-3 sm:w-5 sm:h-5"/></motion.div>}

                {/* 4. Queue / DB */}
                <div className={`p-2.5 sm:p-4 rounded-full flex flex-col items-center transition-all duration-500 relative z-10 ${demoStep >= 4 ? 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] scale-110' : 'bg-slate-100 dark:bg-slate-800 shadow-xl'}`}>
                   <Database className={`w-4 h-4 sm:w-8 sm:h-8 ${demoStep >= 4 ? 'text-white' : 'text-slate-400'}`} />
                   <span className={`absolute mt-10 sm:mt-14 text-[8px] sm:text-xs font-bold whitespace-nowrap bg-white/80 dark:bg-black/60 px-1.5 sm:px-2 py-0.5 rounded-md ${demoStep >= 4 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>Offline Queue</span>
                </div>
                {demoStep >= 4 && <motion.div initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} className="hidden md:block text-blue-500"><ChevronRight className="w-3 h-3 sm:w-5 sm:h-5"/></motion.div>}

                {/* 5. Health Worker / Hospital */}
                <div className={`p-2.5 sm:p-4 rounded-full flex flex-col items-center transition-all duration-500 relative z-10 ${demoStep >= 5 ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-110' : 'bg-slate-100 dark:bg-slate-800 shadow-xl'}`}>
                   <ShieldAlert className={`w-4 h-4 sm:w-8 sm:h-8 ${demoStep >= 5 ? 'text-white' : 'text-slate-400'}`} />
                   <span className={`absolute mt-10 sm:mt-14 text-[8px] sm:text-xs font-bold whitespace-nowrap bg-white/80 dark:bg-black/60 px-1.5 sm:px-2 py-0.5 rounded-md ${demoStep >= 5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>Hospital Sync</span>
                </div>

             </div>
          </div>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4 items-center justify-center border-t border-slate-100 dark:border-slate-800/80">
             <button onClick={handleCustomSmsPrompt} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 shadow-lg hover:shadow-purple-500/30 w-full sm:w-auto justify-center">
                <MessageSquare className="w-4 h-4" /> Simulate Dynamic SMS Packets
             </button>
             <button onClick={() => triggerDemo(5)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                <RefreshCw className="w-4 h-4" /> Run Edge AI Flow Animation
             </button>
          </div>
        </div>

        {/* Feature Phone Simulator (Right card) */}
        <div id="ussd-simulator-panel" className="lg:col-span-5 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-6 flex flex-col justify-between items-center text-center">
          
          {/* Phone Body */}
          <div className="w-[280px] bg-slate-100 border-4 border-slate-300 dark:bg-black dark:border-purple-600/30 rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_0_40px_rgba(168,85,247,0.15)] relative">
             <div className="w-12 h-1.5 bg-slate-300 dark:bg-purple-900/50 rounded-full mx-auto mb-4" />
             
             {/* Phone Screen */}
             <div className="w-full h-44 bg-green-50/50 dark:bg-black rounded-xl p-2.5 border-2 border-slate-300 dark:border-purple-500/20 font-mono text-left relative overflow-hidden flex flex-col shadow-inner">
                <div className="flex justify-between items-center text-[9px] text-slate-500 dark:text-purple-400/80 pb-1.5 border-b border-slate-300/50 dark:border-purple-500/20 select-none font-bold uppercase tracking-wider">
                   <span className="flex items-center gap-1"><Radio className="w-3 h-3 text-slate-600 dark:text-purple-500" /> AIRTEL SIM</span>
                   <span>{new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto py-2 space-y-2">
                   <p className="text-[11px] text-slate-800 dark:text-white leading-tight whitespace-pre-line font-medium break-words">
                     {ussdScreen}
                   </p>
                   {ussdStep !== 99 && (
                      <div className="flex items-center text-[11px] text-slate-800 dark:text-purple-200 font-bold border-2 border-slate-300 dark:border-purple-500/50 p-1.5 px-2 rounded-md bg-white dark:bg-purple-950/20 w-full focus-within:shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all">
                         {ussdInput}
                         <span className="w-1.5 h-3 bg-slate-400 dark:bg-purple-400 animate-pulse ml-0.5" />
                      </div>
                   )}
                </div>
             </div>

             {/* Phone Keypad */}
             <div className="grid grid-cols-3 gap-2.5 mt-5 select-none">
                {['1','2','3','4','5','6','7','8','9','*','0','#'].map((key) => (
                   <button 
                      key={key} 
                      onClick={() => handleKeypadPress(key)}
                      className="h-10 bg-slate-200 dark:bg-purple-900/30 hover:bg-slate-300 dark:hover:bg-purple-500/30 active:bg-slate-400 dark:active:bg-purple-500/50 rounded-xl text-slate-800 dark:text-purple-200 font-black flex flex-col items-center justify-center text-[15px] shadow-sm transition-all"
                   >
                      {key}
                   </button>
                ))}
                
                <button onClick={() => handleKeypadPress('CLR')} className="col-span-1 h-10 bg-rose-500/90 hover:bg-rose-500 rounded-xl text-white font-bold text-[11px] shadow-sm tracking-wider">CLR</button>
                <button onClick={() => handleKeypadPress('SEND')} className="col-span-2 h-10 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-white font-bold text-[12px] shadow-sm tracking-wider shadow-emerald-500/20">SEND</button>
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
              <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={idx} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 text-xs font-mono shadow-sm group">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className={`p-1 px-1.5 rounded-md ${pkt.type === 'SMS' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'} font-bold text-[9px]`}>{pkt.type}</div>
                      <span className="text-slate-800 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{pkt.msg}</span>
                   </div>
                   <span className="text-[9px] font-bold text-emerald-500 tracking-wider animate-pulse flex items-center gap-1 shrink-0">
                      <Radio className="w-3 h-3" /> {lang === 'en' ? "BUFFERED" : "বাফারড"}
                   </span>
                </div>
                {pkt.simulationData && (
                   <div className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="text-[10px] space-y-0.5"><span className="text-slate-400 block uppercase">Priority Score</span><span className="font-bold text-rose-500">{pkt.simulationData.score}/100 - {pkt.simulationData.riskLevel}</span></div>
                      <div className="text-[10px] space-y-0.5"><span className="text-slate-400 block uppercase">Response</span><span className="font-bold text-indigo-500">{pkt.simulationData.action}</span></div>
                      <div className="text-[10px] space-y-0.5"><span className="text-slate-400 block uppercase">Clinical Note</span><span className="font-bold text-cyan-500">{pkt.simulationData.clinical}</span></div>
                   </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
