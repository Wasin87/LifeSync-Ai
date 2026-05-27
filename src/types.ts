export type Theme = 'light' | 'dark';
export type Language = 'en' | 'bn';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  medicalDetails?: {
    confidence: number;
    risk: 'RED' | 'YELLOW' | 'GREEN';
    citations: string[];
    reasoning: string;
    treatment: string;
  };
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  bp: string;
  bloodSugar: string;
  hemoglobin: number;
  weight: number;
  height: number;
  maternalRisk?: string;
  status: 'synced' | 'pending';
}

export interface NutritionPlan {
  dietType: string;
  calories: number;
  macros: { carb: number; protein: number; fat: number };
  meals: string[];
  localFoods: string[];
}

export const BanglaTranslations = {
  // Navigation & Brand
  brandName: "লাইফসিঙ্ক এআই",
  brandSubtitle: "অ্যাক্সেসিবল ও এথিক্যাল এআই কেয়ার",
  home: "হোম",
  medicalAi: "মেডিকেল এআই অ্যাসিস্ট্যান্ট",
  maternalHealth: "মাতৃত্বকালীন কেয়ার",
  healthWorker: "স্বাস্থ্যকর্মী হাব",
  telehealthOffline: "টেলিহেলথ অফলাইন",
  nutritionAi: "নিউট্রিশন এআই",
  riskPrediction: "ঝুঁকি পরিমাপক",
  apiInteroperability: "এফএইচআইআর ইন্টারঅপ",
  judgesDashboard: "বিচারক প্যানেল",
  adminAnalytics: "অ্যাডমিন রিপোর্ট",
  ethicalAi: "নৈতিক এআই কেন্দ্র",
  emergencyAi: "জরুরি এসওএস",
  settings: "সেটিংস",

  // Common UI
  dashboardActive: "সক্রিয় ড্যাশবোর্ড",
  offlineMode: "অoffline মোড",
  onlineMode: "অনলাইন মোড",
  syncNow: "সিঙ্ক করুন",
  emergencyAlert: "জরুরি সতর্কতা!",
  loading: "লোড হচ্ছে...",
  lightMode: "লাইট মোড",
  darkMode: "ডার্ক মোড",
  language: "ভাষা",
  confidenceScore: "এআই কনফিডেন্স স্কোর",
  explainableAI: "ব্যাখ্যাযোগ্য এআই (XAI)",
  medicalDisclaimer: "সতর্কতা: এটি চূড়ান্ত চিকিৎসা পরামর্শ নয়। যেকোনো শারীরিক সমস্যায় চিকিৎসকের পরামর্শ নিন।",
  riskLevel: "ঝুঁকির মাত্রা",
  highRisk: "উচ্চ ঝুঁকি (জরুরি)",
  moderateRisk: "মাঝারি ঝুঁকি (চিকিৎসক দেখান)",
  lowRisk: "স্বল্প ঝুঁকি (স্ব-যত্ন)",

  // Main UI Text
  welcomeBack: "স্বাগতম LifeSync Ai-তে",
  tagline: "গ্রামীণ ও শহরের স্বাস্থ্যসেবা রূপান্তরকারী এআই চালিত অপারেটিং সিস্টেম।",
  heroDescription: "আমাদের উন্নত ও নৈতিক আরএজি পাইপলাইন, দূরবর্তী অফলাইন সিঙ্ক এবং মাতৃস্বাস্থ্য পর্যবেক্ষণ ব্যবস্থা সরাসরি প্রত্যন্ত অঞ্চলে স্বাস্থ্যসেবা পৌঁছে দেয়।",
  exploreFeatures: "ফিচারসমূহ অন্বেষণ করুন",
  systemStatus: "সিস্টেমের অবস্থা",

  // Sections
  pregnantWeek: "গর্ভাবস্থার সপ্তাহ ট্র্যাকার",
  fetalKick: "ভ্রূণের লাথি গণনা",
  intakeForm: "ক্লিনিকাল ইনটেক ফর্ম",
  riskHeatmap: "আঞ্চলিক স্বাস্থ্য ঝুঁকি হিটম্যাপ",
  apiLogs: "এফএইচআইআর এপিআই লগ সমূহ",
  businessModel: "বিজনেস মডেল ও প্রভাব",
  pitchDeck: "বিনিয়োগকারী ও বিচারক পিচ ডেক",
  systemArchitecture: "আমাদের সিস্টেম আর্কিটেকচার",
  privacyConsent: "রোগীর ডেটা সুরক্ষার সম্মতি",
};

export const EnglishTranslations = {
  // Navigation & Brand
  brandName: "LifeSync Ai",
  brandSubtitle: "Accessible & Ethical AI Care",
  home: "Home",
  medicalAi: "Medical AI Assistant",
  maternalHealth: "Maternal Health Companion",
  healthWorker: "Health Worker Hub",
  telehealthOffline: "Telehealth Offline System",
  nutritionAi: "Nutrition AI Engine",
  riskPrediction: "Risk Prediction Engine",
  apiInteroperability: "API Interoperability",
  judgesDashboard: "Judges Dashboard",
  adminAnalytics: "Admin Analytics",
  ethicalAi: "Ethical AI Center",
  emergencyAi: "Emergency SOS AI",
  settings: "Settings",

  // Common UI
  dashboardActive: "Active Dashboard",
  offlineMode: "Offline Mode",
  onlineMode: "Online Mode",
  syncNow: "Sync Now",
  emergencyAlert: "Emergency Alert!",
  loading: "Loading...",
  lightMode: "Light Mode",
  darkMode: "Dark Mode",
  language: "Language",
  confidenceScore: "AI Confidence Score",
  explainableAI: "Explainable AI (XAI)",
  medicalDisclaimer: "Disclaimer: This is simulated medical intelligence and not final medical advice. Always consult a human healthcare professional.",
  riskLevel: "Risk Level",
  highRisk: "High Risk (Emergency)",
  moderateRisk: "Moderate Risk (Consult Doctor)",
  lowRisk: "Low Risk (Self-Care)",

  // Main UI Text
  welcomeBack: "Welcome to LifeSync Ai",
  tagline: "An AI-powered operating system transforming rural & urban healthcare.",
  heroDescription: "Our advanced ethical RAG pipeline, remote offline-first sync engine, and maternal-fetal monitoring protocols directly connect patients with clinical safety safeguards anywhere in the world.",
  exploreFeatures: "Explore Ecosystem",
  systemStatus: "System Status",

  // Sections
  pregnantWeek: "Pregnancy Week Tracker",
  fetalKick: "Fetal Kick Counter",
  intakeForm: "Clinical Intake Form",
  riskHeatmap: "Regional Disease Vitals Heatmap",
  apiLogs: "FHIR API Interaction Logs",
  businessModel: "Business Model & Impact Metrics",
  pitchDeck: "Investor & Judge Pitch Deck",
  systemArchitecture: "System Pipeline Architecture",
  privacyConsent: "Patient Data Consent Safeguards",
};

export function getTranslation(lang: Language) {
  return lang === 'bn' ? BanglaTranslations : EnglishTranslations;
}

export const CLINICAL_CASES = [
  {
    keywords: ['fever', 'headache', 'জ্বর', 'মাথাব্যথা'],
    text: "Clinical reports suggest Dengue and Influenza fever cases are rising. Patient mentions high fever combined with joint ache.",
    medicalDetails: {
      confidence: 94.6,
      risk: "YELLOW" as const,
      citations: ["ICD-11: 1D20 (Dengue)", "WHO Arbovirus Report 2025", "PubMed ID: 3412951"],
      reasoning: "High body temperature combined with retro-orbital pain and thrombocytopenia signs indicates secondary Dengue. Fluid resuscitation must be initiated.",
      treatment: "Frequent oral rehydration, core vitals monitoring, absolute avoidance of NSAIDs (e.g. Ibuprofen/Aspirin) to minimize internal hemorrhaging. Recommend platelets test."
    }
  },
  {
    keywords: ['headache', 'bp', 'pregnancy', 'গর্ভবতী', 'মাথা ব্যথা', 'রক্তচাপ'],
    text: "Patient is pregnant and has extreme headache, blurred vision, and high blood pressure reading of 150/95 mmHg.",
    medicalDetails: {
      confidence: 98.2,
      risk: "RED" as const,
      citations: ["ICD-11: JA60.1 (Pre-eclampsia)", "WHO Maternal Guidelines 2024", "BMDC Pregnancy Protocols"],
      reasoning: "Elevated systolic and diastolic BP in a gestational patient after 20 weeks accompanied by typical cerebral symptom (blurred vision, severe headache) points directly to Pre-eclampsia risk.",
      treatment: "Urgent transfer to tertiary hospital facility. Fast intravenous Magnesium Sulfate therapy protocol to prevent eclampsia seizures. Antihypertensives under clinical supervision."
    }
  },
  {
    keywords: ['cough', 'chest pain', 'কাশি', 'বুকে ব্যথা'],
    text: "Dry coughing spells for 4 weeks accompanied by night sweats, fatigue and minor hemoptysis.",
    medicalDetails: {
      confidence: 96.1,
      risk: "RED" as const,
      citations: ["ICD-11: 1B10 (Tuberculosis)", "WHO End-TB Strategy 2025", "PubMed ID: 310526"],
      reasoning: "Persistent productive cough exceeding 3 weeks coupled with constitutional symptoms (night sweats, low-grade fever) and bloody sputum strongly correlates with active Pulmonary Tuberculosis.",
      treatment: "Immediate sputum smear microbiology examination and GeneXpert PCR checking. Enforce strict isolation in negative-pressure rooms, initiate standard DOTS anti-tubercular medication regimen."
    }
  }
];
