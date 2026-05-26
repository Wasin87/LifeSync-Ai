import React from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, Activity, Users, ShieldAlert, Sparkles, 
  ChevronRight, Landmark, RefreshCw
} from 'lucide-react';
import { getTranslation, Language } from '../types.js';

interface AdminAnalyticsViewProps {
  lang: Language;
}

export default function AdminAnalyticsView({ lang }: AdminAnalyticsViewProps) {
  const t = getTranslation(lang);

  // Recharts Dataset 1: Disease trends by district
  const diseaseData = [
    { name: 'Dhaka', Dengue: 240, Influenza: 320, Malaria: 45 },
    { name: 'Sylhet', Dengue: 85, Influenza: 410, Malaria: 160 },
    { name: 'Chittagong', Dengue: 195, Influenza: 280, Malaria: 90 },
    { name: 'Rajshahi', Dengue: 60, Influenza: 190, Malaria: 30 }
  ];

  // Recharts Dataset 2: Monthly Maternal risk incidents logged
  const maternalTrendData = [
    { month: 'Jan', preEclampsia: 12, anemia: 34, normal: 120 },
    { month: 'Feb', preEclampsia: 18, anemia: 28, normal: 145 },
    { month: 'Mar', preEclampsia: 15, anemia: 45, normal: 160 },
    { month: 'Apr', preEclampsia: 24, anemia: 31, normal: 175 },
    { month: 'May', preEclampsia: 28, anemia: 52, normal: 190 }
  ];

  // Recharts Dataset 3: Diagnostic triage breakdown
  const demographicData = [
    { name: 'High Risk (RED)', value: 12, color: '#ef4444' },
    { name: 'Moderate Risk (YELLOW)', value: 34, color: '#f59e0b' },
    { name: 'Optimal Healthy (GREEN)', value: 154, color: '#10b981' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Simulation stats row */}
      <div className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-md flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            {lang === 'en' ? "Epidemiological and Demographic Surveillance" : "আঞ্চলিক মহামারী ও রোগীর ডেমোগ্রাফিক সূচক"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'en' 
              ? "Plotting real-time disease outbreaks and maternal health alerts parsed across all NGO clinical checkpoints."
              : "সারাদেশের গ্রামীণ ক্লিনিক এবং স্যানিটারি কোয়ার্টার থেকে পাঠানো তথ্যের ভিত্তিতে মহামারী ও প্রসবকালীন অ্যালার্ট গ্রাফ সমূহ:"}
          </p>
        </div>
      </div>

      {/* Grid containing 2 main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* District disease outbreak trends barchart (7-cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
          <h4 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">
            {lang === 'en' ? "District-Wise Outbreak Density" : "জেলা ভিত্তিক মহামারী ছড়ানোর তীব্রতা"}
          </h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px' }} labelStyle={{ color: '#fff', fontSize: '11px' }} itemStyle={{ fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', pt: 10 }} />
                <Bar dataKey="Dengue" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Influenza" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Malaria" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Diagnostic Triage classification donut (5-cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4 flex flex-col justify-between">
          <h4 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">
            {lang === 'en' ? "Triage Classification Split" : "রোগীর সামগ্রিক ঝুঁকির কন্ডিশন বিভাজন"}
          </h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono font-bold">
            {demographicData.map((d, i) => (
              <div key={i} className="p-1.5 rounded-lg bg-slate-500/5">
                <span className="block h-2 w-2 rounded-full mx-auto mb-1" style={{ backgroundColor: d.color }}></span>
                <p className="text-slate-700 dark:text-slate-300">{d.value} Cases</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Maternal-Fetal preeclampsia risk time series linechart */}
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">
          {lang === 'en' ? "Maternal High-Risk Incidents Log Trends" : "গর্ভকালীন জটিলতা রিপোর্টিং টাইমলাইন"}
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={maternalTrendData}>
              <XAxis dataKey="month" stroke="#888888" fontSize={11} />
              <YAxis stroke="#888888" fontSize={11} />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px' }} labelStyle={{ color: '#fff', fontSize: '11px' }} itemStyle={{ fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', pt: 10 }} />
              <Line type="monotone" dataKey="preEclampsia" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="anemia" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="normal" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
