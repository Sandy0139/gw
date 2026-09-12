import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Wrench, BatteryCharging, Factory, ShieldCheck, Zap, ArrowRight, Truck } from 'lucide-react';

export const ProcurementQuadGrid: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quad Card 1 */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
          <h3 className="font-bold text-base text-slate-900 leading-tight">
            Top Industrial Categories
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link to="/browse?category=Electronics" className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 space-y-1 transition">
              <Cpu className="w-5 h-5 text-blue-600" />
              <span className="font-semibold block text-slate-800">Electronics</span>
            </Link>
            <Link to="/browse?category=Machining %26 CNC" className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 space-y-1 transition">
              <Wrench className="w-5 h-5 text-amber-600" />
              <span className="font-semibold block text-slate-800">CNC Machining</span>
            </Link>
            <Link to="/browse?category=Energy %26 Power" className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 space-y-1 transition">
              <BatteryCharging className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold block text-slate-800">Energy & Power</span>
            </Link>
            <Link to="/browse?category=Raw Materials" className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 space-y-1 transition">
              <Factory className="w-5 h-5 text-purple-600" />
              <span className="font-semibold block text-slate-800">Raw Materials</span>
            </Link>
          </div>
          <Link to="/browse" className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1">
            <span>Explore all categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quad Card 2 */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
          <h3 className="font-bold text-base text-slate-900 leading-tight">
            Verified Manufacturer Bids
          </h3>
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-xs text-slate-900">Quotio Trade Assured</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compare proposals from audited industrial suppliers with verified compliance documentation.
            </p>
          </div>
          <Link to="/browse" className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1">
            <span>View verified suppliers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quad Card 3 */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
          <h3 className="font-bold text-base text-slate-900 leading-tight">
            Post Custom Requirements
          </h3>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-600" />
              <span className="font-bold text-xs text-slate-900">Direct Supplier Quotes</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Publish quantity specs, target delivery date, and location to receive verified bids.
            </p>
          </div>
          <Link to="/rfqs/create" className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1">
            <span>Create new RFQ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quad Card 4 */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
          <h3 className="font-bold text-base text-slate-900 leading-tight">
            Escrow Payment Protection
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-800">Global Doorstep Freight</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-slate-800">100% Escrow Guarantee</span>
            </div>
          </div>
          <Link to="/browse" className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1">
            <span>Learn about escrow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
