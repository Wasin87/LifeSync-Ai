import React, { useId } from 'react';

export const Logo = ({ className = "w-6 h-6", isDark = false }: { className?: string, isDark?: boolean }) => {
  const gradId1 = useId().replace(/:/g, '');
  const gradId2 = useId().replace(/:/g, '');
  
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`pulse-grad-${gradId1}`} x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id={`ring-grad-${gradId2}`} x1="0" y1="100" x2="100" y2="0">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#818cf8" strokeOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Modern Hexagonal Frame with Rounded Corners */}
      <path 
        d="M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z" 
        stroke={`url(#ring-grad-${gradId2})`} 
        strokeWidth="4" 
        strokeLinejoin="round"
        strokeOpacity="0.3"
      />

      {/* Central Professional Pulse Core */}
      <path 
        d="M 25 50 H 40 L 48 25 L 56 75 L 64 42 L 70 50 H 75" 
        stroke={`url(#pulse-grad-${gradId1})`} 
        strokeWidth="7" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Sync Dots / Neural Nodes */}
      <circle cx="48" cy="25" r="4" fill="white" className="animate-pulse" />
      <circle cx="56" cy="75" r="4" fill="white" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
      
      {/* Subtle Inner Glow */}
      <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="0.5" strokeDasharray="2 10" strokeOpacity="0.2" />
    </svg>
  );
};

