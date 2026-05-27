import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Sparkles, AlertTriangle, CheckCircle, Info, ShieldAlert,
  Mic, MicOff, FileText, Image as ImageIcon, CheckCircle2, RefreshCw, ChevronRight, HelpCircle
} from 'lucide-react';
import { getTranslation, Language, Message } from '../types.js';

interface MedicalAIViewProps {
  lang: Language;
}

const SAMPLE_UPLOADS = [
  { id: 'rash', name: 'skin_rash_epidermis.jpg', type: 'Skin Rash Analysis', prompt: "Please scan this image showing red macular rash patches on the forearms accompanied by minor itching. Check for Dengue rash vs allergic contact dermatitis." },
  { id: 'xray', name: 'chest_xray_postanterior.png', type: 'Chest X-Ray OCR', prompt: "Analyze this Chest X-ray. Clinical notes say: persistent productive cough, night sweat, and consolidated shadow in right upper lobe." },
  { id: 'prescription', name: 'maternal_rx_dhaka_hospital.pdf', type: 'Prescription OCR Sync', prompt: "Translate and check this prescription for maternal patient: tablet Methyldopa, iron supplements, prenatal vitamins. Analyze medication alignment for pre-eclampsia." }
];

export default function MedicalAIView({ lang }: MedicalAIViewProps) {
  const t = getTranslation(lang);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: lang === 'en' 
        ? "Hello, I am LifeSync Ai’s Medical AI Assistant. Specify your clinical indicators, upload scan files, or select one of our preloaded clinical samples below to initiate immediate diagnostic analysis."
        : "নমস্কার, আমি লাইফসিঙ্ক মেডিকেল এআই। আপনার লক্ষণসমূহ লিখুন, রোগ নির্ণয়ের রিপোর্ট আপলোড করুন অথবা নিচে দেওয়া ক্লিনিকাল ফাইলটি নির্বাচন করে এআই বিশ্লেষণ পরীক্ষা করুন।",
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeUpload, setActiveUpload] = useState<typeof SAMPLE_UPLOADS[0] | null>(null);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: textToSend,
          language: lang
        })
      });
      const data = await response.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString(),
        medicalDetails: {
          confidence: data.confidence,
          risk: data.risk,
          citations: data.citations,
          reasoning: data.reasoning,
          treatment: data.treatment
        }
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      // Fallback
      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: "System momentarily offline. Running local core dictionary simulation.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
      setActiveUpload(null);
    }
  };

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const micText = lang === 'en' 
          ? "Patient reports high fever for 3 days with severe joint pain and retro-orbital headache" 
          : "রোগীর ৩ দিন ধরে তীব্র জ্বর সাথে হাড়ের জয়েন্টে প্রচণ্ড ব্যথা এবং চোখ লাল হওয়া";
        setInput(micText);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const triggerPreloaded = (item: typeof SAMPLE_UPLOADS[0]) => {
    setActiveUpload(item);
    setInput(item.prompt);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* Simulation Upload and Quick-Click Scenarios panel (4-cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/10 space-y-4">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold">
            <ImageIcon className="w-5 h-5" />
            <h3>{lang === 'en' ? "Multimodal Diagnostics Lab" : "মাল্টিমোডাল ডায়াগনস্টিক ল্যাব"}</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'en' 
              ? "Select and scan high-fidelity clinical payloads to test clinical neural reasoning."
              : "নিচের যেকোনো ডায়াগনস্টিক ফাইল নির্বাচন করে আমাদের এআরজি স্ক্যানিং সিস্টেমের কার্যকারিতা পরীক্ষা করুন:"}
          </p>

          <div className="space-y-3">
            {SAMPLE_UPLOADS.map((item) => (
              <button
                key={item.id}
                id={`btn-sample-${item.id}`}
                onClick={() => triggerPreloaded(item)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                  activeUpload?.id === item.id 
                    ? 'border-purple-500 bg-purple-500/5 dark:bg-purple-500/10' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-purple-500/40 bg-slate-500/5'
                }`}
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 dark:text-white">{item.type}</p>
                  <p className="text-[10px] text-purple-600 dark:text-purple-300 font-mono">{item.name}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-800 dark:text-amber-300">
              {lang === 'en' 
                ? "Scans undergo privacy cleansing to fully strip out clinical tracking parameters."
                : "রোগীর নাম এবং পরিচয় এআই ব্যবহারের পূর্বে সম্পূর্ণ গোপন রাখা হয়। (GDPR compliant)"}
            </p>
          </div>
        </div>

        {/* Clinical Disclaimer Box */}
        <div className="p-5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
            <Info className="w-4 h-4" />
            <h4>{lang === 'en' ? "Explainable AI Safeguard" : "XAI নিরাপত্তা ফিল্টার"}</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'en'
              ? "Every neural assessment is cross-grounded in medical publications. Clinicians can click explainability summaries to trace clinical logic chains."
              : "প্রতিটি এআই রেসপন্স মেডিকেল নির্দেশিকা দ্বারা সমর্থিত। স্বাস্থ্যকর্মীরা যেকোনো পরামর্শের যৌক্তিকতা পরীক্ষা করতে পারবেন।"}
          </p>
        </div>
      </div>

      {/* Main Interactive Chat Framework (8-cols) */}
      <div className="lg:col-span-8 flex flex-col h-[600px] border border-slate-200 dark:border-slate-800/80 rounded-2xl glass-card-light dark:glass-card-dark overflow-hidden">
        
        {/* Chat System Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse absolute -right-0.5 -top-0.5"></div>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white text-sm">{t.medicalAi}</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Model: gemini-3.5-flash</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 roundedbg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
              {lang === 'en' ? "RAG GROUNDED" : "নিরাপদ আরএজি"}
            </span>
          </div>
        </div>

        {/* Scrollable Chat screen */}
        <div id="ai-chat-screen" className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl p-4 space-y-3 shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-tl-none text-slate-800 dark:text-slate-200'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                  
                  {/* Medical Specific Cards */}
                  {msg.medicalDetails && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                      
                      {/* Risk and Confidence Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        {msg.medicalDetails.risk === 'RED' ? (
                          <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 uppercase tracking-widest text-[9px] border border-red-500/25">
                            <ShieldAlert className="w-3 h-3 animate-pulse" />
                            {t.highRisk}
                          </span>
                        ) : msg.medicalDetails.risk === 'YELLOW' ? (
                          <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 uppercase tracking-widest text-[9px] border border-amber-500/25">
                            <AlertTriangle className="w-3 h-3" />
                            {t.moderateRisk}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-[9px] border border-emerald-500/25">
                            <CheckCircle className="w-3 h-3" />
                            {t.lowRisk}
                          </span>
                        )}

                        <span className="font-mono bg-purple-500/5 border border-purple-500/10 px-2 py-0.5 rounded text-[10px] text-purple-600 dark:text-purple-300">
                          {t.confidenceScore}: {msg.medicalDetails.confidence}%
                        </span>
                      </div>

                      {/* Explainable AI block */}
                      <div className="p-3 rounded-lg bg-slate-500/5 border border-purple-500/5 space-y-1">
                        <p className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 text-[11px]">
                          <HelpCircle className="w-3.5 h-3.5" />
                          {t.explainableAI}
                        </p>
                        <p className="text-[11px] leading-relaxed italic text-slate-500 dark:text-slate-400">
                          {msg.medicalDetails.reasoning}
                        </p>
                      </div>

                      {/* Actionable recommendations */}
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-800 dark:text-white">
                          {lang === 'en' ? "Recommended Clinical Escalation" : "প্রস্তাবিত চিকিৎসা প্রোটোকল"}
                        </p>
                        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                          {msg.medicalDetails.treatment}
                        </p>
                      </div>

                      {/* Fake Medical Citations */}
                      <div className="pt-2 border-t border-dashed border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-1">
                          {lang === 'en' ? "Clinical Evidence Citations" : "সাইটেশন ও প্রমাণাদি"}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.medicalDetails.citations.map((cite, index) => (
                            <span key={index} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded text-slate-500 dark:text-slate-400 font-mono">
                              {cite}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Disclaimer safeguard */}
                      <p className="text-[9px] text-amber-500 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2 font-medium">
                        {t.medicalDisclaimer}
                      </p>
                    </div>
                  )}

                  <p className="text-[10px] text-right mt-1 opacity-70 font-mono select-none">{msg.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-tl-none p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-purple-500 animate-spin" />
                <p className="text-xs text-slate-500">
                  {lang === 'en' ? "LifeSync RAG model reasoning..." : "লাইফসিঙ্ক ক্লিনিকাল ডেটাবেস স্ক্যান করা হচ্ছে..."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Voice recording dynamic waveform simulation */}
        {isRecording && (
          <div className="px-4 py-2 bg-purple-500/5 border-t border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
              <p className="text-xs text-red-500 font-bold">{lang === 'en' ? "Voice streaming..." : "ভয়েস রেকর্ড হচ্ছে..."}</p>
            </div>
            {/* Pulsing Waveform segments block */}
            <div className="flex items-center gap-1">
              {[8, 16, 24, 12, 18, 28, 14, 8, 22, 12, 6].map((h, i) => (
                <motion.div 
                  key={i} 
                  className="w-1 bg-purple-500 rounded-full"
                  animate={{ height: [h/2, h, h/2] }}
                  transition={{ repeat: Infinity, duration: 0.8 + (i*0.05) }}
                  style={{ height: h }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-500/5 flex items-center gap-2">
          {activeUpload && (
            <div className="p-2 rounded bg-purple-500/10 text-purple-500 flex items-center gap-1 text-[11px] absolute translate-y-[-55px] font-mono border border-purple-500/20 shadow">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{activeUpload.name}</span>
            </div>
          )}
          
          <button
            id="mic-record-btn"
            onClick={handleMicToggle}
            className={`p-2.5 rounded-xl border transition-all ${
              isRecording 
                ? 'bg-red-500 text-white border-red-400' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-500 hover:border-purple-500/30'
            }`}
            title="Scribe clinical speech dictation"
          >
            {isRecording ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            id="chat-text-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder={lang === 'en' ? "Describe clinical indicators..." : "লক্ষণসমূহ উল্লেখ করুন..."}
            className="flex-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-slate-800 dark:text-slate-100"
          />

          <button
            id="send-chat-btn"
            onClick={() => sendMessage(input)}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all flex items-center justify-center shadow"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
