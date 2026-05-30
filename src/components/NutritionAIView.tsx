import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Apple, Salad, HelpCircle, Activity, 
  ChevronRight, ArrowRight, HeartPulse, CheckSquare, RefreshCw, Flame, DollarSign, Pill
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getTranslation, Language } from '../types.js';

interface NutritionAIViewProps {
  lang: Language;
}

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
  const [foodInput, setFoodInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [activeGroup, setActiveGroup] = useState<keyof typeof DIET_TEMPLATES>('PREG');

  const generateNutritionIntelligence = (input: string) => {
    const raw = input.toLowerCase().trim();
    
    // Core database
    const db = [
      { words: ["egg", "dim", "ডিম"], cals: 78, pro: 6, carb: 0.6, fat: 5, fib: 0, irn: 1, cal: 25, pot: 69, score: 92, tags: ["Protein", "B12"] },
      { words: ["milk", "dudh", "দুধ", "doi", "দই"], cals: 103, pro: 8, carb: 12, fat: 2.4, fib: 0, irn: 0, cal: 300, pot: 366, score: 88, tags: ["Calcium", "Dairy"] },
      { words: ["rice", "vat", "ভাত"], cals: 205, pro: 4.3, carb: 45, fat: 0.4, fib: 0.6, irn: 1.9, cal: 10, pot: 55, score: 65, tags: ["Carb"] },
      { words: ["fish", "mach", "মাছ", "rui", "ilish"], cals: 206, pro: 22, carb: 0, fat: 12, fib: 0, irn: 0.9, cal: 15, pot: 384, score: 95, tags: ["Protein", "Omega-3"] },
      { words: ["chicken", "murgi", "মুরগি"], cals: 165, pro: 31, carb: 0, fat: 3.6, fib: 0, irn: 1, cal: 15, pot: 256, score: 85, tags: ["Protein"] },
      { words: ["beef", "goru", "গরু", "mangsho"], cals: 250, pro: 26, carb: 0, fat: 15, fib: 0, irn: 2.6, cal: 18, pot: 318, score: 70, tags: ["Protein", "Iron"] },
      { words: ["banana", "kola", "কলা"], cals: 105, pro: 1.3, carb: 27, fat: 0.3, fib: 3.1, irn: 0.3, cal: 6, pot: 422, score: 90, tags: ["Carb", "Potassium"] },
      { words: ["apple", "apel", "আপেল"], cals: 95, pro: 0.5, carb: 25, fat: 0.3, fib: 4.4, irn: 0.2, cal: 11, pot: 195, score: 92, tags: ["Carb", "Fiber"] },
      { words: ["bread", "ruti", "রুটি", "atta"], cals: 79, pro: 2.7, carb: 15, fat: 1, fib: 1.5, irn: 0.9, cal: 40, pot: 55, score: 75, tags: ["Carb"] },
      { words: ["dal", "lentil", "ডাল"], cals: 116, pro: 9, carb: 20, fat: 0.4, fib: 7.9, irn: 3.3, cal: 19, pot: 369, score: 95, tags: ["Protein", "Iron"] },
      { words: ["vegetables", "sobji", "shak", "সবজি", "শাক", "potato", "alu", "আলু"], cals: 65, pro: 2, carb: 15, fat: 0, fib: 4, irn: 1.5, cal: 30, pot: 400, score: 98, tags: ["Fiber", "Micros"] },
    ];

    let cals = 0, pro = 0, carb = 0, fat = 0, fib = 0, irn = 0, cal = 0, pot = 0, score = 0, count = 0;
    let tags = new Set<string>();

    db.forEach(item => {
      if (item.words.some(w => raw.includes(w))) {
        cals += item.cals;
        pro += item.pro;
        carb += item.carb;
        fat += item.fat;
        fib += item.fib;
        irn += item.irn;
        cal += item.cal;
        pot += item.pot;
        score += item.score;
        item.tags.forEach(t => tags.add(t));
        count++;
      }
    });

    if (count === 0) {
      // Deterministic fallback based on string length and char codes
      let hash = 0;
      for (let i = 0; i < raw.length; i++) {
        hash = raw.charCodeAt(i) + ((hash << 5) - hash);
      }
      cals = Math.abs(hash % 300) + 100;
      pro = Math.abs(hash % 20) + 5;
      carb = Math.abs(hash % 50) + 10;
      fat = Math.abs(hash % 15) + 2;
      fib = Math.abs(hash % 8) + 1;
      irn = Math.abs(hash % 5) + 1;
      cal = Math.abs(hash % 150) + 20;
      pot = Math.abs(hash % 400) + 100;
      score = Math.abs(hash % 40) + 50;
      tags.add("Mixed");
    } else {
      score = Math.round(score / count);
    }

    // Synthesis logic
    let rank = 'Good', cost = 'Moderate', warn: string[] = [];

    if (score > 85) rank = 'Excellent';
    else if (score < 65) rank = 'Average';

    if (tags.has("Carb") && !tags.has("Protein")) warn.push(lang === 'en' ? "High Carbohydrate spike risk" : "রক্তে শর্করার পরিমাণ দ্রুত বাড়তে পারে");
    if (!tags.has("Fiber") && !tags.has("Micros")) warn.push(lang === 'en' ? "Low micronutrient density" : "ভিটামিন ও মিনারেল কম");
    if (fat > 12) warn.push(lang === 'en' ? "High fat content - control portions" : "চর্বি বেশি - পরিমিত মাত্রায় খাবেন");

    let summaryText = lang === 'en' 
        ? `This food combination delivers approximately ${cals.toFixed(0)} kcal. ` 
        : `এই খাবারে প্রায় ${cals.toFixed(0)} ক্যালরি আছে। `;

    if (tags.has("Protein")) summaryText += lang === 'en' ? "Excellent protein source for muscle maintenance and maternal nutrition. " : "এতে প্রচুর প্রোটিন রয়েছে যা শরীরের পেশী গঠনে সাহায্য করে। ";
    if (tags.has("Carb")) summaryText += lang === 'en' ? "Provides fast energy but should be balanced with protein-rich foods. " : "শর্করা থাকায় দ্রুত শক্তি পাবেন, তবে পরিমিত খাওয়া উচিত। ";
    if (tags.has("Calcium") || tags.has("Dairy")) summaryText += lang === 'en' ? "High Calcium levels for bone health support. " : "এটি ক্যালসিয়ামের খুব ভালো একটি উৎস যা হাড় মজবুত করে। ";
    if (tags.has("Omega-3")) summaryText += lang === 'en' ? "Supports cardiovascular health through natural fatty acids. " : "হৃদযন্ত্রের সুস্থতায় কার্যকরী উপকারী চর্বি রয়েছে এতে। ";
    if (tags.has("Potassium")) summaryText += lang === 'en' ? "Potassium-rich profile helps with digestive and muscular support. " : "প্রচুর পটাশিয়াম রয়েছে যা পেশী ও হজমে সহায়ক। ";
    if (tags.has("B12")) summaryText += lang === 'en' ? "Good B12 source. " : "ভিটামিন বি১২ এর ভালো উৎস। ";
    if (tags.has("Iron")) summaryText += lang === 'en' ? "Valuable iron source for preventing anemia. " : "আয়রন রয়েছে যা রক্তস্বল্পতা দূর করতে সহায়ক। ";

    return {
      name: input,
      calories: Math.round(cals),
      macros: { carb: Math.round(carb), protein: Math.round(pro), fat: Math.round(fat) },
      micros: { fiber: parseFloat(fib.toFixed(1)), iron: parseFloat(irn.toFixed(1)), calcium: Math.round(cal), potassium: Math.round(pot) },
      healthScore: Math.min(Math.round(score), 99),
      rating: rank,
      riskIndicators: warn,
      summary: summaryText,
      budget: score > 80 ? "Low Cost" : "Moderate Cost",
      recommendations: [
        lang === 'en' ? "Watch portion sizes" : "পরিমিত মাত্রায় গ্রহণ করুন", 
        tags.has("Fiber") || tags.has("Micros") ? (lang === 'en' ? "Great vegetable intake" : "সবজির পরিমাণ চমৎকার") : (lang === 'en' ? "Add leafy greens" : "সবুজ শাক যুক্ত করুন")
      ]
    };
  };

  const startFoodScan = () => {
    if (!foodInput.trim()) return;
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(generateNutritionIntelligence(foodInput));
    }, 1800);
  };

  const diet = DIET_TEMPLATES[activeGroup];

  const pieData = scanResult ? [
    { name: 'Carbs', value: scanResult.macros.carb, color: '#a855f7' },
    { name: 'Protein', value: scanResult.macros.protein, color: '#06b6d4' },
    { name: 'Fat', value: scanResult.macros.fat, color: '#f59e0b' },
  ] : [];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Upper scanning dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input selectors (5-cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold">
            <Salad className="w-5 h-5 animate-pulse" />
            <h3>{lang === 'en' ? "Aura Nutrition Scanner Simulation" : "পুষ্টি স্ক্যান ল্যাব"}</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'en' 
              ? "Enter local Bangladeshi meals (e.g. 'Khichuri with egg' or 'Lal Shak') to simulate an AI nutrition snapshot."
              : "স্থানীয় যেকোনো বাঙালি খাবারের নাম (যেমন: ডিম-খিচুড়ি বা লাল শাক) লিখে স্ক্যান করুন:"}
          </p>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
               <label className="text-[11px] font-bold text-slate-500 uppercase">{lang === 'en' ? "Local Food Input" : "খাবারের নাম"}</label>
               <input
                 type="text"
                 value={foodInput}
                 onChange={(e) => setFoodInput(e.target.value)}
                 placeholder={lang === 'en' ? "e.g. Ruti with Lentil Dal" : "যেমন: রুটি ও ডাল"}
                 className="w-full p-2.5 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-purple-500/50"
               />
            </div>
            <button
               onClick={startFoodScan}
               disabled={isScanning || !foodInput.trim()}
               className="w-full py-2.5 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 transition-all shadow"
            >
               {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
               {lang === 'en' ? "Analyze Nutrition AI" : "পুষ্টিগুণ যাচাই করুন"}
            </button>
          </div>

          {!isScanning && !scanResult && (
             <div className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[10px] text-slate-500 space-y-1 font-mono">
                <p>Popular entries to try:</p>
                <div className="flex gap-2 flex-wrap">
                   <span onClick={() => setFoodInput('Mashed Potato & Rice')} className="cursor-pointer hover:text-indigo-500">Mashed Potato & Rice</span>
                   <span onClick={() => setFoodInput('Rui Fish Curry')} className="cursor-pointer hover:text-indigo-500">Rui Fish Curry</span>
                   <span onClick={() => setFoodInput('Panta Ilish')} className="cursor-pointer hover:text-indigo-500">Panta Ilish</span>
                </div>
             </div>
          )}
        </div>

        {/* Scan outcome panel (7-cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2 mb-4">
            <Sparkles className="w-4.5 h-4.5 text-purple-500" />
            {lang === 'en' ? "AI Food Scanner Diagnostic Outcome" : "স্ক্যানার ডায়াগনস্টিক রিপোর্ট"}
          </h3>

          <div className="flex-1 flex flex-col">
            {isScanning ? (
              <div className="flex-1 flex flex-col justify-center items-center space-y-4">
                <RefreshCw className="w-10 h-10 text-purple-500 animate-spin" />
                <p className="text-xs font-bold text-slate-500">{lang === 'en' ? "Analyzing macro-distribution & micros..." : "পুষ্টিগুণ এআই দ্বারা বিশ্লেষণ করা হচ্ছে..."}</p>
              </div>
            ) : scanResult ? (
              <div className="space-y-6">
                
                {/* Header Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl text-center">
                      <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{scanResult.healthScore}</div>
                      <div className="text-[9px] font-bold uppercase text-slate-500">Nutrition Score</div>
                   </div>
                   <div className="p-3 bg-slate-500/5 border border-slate-200 dark:border-slate-800 rounded-xl text-center flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                         <Flame className="w-4 h-4 text-orange-500" /> {scanResult.calories}
                      </div>
                      <div className="text-[9px] font-bold uppercase text-slate-500">Calories kcal</div>
                   </div>
                   <div className="p-3 bg-slate-500/5 border border-slate-200 dark:border-slate-800 rounded-xl text-center flex flex-col items-center justify-center">
                      <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{scanResult.rating}</div>
                      <div className="text-[9px] font-bold uppercase text-slate-500">Health Rating</div>
                   </div>
                   <div className="p-3 bg-slate-500/5 border border-slate-200 dark:border-slate-800 rounded-xl text-center flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                         <DollarSign className="w-4 h-4 text-emerald-500" /> {scanResult.budget.split(' ')[0]}
                      </div>
                      <div className="text-[9px] font-bold uppercase text-slate-500">Budget Cost</div>
                   </div>
                </div>

                {/* Macro & Micro Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase text-slate-500">Macro Distribution</p>
                      <div className="h-32">
                         <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                             <Pie
                               data={pieData}
                               cx="50%"
                               cy="50%"
                               innerRadius={30}
                               outerRadius={50}
                               paddingAngle={5}
                               dataKey="value"
                             >
                               {pieData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                             </Pie>
                             <Tooltip 
                               contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                               itemStyle={{ color: '#fff' }}
                             />
                           </PieChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center gap-4 text-[9px] font-mono text-slate-500">
                         <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div>Carbs: {scanResult.macros.carb}g</span>
                         <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-500"></div>Protein: {scanResult.macros.protein}g</span>
                         <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div>Fat: {scanResult.macros.fat}g</span>
                      </div>
                   </div>
                   
                   <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase text-slate-500">Micronutrient Profile</p>
                      <div className="space-y-3 mt-4">
                         <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-slate-500">
                               <span>Fiber (Digestion)</span><span>{scanResult.micros.fiber}g</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full"><div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((scanResult.micros.fiber / 10) * 100, 100)}%` }}></div></div>
                         </div>
                         <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-slate-500">
                               <span>Iron (Anemia protection)</span><span>{scanResult.micros.iron}mg</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full"><div className="bg-rose-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((scanResult.micros.iron / 10) * 100, 100)}%` }}></div></div>
                         </div>
                         <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-slate-500">
                               <span>Calcium (Bone health)</span><span>{scanResult.micros.calcium}mg</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full"><div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((scanResult.micros.calcium / 500) * 100, 100)}%` }}></div></div>
                         </div>
                         <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-slate-500">
                               <span>Potassium (Muscular support)</span><span>{scanResult.micros.potassium}mg</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full"><div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((scanResult.micros.potassium / 1000) * 100, 100)}%` }}></div></div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-4 bg-slate-500/5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                   <p className="text-[10px] font-bold uppercase text-slate-500">Clinical Summary</p>
                   <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{scanResult.summary}</p>
                   <div className="flex gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                     {scanResult.riskIndicators && scanResult.riskIndicators.map((w: string, i: number) => (
                        <div key={`warn-${i}`} className="flex flex-1 items-start gap-1 p-2 bg-amber-500/10 rounded-md text-[10px] text-amber-700 dark:text-amber-400 mb-2">
                           <Pill className="w-3 h-3 shrink-0 mt-0.5" /> <span>{w}</span>
                        </div>
                     ))}
                     <div className="flex gap-2">
                        {scanResult.recommendations.map((r: string, i: number) => (
                           <div key={i} className="flex flex-1 items-start gap-1 p-2 bg-emerald-500/10 rounded-md text-[10px] text-emerald-700 dark:text-emerald-400">
                              <Pill className="w-3 h-3 shrink-0 mt-0.5" /> <span>{r}</span>
                           </div>
                        ))}
                     </div>
                   </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                 <p className="text-xs text-center italic text-slate-400 py-6">
                   {lang === 'en' ? "Please type a food and hit analyze." : "রিপোর্ট দেখতে খাবার সার্চ করুন।"}
                 </p>
              </div>
            )}
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
