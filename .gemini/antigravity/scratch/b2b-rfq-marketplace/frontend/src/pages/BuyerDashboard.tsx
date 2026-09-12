import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { RFQ, ApiResponse } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Badge } from '../components/Badge';
import { RFQCard } from '../components/RFQCard';
import { PlusCircle, FileText, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchMyRfqs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse<RFQ[]>>('/rfqs/my');
      if (res.success) {
        setRfqs(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load your RFQs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRfqs();
  }, []);

  const filteredRfqs = rfqs.filter((rfq) => {
    if (statusFilter === 'ALL') return true;
    return rfq.status === statusFilter;
  });

  const totalCount = rfqs.length;
  const openCount = rfqs.filter((r) => r.status === 'OPEN' && !r.isExpired).length;
  const closedCount = rfqs.filter((r) => r.status === 'CLOSED').length;
  const totalQuotesCount = rfqs.reduce((acc, r) => acc + (r.quotationCount || 0), 0);
  const totalEstSpend = rfqs.reduce((acc, r) => acc + (r.quantity * 4.9), 0);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Fetching your Buyer dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Your Quotio B2B Buyer Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage active requirements, inspect supplier bids, and view purchase orders</p>
        </div>
        <Link
          to="/rfqs/create"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New RFQ</span>
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchMyRfqs} />}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total RFQs Posted</span>
          <span className="text-2xl font-black text-slate-900 block">{totalCount}</span>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Active Open Requirements</span>
          <span className="text-2xl font-black text-emerald-700 block">{openCount}</span>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Bids Received</span>
          <span className="text-2xl font-black text-blue-600 block">{totalQuotesCount}</span>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Est. Procurement Value</span>
          <span className="text-2xl font-black text-amber-600 block">${totalEstSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex items-center space-x-2 text-xs font-semibold">
        <span className="text-slate-500">Filter Status:</span>
        {['ALL', 'OPEN', 'CLOSED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              statusFilter === st
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st} RFQs
          </button>
        ))}
      </div>

      {/* RFQs Grid */}
      {filteredRfqs.length === 0 ? (
        <EmptyState
          title="No RFQs Found"
          description="You haven't posted any requirements yet. Click below to create your first RFQ!"
          actionLabel="Post New Requirement"
          onAction={() => navigate('/rfqs/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRfqs.map((rfq) => (
            <RFQCard key={rfq.id} rfq={rfq} />
          ))}
        </div>
      )}
    </div>
  );
};
