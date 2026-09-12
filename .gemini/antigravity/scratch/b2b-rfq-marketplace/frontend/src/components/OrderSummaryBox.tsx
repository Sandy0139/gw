import React from 'react';
import { ShieldCheck, Lock, Clock } from 'lucide-react';
import { RFQ } from '../types';

interface SummaryBoxProps {
  rfq: RFQ;
  onActionClick?: () => void;
  actionText?: string;
  disabled?: boolean;
}

export const OrderSummaryBox: React.FC<SummaryBoxProps> = ({
  rfq,
  onActionClick,
  actionText = 'Submit Quotation Bid',
  disabled = false,
}) => {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4 text-xs font-normal text-slate-900">
      <div className="space-y-1">
        <span className="text-xl font-extrabold text-blue-600 block">
          ${((rfq.quantity * 4.9) || 24500).toLocaleString()}
        </span>
        <span className="text-xs text-slate-500 block">
          ≈ $4.90 / {rfq.unit}
        </span>
      </div>

      <div className="space-y-1 pt-1 border-t border-slate-100">
        <span className="text-emerald-700 font-bold text-sm block">✓ Open for Supplier Bidding</span>
        <span className="text-slate-600 block">
          Delivery location: <strong className="text-slate-900">{rfq.deliveryLocation}</strong>
        </span>
      </div>

      {/* Dispatch Promises */}
      <div className="space-y-2 py-2 border-y border-slate-100 text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-500">Escrow Provider</span>
          <span className="font-semibold text-slate-800">Quotio Trade Escrow</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Buyer</span>
          <span className="font-semibold text-blue-600 hover:underline">
            {rfq.buyer?.companyName || rfq.buyer?.name || 'Verified Buyer'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Payment Protection</span>
          <span className="font-semibold text-slate-800 flex items-center">
            <Lock className="w-3 h-3 text-slate-400 mr-0.5" />
            Secure Encrypted
          </span>
        </div>
      </div>

      {/* Deadline Indicator */}
      <div className="flex items-center space-x-1.5 text-xs text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200">
        <Clock className="w-4 h-4 text-amber-600" />
        <span>Deadline: <strong>{new Date(rfq.deadline).toLocaleDateString()}</strong></span>
      </div>

      {/* Action Button */}
      {onActionClick && (
        <button
          onClick={onActionClick}
          disabled={disabled}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition disabled:opacity-50"
        >
          {actionText}
        </button>
      )}

      <div className="text-[11px] text-slate-500 space-y-1">
        <p className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Quotio B2B Buyer Assurance Guarantee</span>
        </p>
      </div>
    </div>
  );
};
