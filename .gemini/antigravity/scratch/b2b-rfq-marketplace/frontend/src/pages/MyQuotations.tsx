import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Quotation, ApiResponse } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Badge } from '../components/Badge';
import { Toast } from '../components/Toast';
import { DollarSign, Clock, CheckCircle2, ArrowRight, XCircle, TrendingUp, Award, ShieldCheck } from 'lucide-react';

export const MyQuotations: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchQuotations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse<Quotation[]>>('/quotations/my');
      if (res.success) {
        setQuotations(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load your submitted quotations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleWithdrawQuote = async (quoteId: string) => {
    if (!window.confirm('Are you sure you want to withdraw this quotation?')) return;
    try {
      const res = await api.delete<ApiResponse<{ message: string }>>(`/quotations/${quoteId}`);
      if (res.success) {
        setToastMsg('Quotation withdrawn successfully!');
        fetchQuotations();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to withdraw quotation');
    }
  };

  // Analytics Calculations
  const totalBidsCount = quotations.length;
  const acceptedQuotes = quotations.filter((q) => q.status === 'ACCEPTED');
  const acceptedEarnings = acceptedQuotes.reduce((acc, q) => acc + q.price, 0);
  const pipelineValue = quotations.reduce((acc, q) => acc + q.price, 0);
  const winRate = totalBidsCount > 0 ? ((acceptedQuotes.length / totalBidsCount) * 100).toFixed(0) : '0';

  if (isLoading) {
    return <LoadingSpinner fullPage message="Fetching your submitted quotations..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <Toast message={toastMsg} type="info" onClose={() => setToastMsg(null)} />
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Your Submitted B2B Quotations</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track proposal statuses, manage bids, and review supplier analytics</p>
        </div>
        <Link
          to="/browse"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5"
        >
          <span>Browse Active RFQs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchQuotations} />}

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Bids Submitted</span>
          <span className="text-2xl font-black text-slate-900 block">{totalBidsCount}</span>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Quoted Pipeline Value</span>
          <span className="text-2xl font-black text-blue-600 block">${pipelineValue.toLocaleString()}</span>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Accepted Contract Earnings</span>
          <span className="text-2xl font-black text-emerald-700 block">${acceptedEarnings.toLocaleString()}</span>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Proposal Win Rate</span>
          <span className="text-2xl font-black text-amber-600 block">{winRate}%</span>
        </div>
      </div>

      {/* Quotations List */}
      {quotations.length === 0 ? (
        <EmptyState
          title="No Submitted Quotations"
          description="You haven't submitted any price quotes yet. Browse open RFQs to start bidding!"
          actionLabel="Browse Available RFQs"
          onAction={() => window.location.assign('/browse')}
        />
      ) : (
        <div className="space-y-4">
          {quotations.map((quote) => (
            <div
              key={quote.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Requirement</span>
                  <Link
                    to={`/rfqs/${quote.rfqId}`}
                    className="text-base font-bold text-slate-900 hover:text-blue-600 transition"
                  >
                    {quote.rfq?.title || 'RFQ Requirement'}
                  </Link>
                  {quote.rfq?.buyer && (
                    <span className="text-xs text-slate-500 block">
                      Buyer: <strong>{quote.rfq.buyer.companyName || quote.rfq.buyer.name}</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <Badge type="quote" status={quote.status} />

                  {/* Supplier Withdraw Action */}
                  {quote.status === 'PENDING' && (
                    <button
                      onClick={() => handleWithdrawQuote(quote.id)}
                      className="px-3 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl transition flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Withdraw Quote</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Quoted Price</span>
                  <span className="text-lg font-black text-emerald-700">
                    ${quote.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Lead Time</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{quote.deliveryDays} Days</span>
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submitted On</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {quote.notes && (
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                  "{quote.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
