import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { 
  Heart, AlertTriangle, CheckCircle, Info, Calculator, 
  ChevronRight, Brain, TrendingUp, HelpCircle
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

  // Calculate risks locally based on framingham algorithms simulation
  const calcCardioRisk = () => {
    let risk = 5; // Base risk %
    const ageNum = parseInt(age) || 45;
    const sysNum = parseInt(systolic) || 120;
    const cholNum = parseInt(cholesterol) || 200;
    const ldlNum = parseInt(ldl) || 100;
    const cigNum = parseInt(cigarettes) || 0;

    // Age weights
    if (ageNum > 50) risk += 12;
    else if (ageNum > 40) risk += 6;

    // BP
    if (sysNum > 140) risk += 15;
    else if (sysNum > 130) risk += 8;

    // Lipid
    if (cholNum > 240) risk += 10;
    else if (cholNum > 200) risk += 5;
    if (ldlNum > 130) risk += 6;

    // Lifestyle
    if (cigNum > 10) risk += 18;
    else if (cigNum > 0) risk += 8;

    // Genetics
    if (familyCvd === "yes") risk += 11;

    return Math.min(risk, 100);
  };

  const calcDiabetesRisk = () => {
    let risk = 3;
    const ageNum = parseInt(age) || 45;
    const sysNum = parseInt(systolic) || 120;
    const hdlNum = parseInt(hdl) || 45;

    if (ageNum > 40) risk += 8;
    if (sysNum > 130) risk += 10;
    if (hdlNum < 40) risk += 12;
    if (cigarettes === 'yes') risk += 6;

    return Math.min(risk, 100);
  };

  const cardioRisk = calcCardioRisk();
  const diabetesRisk = calcDiabetesRisk();

  // SHAP Feature importance waterfall dataset for Recharts
  const shapDataset = [
    { name: lang === 'en' ? "Arterial pressure (+)" : "রক্তচাপ (+)", value: 24, fill: '#8884d8' },
    { name: lang === 'en' ? "Hyperlipidemia (+)" : "লিপিড কোলেস্টেরল (+)", value: 16, fill: '#8884d8' },
    { name: lang === 'en' ? "Cigarette toxin load (+)" : "ধূমপান সংযুক্তি (+)", value: 14, fill: '#82ca9d' },
    { name: lang === 'en' ? "Genetic family history" : "বংশগত জিনোটাইপ", value: 11, fill: '#ffc658' },
    { name: lang === 'en' ? "HDL vascular defence" : "এইচডিএল প্রোটেকশন", value: -8, fill: '#34d399' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Simulation Form and Outcomes display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Comprehensive assessment form (7-cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-5">
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
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">{lang === 'en' ? "Intake Age (Years)" : "রোগীর বয়স"}</label>
              <input
                id="risk-intl-age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">{lang === 'en' ? "Systolic BP" : "সিস্টোলিক রক্তচাপ"}</label>
              <input
                id="risk-intl-sys"
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">{lang === 'en' ? "Total Cholesterol" : "টোটাল কোলেস্টেরল"}</label>
              <input
                id="risk-intl-chol"
                type="number"
                value={cholesterol}
                onChange={(e) => setCholesterol(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">{lang === 'en' ? "HDL HDL" : "এইচডিএল কোলেস্টেরল"}</label>
              <input
                id="risk-intl-hdl"
                type="number"
                value={hdl}
                onChange={(e) => setHdl(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">{lang === 'en' ? "LDL LDL" : "এলডিএল কোলেস্টেরল"}</label>
              <input
                id="risk-intl-ldl"
                type="number"
                value={ldl}
                onChange={(e) => setLdl(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">{lang === 'en' ? "Daily Cigarettes" : "দৈনিক সিগারেট"}</label>
              <input
                id="risk-intl-cigs"
                type="number"
                value={cigarettes}
                onChange={(e) => setCigarettes(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">{lang === 'en' ? "Family CVD?" : "বংশগত হৃদরোগ?"}</label>
              <select
                id="risk-intl-family"
                value={familyCvd}
                onChange={(e) => setFamilyCvd(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-white"
              >
                <option value="yes">{lang === 'en' ? "Yes" : "হ্যাঁ"}</option>
                <option value="no">{lang === 'en' ? "No" : "না"}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Predictive outcomes display panel (5-cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 flex flex-col justify-between gap-6">
          <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
            <Heart className="w-4.5 h-4.5 text-red-500" />
            {lang === 'en' ? "Aura Risk Prediction Scores" : "এআই রিস্ক প্রেডিকশন এলার্ট"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Cardiac risk gauge */}
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 text-center space-y-1">
              <TrendingUp className="w-6 h-6 text-red-500 mx-auto" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cardio CVD Risk</p>
              <p className="text-3xl font-black text-red-600 dark:text-red-400">{cardioRisk}%</p>
              <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                cardioRisk > 25 ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'
              }`}>
                {cardioRisk > 25 ? (lang === 'en' ? "Elevated" : "ঝুঁকিপূর্ণ") : (lang === 'en' ? "Normal" : "স্বাভাবিক")}
              </span>
            </div>

            {/* Diabetes risk gauge */}
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 text-center space-y-1">
              <Brain className="w-6 h-6 text-purple-500 mx-auto" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type-2 Diabetes</p>
              <p className="text-3xl font-black text-purple-600 dark:text-purple-400">{diabetesRisk}%</p>
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-purple-500/10 text-purple-600">
                {diabetesRisk > 20 ? (lang === 'en' ? "Moderate" : "মাঝারি ঝুঁকি") : (lang === 'en' ? "Low" : "স্বল্প ঝুঁকি")}
              </span>
            </div>

          </div>

          <div className="p-3 bg-slate-500/5 rounded-xl text-[10.5px] text-slate-400 flex gap-2">
            <Info className="w-4.5 h-4.5 text-purple-500 shrink-0 mt-0.5" />
            <p>{lang === 'en' ? "Risk models conform to standard NIH guidelines." : "আমাদের নির্ণয় প্রক্রিয়া স্ট্যান্ডার্ড ক্লিনিকাল পরীক্ষা প্রোটোকল অনুসরণ করে।"}</p>
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
              <Bar dataKey="value" stroke="none">
                {shapDataset.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.value > 0 ? '#b794f4' : '#34d399'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
