import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, ShieldAlert, WifiOff, Users, Database, 
  ChevronRight, Brain, Sparkles, TrendingUp, Compass, Award, ShieldCheck, Cpu
} from 'lucide-react';
import { getTranslation, Language } from '../types.js';
import { Logo } from './Logo.js';

interface HomeViewProps {
  lang: Language;
  onNavigate: (page: string) => void;
  online: boolean;
}

export default function HomeView({ lang, onNavigate, online }: HomeViewProps) {
  const t = getTranslation(lang);

  const stats = [
    { 
      label: lang === 'en' ? "Clinical Confidence" : "ক্লিনিকাল নির্ভুলতা", 
      value: "98.4%", 
      icon: Brain, 
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/15", 
      trend: lang === 'en' ? "+1.2% versus baseline" : "আগের চেয়ে +১.২% বৃদ্ধি",
      glow: "border-purple-500/20 shadow-[0_4px_20px_rgba(139,92,246,0.05)]" 
    },
    { 
      label: lang === 'en' ? "Active Aid Workers" : "সক্রিয় স্বাস্থ্যকর্মী", 
      value: "342", 
      icon: Users, 
      color: "text-pink-600 dark:text-pink-400 bg-pink-500/10 dark:bg-pink-500/15", 
      trend: lang === 'en' ? "Across 12 rural districts" : "১২টি গ্রামীণ জেলায় কর্মরত",
      glow: "border-pink-500/20 shadow-[0_4px_20px_rgba(236,72,153,0.05)]"
    },
    { 
      label: lang === 'en' ? "Telehealth Sync Queue" : "অফলাইন সিঙ্ক কিউ", 
      value: online ? (lang === 'en' ? "Synced" : "সিঙ্কড") : "4 Pending", 
      icon: Database, 
      color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 dark:bg-cyan-500/15", 
      trend: online ? (lang === 'en' ? "Live to Cloud Sync" : "ক্লাউড ডেটাবেস লাইভ") : (lang === 'en' ? "Cached in Local Storage" : "ডিভাইস স্টোরেজে সংরক্ষিত"),
      glow: "border-cyan-500/20 shadow-[0_4px_20px_rgba(34,211,238,0.05)]"
    },
    { 
      label: lang === 'en' ? "Critical SOS Triage" : "জরুরি এসওএস ট্রায়াজ", 
      value: "0 Active", 
      icon: ShieldAlert, 
      color: "text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/15", 
      trend: lang === 'en' ? "0 critical cases flagged" : "কোনো মুমূর্ষু রোগী নেই",
      glow: "border-red-500/20 shadow-[0_4px_20px_rgba(239,68,68,0.05)]"
    }
  ];

  const features = [
    { 
      id: 'chat', 
      title: t.medicalAi, 
      desc: lang === 'en' ? "Consult advanced multimodal AI regarding clinical indications, scans, or general medical parameters with SHAP explainability variables." : "চর্মরোগ, প্রেসক্রিপশন ও রিপোর্ট স্ক্যান এবং ইনপুট লক্ষণ বিশ্লেষণ করে তাৎক্ষণিক সমাধানকারী ক্লিনিক্যাল এআই সহকারী।", 
      icon: Sparkles, 
      badge: "Gemini 2.5",
      color: "from-purple-600/10 to-indigo-600/10 border-purple-500/20 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]" 
    },
    { 
      id: 'maternal', 
      title: t.maternalHealth, 
      desc: lang === 'en' ? "Maternal weekly development calculators, fetal kick loggers, eclampsia risk heatmaps, and diagnostic charts." : "গর্ভবতী মা ও অনাগত শিশুর বৃদ্ধি পরিমাপক, হৃদস্পন্দন কাউন্টার, খিঁচুনি ও রক্তচাপ বিশ্লেষণমূলক ড্যাশবোর্ড।", 
      icon: Heart, 
      badge: "Clinical",
      color: "from-pink-600/10 to-rose-600/10 border-pink-500/20 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(244,63,94,0.25)]" 
    },
    { 
      id: 'healthworker', 
      title: t.healthWorker, 
      desc: lang === 'en' ? "Clinical intake voice scribing, real-time FHIR record parsing, and offline local cache sync controllers." : "মাঠপর্যায়ের স্বাস্থ্যকর্মীদের জন্য ভয়েসব্যবস্থার ইনটেক ফর্ম, রোগীর প্রেসক্রিপশন এক্সট্রাক্টর ও সিঙ্ক ম্যানেজার হাব।", 
      icon: Users, 
      badge: "Offline OS",
      color: "from-blue-600/10 to-cyan-600/10 border-blue-500/20 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]" 
    },
    { 
      id: 'telehealth', 
      title: t.telehealthOffline, 
      desc: lang === 'en' ? "Simulate USSD rural protocol interfaces (*16263*5#) running over basic 2G/3G networks without smart terminals." : "স্মার্টফোন ছাড়াই প্রত্যন্ত অঞ্চলের রোগীদের জন্য সাধারণ এসএমএস ও ২জি সিঙ্ক প্রযুক্তির একটি লাইভ ইউএসএসডি পোর্টাল সিমুলেশন।", 
      icon: WifiOff, 
      badge: "GSM Sim",
      color: "from-amber-600/10 to-orange-600/10 border-amber-500/20 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]" 
    },
  ];

  const systemBadges = [
    { title: "WHO ICD-11 Alignment", text: "Direct clinical grounding", icon: ShieldCheck },
    { title: "HIPAA Compliant Protocol", text: "Anonymized diagnostic pipelines", icon: ShieldCheck },
    { title: "Compressed GSM-RAG Engine", text: "Dynamic offline transmission link", icon: Cpu },
    { title: "Algorithmic Demographic Parity", text: "Regular mathematical bias mitigation", icon: ShieldCheck }
  ];

  // Motion transitions presets
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8 relative z-10"
    >
      {/* Hero Header Area - Proxima Layout Inspired */}
      <motion.div 
        variants={itemVariants} 
        className="relative p-6 md:p-12 rounded-3xl overflow-hidden glass-card-light dark:glass-card-dark border border-purple-500/25 dark:border-purple-500/30 flex flex-col justify-between gap-6 glow-purple"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none select-none">
          <Logo className="w-64 h-64 opacity-50" />
        </div>
        
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-purple-500/15 dark:bg-purple-600/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-pink-500/10 dark:bg-indigo-600/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-500/15 select-none animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'en' ? "Operational OS: Proxima Core v4.2" : "সিস্টেম ওএস: প্রক্সিমা কোর ৪.২ অ্যাক্টিভ"}
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] font-sans">
            {t.welcomeBack}
          </h1>

          <p className="text-lg md:text-xl font-medium bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            {t.tagline}
          </p>

          <p className="text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed text-sm md:text-base">
            {t.heroDescription}
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button 
              id="hero-emergency-btn"
              onClick={() => onNavigate('emergency')} 
              className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/40 dark:shadow-purple-500/20 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer select-none"
            >
              <ShieldAlert className="w-4.5 h-4.5 text-white animate-pulse" />
              {lang === 'en' ? "Emergency SOS Tracker" : "জরুরি এসওএস ট্র্যাকার"}
            </button>
            <button 
              id="hero-chat-btn"
              onClick={() => onNavigate('chat')} 
              className="px-6 py-3 rounded-xl font-bold bg-white/80 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 border border-purple-500/20 transition-all flex items-center gap-3 hover:scale-[1.02] active:scale-95 cursor-pointer select-none"
            >
              <span className="p-1 rounded-lg bg-[#0f0e17] border border-indigo-500/20 shadow flex items-center justify-center">
                <Logo className="w-4 h-4 scale-110" isDark={true} />
              </span>
              {lang === 'en' ? "Open AI Consult" : "এআই কনসাল্ট শুরু করুন"}
              <ChevronRight className="w-4 h-4 text-purple-500" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grid Stats Row - Slick Telemetries */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className={`p-5 rounded-2xl border ${stat.glow} bg-white/80 dark:bg-black border-slate-100 dark:border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 hover:translate-y-[-2px] flex items-center gap-4`}
          >
            <div className={`p-3.5 rounded-xl ${stat.color} shrink-0`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none pt-0.5">{stat.value}</p>
              <p className="text-[10px] text-purple-600 dark:text-purple-300 font-mono font-medium">{stat.trend}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Portal Switchboard Section */}
      <motion.div variants={itemVariants} className="space-y-5">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Compass className="w-6 h-6 text-purple-500" />
          {lang === 'en' ? "Operational Intelligence Subsystems" : "অপারেটিং ইন্টেলিজেন্স সাবসিস্টেম সমূহ"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onNavigate(item.id)}
              className={`p-6 rounded-2xl border ${item.color} bg-white/70 dark:bg-black cursor-pointer group flex items-start gap-4 transition-all duration-300 hover:translate-y-[-3px]`}
            >
              <div className="p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-purple-500/10 group-hover:bg-purple-600 group-hover:text-white group-hover:border-transparent transition-all text-purple-500 shrink-0">
                <item.icon className="w-6 h-6" />
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[8px] bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded font-mono uppercase tracking-widest font-bold">
                      {item.badge}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Compliance Standard Grid */}
      <motion.div 
        variants={itemVariants} 
        className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/15 dark:border-purple-500/20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      >
        {systemBadges.map((badge, idx) => {
          const BadgeIcon = badge.icon;
          return (
            <div 
              key={idx} 
              className="p-4 rounded-xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/10 flex items-center gap-3 hover:border-purple-500/35 transition-all"
            >
              <BadgeIcon className="w-5 h-5 text-purple-500 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-slate-900 dark:text-purple-300 leading-tight">{badge.title}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{badge.text}</p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
