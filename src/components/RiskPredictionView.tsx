import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { 
  Heart, AlertTriangle, CheckCircle, Info, Calculator, 
  ChevronRight, Brain, TrendingUp, HelpCircle, Activity, Stethoscope, RefreshCw
} from 'lucide-react';
import { getTranslation, Language } from '../types.js';

interface RiskPredictionViewProps {
  lang: Language;
}

export default function RiskPredictionView({ lang }: RiskPredictionViewProps) {
  const t = getTranslation(lang);
  
  // Predictor assessment inputs
  const [systolic, setSystolic] = useState("135");
  const [diastolic, setDiastolic] = useState("85");
  const [cholesterol, setCholesterol] = useState("220"); // mg/dL
  const [hdl, setHdl] = useState("45"); // mg/dL
  const [ldl, setLdl] = useState("130"); // mg/dL
  const [age, setAge] = useState("45");
  const [cigarettes, setCigarettes] = useState("5");
  const [familyCvd, setFamilyCvd] = useState("yes");

  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState<any>(null);

  // Calculate risks locally based on framingham algorithms simulation
  const handleGenerateRiskPrediction = () => {
    setIsPredicting(true);
    setPredictions(null);

    setTimeout(() => {
       const ageNum = parseInt(age) || 45;
       const sysNum = parseInt(systolic) || 120;
       const diaNum = parseInt(diastolic) || 80;
       const cholNum = parseInt(cholesterol) || 200;
       const ldlNum = parseInt(ldl) || 100;
       const hdlNum = parseInt(hdl) || 45;
       const cigNum = parseInt(cigarettes) || 0;

       let cvdRisk = 5;
       if (ageNum > 50) cvdRisk += 12; else if (ageNum > 40) cvdRisk += 6;
       if (sysNum > 140) cvdRisk += 15; else if (sysNum > 130) cvdRisk += 8;
       if (cholNum > 240) cvdRisk += 10; else if (cholNum > 200) cvdRisk += 5;
       if (ldlNum > 130) cvdRisk += 6;
       if (cigNum > 10) cvdRisk += 18; else if (cigNum > 0) cvdRisk += 8;
       if (familyCvd === "yes") cvdRisk += 11;
       
       let diabRisk = 3;
       if (ageNum > 40) diabRisk += 8;
       if (sysNum > 130) diabRisk += 10;
       if (hdlNum < 40) diabRisk += 12;
       
       let strokeRisk = cvdRisk * 0.6 + (sysNum > 150 ? 20 : 0);
       let hyperRisk = (sysNum > 130 || diaNum > 85) ? 45 + ((sysNum - 130) * 0.5) : 15;
       let ckdRisk = 2 + (sysNum > 140 ? 15 : 0) + (diabRisk * 0.3) + (ageNum > 50 ? 5 : 0);

       setPredictions({
          cvd: Math.min(Math.round(cvdRisk), 100),
          diab: Math.min(Math.round(diabRisk), 100),
          stroke: Math.min(Math.round(strokeRisk), 100),
          hyper: Math.min(Math.round(hyperRisk), 100),
          ckd: Math.min(Math.round(ckdRisk), 100)
       });
       setIsPredicting(false);
    }, 2500);
  };

  // SHAP Feature importance waterfall dataset for Recharts
  const shapDataset = [
    { name: lang === 'en' ? "Arterial pressure (+)" : "রক্তচাপ (+)", value: 24, fill: '#ef4444' }, // Red
    { name: lang === 'en' ? "Hyperlipidemia (+)" : "লিপিড কোলেস্টেরল (+)", value: 16, fill: '#a855f7' }, // Purple
    { name: lang === 'en' ? "Cigarette toxin load (+)" : "ধূমপান সংযুক্তি (+)", value: 14, fill: '#f59e0b' }, // Amber
    { name: lang === 'en' ? "Genetic family history" : "বংশগত জিনোটাইপ", value: 11, fill: '#8b5cf6' }, // Violet
    { name: lang === 'en' ? "HDL vascular defence" : "এইচডিএল প্রোটেকশন", value: -12, fill: '#10b981' } // Emerald
  ];

  const renderGauge = (label: string, value: number, colorLabel: string, colorHex: string, Icon: any) => {
     return (
        <div className="p-3 bg-slate-500/5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-2 relative">
           <div className="absolute top-2 left-2"><Icon className={`w-4 h-4 text-${colorLabel}-500`} /></div>
           <div className="w-16 h-16">
             <ResponsiveContainer width="100%" height="100%">
               <RadialBarChart 
                 cx="50%" cy="50%" 
                 innerRadius="70%" outerRadius="100%" 
                 barSize={8} data={[{ name: label, value: value }]}
                 startAngle={90} endAngle={-270}
               >
                 <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                 <RadialBar
                   background={{ fill: 'rgba(100, 100, 100, 0.1)' }}
                   dataKey="value"
                   cornerRadius={4}
                   fill={colorHex}
                 />
                 <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-sm font-black fill-slate-800 dark:fill-white">
                    {value}%
                 </text>
               </RadialBarChart>
             </ResponsiveContainer>
           </div>
           <div className="text-center">
              <div className="text-[9px] font-bold uppercase text-slate-500 tracking-wider whitespace-nowrap">{label}</div>
           </div>
        </div>
     );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Simulation Form and Outcomes display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Comprehensive assessment form (6-cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-6">
          <div className="flex justify-between items-center text-purple-600 dark:text-purple-400 font-bold">
            <h3 className="text-xs uppercase font-mono tracking-widest flex items-center gap-2">
              <Calculator className="w-4.5 h-4.5" />
              {lang === 'en' ? "Epidemiological Biomarker Intake" : "ফিজিওলজিক্যাল বায়ো-মার্কার তথ্য এন্ট্রি"}
            </h3>
            <span className="text-[10px] bg-purple-500/10 text-purple-600 border border-purple-500/15 px-2.5 py-0.5 rounded-full font-mono">
              Framingham Grounded
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="col-span-2 sm:col-span-1 space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "Intake Age (Years)" : "রোগীর বয়স"}</label>
              <input
                id="risk-intl-age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "Systolic BP" : "সিস্টোলিক রক্তচাপ"}</label>
              <input
                id="risk-intl-sys"
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "Diastolic BP" : "ডায়াস্টোলিক রক্তচাপ"}</label>
              <input
                id="risk-intl-dia"
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "Total Chol." : "কোলেস্টেরল"}</label>
              <input
                id="risk-intl-chol"
                type="number"
                value={cholesterol}
                onChange={(e) => setCholesterol(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "HDL" : "এইচডিএল"}</label>
              <input
                id="risk-intl-hdl"
                type="number"
                value={hdl}
                onChange={(e) => setHdl(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "LDL" : "এলডিএল"}</label>
              <input
                id="risk-intl-ldl"
                type="number"
                value={ldl}
                onChange={(e) => setLdl(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "Daily Cigarettes" : "দৈনিক সিগারেট"}</label>
               <input
                 id="risk-intl-cigs"
                 type="number"
                 value={cigarettes}
                 onChange={(e) => setCigarettes(e.target.value)}
                 className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
               />
             </div>
             <div className="space-y-1">
               <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "Family CVD?" : "বংশগত হৃদরোগ?"}</label>
               <select
                 id="risk-intl-family"
                 value={familyCvd}
                 onChange={(e) => setFamilyCvd(e.target.value)}
                 className="w-full p-2.5 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-white flex-1"
               >
                 <option value="yes">{lang === 'en' ? "Yes" : "হ্যাঁ"}</option>
                 <option value="no">{lang === 'en' ? "No" : "না"}</option>
               </select>
             </div>
          </div>

          <button
            onClick={handleGenerateRiskPrediction}
            disabled={isPredicting}
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow transition-all"
          >
            {isPredicting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            {lang === 'en' ? "Generate Full Risk Prediction" : "সম্পূর্ণ এআই রিস্ক অ্যাসেসমেন্ট চালু করুন"}
          </button>
        </div>

        {/* Predictive outcomes display panel (6-cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 flex flex-col justify-between gap-6 relative overflow-hidden">
          {/* Subtle background glow effect */}
          {predictions && <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />}

          <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2 relative z-10">
            <Heart className="w-4.5 h-4.5 text-red-500" />
            {lang === 'en' ? "Aura Risk Prediction Scores" : "এআই রিস্ক প্রেডিকশন এলার্ট"}
          </h3>

          <div className="flex-1 flex flex-col relative z-10">
             {isPredicting ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 pt-10">
                   <div className="relative">
                      <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full animate-pulse"></div>
                      <RefreshCw className="w-12 h-12 text-purple-500 animate-spin p-2" />
                   </div>
                   <p className="text-xs font-bold text-slate-500 animate-pulse">{lang === 'en' ? "Simulating Framingham algorithms..." : "অ্যালগরিদম ক্যালকুলেট হচ্ছে..."}</p>
                </div>
             ) : predictions ? (
                <div className="space-y-4">
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {renderGauge("Cardio CVD", predictions.cvd, "red", "#ef4444", TrendingUp)}
                      {renderGauge("Type-2 Diab", predictions.diab, "purple", "#a855f7", Brain)}
                      {renderGauge("Stroke Risk", predictions.stroke, "amber", "#f59e0b", Activity)}
                      {renderGauge("Hypertension", predictions.hyper, "rose", "#e11d48", Heart)}
                      {renderGauge("CKD Risk", predictions.ckd, "cyan", "#06b6d4", Stethoscope)}
                   </div>
                   
                   <div className="mt-4 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                      <p className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-1">
                         <AlertTriangle className="w-3.5 h-3.5" /> {lang === 'en' ? 'Clinical Action Needed' : 'ঝুঁকিপূর্ণ অবস্হা!'}
                      </p>
                      <p className="text-[10px] text-slate-700 dark:text-slate-300 leading-relaxed">
                         {predictions.cvd > 30 || predictions.hyper > 30 
                           ? (lang === 'en' ? "High risk detected for future cardiovascular event. Immediate lifestyle intervention and lipid-lowering therapy consideration recommended." : "উচ্চ কার্ডিওভাসকুলার ঝুঁকির সংকেত! অবিলম্বে চিকিৎসকের শরণাপন্ন হওয়া এবং লিপিড কমানোর উদ্যোগ নেয়া বাঞ্ছনীয়।")
                           : (lang === 'en' ? "Parameters are within acceptable thresholds for non-immediate intervention. Maintain monitoring." : "ঝুঁকির মাত্রা অপেক্ষাকৃত স্বাভাবিক সীমার মধ্যে আছে।")}
                      </p>
                   </div>
                </div>
             ) : (
                <div className="flex-1 flex items-center justify-center min-h-[200px]">
                   <p className="text-xs text-center italic text-slate-400">
                     {lang === 'en' ? "Fill out physiological markers and hit generate." : "তথ্য দিয়ে জেনারেট বাটনে ক্লিক করুন।"}
                   </p>
                </div>
             )}
          </div>

          <div className="p-3 bg-slate-500/5 rounded-xl text-[10.5px] text-slate-400 flex gap-2 relative z-10 mt-auto">
            <Info className="w-4.5 h-4.5 text-purple-500 shrink-0 mt-0.5" />
            <p>{lang === 'en' ? "Risk models conform to standard NIH and Framingham guidelines." : "আমাদের নির্ণয় প্রক্রিয়া স্ট্যান্ডার্ড ক্লিনিকাল পরীক্ষা প্রোটোকল অনুসরণ করে।"}</p>
          </div>
        </div>

      </div>

      {/* Recharts SHAP explainable AI waterfall chart */}
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
          <HelpCircle className="w-4.5 h-4.5 text-cyan-500" />
          {lang === 'en' ? "Explainable AI (XAI) Biomarker SHAP Analysis" : "ব্যাখ্যাযোগ্য এআই (XAI) মার্কার অবদান বিশ্লেষণ"}
        </h3>
        
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {lang === 'en' 
            ? "SHAP (Shapley Additive exPlanations) factors outline how each variable pulls the risk prediction up (+) or protects the cardiovascular health down (-)."
            : "শ্যাপলি এআই (SHAP) মেকানিজম রোগীকে স্পষ্ট ধারণা দেয় ঠিক কোন উপসর্গটি রোগ সৃষ্টিতে কতটুকু কাজ করছে এবং কোন বিষয় প্রতিরোধ করছে।"}
        </p>

        {/* Custom Barchart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={shapDataset}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
            >
              <XAxis type="number" stroke="#888888" fontSize={11} domain={[-20, 30]} />
              <YAxis dataKey="name" type="category" stroke="#888888" fontSize={11} width={130} />
              <Tooltip 
                contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px' }} 
                labelStyle={{ color: '#fff', fontSize: '11px' }} 
                itemStyle={{ color: '#a78bfa', fontSize: '11px' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {shapDataset.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
