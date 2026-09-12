import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] border-t border-slate-800 text-slate-400 py-8 mt-auto select-none">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <Logo size="sm" />
          <span className="text-slate-500">• Industrial RFQ Procurement Platform</span>
        </div>
        <div className="text-slate-400 font-semibold">
          © {currentYear} Sandy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
