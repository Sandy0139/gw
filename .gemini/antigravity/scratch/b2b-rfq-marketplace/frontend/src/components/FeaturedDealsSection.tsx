import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Zap, ArrowRight } from 'lucide-react';

export const FeaturedDealsSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white border border-slate-200 p-5 shadow-xs mb-6 rounded-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-600 fill-blue-600" />
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Priority B2B Procurement Deals
            </h2>
          </div>

          {/* Live Timer Pill */}
          <div className="flex items-center space-x-1.5 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-rose-600 animate-spin" />
            <span>
              {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s Left
            </span>
          </div>
        </div>

        <Link
          to="/browse"
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-xs transition inline-flex items-center space-x-1 self-start sm:self-auto"
        >
          <span>VIEW ALL DEALS</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>

      {/* Banner Callout */}
      <div className="mt-4 bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between text-xs font-bold border border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-400 text-slate-900 px-2 py-0.5 font-black text-[10px] uppercase rounded">
            QUOTIO SAVINGS
          </span>
          <span>Verified Volume Discounts on Bulk Orders above $50,000</span>
        </div>
        <span className="hidden md:inline text-slate-400 hover:text-white cursor-pointer">Learn More</span>
      </div>
    </div>
  );
};
