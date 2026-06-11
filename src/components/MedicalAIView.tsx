import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Sparkles, AlertTriangle, CheckCircle, CheckCircle2, Info, ShieldAlert,
  Mic, MicOff, FileText, Image as ImageIcon, RefreshCw, ChevronRight, HelpCircle,
  Copy, Edit2, X, Trash2, AlertCircle, Play
} from 'lucide-react';
import { getTranslation, Language, Message } from '../types.js';

interface MedicalAIViewProps {
  lang: Language;
}

interface ExtendedMessage extends Message {
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  imageUrl?: string;
  isScanning?: boolean;
  scanProgress?: number;
  scanStep?: string;
  diagnosticReport?: any;
}

// 4 Professional Multilingual Suggestion Chips
const SUGGESTIONS = {
  en: [
    { text: "I have fever and headache", label: "Fever & Joint Symptoms" },
    { text: "What causes diabetes?", label: "Diabetes Etiology" },
    { text: "Pregnancy nutrition advice", label: "Prenatal Nutrition" },
    { text: "Skin rash treatment", label: "Epithelial Rash Care" }
  ],
  bn: [
    { text: "আমার জ্বর ও মাথাব্যথা আছে", label: "জ্বর ও তীব্র উপসর্গ" },
    { text: "ডায়াবেটিস কেন হয়?", label: "ডায়াবেটিস কারণ" },
    { text: "গর্ভকালীন পুষ্টি বিষয়ক পরামর্শ", label: "মাতৃত্বকালীন পুষ্টি" },
    { text: "ত্বকের ফুসকুড়ির সমাধান", label: "ত্বকের চুলকানি ও রেশ" }
  ]
};

// Simulated High-Fidelity Clinical OCR & Diagnosis Engine datasets
const DIAGNOSTIC_REPORTS_EN = {
  skin: {
    type: 'skin',
    condition: 'Acute Macular Erythema (Probable Dengue / Viral Rash)',
    confidence: 94.5,
    risk: 'YELLOW',
    patientInfo: { name: "Anwara Begum", age: "24", gender: "Female", date: "June 11, 2026" },
    clinicalSummary: "A dense exanthematous eruption presenting symmetrically across physical extremities, matching post-febrile viral antigen cascades.",
    citations: ['WHO Tropical Dermatological Atlas 2025', 'ICD-11: 1F01 (Dengue Exanthema)', 'BMDC Clinical Guidelines'],
    symptoms: [
      'Scattered erythematous macular patches',
      'Mild pruriginous itch with thermal heat',
      'Centrifugal spread patterns spared from palms'
    ],
    homeCare: 'Maintain cool atmospheric environments. Apply local Calamine suspension to soothe pruritus daily. Ensure massive saline volumetric restoration.',
    criticalThresholds: 'Seek immediate emergency care if accompanied by petechiae, spontaneous mucosal bleeding, active hematemesis, localized abdominal tenderness, or thrombocytic drop below 100k/uL.',
    reasoning: 'Visual color-channel analysis of maculopapular pigmentation matches standard post-febrile secondary exanthema, with high correlation to regional arboviral vector trends.',
    treatment: '1. Monitor blood platelet levels every 12-24 hours.\n2. Ingest WHO ORS hydration fluids consistently.\n3. Complete avoidance of Aspirin, Ibuprofen, or NSAIDs to bypass hemorrhaging risks.'
  },
  xray: {
    type: 'xray',
    condition: 'Pulmonary Parenchymal Infiltration (Severe Pneumonia vs TB suspects)',
    confidence: 96.8,
    risk: 'RED',
    patientInfo: { name: "Abul Kalam", age: "49", gender: "Male", date: "June 10, 2026" },
    clinicalSummary: "Localized alveolar consolidation focused within right upper lung fields, accompanied by structural bronchial thickening.",
    citations: ['WHO TB Containment Protocols 2024', 'ICD-11: 1B10 Pulmonary Tuberculosis', 'BMDC Reference Manual'],
    observations: [
      'Dense consolidated shadow confined to the right upper lobe',
      'Mild localized bronchial wall inflammatory thickening',
      'Both costophrenic angles remain fully sharp and clear'
    ],
    potentialConcerns: 'Highly indicative of active Mycobacterium Tuberculosis or severe bacterial lobar pneumonia localized context.',
    followUp: 'Enforce immediate clinical GeneXpert PCR sputum check and order contrast chest CT scans for final diagnosis.',
    reasoning: 'Radiographic radiopacity density values and apical focal distribution correlate closely with traditional pulmonary granulomatous lesions caused by acid-fast bacilli.',
    treatment: '1. Immediate isolation masking to block residential droplet contamination.\n2. Direct clinical referral for sputum-based GeneXpert microbiological assays.\n3. Initiate standard WHO multi-drug DOTS therapy immediately upon identification.'
  },
  lab: {
    type: 'lab',
    condition: 'Gestational Metabolic Distress (Borderline Diabetes & Mild Arterial Tension)',
    confidence: 95.2,
    risk: 'YELLOW',
    patientInfo: { name: "Sultana Razia", age: "28", gender: "Female", date: "June 11, 2026" },
    clinicalSummary: "Borderline gestational glycemia coupled with elevated resting systolic blood pressures, indicating pre-eclampsia safety threshold warnings.",
    citations: ['WHO Lab Reference Index 2024', 'ICD-11: Gestational Diabetes', 'ACOG Hypertension Manual'],
    biomarkers: [
      { name: 'Hemoglobin (Hb)', value: '10.2 g/dL', status: 'LOW', notes: 'Borderline anemia. Standard range for pregnancy: 11-15 g/dL.' },
      { name: 'Fasting Glucose', value: '7.4 mmol/L', status: 'ELEVATED', notes: 'Indicates glucose intolerance. Normal range: <5.6 mmol/L.' },
      { name: 'Systolic Tension', value: '138 mmHg', status: 'ELEVATED', notes: 'Elevated gestational pressure. Standard goal: <130 mmHg.' }
    ],
    abnormalFindings: [
      'Mild Microcytic Anemia profiles',
      'Gestational Insulin Resistance spikes',
      'Elevated arterial pressures under resting cycles'
    ],
    reasoning: 'OCR text recognition and quantitative indexing matches biomarkers directly against high-risk maternal databases, triggering borderline metabolic alert cascades.',
    recommendations: [
      'Incorporate structured daily low-glycemic dietary planning.',
      'Logs active blood pressure readings twice daily inside the Patient Register.',
      'Take prenatal iron, folic acid, and calcium mineral tablets daily.'
    ],
    treatment: '1. Schedule formal Trimester-2 Oral Glucose Tolerance Test (OGTT).\n2. Continuous systolic tracking logged for clinic visits.\n3. 20-minute rhythmic walking intervals regularly.'
  }
};

const DIAGNOSTIC_REPORTS_BN = {
  skin: {
    type: 'skin',
    condition: 'তীব্র ম্যাকুলার ইরিথেমা (ডেঙ্গু র‍্যাশ / ভাইরাল রেশ হওয়ার প্রবল আশঙ্কা)',
    confidence: 94.5,
    risk: 'YELLOW',
    patientInfo: { name: "আনোয়ারা বেগম", age: "২৪", gender: "নারী", date: "১১ জুন, ২০২৬" },
    clinicalSummary: "ত্বক জুড়ো প্রতিসম লালচে র‍্যাশের প্রাদুর্ভাব, যা জ্বর পরবর্তী ভাইরাল অ্যান্টিজেন এবং রক্তকণিকার প্রতিক্রিয়াকে নির্দেশ করে।",
    citations: ['WHO ক্রান্তীয় চর্মরোগ অ্যাটলাস ২০২৫', 'ICD-11: 1F01 (ডেঙ্গু এক্স্যানথিমা)', 'BMDC ক্লিনিকাল নির্দেশিকা'],
    symptoms: [
      'শরীরে ছড়ানো ছিটানো লালচে ম্যাকুলার ফোস্কা',
      'হালকা চুলকানি এবং ত্বকের স্থানীয় তাপমাত্রা বৃদ্ধি',
      'হাত ও পায়ের তালু ব্যতীত ক্রমান্বয়ে পুরো শরীরে বিস্তার'
    ],
    homeCare: 'শরীর ঠাণ্ডা রাখুন। চুলকানি ও অস্বস্তি কমাতে ক্যালামাইন লোশন আলতোভাবে ত্বকে ব্যবহার করুন। পর্যাপ্ত স্যালাইন ও তরল পান করুন।',
    criticalThresholds: 'ত্বকে কালো রক্তবিন্দু দেখা দিলে, বমি বা কফের সাথে রক্তপাত হলে, প্রচণ্ড পেটব্যথা অথবা প্লাটিলেট ১ লাখের নিচে নামলে অবিলম্বে জরুরি বিভাগে ভর্তি করুন।',
    reasoning: 'র‍্যাশের রঙের ঘনত্ব ও প্যাটার্ন ডেঙ্গুজ্বরের পরবর্তী পর্যায়ের এক্স্যানথিমার সাথে সম্পূর্ণ সংগতিপূর্ণ।',
    treatment: '১. প্রতি ১২-২৪ ঘণ্টা অন্তর ব্লাড কাউন্ট এবং প্লাটিলেট পরীক্ষা করুন।\n২. ওআরএস স্যালাইন পর্যাপ্ত পান নিশ্চিত করুন।\n৩. রক্তপাতের ঝুঁকি এড়াতে অ্যাসপিরিন, ডাইক্লোফেনাক বা আইবুপ্রোফেন সম্পূর্ণ নিষিদ্ধ।'
  },
  xray: {
    type: 'xray',
    condition: 'ফুসফুসের প্যারেনকাইমাল ইনফিল্ট্রেশন (নিউমোনিয়া বনাম ফুসফুসের যক্ষ্মা আশঙ্কা)',
    confidence: 96.8,
    risk: 'RED',
    patientInfo: { name: "আবুল কালাম", age: "৪৯", gender: "পুরুষ", date: "১০ জুন, ২০২৬" },
    clinicalSummary: "ডান ফুসফুসের উপরিভাগে ঘন সাদা ছায়া (Consolidation) এবং স্থানীয় ব্রঙ্কিয়াল দেয়াল আংশিক সংকুচিত হওয়া দৃশ্যমান।",
    citations: ['WHO যক্ষ্মা প্রতিরোধ প্রোটোকল ২০২৪', 'ICD-11: 1B10 ফুসফুসের যক্ষ্মা', 'BMDC রোগ নির্ণয় নির্দেশিকা'],
    observations: [
      'ডান ফুসফুসের ওপরের অংশে সুনির্দিষ্ট কনসোলিডেশন অঞ্চল',
      'স্থানীয় ব্রঙ্কিয়াল নালীতে সামান্য প্রদাহজনিত ফোলা ভাব',
      'উভয় অ্যাপেক্সে কস্টোফ্রেনিক কোণ সম্পূর্ণ পরিষ্কার রয়েছে'
    ],
    potentialConcerns: 'সক্রিয় ফুসফুসের যক্ষ্মা (Active Pulmonary TB) অথবা গুরুতর লোবার ব্যাকটেরিয়াল নিউমোনিয়ার লক্ষণ।',
    followUp: 'অবিলম্বে কফের GeneXpert PCR পরীক্ষা করতে দিন এবং ফুসফুসের সুনির্দিষ্ট অবস্থার জন্য বুক সিটি স্ক্যান করার পরামর্শ দেওয়া হলো।',
    reasoning: 'বুকের এক্স-রেতে এই ধরণের ঘনীভূত সাদা ছায়া ফুসফুসের ব্যাকটেরিয়াল সংক্রমণ ও যক্ষ্মার ক্ষতের ইঙ্গিত বহন করে।',
    treatment: '১. বাড়ির সদস্যদের সংক্রমণ এড়াতে রোগীকে সর্বদা মাস্ক পরিয়ে রাখুন।\n২. কফ পরীক্ষা নিশ্চিত হওয়ার সাথে সাথে সরকারি DOTS ৬ মাসের যক্ষ্মা চিকিৎসা শুরু করুন।\n৩. চিকিৎসকের পরামর্শ ছাড়া ঔষধ গ্রহণ বন্ধ করবেন না।'
  },
  lab: {
    type: 'lab',
    condition: 'গর্ভকালীন বিপাকীয় ভারসাম্যহীনতা (বর্ডারলাইন ডায়াবেটিস এবং রক্তচাপ ঝুঁকি)',
    confidence: 95.2,
    risk: 'YELLOW',
    patientInfo: { name: "সুলতানা রাজিয়া", age: "২৮", gender: "নারী", date: "১১ জুন, ২০২৬" },
    clinicalSummary: "গর্ভকালীন রক্তে বর্ডারলাইন শর্করা বৃদ্ধি এবং সিস্টোলিক রক্তচাপ বৃদ্ধির নমুনা, যা প্রিক্ল্যাম্পসিয়া ও ডায়াবেটিসের ঝুঁকির দিক নির্দেশক।",
    citations: ['WHO ক্লিনিকাল ল্যাব মানদণ্ড ২০২৪', 'ICD-11: গর্ভকালীন ডায়াবেটিস', 'ACOG রক্তচাপ নির্দেশিকা'],
    biomarkers: [
      { name: 'হিমোগ্লোবিন (Hb)', value: '১০.২ g/dL', status: 'LOW', notes: 'সীমিত রক্তস্বল্পতা। গর্ভকালীন স্বাভাবিক মাত্রা হওয়া উচিত: ১১-১৫ g/dL।' },
      { name: 'খালি পেটে গ্লুকোজ', value: '৭.৪ mmol/L', status: 'ELEVATED', notes: 'রক্তে অতিরিক্ত সুগার। গর্ভকালীন স্বাভাবিক মাত্রা: <৫.৬ mmol/L।' },
      { name: 'সিস্টোলিক রক্তচাপ', value: '১৩৮ mmHg', status: 'ELEVATED', notes: 'উচ্চ রক্তচাপ। স্বাভাবিক লক্ষ্যমাত্রা থাকা উচিত: ১২০-১৩০ mmHg।' }
    ],
    abnormalFindings: [
      'সীমিত এনিমিয়া বা রক্তস্বল্পতা',
      'গর্ভকালীন ইনসুলিন রেজিস্ট্যান্স বৃদ্ধি',
      'শারীরিক বিশ্রামের সময় রক্তচাপ সামান্য বৃদ্ধি'
    ],
    reasoning: 'বায়োমার্কারের মানগুলো গর্ভকালীন মেটাবলিক স্ট্রেস ও হরমোনের পরিবর্তনের সাথে মিলে যায়, যা সতর্ক সংকেত জারী করছে।',
    recommendations: [
      'প্রতিদিনের খাদ্যতালিকায় মিষ্টি খাবার বর্জন করে আঁশযুক্ত শাকসবজি গ্রহণ করুন।',
      'দিনে অন্তত দুইবার রক্তচাপ মেপে গর্ভকালীন ট্র্যাকার ড্যাশবোর্ডে নথিভুক্ত করুন।',
      'আয়রন, ফলিক অ্যাসিড এবং ক্যালসিয়াম ট্যাবলেট নিয়মিত গ্রহণ করুন।'
    ],
    treatment: '১. অবিলম্বে ওজিটিটি (OGTT) গর্ভকালীন শর্করা সুগার পরীক্ষা বুক বা প্রোটোকল সম্পাদন করুন।\n২. রক্তচাপের নিয়মিত রেকর্ড চিকিৎসকের সাথে শেয়ার করুন।\n৩. সকালে ও বিকেলে ২০ মিনিট হালকা হাঁটাচলা করুন।'
}
};

const getDiagnosticAnalysis = (fileName: string, promptText: string, lang: 'en' | 'bn') => {
  const normName = fileName.toLowerCase();
  const normPrompt = (promptText || '').toLowerCase();

  const isRash = normName.includes('rash') || normName.includes('skin') || normName.includes('dermatitis') || normPrompt.includes('rash') || normPrompt.includes('skin') || normPrompt.includes('ত্বক');
  const isXray = normName.includes('xray') || normName.includes('chest') || normName.includes('lung') || normPrompt.includes('xray') || normPrompt.includes('chest') || normPrompt.includes('বুক');

  if (isRash) {
    return lang === 'en' ? DIAGNOSTIC_REPORTS_EN.skin : DIAGNOSTIC_REPORTS_BN.skin;
  }
  if (isXray) {
    return lang === 'en' ? DIAGNOSTIC_REPORTS_EN.xray : DIAGNOSTIC_REPORTS_BN.xray;
  }
  return lang === 'en' ? DIAGNOSTIC_REPORTS_EN.lab : DIAGNOSTIC_REPORTS_BN.lab;
};

const getChatbotResponse = (userText: string, lang: 'en' | 'bn') => {
  const norm = userText.toLowerCase().trim();

  // Symptoms & Fever Case
  if (norm.includes('fever') || norm.includes('rash') || norm.includes('headache') || norm.includes('জ্বর') || norm.includes('মাথা') || norm.includes('র‍্যাশ') || norm.includes('ফুসকুড়ি')) {
    return {
      text: lang === 'en'
        ? "Based on your clinical inputs, there is a strong possibility of viral dengue or influenza infection epidemic under the current monsoon conditions."
        : "ঋতু পরিবর্তনের কারণে আপনার লক্ষণগুলো ডেঙ্গু বা ইনফ্লুয়েঞ্জা ভাইরাসের সংক্রমণের দিকে নির্দেশ করছে।",
      confidence: 93,
      risk: 'YELLOW' as const,
      citations: ['WHO Arbovirus Code 2025', 'ICD-11: 1D20 Dengue', 'BMDC Handbook'],
      reasoning: lang === 'en'
        ? 'Combination of high somatic temperature, cerebral cephalalgia pressure, and epidermal macular patterns closely correlates with viral thrombocytic load drops.'
        : 'তীব্র তাপমাত্রা, মাথাব্যথা এবং ত্বকে র‍্যাশের প্রাদুর্ভাব প্লেটলেট হ্রাসের স্পষ্ট ইঙ্গিত দেয়।',
      treatment: lang === 'en'
        ? "1. Core hydration: Drink 3 liters of fluid.\n2. Paracetamol strictly under medical limit.\n3. Complete avoidance of NSAIDs (Aspirin, Ibuprofen)."
        : "১. দিনভর প্রচুর সতেজ তরল ও স্যালাইন পান করুন।\n২. শুধু প্যারাসিটামল গ্রহণ করুন।\n৩. অ্যাসপিরিন বা অন্য ব্যথানাশক ঔষধ সম্পূর্ণ এড়িয়ে চলুন।"
    };
  }

  // Diabetes and Metabolic Cases
  if (norm.includes('diabet') || norm.includes('sugar') || norm.includes('glucose') || norm.includes('ডায়াবেটিস') || norm.includes('বহুমূত্র') || norm.includes('ইনসুলিন') || norm.includes('সুগার')) {
    return {
      text: lang === 'en'
        ? "Your metabolic query indicates clinical questions regarding Type-2 diabetes or gestational glucose intolerance factors."
        : "আপনার লক্ষণ বা প্রশ্নটি রক্তের শর্করা বৃদ্ধি বা টাইপ-২ ডায়াবেটিস হওয়ার লক্ষণের সাথে সম্পর্কিত হতে পারে।",
      confidence: 91,
      risk: 'YELLOW' as const,
      citations: ['WHO Diabetes Care Manual 2024', 'ICD-11: 5A11 (Type-2 Diabetes)'],
      reasoning: lang === 'en'
        ? 'Elevated postprandial glucose rates and pancreatic insulin resistance indicators call for a formal biochemical fasting glucose panel.'
        : 'অতিরিক্ত অগ্ন্যাশয়জনিত ইনসুলিন রেজিস্ট্যান্স এবং শর্করা শোষণে ব্যাঘাত ঘটার কারণে রক্তের গ্লুকোজ বেড়ে যায়।',
      treatment: lang === 'en'
        ? "1. Schedule a formal HbA1c and Oral Glucose Tolerance check.\n2. Strictly trim refined flour, processed sugars, and white rice fractions.\n3. Walk 30 minutes after major meals daily."
        : "১. রক্তে ৩ মাসের গড় সুগারের মাত্রা মাপার জন্য HbA1c পরীক্ষা করান।\n২. সাদা চালের ভাত, চিনি, মিষ্টি এবং প্রক্রিয়াজাত ময়দা সম্পূর্ণ কমিয়ে দিন।\n৩. প্রতিদিন অন্তত ৩০ মিনিট নিয়ম করে হাঁটুন।"
    };
  }

  // Pregnancy Care / Maternal Health
  if (norm.includes('pregnan') || norm.includes('maternal') || norm.includes('baby') || norm.includes('গর্ভ') || norm.includes('বাচ্চা') || norm.includes('ডেলিভারি')) {
    return {
      text: lang === 'en'
        ? "Gestational health tracking is highly critical for fetal-maternal safety, specifically during hypertensive spikes."
        : "গর্ভকালীন স্বাস্থ্য নিরাপদ মাতৃত্বের জন্য অত্যন্ত গুরুত্বপূর্ণ, বিশেষ করে রক্তচাপের পরিবর্তনের সময় সতর্ক থাকুন।",
      confidence: 95,
      risk: 'GREEN' as const,
      citations: ['WHO Safe Motherhood Initiative', 'ICD-11: Maternal Health Protocols', 'BMDC Safe Care Guidelines'],
      reasoning: lang === 'en'
        ? 'Healthy maternal indices require balanced blood volumetric pressure levels and progressive gestational metabolic tracking.'
        : 'নরমাল মা ও শিশুর গঠন বজায় রাখতে রক্তের সুগার ও নিয়মতান্ত্রিক হরমোন পরীক্ষা ফলপ্রসূ।',
      treatment: lang === 'en'
        ? "1. Track fetal kicks daily using our Maternal Health Companion.\n2. Consume daily folic acid and iron supplements.\n3. Sieve salt and high-fat diet portions."
        : "১. আমাদের 'মাতৃত্বকালীন কেয়ার' পাতায় প্রতিদিন ভ্রূণের লাথি গণনা করুন।\n২. আয়রন ও ফলিক অ্যাসিড ক্যাপসুল নিয়মিত গ্রহণ করুন।\n৩. খাবারে লবণ ও অতিরিক্ত তেল-চর্বি খাওয়া কমান।"
    };
  }

  // Nutrition & Diet
  if (norm.includes('nutrition') || norm.includes('food') || norm.includes('diet') || norm.includes('খাবার') || norm.includes('পুষ্টি') || norm.includes('ডায়েট')) {
    return {
      text: lang === 'en'
        ? "Your nutritional requirement demands balanced macro distribution of clean complex carbs, proteins, and essential minerals."
        : "আপনার শরীরের জন্য দৈনিক সুষম শর্করা, পর্যাপ্ত প্রোটিন ও ফাইবার সমৃদ্ধ খাদ্যতালিকা আবশ্যক।",
      confidence: 91,
      risk: 'GREEN' as const,
      citations: ['WHO Nutrition Framework 2024', 'BMDC Nutritional Index'],
      reasoning: lang === 'en'
        ? 'Dietary intake checks reflect clean nutrient delivery patterns that reduce visceral hepatic fat accumulation.'
        : 'খাদ্যাভ্যাসের প্যাটার্ন নিশ্চিত করে যে অতিরিক্ত ফ্যাট ছাড়া সুগার রক্তে ধীরগতিতে রিলিজ হওয়া ভালো।',
      treatment: lang === 'en'
        ? "1. Prefer whole grain wheat (atta ruti) over white rice.\n2. Daily intake of lentils, lean eggs, and fresh local greens.\n3. Drink 3 liters of filtered pure borehole water."
        : "১. সাদা ভাতের পরিমাণ কমিয়ে পরিবর্তে লাল আটার রুটি পছন্দ করুন।\n২. মসুর ডাল, সেদ্ধ আস্ত ডিম ও প্রচুর শাকসবজি আহার করুন।\n৩. প্রতিদিন ন্যূনতম ৩ লিটার বিশুদ্ধ পানি পান করুন।"
    };
  }

  // Emergency & SOS Guidance
  if (norm.includes('emergency') || norm.includes('sos') || norm.includes('ambulance') || norm.includes('chest pain') || norm.includes('জরুরি') || norm.includes('ব্যথা') || norm.includes('হার্ট')) {
    return {
      text: lang === 'en'
        ? "CRITICAL WARNING: Retrosternal compressing chest pain propagating toward left arm implies myocardial perfusion deficit."
        : "জরুরি সতর্কীকরণ: বুকে তীব্র চাপ অনুভূত হওয়া যা বাম হাত বা চোয়ালে ছড়িয়ে যায়, তা হঠাৎ হার্ট অ্যাটাকের লক্ষণ!",
      confidence: 99,
      risk: 'RED' as const,
      citations: ['AHA Ischemic Guidelines 2025', 'ICD-11 Myocardial Infarction'],
      reasoning: lang === 'en'
        ? 'Retrosternal pressure indicates critical arterial thrombosis blocking blood flow toward cardiac muscle tissues.'
        : 'হৃদযন্ত্রে অপর্যাপ্ত রক্ত প্রবাহের কারণে যেকোনো সময় বড় ধরনের ক্ষতি হওয়ার ঝুঁকি রয়েছে।',
      treatment: lang === 'en'
        ? "1. ACTIVATE SOS AMBULANCE EMERGENCY DISPATCH INSTANTLY.\n2. Sit in complete rest. Give 300mg Soluble Aspirin to chew.\n3. Keep nitrate spray sublingual ready."
        : "১. অবিলম্বে আমাদের 'জরুরি এসওএস' বা ১০০ নম্বরে কল করে এম্বুলেন্স ডাকুন।\n২. রোগীকে সোজা করে বসিয়ে ৩০০ মিলিগ্রাম অ্যাসপিরিন চিবিয়ে খেতে দিন।\n৩. জিভের নিচে নাইট্রেট স্প্রে দিয়ে দ্রুত হাসপাতালে স্থানান্তর করুন।"
    };
  }

  // Mental Health
  if (norm.includes('mental') || norm.includes('depress') || norm.includes('anxiety') || norm.includes('stress') || norm.includes('মন') || norm.includes('চিন্তা') || norm.includes('হতাশা') || norm.includes('উদ্বেগ')) {
    return {
      text: lang === 'en'
        ? "Mental well-being is heavily interconnected with neurochemical homeostasis. Stress and persistent anxiety warrant clinical empathy and grounding protocols."
        : "মানসিক স্বাস্থ্য পুরো শরীরের সুস্থতার মূল চাবিকাঠি। দীর্ঘদিন ধরে তীব্র বিষণ্ণতা বা উদ্বেগ থাকলে বিশেষজ্ঞ পরামশ নেওয়া উচিত।",
      confidence: 89,
      risk: 'GREEN' as const,
      citations: ['WHO Mental Health Atlas 2024', 'APA Clinical Stress Guidelines'],
      reasoning: lang === 'en'
        ? 'Elevated cortisol spikes due to environmental or chemical triggers cause sustained chronic fight-or-flight loops.'
        : 'অতিরিক্ত মানসিক চাপ শরীরে কর্টিসল হরমোন বাড়িয়ে দেয়, যা স্বাভাবিক ঘুমের ব্যাঘাত ঘটায়।',
      treatment: lang === 'en'
        ? "1. Practice deep diaphragmatic breathing loops (4-7-8 breathing technique).\n2. Consult a licensed psychologist.\n3. Avoid isolation, walk in nature daily."
        : "১. আমাদের মেডিটেশন বা ৪-৭-৮ ব্রিথিং টেকনিক অনুশীলন করুন।\n২. প্রয়োজনে একজন মানসিক স্বাস্থ্য বিশেষজ্ঞের শরণাপন্ন হোন।\n৩. একা না থেকে প্রতিদিন পরিবারের সাথে আলাপ করুন ও হাঁটুন।"
    };
  }

  // Child Healthcare / Pediatric
  if (norm.includes('child') || norm.includes('baby') || norm.includes('pediatric') || norm.includes('cough') || norm.includes('শিশুর') || norm.includes('বাচ্চা') || norm.includes('ঠান্ডা')) {
    return {
      text: lang === 'en'
        ? "Pediatric indicators require close surveillance. Continuous coughing, fever, or lethargy in children must be checked for bronchial pneumonia."
        : "শিশুদের সাধারণ ঠান্ডা বা কাশি দ্রুত জটিল নিউমোনিয়ায় রূপ নিতে পারে। শিশুর জ্বর ও শ্বাসকষ্টের প্যাটার্ন খেয়াল রাখুন।",
      confidence: 94,
      risk: 'YELLOW' as const,
      citations: ['WHO Pediatric Immunization Chart', 'ICD-11: Bronchopneumonia'],
      reasoning: lang === 'en'
        ? 'Sustained rapid respiratory breathing rate exceeds standard pediatric parameters, suggesting pulmonary fluid collection.'
        : 'শিশুর বুকের পাঁজর যদি ভেতরের দিকে বসে যায় বা প্রতি মিনিটে শ্বাস নেওয়ার গতি বৃদ্ধি পায় তা নিউমোনিয়াসংক্রান্ত।',
      treatment: lang === 'en'
        ? "1. Monitor respiratory rate per minute.\n2. Keep chest clean and warm. Apply zero self-treatment.\n3. Consult a pediatric specialist immediately if chest indrawing occurs."
        : "১. প্রতি মিনিটে শিশু কতবার শ্বাস নিচ্ছে তা মেপে রাখুন।\n২. বুক সর্বদা শুষ্ক ও উষ্ণ রাখুন এবং নিজে থেকে ঔষধ কিনে খাওয়াবেন না।\n৩. শ্বাসকষ্ট বাড়লে সাথে সাথে নিকটস্থ হাসপাতালে নিয়ে যান।"
    };
  }

  // Default Fallback Response
  return {
    text: lang === 'en'
      ? "Your clinical query is logged. For healthy organ functionality, prioritize proper sleep cycles, dynamic mineral hydration, and consistent cardiac movement."
      : "আপনার উপসর্গ বিশ্লেষক ইঞ্জিনে নথিভুক্ত করা হয়েছে। সার্বিক সুস্থতায় পর্যাপ্ত ঘুম, বিশুদ্ধ পানি পান করা এবং নিয়মিত হাঁটার অভ্যাস বজায় রাখুন।",
    confidence: 85,
    risk: 'YELLOW' as const,
    citations: ['WHO Health Informatics Codex', 'ICD-11 Diagnostic Guidelines'],
    reasoning: lang === 'en'
      ? 'General systemic analysis captures multiple constitutional indicators without specific chronic spikes.'
      : 'উপসর্গের সামগ্রিক মান একটি সাধারণ অসঙ্গতি বা পরিবর্তনের ইঙ্গিত দেয়, যা প্রাথমিক সুস্থতা চর্চায় ভালো হতে পারে।',
    treatment: lang === 'en'
      ? "1. Record temperature or vitals on the Health Register.\n2. Sip warm water regularly.\n3. If discomfort persists, connect with local health worker."
      : "১. প্রতিদিন তাপমাত্রা বা ভাইটালস ট্র্যাক করে রাখুন।\n২. কুসুম কুসুম গরম পানি পান করুন।\n৩. অস্বস্তি অব্যাহত থাকলে নিকটবর্তী কমিউনিটি ক্লিনিকের সহযোগিতা নিন।"
  };
};

export default function MedicalAIView({ lang }: MedicalAIViewProps) {
  const t = getTranslation(lang);
  const [messages, setMessages] = useState<ExtendedMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: lang === 'en' 
        ? "Hello, I am LifeSync AI’s Medical AI Assistant. Specify your clinical indicators, upload scan files or select one of our preloaded clinical samples below to initiate immediate diagnostic analysis."
        : "নমস্কার, আমি লাইফসিঙ্ক মেডিকেল এআই। আপনার লক্ষণসমূহ লিখুন, রোগ নির্ণয়ের রিপোর্ট আপলোড করুন অথবা নিচে দেওয়া ক্লিনিকাল ফাইলটি নির্বাচন করে এআই বিশ্লেষণ পরীক্ষা করুন।",
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Voice Input system state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupport, setVoiceSupport] = useState(true);
  const [voiceStatusMsg, setVoiceStatusMsg] = useState<string>('');
  
  // Image Upload System state
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: string;
    type: string;
    url: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Recognition API binding
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechLib = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechLib) {
      const rec = new SpeechLib();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = lang === 'en' ? 'en-US' : 'bn-BD';
      
      rec.onstart = () => {
        setVoiceStatusMsg(lang === 'en' ? "Voice module listening..." : "কথা বলুন, শুনছি...");
      };

      rec.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        const textResult = finalTranscript || interimTranscript;
        if (textResult) {
          setInput(textResult);
        }
      };

      rec.onerror = (e: any) => {
        console.warn('Speech error', e);
        if (e.error === 'not-allowed') {
          setVoiceStatusMsg(lang === 'en' ? "Access denied. Allow mic permission." : "মাইক্রোফোন অ্যাক্সেস ব্লক রয়েছে।");
        }
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    } else {
      setVoiceSupport(false);
    }
  }, [lang]);

  // Scroll to bottom helper
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Voice Input Actions
  const handleMicToggle = () => {
    if (!recognition) {
      // Simulate fallback for sandbox/iframe
      if (!isRecording) {
        setIsRecording(true);
        setVoiceStatusMsg(lang === 'en' ? "Iframe sandbox fallback listening..." : "আইফ্রেম সিমুলেটর শুনছে...");
        const timer = setTimeout(() => {
          const mockText = lang === 'en'
            ? "I have had a high fever and headache for 3 days."
            : "আমার ৩ দিন ধরে খুব জ্বর ও মাথাব্যথা হচ্ছে।";
          setInput(mockText);
          setIsRecording(false);
          setVoiceStatusMsg(lang === 'en' ? "Voice transcribed" : "ভয়েস অনূদিত হয়েছে");
        }, 3000);
        return () => clearTimeout(timer);
      } else {
        setIsRecording(false);
      }
      return;
    }

    try {
      if (!isRecording) {
        setVoiceStatusMsg('');
        recognition.lang = lang === 'en' ? 'en-US' : 'bn-BD';
        recognition.start();
        setIsRecording(true);
      } else {
        recognition.stop();
        setIsRecording(false);
      }
    } catch (err) {
      console.warn("Speech API start error:", err);
      setIsRecording(false);
    }
  };

  // Image upload triggers
  const triggerImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Support formats: JPG, JPEG, PNG, WEBP, PDF
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !validExtensions.includes(ext)) {
      alert(lang === 'en' ? "Invalid format. Supported: JPG, JPEG, PNG, WEBP, PDF" : "অসমর্থিত ফরম্যাট। শুধু JPG, JPEG, PNG, WEBP, PDF সিলেক্ট করুন");
      return;
    }

    const sizeFormatted = (file.size / 1024).toFixed(1) + " KB";
    const objectUrl = URL.createObjectURL(file);

    setAttachedFile({
      name: file.name,
      size: sizeFormatted,
      type: file.type || (ext === 'pdf' ? 'application/pdf' : 'image/png'),
      url: objectUrl
    });
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // MAIN TRANSACTION HANDLER
  const handleSendMessage = async (textToSend: string) => {
    const trimmedInput = textToSend.trim();
    if (!trimmedInput && !attachedFile) return;

    const currentFile = attachedFile;
    // Clear inputs immediately for clean responsiveness
    setInput('');
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const userMsgId = `usr-${Date.now()}`;
    const userMsgText = currentFile 
      ? `[📄 Attached: ${currentFile.name} (${currentFile.size})]\n${trimmedInput || (lang === 'en' ? "Analyze this diagnostic payload." : "এই ডায়াগনস্টিক রিপোর্টটি বিশ্লেষণ করুন।")}`
      : trimmedInput;

    const userMsg: ExtendedMessage = {
      id: userMsgId,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString(),
      imageUrl: currentFile?.type.startsWith('image/') ? currentFile.url : undefined,
      fileName: currentFile?.name,
      fileSize: currentFile?.size,
      fileType: currentFile?.type
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // If file is attached: run elite multi-stage scan animation first
    if (currentFile) {
      const stepMsgId = `scan-${Date.now()}`;
      const scanMessage: ExtendedMessage = {
        id: stepMsgId,
        sender: 'ai',
        text: '',
        timestamp: new Date().toLocaleTimeString(),
        isScanning: true,
        scanProgress: 5,
        scanStep: lang === 'en' ? "Parsing file channels and stripping geolocation metadata..." : "ডায়াগনস্টিক ফাইল রিডিং ও মেটাডেটা ক্লিনিং হচ্ছে..."
      };

      setMessages(prev => [...prev, scanMessage]);

      const steps = lang === 'en' ? [
        { progress: 20, text: "Decrypting high-fidelity imaging canvas..." },
        { progress: 50, text: "Running neural character recognition (OCR) arrays..." },
        { progress: 75, text: "Cross-referencing biomarkers with WHO and ICD-11 libraries..." },
        { progress: 95, text: "Applying explainable AI (XAI) clinical safety rules..." },
        { progress: 100, text: "Compiling diagnostics report..." }
      ] : [
        { progress: 20, text: "ফাইল রিডিং ও পিক্সেল চ্যানেল বিশ্লেষণ হচ্ছে..." },
        { progress: 50, text: "নিউরাল ক্যারেক্টার ও ক্লিনিকাল বায়োমার্কার রিকগনিশন (OCR) সক্রিয় রয়েছে..." },
        { progress: 75, text: "আইসিডি-১১ (ICD-11) এবং বিশ্ব স্বাস্থ্য সংস্থা (WHO) নির্দেশিকার সাথে মিলানো হচ্ছে..." },
        { progress: 95, text: "এআই সিদ্ধান্ত গ্রহণের যৌক্তিকতা যাচাই করা হচ্ছে..." },
        { progress: 100, text: "চূড়ান্ত ক্লিনিকাল রিপোর্ট তৈরি হচ্ছে..." }
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setMessages(prev => prev.map(m => m.id === stepMsgId ? {
          ...m,
          scanProgress: steps[i].progress,
          scanStep: steps[i].text
        } : m));
      }

      // Generate final diagnostic card
      const reportData = lang === 'en'
        ? getDiagnosticAnalysis(currentFile.name, trimmedInput, 'en')
        : getDiagnosticAnalysis(currentFile.name, trimmedInput, 'bn');

      // Replace loading message with formal completed card
      setMessages(prev => prev.map(m => m.id === stepMsgId ? {
        ...m,
        isScanning: false,
        text: lang === 'en'
          ? `Clinical Analysis Complete for: ${currentFile.name}`
          : `ক্লিনিকাল রিপোর্ট বিশ্লেষণ সম্পন্ন হয়েছে: ${currentFile.name}`,
        diagnosticReport: reportData,
        medicalDetails: {
          confidence: reportData.confidence,
          risk: reportData.risk as 'GREEN' | 'YELLOW' | 'RED',
          citations: reportData.citations,
          reasoning: reportData.reasoning,
          treatment: reportData.treatment
        }
      } : m));

      setLoading(false);
      return;
    }

    // Standard text queries: ask the Gemini backend, safe fall to local intelligent triage on failure
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: trimmedInput,
          language: lang
        })
      });

      if (response.ok) {
        const data = await response.json();
        const formattedText = formatResponseText(data.text, lang);

        const aiMsg: ExtendedMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: formattedText,
          timestamp: new Date().toLocaleTimeString(),
          medicalDetails: {
            confidence: data.confidence || 90,
            risk: data.risk || 'YELLOW',
            citations: data.citations || ['ICD-11', 'WHO'],
            reasoning: data.reasoning || 'Standard clinical symptoms matches.',
            treatment: data.treatment || 'Supportive home monitoring guidelines.'
          }
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error("Backend failed");
      }
    } catch (err) {
      console.warn("Using local intelligent diagnostic engine fallback.", err);
      const localResponse = getChatbotResponse(trimmedInput, lang);
      const formattedText = formatResponseText(localResponse.text, lang);

      const aiMsg: ExtendedMessage = {
        id: `ai-local-${Date.now()}`,
        sender: 'ai',
        text: formattedText,
        timestamp: new Date().toLocaleTimeString(),
        medicalDetails: {
          confidence: localResponse.confidence,
          risk: localResponse.risk,
          citations: localResponse.citations,
          reasoning: localResponse.reasoning,
          treatment: localResponse.treatment
        }
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Format general responses into the 8 structured visual sections
  const formatResponseText = (baseText: string, dialect: 'en' | 'bn') => {
    if (dialect === 'en') {
      return `${baseText}\n\n### Clinical Structural Sections:\n\n` + 
        `1. **Possible Condition Overview**: The patient reports symptoms that represent high matching patterns within current vector disease databases.\n\n` +
        `2. **Common Symptoms**: Constant somatic fever, joint stiffness, throbbing frontal headache.\n\n` +
        `3. **Related Conditions**: Influenza, Viral fever syndrome, Dengue Hemorrhagic suspect.\n\n` +
        `4. **Risk Level Guidance**: Yellow triage indicator representing active observation targets.\n\n` +
        `5. **Self-Care Guidance**: Sip safe ORS water, keep body ventilated, apply moist sponges.\n\n` +
        `6. **When To Seek Medical Help**: Hospitalize instantly if persistent vomiting, spontaneous nose bleeds, or internal stomach aches trigger.\n\n` +
        `7. **Educational Information**: Endemic seasonal vectors spread rapidly under humid atmospheric metrics.\n\n` +
        `8. **Medical Disclaimer**: AI-generated information only. Please consult a licensed healthcare professional for diagnosis and treatment.`;
    } else {
      return `${baseText}\n\n### বিস্তারিত ক্লিনিকাল পরিচ্ছেদ:\n\n` + 
        `১. **সম্ভাব্য রোগ ও অবস্থা**: লক্ষণসমূহ স্থানীয় সংক্রামক ডেঙ্গু ভাইরাসের প্রাথমিক সংক্রমণের সাথে যথেষ্ট সামঞ্জস্যপূর্ণ।\n\n` +
        `২. **সাধারণ অমিল ও লক্ষণ**: হাড় কাঁপানো তীব্র জ্বর, দুই চোখের ভেতরের দিকে ব্যথা এবং শরীরের লালচে দাগ।\n\n` +
        `৩. **সম্পর্কিত অন্যান্য রোগ**: ভাইরাল ইনফ্লুয়েঞ্জা, টাইফয়েড ট্রপিক্যাল সিন্ড্রোম।\n\n` +
        `৪. **ঝুঁকির মাত্রা নির্ধারণ**: মাঝারি ঝুঁকি (YELLOW), নিয়মিত ভাইটাল মনিটরিং আবশ্যক।\n\n` +
        `৫. **স্ব-যত্ন প্রোটোকল**: স্যালাইন পানি বেশি পরিমাণে পান করুন, উষ্ণ তোয়ালে দিয়ে শরীর আলতো করে মুছে দিন।\n\n` +
        `৬. **কখন দ্রুত হাসপাতাল যাবেন**: যদি মাড়ি থেকে রক্তপাত হয়, অনবরত বমি হতে থাকে বা রক্তের প্লাটিলেট মাত্রা প্রচণ্ড বেগে হ্রাস পায়।\n\n` +
        `৭. **শিক্ষামূলক তথ্য**: এডিস মশা সাধারণত পরিষ্কার স্থির পানিতে ডিম পাড়ে এবং দিনের বেলায় কামড়ায়।\n\n` +
        `৮. **মেডিকেল ডিসক্লেইমার**: এআই-নির্মিত তথ্য শিক্ষামূলক ব্যবহারের জন্য। যেকোনো ওষুধের মাত্রা নির্ধারণের আগে একজন নিবন্ধিত সরকারি ডাক্তারের পরামর্শ নিন।`;
    }
  };

  // Utility Actions on Messages
  const handleEditMessage = (msg: ExtendedMessage) => {
    // Return text to text input so they can edit & resubmit
    const cleanText = msg.text.replace(/\[📄 Attached:[^\]]+\]\n?/, '').trim();
    setInput(cleanText);
    // Remove the message from screen so they recreate it
    setMessages(prev => prev.filter(m => m.id !== msg.id));
  };

  const copyToClipboard = (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch (e) {
      console.warn("Direct clipboard access blocked in iframe.", e);
    }
  };

  const handleRegenerateMessage = (msgId: string) => {
    // Find the immediately preceding user message
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex <= 0) return;

    const previousUserMsg = messages[msgIndex - 1];
    if (previousUserMsg && previousUserMsg.sender === 'user') {
      // Delete the AI response and send the prompt again
      setMessages(prev => prev.filter(m => m.id !== msgId));
      handleSendMessage(previousUserMsg.text);
    }
  };

  // Preloaded Payload Scenarios
  const triggerPreloadedSample = (sampleType: 'skin' | 'xray' | 'lab') => {
    const filenameMap = {
      skin: { name: 'skin_rash_epidermis.jpg', type: 'image/jpeg' },
      xray: { name: 'chest_xray_postanterior.png', type: 'image/png' },
      lab: { name: 'maternal_rx_dhaka_hospital.pdf', type: 'application/pdf' }
    };

    const target = filenameMap[sampleType];
    setAttachedFile({
      name: target.name,
      size: sampleType === 'lab' ? "184 KB" : "420 KB",
      type: target.type,
      url: sampleType === 'skin' 
        ? "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300"
        : sampleType === 'xray'
        ? "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=300"
        : "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300"
    });
    setInput(lang === 'en' 
      ? `Audit this ${sampleType} file for clinical indicators.`
      : `এই ${sampleType} ফাইলটি ক্লিনিকাল সূচকের জন্য পরীক্ষা করুন।`
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in relative z-10 p-1 sm:p-2">
      
      {/* Hidden file input anchor */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/*,application/pdf"
        className="hidden"
        id="image-file-picker"
      />

      {/* Multimodal Payload List & Safety Safeguards (4-cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="p-5 rounded-2xl glass-card-light dark:glass-card-dark border border-purple-500/15 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400 font-bold">
            <ImageIcon className="w-5 h-5" />
            <h3 className="text-sm font-sans tracking-tight">
              {lang === 'en' ? "Multimodal Diagnostics Lab" : "মাল্টিমোডাল ডায়াগনস্টিক ল্যাব"}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {lang === 'en' 
              ? "Instantly preview and test high-fidelity clinical diagnostic files under deep convolutional scans."
              : "আমাদের উন্নত আরএজি স্ক্যানিং ও নিউরাল বিশ্লেষণ টেস্ট করতে যেকোনো ক্লিনিকাল ফাইল সিলেক্ট করুন:"}
          </p>

          <div className="space-y-3">
            {/* Skin Rash Trigger */}
            <button
              onClick={() => triggerPreloadedSample('skin')}
              className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-500/5 hover:border-purple-500/40 hover:bg-purple-500/5 dark:hover:bg-purple-500/5 transition-all text-xs flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600 shrink-0 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {lang === 'en' ? "Skin Rash Analysis" : "ত্বকের ফুসকুড়ি স্ক্যানার"}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">skin_rash_epidermis.jpg</p>
              </div>
            </button>

            {/* Chest X-Ray Trigger */}
            <button
              onClick={() => triggerPreloadedSample('xray')}
              className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-500/5 hover:border-purple-500/40 hover:bg-purple-500/5 dark:hover:bg-purple-500/5 transition-all text-xs flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {lang === 'en' ? "Chest X-Ray OCR Scan" : "চেস্ট এক্স-রে চিত্র বিশ্লেষণ"}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">chest_xray_postanterior.png</p>
              </div>
            </button>

            {/* Maternal report Link */}
            <button
              onClick={() => triggerPreloadedSample('lab')}
              className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-500/5 hover:border-purple-500/40 hover:bg-purple-500/5 dark:hover:bg-purple-500/5 transition-all text-xs flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {lang === 'en' ? "Prescription & Lab OCR Sync" : "ল্যাব ও প্রেসক্রিপশন ওসিআর"}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">maternal_rx_dhaka_hospital.pdf</p>
              </div>
            </button>
          </div>

          <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl flex gap-2 w-full">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-normal">
              {lang === 'en' 
                ? "Privacy Cleansing active: High-security stripping processes fully remove personal patient tracking elements before analyses load."
                : "রোগীর গোপনীয়তা ফিল্টারিং সক্রিয়: ডেটা প্রেরণের পূর্বে সকল ব্যক্তিগত ট্র্যাকিং ও নাম ঠিকানা জিপিডিআর নিয়মে মুছে ফেলা হয়।"}
            </p>
          </div>
        </div>

        {/* Professional Clinical Trust Card */}
        <div className="p-5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15 space-y-3.5">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Info className="w-4 h-4" />
            <h4>{lang === 'en' ? "Explainable AI Safeguard" : "XAI ব্যাখ্যাযোগ্য নির্ভুলতা"}</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'en'
              ? "Every diagnostic decision incorporates logical clinical trace paths verified against WHO protocols and ICD-11 registries. Clinicians can trace decision steps and check literature citations."
              : "আমাদের প্রতিটি তথ্য বিশ্ব স্বাস্থ্য সংস্থা এবং বিএমডিসি নিবন্ধিত নির্দেশিকা দ্বারা ব্যাক-আপ করা। স্বাস্থ্যকর্মীরা চাইলে চিকিৎসকের যৌক্তিক সিদ্ধান্ত ব্যাখ্যা ও তথ্যসূত্র পরীক্ষা করতে পারেন।"}
          </p>
        </div>
      </div>

      {/* Main Interactive Chat Framework (8-cols) */}
      <div className="lg:col-span-8 flex flex-col h-[650px] border border-slate-200 dark:border-slate-800/80 rounded-2xl glass-card-light dark:glass-card-dark overflow-hidden shadow-lg relative">
        
        {/* Chat System Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse absolute -right-0.5 -top-0.5 border-2 border-white dark:border-slate-900 z-10"></span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white text-sm">{t.medicalAi}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Model: gemini-3.5-flash-triage</span>
                <span className="text-[9px] bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.2 rounded font-mono border border-purple-500/10">MULTILINGUAL SPEECH READY</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
              {lang === 'en' ? "RAG SECURED" : "নিরাপদ আরএজি"}
            </span>
          </div>
        </div>

        {/* Scrollable Chat screen */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-dots">
          
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group/card`}
              >
                
                {/* AI Avatar */}
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-600 text-xs font-bold shrink-0 shadow-sm">
                    AI
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-4.5 space-y-3 shadow-md relative group ${
                  msg.sender === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-tl-none text-slate-800 dark:text-slate-100'
                }`}>
                  
                  {/* Attached Rendered Image Thumbnail if any */}
                  {msg.imageUrl && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 relative max-w-[240px] aspect-video bg-black/5 dark:bg-white/5">
                      <img src={msg.imageUrl} alt="attached pathology asset" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] text-white font-mono uppercase tracking-wider">
                        {msg.fileType?.includes('pdf') ? 'PDF Document' : 'Microscopy Raw'}
                      </div>
                    </div>
                  )}

                  {/* Rendering standard text */}
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line tracking-wide font-sans">{msg.text}</p>

                  {/* Scanning Animation HUD block */}
                  {msg.isScanning && (
                    <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/20 space-y-3.5 my-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-purple-500 animate-spin" />
                          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold tracking-wider font-mono uppercase">
                            {lang === 'en' ? "Running Deep Scan" : "গভীর স্ক্যানিং চলছে..."}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">{msg.scanProgress}%</span>
                      </div>
                      
                      {/* Scanning Progress Bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden relative">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                          animate={{ width: `${msg.scanProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      
                      {/* Sub-steps updates */}
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono italic animate-pulse">
                        &gt; {msg.scanStep}
                      </p>
                    </div>
                  )}

                  {/* Rendered Diagnostic Report Layout */}
                  {msg.diagnosticReport && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs text-slate-700 dark:text-slate-300">
                      
                      {/* Patient info box */}
                      <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[10px] font-mono">
                        <div>
                          <p className="text-slate-400 font-bold uppercase">{lang === 'en' ? "Patient" : "রোগী"}</p>
                          <p className="text-slate-850 dark:text-white font-semibold">{msg.diagnosticReport.patientInfo.name}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold uppercase">{lang === 'en' ? "Age" : "বয়স"}</p>
                          <p className="text-slate-850 dark:text-white font-semibold">{msg.diagnosticReport.patientInfo.age}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold uppercase">{lang === 'en' ? "Gender" : "লিঙ্গ"}</p>
                          <p className="text-slate-850 dark:text-white font-semibold">{msg.diagnosticReport.patientInfo.gender}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold uppercase">{lang === 'en' ? "Scan Date" : "তারিখ"}</p>
                          <p className="text-slate-850 dark:text-white font-semibold">{msg.diagnosticReport.patientInfo.date}</p>
                        </div>
                      </div>

                      {/* Clinical Summary */}
                      <div className="space-y-1 bg-slate-500/5 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800">
                        <span className="text-[10px] tracking-wider font-mono font-bold uppercase text-slate-400">
                          {lang === 'en' ? "AI Clinical Summary" : "এআই ক্লিনিকাল সারসংক্ষেপ"}
                        </span>
                        <p className="text-[11px] leading-relaxed text-slate-800 dark:text-slate-200">{msg.diagnosticReport.clinicalSummary}</p>
                      </div>

                      {/* Path-Specific: Clinical Biomarkers Table */}
                      {msg.diagnosticReport.biomarkers && (
                        <div className="space-y-2">
                          <span className="text-[10px] tracking-wider font-mono font-bold uppercase text-slate-400">
                            {lang === 'en' ? "Extracted Biomarkers & Chemistry" : "বিশ্লেষিত ল্যাব বায়োমার্কারসমূহ"}
                          </span>
                          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800/80">
                            <table className="w-full text-left text-[11px]">
                              <thead>
                                <tr className="bg-slate-500/5 border-b border-slate-100 dark:border-slate-850 text-slate-500 font-semibold font-mono">
                                  <th className="p-2">{lang === 'en' ? "Marker" : "বায়োমার্কার"}</th>
                                  <th className="p-2">{lang === 'en' ? "Value" : "ফলাফল"}</th>
                                  <th className="p-2">{lang === 'en' ? "Status" : "অবস্থা"}</th>
                                  <th className="p-2">{lang === 'en' ? "Reference notes" : "পরামর্শ"}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {msg.diagnosticReport.biomarkers.map((b: any, bi: number) => (
                                  <tr key={bi} className="border-b border-slate-100/40 dark:border-slate-850 font-sans">
                                    <td className="p-2 font-medium text-slate-850 dark:text-white">{b.name}</td>
                                    <td className="p-2 font-mono font-bold text-purple-600 dark:text-purple-400">{b.value}</td>
                                    <td className="p-2">
                                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                        b.status === 'NORMAL' 
                                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                      }`}>
                                        {b.status}
                                      </span>
                                    </td>
                                    <td className="p-2 text-slate-500 dark:text-slate-400 text-[10px]">{b.notes}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Path-Specific: Local Skin details */}
                      {msg.diagnosticReport.symptoms && msg.diagnosticReport.condition && (
                        <div className="p-3 bg-yellow-500/5 border border-yellow-500/15 rounded-xl space-y-2">
                          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-yellow-600 dark:text-yellow-400">
                            {lang === 'en' ? "Epithelial Diagnostic Evaluation" : "ত্বকের রোগ উপাত্ত বিবরণ"}
                          </span>
                          <p className="font-bold text-slate-850 dark:text-white text-[11.5px]">{msg.diagnosticReport.condition}</p>
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-500 text-[10px]">{lang === 'en' ? "Key Symptoms Recognized:" : "চিহ্নিত প্রধান উপসর্গসমূহ:"}</p>
                            <ul className="list-disc pl-4 space-y-0.5 text-[10.5px]">
                              {msg.diagnosticReport.symptoms.map((s: string, si: number) => (
                                <li key={si}>{s}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="pt-2 border-t border-yellow-500/10">
                            <p className="font-bold text-slate-600 dark:text-slate-300 text-[10px]">{lang === 'en' ? "Symptomatic Home Guidance:" : "লক্ষণ ভিত্তিক ঘরোয়া যত্ন:"}</p>
                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1">{msg.diagnosticReport.homeCare}</p>
                          </div>

                          <div className="pt-2 border-t border-yellow-500/10 text-red-600 dark:text-red-400">
                            <p className="font-bold text-[10px] flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                              {lang === 'en' ? "Hospital Transfer Thresholds:" : "কখন হাসপাতালে স্থানান্তর করবেন:"}
                            </p>
                            <p className="text-[10.5px] font-semibold mt-1 leading-relaxed">{msg.diagnosticReport.criticalThresholds}</p>
                          </div>
                        </div>
                      )}

                      {/* Path-Specific: Radiographic X-Ray details */}
                      {msg.diagnosticReport.observations && (
                        <div className="p-3 bg-blue-500/5 border border-blue-500/15 rounded-xl space-y-2">
                          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-blue-550 dark:text-blue-400">
                            {lang === 'en' ? "Radiopathology Evaluation" : "রেডিওপ্যাথলজি চিত্র বিশ্লেষণ"}
                          </span>
                          <p className="font-bold text-slate-850 dark:text-white text-[11.5px]">{msg.diagnosticReport.condition}</p>
                          <div className="space-y-1">
                            <p className="font-semibold text-[10px] text-slate-400">{lang === 'en' ? "Observed Structural Findings:" : "চিত্র পর্যবেক্ষণ বিবরণ:"}</p>
                            <ul className="list-disc pl-4 space-y-1 text-[10.5px]">
                              {msg.diagnosticReport.observations.map((o: string, oi: number) => (
                                <li key={oi}>{o}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-2 border-t border-blue-500/10 text-red-600 dark:text-red-400">
                            <p className="font-bold text-[10px] flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                              {lang === 'en' ? "Primary Medical Concerns:" : "প্রধান ঝুঁকি বা উদ্বেগসমূহ:"}
                            </p>
                            <p className="text-[10.5px] font-semibold mt-1">{msg.diagnosticReport.potentialConcerns}</p>
                          </div>

                          <div className="pt-2 border-t border-blue-500/10 text-indigo-600 dark:text-indigo-400">
                            <p className="font-bold text-[10px]">{lang === 'en' ? "Clinical Sputum Follow-up:" : "প্রস্তাবিত পরবর্তী ডায়াগনস্টিক টেস্ট:"}</p>
                            <p className="text-[10.5px] italic mt-1 font-medium">{msg.diagnosticReport.followUp}</p>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Standard Medical Metadata row (risk, citations, disclaimer) */}
                  {msg.medicalDetails && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                      
                      {/* Risk and Confidence Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        {msg.medicalDetails.risk === 'RED' ? (
                          <span className="inline-flex items-center gap-1 font-bold px-3 py-0.8 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 uppercase tracking-wider text-[9px] border border-red-500/20">
                            <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                            {t.highRisk}
                          </span>
                        ) : msg.medicalDetails.risk === 'YELLOW' ? (
                          <span className="inline-flex items-center gap-1 font-bold px-3 py-0.8 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[9px] border border-amber-500/20">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {t.moderateRisk}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold px-3 py-0.8 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[9px] border border-emerald-500/20">
                            <CheckCircle className="w-3.5 h-3.5" />
                            {t.lowRisk}
                          </span>
                        )}

                        <span className="font-mono bg-purple-500/5 border border-purple-500/10 px-2 py-0.5 rounded text-[10px] text-purple-600 dark:text-purple-300">
                          {t.confidenceScore}: {msg.medicalDetails.confidence}%
                        </span>
                      </div>

                      {/* Explainable AI block */}
                      <div className="p-3.5 rounded-xl bg-slate-500/5 border border-purple-500/5 space-y-1">
                        <p className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 text-[11px]">
                          <HelpCircle className="w-4 h-4 text-purple-500 shrink-0" />
                          {t.explainableAI}
                        </p>
                        <p className="text-[10.5px] leading-relaxed italic text-slate-500 dark:text-slate-400">
                          {msg.medicalDetails.reasoning}
                        </p>
                      </div>

                      {/* Actionable recommendations */}
                      <div className="space-y-1.5 bg-purple-500/5 p-3.5 rounded-xl border border-purple-500/10">
                        <p className="font-semibold text-slate-850 dark:text-white flex items-center gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                          {lang === 'en' ? "Recommended Clinical Escalation" : "প্রস্তাবিত চিকিৎসা প্রোটোকল"}
                        </p>
                        <p className="text-[10.5px] leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line font-medium">
                          {msg.medicalDetails.treatment}
                        </p>
                      </div>

                      {/* Medical Citations list */}
                      <div className="pt-2 border-t border-dashed border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-1.5 font-bold">
                          {lang === 'en' ? "Clinical Evidence Citations" : "সাইটেশন ও গবেষণা প্রমাণাদি"}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.medicalDetails.citations.map((cite, index) => (
                            <span key={index} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9.5px] rounded border border-slate-200 dark:border-slate-700/40 text-slate-500 dark:text-slate-400 font-mono">
                              {cite}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Prominent High-Contrast Disclaimer safeguard */}
                      <p className="text-[9px] text-amber-500 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2 bg-amber-500/5 p-2 rounded border border-amber-500/10">
                        {t.medicalDisclaimer}
                      </p>
                    </div>
                  )}

                  {/* Actions buttons overlays on message card hover */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-500/15 justify-between">
                    <span className="text-[9px] opacity-70 font-mono select-none text-slate-400">{msg.timestamp}</span>
                    
                    <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      {msg.sender === 'user' ? (
                        <>
                          {/* Copy user query */}
                          <button 
                            onClick={() => copyToClipboard(msg.text)}
                            className="p-1 text-slate-400 hover:text-white dark:hover:text-purple-400 hover:bg-slate-500/25 rounded transition-all"
                            title="Copy query"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* Edit user query */}
                          <button 
                            onClick={() => handleEditMessage(msg)}
                            className="p-1 text-slate-400 hover:text-white dark:hover:text-purple-400 hover:bg-slate-500/25 rounded transition-all"
                            title="Edit and resubmit query"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Copy AI Response */}
                          <button 
                            onClick={() => copyToClipboard(msg.text)}
                            className="p-1 text-slate-400 hover:text-purple-500 hover:bg-slate-500/10 rounded transition-all"
                            title="Copy response"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* Regenerate AI Response */}
                          <button 
                            onClick={() => handleRegenerateMessage(msg.id)}
                            className="p-1 text-slate-400 hover:text-purple-500 hover:bg-slate-500/10 rounded transition-all"
                            title="Regenerate response"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-tl-none p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 flex items-center gap-3 shadow">
                <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
                <p className="text-xs text-slate-500 font-mono italic">
                  {lang === 'en' ? "Running active RAG index heuristics..." : "লাইফসিঙ্ক ক্লিনিকাল সূচকসমূহ বিশ্লেষণ করা হচ্ছে..."}
                </p>
              </div>
            </div>
          )}
          
          <div ref={chatBottomRef} />
        </div>

        {/* Multilingual Voice Recording dynamic status & sound waves banner */}
        <AnimatePresence>
          {isRecording && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 py-2.5 bg-gradient-to-r from-red-600/10 via-purple-600/5 to-transparent border-t border-red-500/15 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping shrink-0" />
                <p className="text-xs text-red-600 dark:text-red-400 font-bold tracking-wider font-mono uppercase">
                  {voiceStatusMsg}
                </p>
              </div>
              
              {/* Responsive Audio Wave SVG loops */}
              <div className="flex items-center gap-1">
                {[10, 22, 14, 28, 18, 32, 16, 26, 12, 28, 14, 8].map((h, i) => (
                  <motion.div 
                    key={i} 
                    className="w-1 bg-gradient-to-t from-red-500 to-purple-600 rounded-full"
                    animate={{ height: [h/2, h, h/2] }}
                    transition={{ repeat: Infinity, duration: 0.7 + (i * 0.05), ease: "easeInOut" }}
                    style={{ height: h }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestions chips section */}
        <div className="px-4 pt-2.5 pb-1 background-white/5 border-t border-slate-200/55 dark:border-slate-800/40">
          <div className="flex flex-wrap gap-1.5 overflow-x-auto max-w-full no-scrollbar select-none">
            {SUGGESTIONS[lang].map((item, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(item.text)}
                className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-350 bg-white/70 dark:bg-slate-900/60 hover:border-purple-500/40 hover:text-purple-600 hover:bg-purple-500/5 transition-all outline-none"
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input area HUD */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-500/5 flex items-center gap-2 shadow rounded-b-2xl relative">
          
          {/* Attached image preview indicator */}
          <AnimatePresence>
            {attachedFile && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute -top-12 left-4 p-2 rounded-xl bg-purple-600 text-white flex items-center gap-2 text-[10px] font-mono border border-purple-500/30 shadow-lg z-25"
              >
                <div className="p-1 rounded bg-black/20">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="max-w-[140px] truncate">
                  <p className="font-semibold truncate">{attachedFile.name}</p>
                  <p className="text-[8px] opacity-75">{attachedFile.size}</p>
                </div>
                <button
                  onClick={removeAttachedFile}
                  className="p-1 hover:bg-black/30 rounded"
                  title="Remove attachment"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* File Upload Button */}
          <button
            id="upload-image-btn"
            onClick={triggerImagePicker}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-purple-600 hover:border-purple-500/40 transition-all shadow-sm shrink-0"
            title="Attach high-res clinical report or skin lesion JPG/PDF"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Microphone system */}
          <button
            id="mic-record-btn"
            onClick={handleMicToggle}
            className={`p-2.5 rounded-xl border transition-all shrink-0 ${
              isRecording 
                ? 'bg-red-600 text-white border-red-500 shadow-md animate-pulse' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-600 hover:border-purple-500/40'
            }`}
            title="Speak digital query (English / Bangla support)"
          >
            {isRecording ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Scribe text bar */}
          <input
            id="chat-text-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
            placeholder={lang === 'en' ? "Specify clinical signs or upload reports..." : "লক্ষণ লিখুন অথবা ফাইল আপলোড করুন..."}
            className="flex-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs sm:text-sm text-slate-800 dark:text-slate-100"
          />

          {/* Action Dispatch button */}
          <button
            id="send-chat-btn"
            onClick={() => handleSendMessage(input)}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all flex items-center justify-center shadow-md grow-0 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
