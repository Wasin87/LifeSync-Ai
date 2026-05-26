import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Apple, Salad, HelpCircle, Activity, 
  ChevronRight, ArrowRight, HeartPulse, CheckSquare, RefreshCw
} from 'lucide-react';
import { getTranslation, Language } from '../types.js';

interface NutritionAIViewProps {
  lang: Language;
}

const LOCAL_FOODS_DB = [
  { name: lang => lang === 'en' ? "Khichuri (Rice, Lentil, Egg)" : "ডিম দিয়ে খিচুড়ি", calories: 450, macros: { carb: 58, protein: 18, fat: 12 }, healthScore: 92, cost: "Low", category: "High Protein Folate" },
  { name: lang => lang === 'en' ? "Lal Shak (Red Amaranth Leaf)" : "লাল শাক ভাজি", calories: 45, macros: { carb: 6, protein: 3, fat: 0.5 }, healthScore: 98, cost: "Very Low", category: "Micro Nutrition Iron" },
  { name: lang => lang === 'en' ? "Ruti with Lentil Dal" : "রুটি এবং মসুর ডাল", calories: 280, macros: { carb: 42, protein: 11, fat: 4 }, healthScore: 88, cost: "Low", category: "Starch & Fibre" },
  { name: lang => lang === 'en' ? "local Deshi Guava (Peyara)" : "দেশি পেয়ারা", calories: 60, macros: { carb: 14, protein: 1.2, fat: 0.2 }, healthScore: 96, cost: "Very Low", category: "Vitamin C booster" }
];

const DIET_TEMPLATES = {
  PREG: {
    title: { en: "Maternal Prenatal Diet Plan", bn: "গর্ভকালীন পুষ্টি ও সুষম ডায়েট" },
    desc: { en: "Enriched with high folate, calcium and iron absorption elements to prevent structural birth defects and microcytic anemia.", bn: "ফোলেট, ক্যালসিয়াম এবং আয়রন সমৃদ্ধ খাবার যা শিশুর মেরুদণ্ডের গঠন সবল করে এবং মায়ের রক্তস্বল্পতা প্রতিরোধ করে।" },
    foods: ["Lal Shak (daily)", "Khichuri with boiled egg", "Moringa leaf soup", "Ripe Peyara (Guava)"]
  },
  DIAB: {
    title: { en: "Type-2 Diabetes Management Diet", bn: "টাইপ-২ ডায়াবেটিস নিয়ন্ত্রণ ডায়েট" },
    desc: { en: "High fibers, low-glycemic scale carbohydrates to flatten insulin peaks.", bn: "লো-গ্লাইসেমিক ইনডেক্স শর্করা ও আঁশযুক্ত খাবার যা ডায়াবেটিস রোগী এবং গ্লুকোজ লেভেল নিয়ন্ত্রণে সহায়ক।" },
    foods: ["Brown Atta Ruti (2 pcs)", "Mixed leafy greens fried", "Lentil soup/Daal (no sugar)", "Green papaya mash (Pepe)"]
  },
  CKD: {
    title: { en: "Chronic Kidney Disease Diet (Low Potassium)", bn: "কিডনি রোগ ডায়েট (কম পটাশিয়াম)" },
    desc: { en: "Carefully controlled sodium, phosphorus, and potassium loads to safeguard nephrons.", bn: "নিয়ন্ত্রিত সোডিয়াম, ফসফরাস এবং কম পটাশিয়ামের পুষ্টি তালিকা যা রেনাল সুরক্ষায় কার্যকরী।" },
    foods: ["White Rice (sieved)", "Wax gourd stew (Chalkumra)", "Sweet gourd curry (controlled)", "Egg white (no yolk)"]
  },
  HYPERTENSION: {
    title: { en: "DASH Hypertension Reduction Diet", bn: "ড্যাশ (DASH) উচ্চ রক্তচাপ নিয়ন্ত্রণ ডায়েট" },
    desc: { en: "Enriched with high magnesium, low sodium, and potassium triggers to reduce blood pressure.", bn: "ম্যাগনেসিয়াম সমৃদ্ধ এবং অতিরিক্ত লবণ মুক্ত খাবার যা রক্তচাপ নিয়ন্ত্রণে অত্যন্ত কার্যকরী।" },
    foods: ["Moringa soup", "Fresh banana (local bichi kola)", "Boiled localized small fish stew", "Tomato cucumber raw salad (no salt)"]
  }
};

export default function NutritionAIView({ lang }: NutritionAIViewProps) {
  const t = getTranslation(lang);
  
  // Scanning active states
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<typeof LOCAL_FOODS_DB[0] | null>(null);
  const [activeGroup, setActiveGroup] = useState<keyof typeof DIET_TEMPLATES>('PREG');

  const startFoodScan = (item: typeof LOCAL_FOODS_DB[0]) => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(item);
    }, 2000);
  };

  const diet = DIET_TEMPLATES[activeGroup];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Upper scanning dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Preset selectors (5-cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold">
            <Salad className="w-5 h-5 animate-pulse" />
            <h3>{lang === 'en' ? "Aura Nutrition scanner simulation" : "পুষ্টি স্ক্যান ল্যাব"}</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'en' 
              ? "Select from local Bangladeshi budget food items to simulate an AI snapshot scan."
              : "নিচে দেওয়া স্থানীয় বাজেট উপযোগী খাবারগুলোর একটি নির্বাচন করে সেকেন্ডে স্ক্যান রিপোর্ট দেখুন:"}
          </p>

          <div className="space-y-2.5">
            {LOCAL_FOODS_DB.map((food, idx) => (
              <button
                key={idx}
                id={`btn-scan-food-${idx}`}
                onClick={() => startFoodScan(food)}
                className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-500/5 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all text-xs flex items-center justify-between group"
              >
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{food.name(lang)}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-mono">{food.category}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-purple-500 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Scan outcome panel (7-cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-purple-500" />
            {lang === 'en' ? "AI Food Scanner Diagnostic Outcome" : "স্ক্যানার ডায়াগনস্টিক রিপোর্ট"}
          </h3>

          <div className="flex-1 flex flex-col justify-center py-4">
            {isScanning ? (
              <div className="text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                <p className="text-xs text-slate-500">{lang === 'en' ? "Extracting macronutrients and micronutrient metrics..." : "খাবারের পুষ্টিগুণ এআই দ্বারা বিশ্লেষণ করা হচ্ছে..."}</p>
              </div>
            ) : scanResult ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-purple-500/5 p-3.5 rounded-xl border border-purple-500/10">
                  <div>
                    <h4 className="text-md font-bold text-purple-700 dark:text-purple-300">{scanResult.name(lang)}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Caloric density: {scanResult.calories} kcal</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-purple-600 dark:text-purple-300">{scanResult.healthScore}</p>
                    <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400">Health Score</span>
                  </div>
                </div>

                {/* Macromolecules breakdown */}
                <div className="space-y-2.5">
                  <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Macronutrients Breakdown</p>
                  
                  {/* Carbs */}
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Glucose/Carbs</span>
                      <span>{scanResult.macros.carb}g / 65%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  {/* Protein */}
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Proteins</span>
                      <span>{scanResult.macros.protein}g / 20%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>

                  {/* Fat */}
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Lipids/Fat</span>
                      <span>{scanResult.macros.fat}g / 15%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-center italic text-slate-400 py-6">
                {lang === 'en' ? "Please scan a food component on the left sidebar." : "রিপোর্ট দেখতে বাঁদিকের ফুড ডায়াগনস্টিক বাটন এ ট্যাপ করুন।"}
              </p>
            )}
          </div>

          <div className="p-3 bg-indigo-500/5 rounded-xl text-[11px] text-slate-500 dark:text-slate-400">
            {lang === 'en' 
              ? "All values are estimated according to localized nutritional scale benchmarks." 
              : "পুষ্টিমানের অনুপাতগুলো স্থানীয় পুষ্টি তালিকা অনুসারে গণনা করা হয়েছে।"}
          </div>
        </div>

      </div>

      {/* Conditionally customizable meal plans block */}
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-md flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-indigo-500" />
              {lang === 'en' ? "Condition-Tailored Nutrition Plans" : "রোগ-ভিত্তিক পুষ্টিকর খাবার পরিকল্পনা"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'en' 
                ? "Select a condition to display localized diet plans constructed using low-cost community foods."
                : "গর্ভকালীন সুস্থতা, কিডনি এবং উচ্চ রক্তচাপ নিয়ন্ত্রণে বিশেষ সাজেস্টেড খাবারের তালিকা:"}
            </p>
          </div>

          {/* Group toggles */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(DIET_TEMPLATES).map((grp) => (
              <button
                key={grp}
                id={`btn-diet-tab-${grp}`}
                onClick={() => setActiveGroup(grp as keyof typeof DIET_TEMPLATES)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold justify-center border transition-all ${
                  activeGroup === grp 
                    ? 'bg-purple-600 text-white border-purple-500' 
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-250 dark:border-slate-700 text-slate-600 dark:text-slate-350'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Plan Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">{diet.title[lang]}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {diet.desc[lang]}
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {diet.foods.map((food, idx) => (
              <div key={idx} className="p-3 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{food}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
