import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Wrench, BatteryCharging, Factory, Truck, ShieldCheck, Zap } from 'lucide-react';

export const CategoryStrip: React.FC = () => {
  const categories = [
    { name: 'Electronics', icon: Cpu, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { name: 'Machining & CNC', icon: Wrench, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { name: 'Energy & Power', icon: BatteryCharging, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { name: 'Raw Materials', icon: Factory, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { name: 'Logistics & Freight', icon: Truck, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { name: 'Verified Bids', icon: ShieldCheck, color: 'text-sky-600 bg-sky-50 border-sky-100' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs mb-6 select-none">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between overflow-x-auto scrollbar-none gap-4">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <Link
              key={cat.name}
              to={`/browse?search=${encodeURIComponent(cat.name === 'Verified Bids' ? '' : cat.name)}`}
              className="flex items-center space-x-3 px-4 py-2 rounded-2xl border bg-white hover:bg-slate-50 transition group flex-shrink-0 shadow-2xs"
            >
              <div className={`w-9 h-9 rounded-xl border ${cat.color} flex items-center justify-center font-bold`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
