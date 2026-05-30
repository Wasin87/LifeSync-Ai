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
  const [village, setVillage] = useState('Dharmapur');
  const [symptoms, setSymptoms] = useState('Headache, blurry vision');
  const [priority, setPriority] = useState('High');
  const [age, setAge] = useState('32');
  const [gender, setGender] = useState('Female');
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [sugar, setSugar] = useState('6.1');
  const [hemoglobin, setHemoglobin] = useState('11.8');
  const [maternalRisk, setMaternalRisk] = useState('Healthy prenatal');

  // Extended Local Registry Type
  interface ExtendedPatientRecord extends PatientRecord {
    village?: string;
    symptoms?: string;
    priority?: string;
    timestamp?: string;
  }

  // Syncing states
  const [localRegistry, setLocalRegistry] = useState<ExtendedPatientRecord[]>([
    { 
      id: "PAT-OFF-1", 
      name: "Morzina Begum", 
      age: 34, 
      gender: "Female", 
      bp: "145/95", 
      bloodSugar: "8.2", 
      hemoglobin: 10.1, 
      weight: 58, 
      height: 150, 
      maternalRisk: "Pre-eclampsia Risk", 
      village: "Sonapur",
      symptoms: "Severe headache, blurry vision",
      priority: "High",
      timestamp: "10:24 AM",
      status: "pending" 
    }
  ]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStage, setSyncStage] = useState('');
  const [lastSync, setLastSync] = useState('Never');
  const [cloudSyncedCount, setCloudSyncedCount] = useState(3); // Initial DB records length

  // Voice scribe state
  const [scribeInput, setScribeInput] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [scribeNotes, setScribeNotes] = useState<any>(null);

  const whoProtocol = [
    { id: 'bp', label: lang === 'en' ? "Screening for high arterial pressure (Hypertension/Pre-eclampsia)" : "রক্তচাপ পরিমাপ (উচ্চ রক্তচাপ ও এক্লাম্পসিয়া প্রতিরোধ)" },
    { id: 'hb', label: lang === 'en' ? "Micro-cuvette Hemoglobin blood assessment (Severe Anemia monitoring)" : "রক্তস্বল্পতা পরীক্ষা (হিমোগ্লোবিনের মাত্রা নিরূপণ)" },
    { id: 'urine', label: lang === 'en' ? "Urine strip leukocyte & protein screening (Preeclampsia & UTIs check)" : "প্রস্রাবে প্রোটিন ও ব্যাকটেরিয়াল গ্লুকোজ লেভেল পরীক্ষণ" },
    { id: 'fetal', label: lang === 'en' ? "Gestational Doppler fetal heart rate audio assessment" : "ডপলার সঙ্কেত পরীক্ষা (গর্ভস্থ শিশুর হৃদস্পন্দন নিরূপণ)" }
  ];

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newRecord: ExtendedPatientRecord = {
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
      village,
      symptoms,
      priority,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      status: 'pending'
    };

    setLocalRegistry(prev => [newRecord, ...prev]);
    setPatientName('');
    setSymptoms('');
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncStage(lang === 'en' ? 'Authenticating with edge node...' : 'এজ নোড যাচাই করা হচ্ছে...');
    
    // Simulate API delay transmission
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setSyncProgress(progress);
      if (progress === 40) setSyncStage(lang === 'en' ? 'Compressing patient payload...' : 'পেলোড কমপ্রেস করা হচ্ছে...');
      if (progress === 60) setSyncStage(lang === 'en' ? 'Transmitting via low-bandwidth connection...' : 'লো-ব্যান্ডউইথ সংযোগে ট্রান্সফার হচ্ছে...');
      if (progress === 80) setSyncStage(lang === 'en' ? 'Confirming FHIR database write...' : 'ডেটাবেইসে সেভ নিশ্চিত করা হচ্ছে...');
      
      if (progress >= 100) {
        clearInterval(interval);
        setLocalRegistry(prev => prev.map(p => ({ ...p, status: 'synced' })));
        setCloudSyncedCount(prev => prev + localRegistry.filter(p => p.status === 'pending').length);
        setLastSync(new Date().toLocaleTimeString());
        setIsSyncing(false);
      }
    }, 600);
  };

  const processDictation = () => {
    if (!scribeInput) return;
    setIsTranscribing(true);

    setTimeout(() => {
      setIsTranscribing(false);
      setScribeNotes({
        soap: {
          subjective: lang === 'en' ? "Patient reports severe symptoms matching the dictated input." : "রোগীর উল্লেখিত উপসর্গ অনুযায়ী তীব্র সমস্যা প্রতীয়মান হচ্ছে।",
          objective: lang === 'en' ? "Vitals pending validation. Patient appears distressed in recording." : "প্রাথমিক ভাইটালস যাচাই করা প্রয়োজন। রোগী রেকর্ডিংয়ে ব্যথাতুর।",
          assessment: lang === 'en' ? "Suspected acute condition requiring immediate physician review." : "সম্ভাব্য জটিল অবস্থা যা চিকিৎসকের পর্যালোচনা দাবি করে।",
          plan: lang === 'en' ? "1. Triage to ICU\n2. Order comprehensive metabolic panel" : "১. আইসিইউতে স্থানান্তর\n২. মেটাবলিক প্যানেল পরীক্ষা"
        },
        triagePriority: scribeInput.toLowerCase().includes('emergency') || scribeInput.toLowerCase().includes('severe') ? 'RED (Emergency)' : 'YELLOW (Urgent)',
        clinicalTerms: [
          { term: lang === 'en' ? 'Hypertension' : 'উচ্চ রক্তচাপ', confidence: 95 },
          { term: lang === 'en' ? 'Pre-eclampsia' : 'এক্লাম্পসিয়া', confidence: 88 }
        ]
      });
    }, 2000);
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
                  <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "Village / Area" : "গ্রাম / এলাকা"}</label>
                  <input
                    id="worker-village"
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "Clinical Priority" : "অগ্রাধিকার"}</label>
                  <select
                    id="worker-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-white"
                  >
                    <option value="High">{lang === 'en' ? "High" : "উচ্চ"}</option>
                    <option value="Medium">{lang === 'en' ? "Medium" : "মাঝারি"}</option>
                    <option value="Low">{lang === 'en' ? "Low" : "নিম্ন"}</option>
                  </select>
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

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                  <label className="text-[11px] font-semibold text-slate-500">{lang === 'en' ? "Chief Symptoms" : "প্রধান উপসর্গ"}</label>
                  <input
                    id="worker-symptoms"
                    type="text"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
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
              <div className="flex items-center gap-4">
                 <div className="text-[10px] font-mono text-slate-500 text-right">
                   <div>Pending: <span className="font-bold text-amber-500">{localRegistry.filter(p => p.status === 'pending').length}</span></div>
                   <div>Last sync: <span className="text-slate-400">{lastSync}</span></div>
                 </div>
                 <button
                   id="worker-sync-all-btn"
                   onClick={handleCloudSync}
                   disabled={isSyncing || localRegistry.filter(p => p.status === 'pending').length === 0}
                   className="p-1.5 px-3 rounded-lg bg-purple-600 text-[11px] font-bold tracking-wider text-white uppercase hover:bg-purple-500 disabled:opacity-50 flex items-center gap-1.5 shrink-0 transition-all"
                 >
                   {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                   {t.syncNow}
                 </button>
              </div>
            </div>

            {/* Offline cached cases list */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800">
                <span>CLINICAL DATABASE TABLE</span>
                <span>STATUS</span>
              </div>
              
              {isSyncing && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-bold font-mono text-purple-600 dark:text-purple-400">
                    <span>{syncStage}</span>
                    <span>{syncProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${syncProgress}%` }}></div>
                  </div>
                </div>
              )}

              <div className="max-h-52 overflow-y-auto space-y-2.5 pr-1">
                {localRegistry.length === 0 ? (
                  <p className="text-xs text-center text-slate-400 py-4 italic">
                    {lang === 'en' ? "All diagnostic records synced cleanly." : "সকল বাফার সাকসেসফুল সিঙ্কড!"}
                  </p>
                ) : (
                  localRegistry.map((p) => (
                    <div key={p.id} className="p-3 bg-slate-500/5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs transition-opacity hover:bg-slate-500/10">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <p className="font-bold text-slate-800 dark:text-white uppercase">{p.id}</p>
                           <span className={`px-1.5 py-[1px] rounded text-[8px] font-bold uppercase ${p.priority === 'High' ? 'bg-red-500/10 text-red-500' : p.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{p.priority} PRIORITY</span>
                        </div>
                        <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{p.name} <span className="font-normal text-slate-500">· {p.age}y · {p.gender} · {p.village}</span></p>
                        <p className="text-[10px] font-mono text-slate-500 mt-1">Symptoms: {p.symptoms}</p>
                        <p className="text-[10px] font-mono text-slate-400">BP: {p.bp} | Sugar: {p.bloodSugar} | TS: {p.timestamp}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider ml-3 ${
                        p.status === 'synced' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
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

            <div className="bg-slate-500/5 rounded-xl border border-slate-200 dark:border-slate-800 p-2 space-y-2">
               <textarea 
                  value={scribeInput}
                  onChange={(e) => setScribeInput(e.target.value)}
                  placeholder={lang === 'en' ? "Type or narrate clinical observations here..." : "ক্লিনিকাল পর্যবেক্ষণ এখানে লিখুন..."}
                  className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-800 dark:text-white min-h-[60px] resize-none"
               />
               <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-2">
                  <div className="flex gap-2">
                     <button className="p-2 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all">
                        <MessageSquare className="w-4 h-4" />
                     </button>
                  </div>
                  <button
                    onClick={processDictation}
                    disabled={isTranscribing || !scribeInput.trim()}
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isTranscribing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    {lang === 'en' ? "Process EMR" : "রিপোর্ট তৈরি করুন"}
                  </button>
               </div>
            </div>

            {scribeNotes && !isTranscribing && (
              <div className="space-y-4 pt-2">
                 <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/10 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-purple-500/10">
                       <h5 className="font-bold text-slate-800 dark:text-white text-xs">{lang === 'en' ? "AI Clinical Summary Card" : "এআই ক্লিনিকাল সারাংশ"}</h5>
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${scribeNotes.triagePriority.includes('RED') ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>{scribeNotes.triagePriority}</span>
                    </div>
                    
                    <div className="space-y-2 text-[11px]">
                       <div>
                          <strong className="text-purple-600 dark:text-purple-400">Subjective:</strong>
                          <p className="text-slate-600 dark:text-slate-300">{scribeNotes.soap.subjective}</p>
                       </div>
                       <div>
                          <strong className="text-purple-600 dark:text-purple-400">Objective:</strong>
                          <p className="text-slate-600 dark:text-slate-300">{scribeNotes.soap.objective}</p>
                       </div>
                       <div>
                          <strong className="text-purple-600 dark:text-purple-400">Assessment:</strong>
                          <p className="text-slate-600 dark:text-slate-300">{scribeNotes.soap.assessment}</p>
                       </div>
                       <div>
                          <strong className="text-purple-600 dark:text-purple-400">Action Plan & Prescription:</strong>
                          <pre className="text-emerald-600 dark:text-emerald-400 font-mono mt-1 whitespace-pre-wrap leading-relaxed">{scribeNotes.soap.plan}</pre>
                       </div>
                    </div>

                    <div className="pt-2 border-t border-purple-500/10">
                       <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Extracted Medical Terminology</p>
                       <div className="flex gap-2 flex-wrap">
                          {scribeNotes.clinicalTerms.map((t: any, i: number) => (
                             <div key={i} className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px]">
                                <span className="font-medium text-slate-700 dark:text-slate-300">{t.term}</span>
                                <span className="text-emerald-500 font-mono">{t.confidence}%</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
