import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, ClipboardCheck, Sparkles, Database, Plus, RefreshCw, 
  HelpCircle, CheckSquare, MessageSquare, AlertCircle, Save
} from 'lucide-react';
import { getTranslation, Language, PatientRecord } from '../types.js';

interface HealthWorkerHubProps {
  lang: Language;
}

export default function HealthWorkerHub({ lang }: HealthWorkerHubProps) {
  const t = getTranslation(lang);
  
  // Intake list states
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('32');
  const [gender, setGender] = useState('Female');
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [sugar, setSugar] = useState('6.1');
  const [hemoglobin, setHemoglobin] = useState('11.8');
  const [maternalRisk, setMaternalRisk] = useState('Healthy prenatal');

  // Syncing states
  const [localRegistry, setLocalRegistry] = useState<PatientRecord[]>([
    { id: "PAT-OFF-1", name: "Morzina Begum", age: 34, gender: "Female", bp: "145/95", bloodSugar: "8.2", hemoglobin: 10.1, weight: 58, height: 150, maternalRisk: "Pre-eclampsia Risk", status: "pending" }
  ]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudSyncedCount, setCloudSyncedCount] = useState(3); // Initial DB records length

  // Voice scribe state
  const [recordedScript, setRecordedScript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [scribeNotes, setScribeNotes] = useState("");

  const whoProtocol = [
    { id: 'bp', label: lang === 'en' ? "Screening for high arterial pressure (Hypertension/Pre-eclampsia)" : "রক্তচাপ পরিমাপ (উচ্চ রক্তচাপ ও এক্লাম্পসিয়া প্রতিরোধ)" },
    { id: 'hb', label: lang === 'en' ? "Micro-cuvette Hemoglobin blood assessment (Severe Anemia monitoring)" : "রক্তস্বল্পতা পরীক্ষা (হিমোগ্লোবিনের মাত্রা নিরূপণ)" },
    { id: 'urine', label: lang === 'en' ? "Urine strip leukocyte & protein screening (Preeclampsia & UTIs check)" : "প্রস্রাবে প্রোটিন ও ব্যাকটেরিয়াল গ্লুকোজ লেভেল পরীক্ষণ" },
    { id: 'fetal', label: lang === 'en' ? "Gestational Doppler fetal heart rate audio assessment" : "ডপলার সঙ্কেত পরীক্ষা (গর্ভস্থ শিশুর হৃদস্পন্দন নিরূপণ)" }
  ];

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newRecord: PatientRecord = {
      id: `PAT-OFF-${Date.now()}`,
      name: patientName,
      age: parseInt(age) || 30,
      gender,
      bp: `${systolic}/${diastolic}`,
      bloodSugar: sugar,
      hemoglobin: parseFloat(hemoglobin) || 12.0,
      weight: 60,
      height: 154,
      maternalRisk: gender === 'Female' ? maternalRisk : undefined,
      status: 'pending'
    };

    setLocalRegistry(prev => [newRecord, ...prev]);
    setPatientName('');
    setSystolic('120');
    setDiastolic('80');
    setSugar('6.0');
    setHemoglobin('12.0');
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    // Simulate API delay transmission
    setTimeout(() => {
      setLocalRegistry(prev => prev.map(p => ({ ...p, status: 'synced' })));
      setCloudSyncedCount(prev => prev + localRegistry.filter(p => p.status === 'pending').length);
      setIsSyncing(false);
    }, 3000);
  };

  const simulateScribe = () => {
    setIsTranscribing(true);
    setRecordedScript(
      lang === 'en' 
        ? "Maternal patient is Morzina Begum, 34 weeks, complaints of severe headache. BP measured at 145 over 95, patient mentions blur vision."
        : "রোগীর নাম মোরজিনা বেগম, বয়স ৩৪ বছর। তার মাথায় তীব্র ব্যথা রয়েছে সাথে রক্তচাপ ১৪৫ বাই ৯৫ এবং চোখে ঝাপসা দেখার উপসর্গ।"
    );

    setTimeout(() => {
      setIsTranscribing(false);
      setScribeNotes(
        lang === 'en' 
          ? "Scribe Summary: Gestational maternal Morzina Begum displays elevated arterial BP (145/95 mmHg) accompanied by pre-eclampsia prodromal signs (cerebral headache, visual blurring). Clinical escalation to nearest NGO healthcare hub suggested."
          : "স্ক্রাইব সারাংশ: রোগী মোরজিনা বেগম গর্ভকালীন উচ্চ রক্তচাপে (১৪৫/৯৫) ভুগছেন। তীব্র মাথা ব্যথা ও চোখে ঝাপসা দেখা এক্লাম্পসিয়া সিগন্যাল নির্দেশ করে। দ্রুত বিশেষজ্ঞ চিকিৎসকের পরামর্শ নিন।"
      );
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left side: intake form and WHO guidelines checklist (7-cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm">
                <ClipboardCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                {t.intakeForm}
              </h3>
              <span className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/20 font-mono">
                {lang === 'en' ? "WHO Diagnostic Compliant" : "হু প্রোটোকল সমর্থিত"}
              </span>
            </div>

            {/* Patient Intake Form */}
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "Full Patient Name" : "রোগীর সম্পূর্ণ নাম"}</label>
                  <input
                    id="worker-patient-name"
                    type="text"
                    required
                    placeholder={lang === 'en' ? "Enter Patient Name" : "রোগীর নাম লিখুন"}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "Biological Gender" : "লিঙ্গ"}</label>
                  <select
                    id="worker-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-white"
                  >
                    <option value="Female">{lang === 'en' ? "Female" : "নারী"}</option>
                    <option value="Male">{lang === 'en' ? "Male" : "পুরুষ"}</option>
                    <option value="Other">{lang === 'en' ? "Other" : "অন্যান্য"}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "Age" : "বয়স"}</label>
                  <input
                    id="worker-age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "BP Systolic" : "সিস্টোলিক রক্তচাপ"}</label>
                  <input
                    id="worker-sys"
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "BP Diastolic" : "ডায়াস্টোলিক রক্তচাপ"}</label>
                  <input
                    id="worker-dia"
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "Hb Level (g/dL)" : "হিমোগ্লোবিন লেভেল"}</label>
                  <input
                    id="worker-hb"
                    type="number"
                    step="0.1"
                    value={hemoglobin}
                    onChange={(e) => setHemoglobin(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {gender === 'Female' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "Maternal Risk Note (If pregnant)" : "পরীক্ষামূলক গর্ভকালীন তথ্য"}</label>
                  <input
                    id="worker-maternal-risk"
                    type="text"
                    value={maternalRisk}
                    onChange={(e) => setMaternalRisk(e.target.value)}
                    placeholder={lang === 'en' ? "e.g., Week 28 healthy, Pre-eclampsia risk" : "যেমন: অ্যানিমিয়া ঝুঁকি বা উঁচ রক্তচাপ"}
                    className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white"
                  />
                </div>
              )}

              <button
                id="worker-submit-btn"
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                {lang === 'en' ? "Save Patient to Offline Sync Cache" : "রোগীর তথ্য সংরক্ষণ করুন"}
              </button>
            </form>
          </div>

          {/* WHO Checklist guidelines */}
          <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-cyan-500" />
              {lang === 'en' ? "Antenatal WHO Diagnostic Protocol Checklist" : "হু (WHO) প্রসবকালীন সুরক্ষার ৪টি প্রধান শর্ত"}
            </h4>
            <div className="space-y-2.5">
              {whoProtocol.map((item, idx) => (
                <div key={item.id} className="p-3 bg-slate-500/5 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-500 text-xs flex items-center justify-center font-bold font-mono">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: Sync Queue status and Voice script (5-cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Synchronizer display */}
          <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500" />
                {lang === 'en' ? "Edge Sync Sync Queue" : "অফলাইন বাফার রেজিস্ট্রি"}
              </h3>
              <button
                id="worker-sync-all-btn"
                onClick={handleCloudSync}
                disabled={isSyncing}
                className="p-1 px-2.5 rounded bg-purple-600 text-[10px] font-bold tracking-wider text-white uppercase hover:bg-purple-500 disabled:opacity-50 flex items-center gap-1 shrink-0"
              >
                {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                {t.syncNow}
              </button>
            </div>

            {/* Offline cached cases list */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800">
                <span>PATIENT RECORD</span>
                <span>STATUS</span>
              </div>
              
              <div className="max-h-52 overflow-y-auto space-y-2.5 pr-1">
                {localRegistry.length === 0 ? (
                  <p className="text-xs text-center text-slate-400 py-4 italic">
                    {lang === 'en' ? "All diagnostic records synced cleanly." : "সকল বাফার সাকসেসফুল সিঙ্কড!"}
                  </p>
                ) : (
                  localRegistry.map((p) => (
                    <div key={p.id} className="p-3 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{p.name} ({p.age}y / {p.gender})</p>
                        <p className="text-[10px] font-mono text-slate-400">BP: {p.bp} | Sugar: {p.bloodSugar}mmol/L</p>
                        {p.maternalRisk && <p className="text-[9px] font-medium text-pink-500">{p.maternalRisk}</p>}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider ${
                        p.status === 'synced' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse'
                      }`}>
                        {p.status === 'synced' ? 'SYNCED' : 'PENDING'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Scribing simulation card */}
          <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-500" />
              {lang === 'en' ? "Clinical Dictation Voice Scribe" : "ভয়েস স্ক্রিপ্ট এবং এআই ট্রান্সক্রাইবার"}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {lang === 'en' 
                ? "Simulate a live microphone voice-scribe processing doctor discussion into structured electronic medical cards (EMRs)."
                : "ডাক্তারের মুখের ডিক্টেশন বিশ্লেষণ করে মেমোরি কার্ডে সেভ করার প্রযুক্তিগত ট্রায়াল নিন।"}
            </p>

            <button
              id="worker-sim-scribe-btn"
              onClick={simulateScribe}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              {lang === 'en' ? "Simulate Clinical Discussion Tape" : "রেকর্ডিং ট্রান্সক্রাইব করুন"}
            </button>

            {recordedScript && (
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10">
                  <p className="text-[10px] font-bold font-mono uppercase text-slate-400 mb-1">
                    {lang === 'en' ? "Captured Auditory Input" : "প্রাপ্ত ভয়েস ইনপুট"}
                  </p>
                  <p className="italic text-slate-700 dark:text-slate-300">{recordedScript}</p>
                </div>
                
                {isTranscribing ? (
                  <div className="flex justify-center py-2">
                    <RefreshCw className="w-5 h-5 text-purple-500 animate-spin" />
                  </div>
                ) : (
                  scribeNotes && (
                    <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                      <p className="text-[10px] font-bold font-mono uppercase text-slate-400 mb-1">
                        {lang === 'en' ? "Structured Diagnostic Log" : "অটো-ফিল্ড ক্লিনিকাল রিপোর্ট"}
                      </p>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-200">{scribeNotes}</p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
