import React from 'react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  className?: string; // Icon width/height class, e.g. "w-5 h-5"
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'massive';
  animate?: boolean;
}

/**
 * Unique, highly polished custom heartbeat brand icon for LifeSync AI.
 * Merges a high-fidelity vector heart rate ECG waveform with an AI smart spark capsule.
 */
export function LogoIcon({ size = 'md', animate = true, className = "" }: LogoProps) {
  // Determine dimensions for perfect circles
  const sizes = {
    sm: { container: 'rounded-[10px] w-9 h-9', dotR: '3.5' },
    md: { container: 'rounded-[14px] w-12 h-12', dotR: '3.5' },
    lg: { container: 'rounded-[18px] w-16 h-16', dotR: '3' },
    xl: { container: 'rounded-2xl w-24 h-24', dotR: '2.5' },
    massive: { container: 'rounded-[40px] w-56 h-56', dotR: '2.5' }
  };

  const dim = sizes[size] || sizes.md;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 group select-none ${className}`}>
      {/* Background glow shadow mimicking custom high-end brand assets */}
      <div className={`absolute inset-0 rounded-[inherit] bg-[#6A74FF] opacity-20 blur-[6px] group-hover:opacity-40 transition-opacity duration-300 ${animate ? 'animate-pulse' : ''}`} />

      {/* Main glassmorphic squircle of the logo */}
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-[#302360] to-[#161036] shadow-[inset_0_0_15px_rgba(106,116,255,0.2)] ${dim.container} overflow-hidden transition-all duration-300 ring-1 ring-white/10 dark:ring-white/5`}>
        {/* Abstract futuristic interior gradients */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-[#6A74FF]/10 via-transparent to-transparent" />

        {/* Custom Heart Rate ECG Vector Waveform inside a 100x100 box */}
        <svg
          width="85%"
          height="85%"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform group-hover:scale-105 duration-300"
        >
          {/* Subtle circle guiding outline */}
          <circle
            cx="50"
            cy="50"
            r="38"
            className="stroke-[#484082]/60 dark:stroke-[#484082]"
            strokeWidth="1.5"
          />

          {/* Left Arc */}
          <path
            d="M 32 26 Q 15 50 32 74"
            stroke="#C4C9FF"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Right Arc */}
          <path
            d="M 68 26 Q 85 50 68 74"
            stroke="#C4C9FF"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Pulse Waveform */}
          <path
            d="M 23.5 50 L 37.5 50 L 44.5 32 L 55.5 68 L 62.5 50 L 76.5 50"
            stroke="#6A74FF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Top white dot */}
          <circle cx="44.5" cy="32" r={dim.dotR} fill="#FFFFFF" />
          
          {/* Bottom white dot */}
          <circle cx="55.5" cy="68" r={dim.dotR} fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );
}

interface LogoFullProps {
  brandName: string;
  lang?: 'en' | 'bn';
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
}

/**
 * Combined brand sign with custom styled modern typography.
 */
export function LogoFull({ brandName, lang = 'en', size = 'md' }: LogoFullProps) {
  const isBangla = lang === 'bn';
  
  return (
    <div className="flex items-center gap-3.5 select-none">
      <LogoIcon size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'} />
      <div className="flex flex-col text-left leading-none mt-0.5">
        <h1 className="font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1 font-sans leading-none text-[15px] md:text-[16px]">
          {/* Stylized premium brand title text */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-[#302360] to-slate-900 dark:from-white dark:via-purple-100 dark:to-white">
            {brandName}
          </span>
        </h1>
        <p className="text-[9px] text-[#6A74FF] dark:text-[#A9B1FF] font-extrabold tracking-wider pt-1.5 font-mono uppercase">
          {isBangla ? "এআই ক্লিনিক্যাল ওএস" : "Clinician AI OS"}
        </p>
      </div>
    </div>
  );
}

