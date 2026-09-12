import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center space-x-2.5 select-none group">
      {/* SVG Icon Mark */}
      <div className={`${iconSizes[size]} flex-shrink-0 transition-transform group-hover:scale-105 duration-200`}>
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          
          <path d="M50 8 L86 28 V72 L50 92 L14 72 V28 Z" fill="url(#bgGrad)" />
          <path d="M50 24 C35.6 24 24 35.6 24 50 C24 64.4 35.6 76 50 76 C55.8 76 61.1 74.1 65.5 70.9 L74 79 L79 74 L70.9 65.5 C74.1 61.1 76 55.8 76 50 C76 35.6 64.4 24 50 24 Z M50 66 C41.2 66 34 58.8 34 50 C34 41.2 41.2 34 50 34 C58.8 34 66 41.2 66 50 C66 58.8 58.8 66 50 66 Z" fill="white" />
          <path d="M54 38 L62 46 H54 Z" fill="url(#goldGrad)" />
          <circle cx="68" cy="32" r="4" fill="url(#goldGrad)" />
        </svg>
      </div>

      {/* Typography Mark */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center space-x-1">
            <span className={`${textSizes[size]} font-black tracking-tight text-white`}>
              Quotio
            </span>
            <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              B2B
            </span>
          </div>
          <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-widest mt-0.5">
            Enterprise Trade
          </span>
        </div>
      )}
    </div>
  );
};
