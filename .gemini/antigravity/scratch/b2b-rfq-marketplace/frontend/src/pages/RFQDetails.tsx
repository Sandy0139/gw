import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { RFQ, Quotation, ApiResponse } from '../types';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import { OrderSummaryBox } from '../components/OrderSummaryBox';
import { PurchaseOrderModal } from '../components/PurchaseOrderModal';
import { Toast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import {
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Check,
  X,
  Send,
  Edit,
  User,
  ShieldCheck,
  Star,
  Award,
  Sparkles,
  Zap,
  Printer,
  FileText,
} from 'lucide-react';

export const RFQDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isBuyer, isSupplier } = useAuth();
  const navigate = useNavigate();

  const [rfq, setRfq] = useState<RFQ | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Supplier quotation submit state
  const [price, setPrice] = useState<number | ''>('');
  const [deliveryDays, setDeliveryDays] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Purchase Order Modal State
  const [selectedPOQuote, setSelectedPOQuote] = useState<Quotation | null>(null);

  const fetchRfqDetail = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get<ApiResponse<RFQ>>(`/rfqs/detail/${id}`);
      if (res.success && res.data) {
        setRfq(res.data);
        if (res.data.myQuotation) {
          setPrice(res.data.myQuotation.price);
          setDeliveryDays(res.data.myQuotation.deliveryDays);
          setNotes(res.data.myQuotation.notes || '');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load RFQ details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRfqDetail();
  }, [id]);

  const handleAutoFillBid = () => {
    if (!rfq) return;
    const estTotal = rfq.quantity * 4.65;
    setPrice(Number(estTotal.toFixed(2)));
    setDeliveryDays(12);
    setNotes('⚡ Ready stock available in our Bengaluru warehouse. Includes ISO 9001 quality test report, anti-static ESD packaging, and 1-year replacement warranty.');
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteError(null);

    if (!price || Number(price) <= 0) {
      setQuoteError('Please specify a valid positive quoted price');
      return;
    }

    if (!deliveryDays || Number(deliveryDays) <= 0) {
      setQuoteError('Please specify a valid estimated delivery time in days');
      return;
    }

    setIsSubmittingQuote(true);

    try {
      const res = await api.post<ApiResponse<Quotation>>('/quotations', {
        rfqId: id,
        price: Number(price),
        deliveryDays: Number(deliveryDays),
        notes: notes || undefined,
      });

      if (res.success) {
        setToastMessage({ msg: 'Quotation bid submitted successfully!', type: 'success' });
        fetchRfqDetail();
      }
    } catch (err: any) {
      setQuoteError(err.message || 'Failed to submit quotation');
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const handleQuotationStatusUpdate = async (quoteId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await api.patch(`/quotations/${quoteId}/status`, { status });
      if (status === 'ACCEPTED') {
        await api.patch(`/rfqs/${id}/close`);
        setToastMessage({
          msg: '🎉 Winning quotation accepted! RFQ is now closed and purchase order generated.',
          type: 'success',
        });
      } else {
        setToastMessage({
          msg: 'Quotation declined.',
          type: 'info',
        });
      }
      fetchRfqDetail();
    } catch (err: any) {
      alert(err.message || 'Failed to update quotation status');
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading RFQ specifications..." />;
  }

  if (error || !rfq) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ErrorMessage message={error || 'RFQ not found'} onRetry={fetchRfqDetail} />
      </div>
    );
  }

  const isOwner = user?.id === rfq.buyerId;
  const isExpired = new Date(rfq.deadline) < new Date();
  const canSubmitQuote = isSupplier && rfq.status === 'OPEN' && !isExpired;

  // Live Unit Cost Calculator
  const unitPrice = price && Number(price) > 0 && rfq.quantity > 0 ? (Number(price) / rfq.quantity).toFixed(2) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage.msg}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Purchase Order Modal */}
      {selectedPOQuote && (
        <PurchaseOrderModal
          rfq={rfq}
          quotation={selectedPOQuote}
          onClose={() => setSelectedPOQuote(null)}
        />
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center space-x-1 text-xs text-slate-500">
        <button onClick={() => navigate('/browse')} className="hover:text-blue-600 font-medium">
          Quotio B2B Marketplace
        </button>
        <span>›</span>
        <span className="font-semibold text-slate-900 truncate max-w-xs">{rfq.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Details & Quotes */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-5">
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 uppercase tracking-wider rounded-lg flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Quotio Verified</span>
                </span>
                <Badge type="rfq" status={rfq.status} isExpired={rfq.isExpired} />
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">{rfq.title}</h1>

              {rfq.buyer && (
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <span>Buyer: <strong>{rfq.buyer.companyName || rfq.buyer.name}</strong></span>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-slate-400">({rfq.buyer.email})</span>
                </div>
              )}

              {/* Rating & Trust Badges */}
              <div className="flex items-center space-x-3 text-xs text-slate-600 flex-wrap gap-y-1 pt-1">
                <div className="flex items-center space-x-1">
                  <div className="flex text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <span className="font-bold text-blue-600">4.9 / 5 Score</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-medium">ISO 9001:2015 & CE Certified Compliance</span>
              </div>
            </div>

            {/* Specifications Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technical Specifications</h3>
              <table className="w-full text-xs text-left border border-slate-200 border-collapse rounded-xl overflow-hidden">
                <tbody>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="p-3 font-bold text-slate-600 w-1/3">Quantity Needed</td>
                    <td className="p-3 font-bold text-slate-900">{rfq.quantity.toLocaleString()} {rfq.unit}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-3 font-bold text-slate-600">Delivery Location</td>
                    <td className="p-3 font-semibold text-slate-800">{rfq.deliveryLocation}</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="p-3 font-bold text-slate-600">Quotation Deadline</td>
                    <td className="p-3 font-semibold text-slate-800">{new Date(rfq.deadline).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600">Trade Insurance</td>
                    <td className="p-3 text-emerald-700 font-bold">✓ 100% Quotio Escrow Coverage Guaranteed</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Description */}
            <div className="space-y-1 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Requirement Specifications</h3>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-4 border border-slate-200 rounded-xl font-medium">
                {rfq.description}
              </p>
            </div>
          </div>

          {/* SUPPLIER VIEW: Submit / Update Quotation Form with Live Calculator */}
          {isSupplier && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">
                  {rfq.myQuotation ? 'Your Submitted Quotation' : 'Submit Price Quote'}
                </h2>

                <div className="flex items-center space-x-2">
                  {unitPrice && (
                    <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                      ⚡ Equivalent: ${unitPrice} / {rfq.unit}
                    </span>
                  )}
                  {canSubmitQuote && (
                    <button
                      type="button"
                      onClick={handleAutoFillBid}
                      className="px-3 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs rounded-full transition flex items-center space-x-1"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                      <span>Auto-Fill Sample Bid</span>
                    </button>
                  )}
                </div>
              </div>

              {quoteError && <ErrorMessage message={quoteError} />}

              {canSubmitQuote ? (
                <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Total Price ($ USD) *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={price}
                        onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                        placeholder="e.g. 24500"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Estimated Delivery Lead Time (Days) *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(e.target.value ? Number(e.target.value) : '')}
                        placeholder="e.g. 14"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Supplier Compliance & Warranty Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Packaging compliance, ISO test reports, stock availability..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingQuote}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition"
                  >
                    {isSubmittingQuote ? 'Submitting Bid...' : rfq.myQuotation ? 'Update Quotation' : 'Submit Quotation Bid'}
                  </button>
                </form>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs font-semibold text-amber-900">
                  {rfq.status !== 'OPEN'
                    ? `Quotations are closed because this RFQ is ${rfq.status}.`
                    : 'Quotations are closed because the deadline for this RFQ has expired.'}
                </div>
              )}
            </div>
          )}

          {/* BUYER / OWNER VIEW: Received Quotations List & PO Generator */}
          {isBuyer && isOwner && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                Received Supplier Offers ({rfq.quotations?.length || 0})
              </h2>

              {!rfq.quotations || rfq.quotations.length === 0 ? (
                <EmptyState
                  title="No Quotes Received Yet"
                  description="Suppliers will submit quotes shortly."
                />
              ) : (
                <div className="space-y-3">
                  {rfq.quotations.map((quote) => (
                    <div key={quote.id} className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                          <span>{quote.supplier?.companyName || quote.supplier?.name}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-slate-400 font-normal">({quote.supplier?.email})</span>
                        </div>
                        <Badge type="quote" status={quote.status} />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white p-2.5 border border-slate-200 rounded-lg">
                          <span className="text-[10px] text-slate-400 font-bold block">Total Price</span>
                          <span className="font-black text-emerald-700 text-sm">${quote.price.toLocaleString()}</span>
                        </div>
                        <div className="bg-white p-2.5 border border-slate-200 rounded-lg">
                          <span className="text-[10px] text-slate-400 font-bold block">Unit Equivalent</span>
                          <span className="font-bold text-slate-800">${(quote.price / rfq.quantity).toFixed(2)}/unit</span>
                        </div>
                        <div className="bg-white p-2.5 border border-slate-200 rounded-lg">
                          <span className="text-[10px] text-slate-400 font-bold block">Delivery Time</span>
                          <span className="font-bold text-slate-800">{quote.deliveryDays} Days</span>
                        </div>
                      </div>

                      {quote.notes && (
                        <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                          "{quote.notes}"
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end space-x-2 pt-2">
                        {quote.status === 'ACCEPTED' && (
                          <button
                            onClick={() => setSelectedPOQuote(quote)}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 shadow-xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View / Download Purchase Order (PO)</span>
                          </button>
                        )}

                        {quote.status === 'PENDING' && rfq.status === 'OPEN' && (
                          <>
                            <button
                              onClick={() => handleQuotationStatusUpdate(quote.id, 'ACCEPTED')}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition"
                            >
                              Accept Offer
                            </button>
                            <button
                              onClick={() => handleQuotationStatusUpdate(quote.id, 'REJECTED')}
                              className="px-3 py-1.5 bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold text-xs rounded-lg transition"
                            >
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Box Sidebar */}
        <div className="lg:col-span-4">
          <OrderSummaryBox rfq={rfq} />
        </div>
      </div>
    </div>
  );
};
