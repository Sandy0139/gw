import React from 'react';
import { RFQ, Quotation } from '../types';
import { Printer, Download, CheckCircle2, X, Building2, ShieldCheck, FileText } from 'lucide-react';

interface POModalProps {
  rfq: RFQ;
  quotation: Quotation;
  onClose: () => void;
}

export const PurchaseOrderModal: React.FC<POModalProps> = ({ rfq, quotation, onClose }) => {
  const poNumber = `PO-2026-${rfq.id.substring(0, 6).toUpperCase()}`;
  const poDate = new Date().toLocaleDateString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ACCEPTED & CONFIRMED PO</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official PO Printable Sheet */}
        <div className="p-6 border border-slate-200 rounded-2xl bg-white space-y-6 text-xs text-slate-800 font-sans">
          {/* PO Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center space-x-1.5 text-lg font-black text-slate-900">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Quotio B2B Purchase Order</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Official B2B Procurement Contract</p>
            </div>

            <div className="text-right">
              <span className="text-sm font-extrabold text-blue-600 block">{poNumber}</span>
              <span className="text-slate-500 text-[11px]">Issued Date: {poDate}</span>
            </div>
          </div>

          {/* Buyer & Supplier Party Information */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                Issued By (Buyer):
              </span>
              <p className="font-bold text-slate-900 text-xs">
                {rfq.buyer?.companyName || rfq.buyer?.name || 'Buyer Enterprise'}
              </p>
              <p className="text-slate-500 text-[11px]">{rfq.buyer?.email}</p>
              <p className="text-slate-700 font-medium mt-1">Delivery to: {rfq.deliveryLocation}</p>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                Issued To (Supplier):
              </span>
              <p className="font-bold text-slate-900 text-xs">
                {quotation.supplier?.companyName || quotation.supplier?.name || 'Supplier Enterprise'}
              </p>
              <p className="text-slate-500 text-[11px]">{quotation.supplier?.email}</p>
              <p className="text-emerald-700 font-bold mt-1">✓ Verified Quotio Trade Supplier</p>
            </div>
          </div>

          {/* Item Order Table */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
              Order Details & Agreed Terms
            </span>
            <table className="w-full text-left border border-slate-200 border-collapse rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold">
                  <th className="p-3">Requirement Description</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-right">Agreed Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-200">
                  <td className="p-3">
                    <strong className="text-slate-900 block">{rfq.title}</strong>
                    <span className="text-slate-500 text-[11px] line-clamp-1">{rfq.description}</span>
                  </td>
                  <td className="p-3 text-center font-bold">
                    {rfq.quantity.toLocaleString()} {rfq.unit}
                  </td>
                  <td className="p-3 text-right font-black text-emerald-700 text-sm">
                    ${quotation.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Delivery & Terms */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px]">
            <div>
              <span className="font-bold text-slate-700 block">Lead Time Commitment:</span>
              <span className="text-slate-900 font-bold">{quotation.deliveryDays} Days Estimated Delivery</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 block">Payment Security:</span>
              <span className="text-emerald-700 font-bold">100% Quotio Trade Escrow Guaranteed</span>
            </div>
          </div>

          {quotation.notes && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600">
              <span className="font-bold text-slate-700 block">Supplier Compliance Notes:</span>
              <p className="italic">"{quotation.notes}"</p>
            </div>
          )}

          {/* Footer Signature Seal */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-800">Digitally Verified Purchase Order</span>
            </div>
            <span>Quotio B2B Enterprise Escrow</span>
          </div>
        </div>
      </div>
    </div>
  );
};
