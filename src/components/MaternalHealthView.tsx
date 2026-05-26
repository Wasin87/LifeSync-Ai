import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Baby, Heart, ShieldAlert, Sparkles, Scale, Info, Plus, RotateCcw, 
  ChevronRight, Apple, CheckCircle2, CloudLightning, Activity
} from 'lucide-react';
import { getTranslation, Language } from '../types.js';

interface MaternalHealthViewProps {
  lang: Language;
}

export default function MaternalHealthView({ lang }: MaternalHealthViewProps) {
  const t = getTranslation(lang);
  
  // Pregnancy sliders states
  const [gestationWeek, setGestationWeek] = useState(24);

  // Fetal kick counter states
  const [kickCount, setKickCount] = useState(0);
  const [kickHistory, setKickHistory] = useState<{ time: string; count: number }[]>([]);

  // Clinical risk assessment inputs
  const [systolic, setSystolic] = useState("120");
  const [diastolic, setDiastolic] = useState("80");
  const [bloodSugar, setBloodSugar] = useState("5.6"); // mmol/L
  const [hemoglobin, setHemoglobin] = useState("11.5"); // g/dL
  const [weight, setWeight] = useState("64");
  const [height, setHeight] = useState("155"); // cm

  // Low bandwidth display override
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false);

  // Fetal weight estimation & size mappings
  const getFetalDetails = (week: number) => {
    if (week < 12) {
      return { 
        size: lang === 'en' ? "Size of a Fig" : "ডুমুরের দানার মতো", 
        weight: "15g", 
        length: "5.4 cm",
        milestone: lang === 'en' ? "Kidneys begin producing urine; tiny vocal cords form." : "কিডনি সক্রিয় হতে শুরু করে; কণ্ঠনালীর গঠন শুরু হয়।" 
      };
    } else if (week >= 12 && week < 20) {
      return { 
        size: lang === 'en' ? "Size of a Lebu (Lime)" : "লেবুর মতো ছোট", 
        weight: "100g", 
        length: "11.6 cm",
        milestone: lang === 'en' ? "Baby reflexively sucks thumb; fingernails and toenails are growing." : "আঙুল চোষার রিফ্লেক্স তৈরি হয়; চুল ও নখ জন্মাতে শুরু করে।" 
      };
    } else if (week >= 20 && week < 28) {
      return { 
        size: lang === 'en' ? "Size of an Eggplant (Begun)" : "বাগানের বেগুনের মতো", 
        weight: "600g", 
        length: "30 cm",
        milestone: lang === 'en' ? "Taste buds develop; lungs form alveoli for respiratory expansion." : "স্বাদ গ্রন্থি গঠিত হয়; ফুসফুস শ্বাস কাজ পরিচালনার জন্য প্রস্তুত হয়।" 
      };
    } else if (week >= 28 && week < 36) {
      return { 
        size: lang === 'en' ? "Size of a Coconut (Narikel)" : "একটি কচি নারকেলের মতো", 
        weight: "1.7 kg", 
        length: "41 cm",
        milestone: lang === 'en' ? "Brain waves control sleep cycle; central nervous system is fully unified." : "মস্তিষ্কের তরঙ্গ সক্রিয় হয়; কেন্দ্রীয় নার্ভাস সিস্টেম গঠিত সম্পূর্ণ।" 
      };
    } else {
      return { 
        size: lang === 'en' ? "Size of a Sweet Papaya (Pepe)" : "মিষ্টি পেঁপের মতো", 
        weight: "3.2 kg", 
        length: "50 cm",
        milestone: lang === 'en' ? "Full gestation. Safe lung surfactants allow breathing after delivery." : "পরিপূর্ণ সময়কাল। ফুসফুস সম্পূর্ণ প্রস্তুত ও শক্তিশালী।" 
      };
    }
  };

  const info = getFetalDetails(gestationWeek);

  // Fetal kick log handler
  const handleAddKick = () => {
    setKickCount(prev => prev + 1);
  };

  const handleResetKicks = () => {
    if (kickCount > 0) {
      setKickHistory(prev => [{ time: new Date().toLocaleTimeString(), count: kickCount }, ...prev].slice(0, 5));
    }
    setKickCount(0);
  };

  // Logic threshold risks detector
  const checkMaternalMutedFactors = () => {
    const sysNum = parseInt(systolic) || 120;
    const diaNum = parseInt(diastolic) || 80;
    const bsNum = parseFloat(bloodSugar) || 5.6;
    const hbNum = parseFloat(hemoglobin) || 12.0;

    const risksDetected: { title: string; category: 'RED' | 'YELLOW' | 'GREEN'; text: string }[] = [];

    // Pre-eclampsia: gestational HTN + headache warning signs
    if (sysNum >= 140 || diaNum >= 90) {
      if (sysNum >= 160 || diaNum >= 110) {
        risksDetected.push({
          title: lang === 'en' ? "Severe Safe Pre-eclampsia Risk!" : "উচ্চ এক্লাম্পসিয়া খিঁচুনি ঝুঁকি!",
          category: "RED",
          text: lang === 'en' ? "Urgent transfer, IV Magnesium Sulfate required immediately." : "জরুরিভাবে হাসপাতালে স্থানান্তরের নির্দেশ এবং ম্যাগনেসিয়াম সালফেট দেওয়া প্রয়োজন।"
        });
      } else {
        risksDetected.push({
          title: lang === 'en' ? "Gestational Hypertension Risk" : "গর্ভকালীন উচ্চ রক্তচাপ",
          category: "YELLOW",
          text: lang === 'en' ? "Blood pressure elevated above 140/90. Daily checking is critical." : "রক্তচাপ ১৪০/৯০ এর উপরে। নিয়মিত লবণ বাদ দিয়ে জীবনযাত্রা পরীক্ষা আবশ্যক।"
        });
      }
    }

    // Gestational diabetes
    if (bsNum >= 7.8) {
      risksDetected.push({
        title: lang === 'en' ? "Gestational Diabetes Melitus Risk" : "গর্ভকালীন ডায়াবেটিস ঝুঁকি",
        category: "YELLOW",
        text: lang === 'en' ? "Blood sugar readings of >7.8 mmol/L. Regulate carbohydrate loads." : "খাবারের পরে রক্তে শর্করা ৭.৮ এর বেশি। সুজি ও অতিরিক্ত চিনি জাতীয় খাবার এড়িয়ে চলুন।"
      });
    }

    // Severe anemia
    if (hbNum < 11.0) {
      if (hbNum < 8.0) {
        risksDetected.push({
          title: lang === 'en' ? "Severe Microcytic Anemia!" : "গুরুতর রক্তস্বল্পতা রোগ!",
          category: "RED",
          text: lang === 'en' ? "Hemoglobin dangerously low. Iron infusion or transfusion required." : "রক্তে হিমোগ্লোবিন ৮ এর নিচে। আইরন থেরাপি বা জরুরি রক্ত চালনার পরামর্শ।"
        });
      } else {
        risksDetected.push({
          title: lang === 'en' ? "Mild Gestational Anemia" : "হালকা অ্যানিমিয়া ঝুঁকি",
          category: "YELLOW",
          text: lang === 'en' ? "Maintain iron-rich local dietary greens (Lal Shak, Moringa leaves)." : "আয়রন সমৃদ্ধ খাবার (লাল শাক, সাজনে শাক, গুড় ও কলিজা) বেশি খান।"
        });
      }
    }

    if (risksDetected.length === 0) {
      risksDetected.push({
        title: lang === 'en' ? "Optimal Maternal Health Vitals" : "স্বাভাবিক মাতৃত্বকালীন স্বাস্থ্য",
        category: "GREEN",
        text: lang === 'en' ? "All measured clinical markers align with baseline requirements." : "হিমোগ্লোবিন, শর্করা ও রক্তচাপ পরিমাপ স্বাভাবিক রয়েছে।"
      });
    }

    return risksDetected;
  };

  const detectedRisks = checkMaternalMutedFactors();

  return (
    <div className={`space-y-8 animate-fade-in ${lowBandwidthMode ? 'contrast-125 saturate-50' : ''}`}>
      
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10">
        <div>
          <div className="flex items-center gap-2 text-pink-500 font-bold text-lg">
            <Baby className="w-5 h-5 animate-pulse" />
            <h2>{lang === 'en' ? "Maternal & Fetal Health Command" : "মাতৃস্বাস্থ্য এবং ভ্রূণ পর্যবেক্ষণ কেন্দ্র"}</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'en' 
              ? "Comprehensive analytics tracking gestation weeks, neonatal growth sizes, kick-rates and pre-eclampsia warning signs."
              : "গর্ভধারণের সপ্তাহ, ভ্রূণের ওজন, লাথির হার এবং গর্ভকালীন খিঁচুনির জটিল ঝুঁকি গণনা পদ্ধতি।"}
          </p>
        </div>
        
        {/* Broadband Mode Switch */}
        <button
          id="bandwidth-toggle-btn"
          onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
            lowBandwidthMode 
              ? 'bg-amber-500/20 text-amber-700 border-amber-500' 
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          <CloudLightning className="w-4 h-4" />
          {lowBandwidthMode ? (lang === 'en' ? "Rural Offline UI Enabled" : "গ্রামীণ লো-ব্যান্ডউইথ মোড অ্যাক্টিভ") : (lang === 'en' ? "High Bandwidth Mode" : "ব্রডব্যান্ড মোড চালু")}
        </button>
      </div>

      {/* Development and development slider bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Gestation timeline (7-cols) */}
        <div className="md:col-span-7 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-purple-500" />
              {t.pregnantWeek}
            </h3>
            <span className="text-xl font-extrabold text-purple-600 dark:text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              {lang === 'en' ? `Week ${gestationWeek}` : `সপ্তাহ ${gestationWeek}`}
            </span>
          </div>

          {/* Range input slider */}
          <div className="space-y-2">
            <input
              id="gestation-slider"
              type="range"
              min="4"
              max="40"
              value={gestationWeek}
              onChange={(e) => setGestationWeek(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>W4</span>
              <span>W12</span>
              <span>W20</span>
              <span>W28</span>
              <span>W36</span>
              <span>W40</span>
            </div>
          </div>

          {/* Interactive visualizer */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/10 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 relative shrink-0">
              <Baby className="w-12 h-12" />
              <div className="w-24 h-24 rounded-full absolute border border-dashed border-purple-500/20 animate-spin" style={{ animationDuration: '20s' }}></div>
            </div>
            
            <div className="space-y-2 flex-1">
              <p className="text-xs uppercase font-mono text-purple-500 tracking-widest">
                {lang === 'en' ? "Approximate Fetal Size scale & Weight" : "ভ্রূণের আনুমানিক আকার ও ওজন"}
              </p>
              <h4 className="text-xl font-black text-slate-800 dark:text-white">
                {info.size}
              </h4>
              <div className="flex gap-4 text-xs font-mono text-slate-500">
                <span>Weight: <strong className="text-purple-600">{info.weight}</strong></span>
                <span>Length: <strong className="text-purple-600">{info.length}</strong></span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                {info.milestone}
              </p>
            </div>
          </div>
        </div>

        {/* Kick Counter widget (5-cols) */}
        <div id="kick-counter-widget" className="md:col-span-5 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-red-500" />
              {t.fetalKick}
            </h3>
            <span className="text-xs font-mono text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded">
              {lang === 'en' ? "Standard check: 10 kicks/2hr" : "নিরাপদ মাত্রা: ১০ লাথি/২ ঘণ্টা"}
            </span>
          </div>

          <div className="flex items-center justify-center gap-6 py-2">
            <button
              id="kick-add-btn"
              onClick={handleAddKick}
              className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-400 text-white flex flex-col items-center justify-center shadow-lg shadow-red-500/25 transition-all text-xs font-extrabold"
            >
              <Plus className="w-5 h-5 mb-1" />
              {kickCount} {lang === 'en' ? "Kicks" : "লাথি"}
            </button>

            <button
              id="kick-reset-btn"
              onClick={handleResetKicks}
              className="p-3 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-purple-500 transition-all"
              title="Save session and reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* History tracker */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase text-slate-400 tracking-widest">
              {lang === 'en' ? "Kick logging historical sessions" : "পূর্ববর্তী সেশনের রের্কড"}
            </p>
            {kickHistory.length === 0 ? (
              <p className="text-xs italic text-slate-400 text-center py-2">
                {lang === 'en' ? "Zero saved counters. Tap + above to log kicks." : "কোনো সংরক্ষিত সেশন নেই"}
              </p>
            ) : (
              <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 text-[11px] font-mono text-slate-500">
                {kickHistory.map((h, i) => (
                  <div key={i} className="flex justify-between p-2 rounded bg-slate-500/5">
                    <span>{h.time}</span>
                    <span className="font-bold text-purple-600">{h.count} cumulative kicks</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Maternal Risk prediction module */}
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-6">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            {lang === 'en' ? "Gestational Clinical Biomarker Scanner" : "গর্ভকালীন বায়ো-মার্কার ঝুঁকি পরিমাপক"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'en' 
              ? "Modify physiological variables to observe instant medical alerts on risks of pre-eclampsia, anemia, and diabetes."
              : "রক্তচাপ, সুগার ও হিমোগ্লোবিন পরিমাপ পরিবর্তন করে গর্ভকালীন ঝুঁকি এলার্ম পরীক্ষা করুন।"}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">{lang === 'en' ? "BP Systolic (mmHg)" : "রক্তচাপ সিস্টোলিক"}</label>
            <input
              id="maternal-sys-input"
              type="number"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">{lang === 'en' ? "BP Diastolic (mmHg)" : "রক্তচাপ ডায়াস্টোলিক"}</label>
            <input
              id="maternal-dia-input"
              type="number"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">{lang === 'en' ? "Sugar (mmol/L)" : "রক্ত শর্করা (সুগার)"}</label>
            <input
              id="maternal-sugar-input"
              type="number"
              step="0.1"
              value={bloodSugar}
              onChange={(e) => setBloodSugar(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">{lang === 'en' ? "Hemoglobin (g/dL)" : "হিমোগ্লোবিন পরিমাপ"}</label>
            <input
              id="maternal-hb-input"
              type="number"
              step="0.1"
              value={hemoglobin}
              onChange={(e) => setHemoglobin(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">{lang === 'en' ? "Weight (kg)" : "আদর্শ ওজন (কেজি)"}</label>
            <input
              id="maternal-wt-input"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">{lang === 'en' ? "Height (cm)" : "উচ্চতা (সেমি)"}</label>
            <input
              id="maternal-ht-input"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Predictive risk outcome status display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-dashed border-purple-500/20 bg-purple-500/5 space-y-3">
            <p className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              {lang === 'en' ? "Clinical Risk Signals Analyzed" : "বিশ্লেষিত এআই সঙ্কেতসমূহ"}
            </p>
            <div className="space-y-3">
              {detectedRisks.map((risk, index) => (
                <div key={index} className="flex gap-3 items-start">
                  {risk.category === 'RED' ? (
                    <span className="p-1 px-1.5 rounded-md bg-red-100 text-red-600 font-extrabold text-[10px] shrink-0 mt-0.5">RED</span>
                  ) : risk.category === 'YELLOW' ? (
                    <span className="p-1 px-1.5 rounded-md bg-amber-100 text-amber-600 font-extrabold text-[10px] shrink-0 mt-0.5">YEL</span>
                  ) : (
                    <span className="p-1 px-1.5 rounded-md bg-emerald-100 text-emerald-600 font-extrabold text-[10px] shrink-0 mt-0.5">OK</span>
                  )}
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{risk.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{risk.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Nutrition suggestions */}
          <div className="p-4 rounded-xl border border-indigo-500/10 bg-indigo-500/5 space-y-3">
            <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1">
              <Apple className="w-4 h-4" />
              {lang === 'en' ? "Local high-absorption clinical dietary items" : "আয়রণ ও ক্যালসিয়াম শোষক পুষ্টিকর খাবার"}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex gap-1.5 items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>লাল শাক (Iron rich)</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>কলিজা ও ডিম (Folate source)</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>সাজনে পাতা (Moringa calcium)</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>আমলকী ও লেবু (Vitamin C absorption)</span>
              </div>
            </div>
            <p className="text-[10px] leading-relaxed italic text-slate-400 mt-1">
              {lang === 'en' ? "Ensures optimal maternal hemoglobin absorption rates under low budgetary requirements." : "গ্রামাঞ্চলে স্বল্প খরচে গর্ভবতীদের হিমোগ্লোবিনের মাত্রা বাড়াতে বিশেষ সুপারিশ।"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
