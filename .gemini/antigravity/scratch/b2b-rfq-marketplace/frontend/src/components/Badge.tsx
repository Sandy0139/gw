import React from 'react';
import { RFQStatus, QuotationStatus } from '../types';

interface BadgeProps {
  type: 'rfq' | 'quote';
  status: RFQStatus | QuotationStatus;
  isExpired?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ type, status, isExpired }) => {
  if (type === 'rfq') {
    if (isExpired && status === 'OPEN') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          EXPIRED
        </span>
      );
    }

    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            ● OPEN
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 border border-slate-300">
            CLOSED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            CANCELLED
          </span>
        );
      default:
        return null;
    }
  }

  // Quote status badges
  switch (status) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
          PENDING REVIEW
        </span>
      );
    case 'ACCEPTED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          ✓ ACCEPTED
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
          ✕ REJECTED
        </span>
      );
    default:
      return null;
  }
};
