import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { RFQ, ApiResponse } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { CategoryStrip } from '../components/CategoryStrip';
import { ProcurementQuadGrid } from '../components/ProcurementQuadGrid';
import { FeaturedDealsSection } from '../components/FeaturedDealsSection';
import { RFQCard } from '../components/RFQCard';
import { Search, MapPin, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BrowseRFQs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('OPEN');
  const [locationFilter, setLocationFilter] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isSupplier } = useAuth();
  const navigate = useNavigate();

  const fetchRfqs = async () => {
    setIsLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append('search', searchTerm);
    if (statusFilter && statusFilter !== 'ALL') queryParams.append('status', statusFilter);
    if (locationFilter) queryParams.append('location', locationFilter);

    try {
      const res = await api.get<ApiResponse<RFQ[]>>(`/rfqs?${queryParams.toString()}`);
      if (res.success) {
        setRfqs(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load RFQs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRfqs();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRfqs();
  };

  return (
    <div className="pb-12">
      {/* Category Strip */}
      <CategoryStrip />

      {/* Showcase Quad Grid */}
      <ProcurementQuadGrid />

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Featured Deals Section with Live Ticking Timer */}
        <FeaturedDealsSection />

        {/* Filter Controls Header */}
        <form onSubmit={handleSearchSubmit} className="bg-white p-4 border border-slate-200 shadow-xs space-y-3 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Quotio B2B microcontrollers, CNC enclosures, batteries..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
              />
            </div>

            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Location (e.g. Austin)"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
              />
            </div>

            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center space-x-1"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </form>

        {error && <ErrorMessage message={error} onRetry={fetchRfqs} />}

        {/* Quotio B2B Grid View */}
        {isLoading ? (
          <LoadingSpinner fullPage message="Loading Quotio B2B RFQ listings..." />
        ) : rfqs.length === 0 ? (
          <EmptyState
            title="No Matching RFQs Found"
            description="Clear search terms to view all active requirements."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rfqs.map((rfq) => (
              <RFQCard key={rfq.id} rfq={rfq} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
