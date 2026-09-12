import React from 'react';
import { Phone, ShieldCheck, Headphones, Lock, CheckCircle2 } from 'lucide-react';

export const AssistanceStrip: React.FC = () => {
  return (
    <div className="bg-[#0f172a] text-white border-y border-amber-400/40 py-3 px-4 my-6 shadow-md select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Left Helpline Section */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md flex-shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">
              Customer Sourcing Assistance Helpline
            </span>
            <span className="text-sm font-extrabold text-white tracking-wide">
              Toll-Free: 1800-425-1199 <span className="text-amber-400 font-normal text-xs">(24/7 B2B Support)</span>
            </span>
          </div>
        </div>

        {/* Middle Escrow Feature Badges */}
        <div className="flex items-center space-x-6 text-[11px] font-semibold text-slate-200 flex-wrap justify-center">
          <div className="flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Bank-Grade Escrow Guarantee</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ISO 9001:2015 Verified Trade</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Headphones className="w-4 h-4 text-sky-400" />
            <span>Indic AI Assistant Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
