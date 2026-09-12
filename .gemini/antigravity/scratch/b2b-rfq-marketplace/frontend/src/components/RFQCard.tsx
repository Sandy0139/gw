import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RFQ } from '../types';
import { Star, ShieldCheck, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface RFQCardProps {
  rfq: RFQ;
}

export const RFQCard: React.FC<RFQCardProps> = ({ rfq }) => {
  const navigate = useNavigate();

  const listPrice = rfq.quantity * 5.5;
  const estPrice = listPrice * 0.82;

  return (
    <div
      onClick={() => navigate(`/rfqs/${rfq.id}`)}
      className="bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition cursor-pointer p-5 rounded-2xl flex flex-col justify-between space-y-3 group select-none"
    >
      <div className="space-y-2.5">
        {/* Category & Trade Assured Badge */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-blue-100">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            <span>Trade Assured</span>
          </span>

          {rfq.hasSubmittedQuote && (
            <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] flex items-center space-x-1 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Quote Submitted</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition line-clamp-2 leading-snug">
          {rfq.title}
        </h3>

        {/* Buyer Company & Rating */}
        <div className="flex items-center justify-between text-xs">
          {rfq.buyer && (
            <span className="font-semibold text-slate-700 truncate max-w-[160px] flex items-center space-x-1">
              <span>{rfq.buyer.companyName || rfq.buyer.name}</span>
            </span>
          )}

          {/* Rating Pill */}
          <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5">
            <span>4.8</span>
            <Star className="w-2.5 h-2.5 fill-white text-white" />
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {rfq.description}
        </p>

        {/* Quantity & Location Specs */}
        <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Quantity Needed:</span>
            <span className="font-bold text-slate-900">
              {rfq.quantity.toLocaleString()} {rfq.unit}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Delivery Location:</span>
            <span className="font-semibold text-slate-800 flex items-center">
              <MapPin className="w-3 h-3 text-slate-400 mr-0.5" />
              {rfq.deliveryLocation}
            </span>
          </div>
        </div>

        {/* Pricing & Savings Callouts */}
        <div className="pt-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-extrabold text-slate-900">
              ${estPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ${listPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs font-bold text-emerald-600">18% off</span>
          </div>

          <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
            ✓ Guaranteed Escrow Freight Available
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-bold">
          {rfq.quotationCount || 0} Bids Submitted
        </span>

        <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-1">
          <span>View Specification</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
