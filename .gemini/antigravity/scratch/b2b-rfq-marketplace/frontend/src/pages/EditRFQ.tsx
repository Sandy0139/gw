import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { RFQ, ApiResponse } from '../types';
import { Edit, ArrowLeft, Save } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const EditRFQ: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState('units');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<'OPEN' | 'CLOSED' | 'CANCELLED'>('OPEN');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRfq = async () => {
      try {
        const res = await api.get<ApiResponse<RFQ>>(`/rfqs/detail/${id}`);
        if (res.success && res.data) {
          const rfq = res.data;
          setTitle(rfq.title);
          setDescription(rfq.description);
          setQuantity(rfq.quantity);
          setUnit(rfq.unit);
          setDeliveryLocation(rfq.deliveryLocation);
          setDeadline(new Date(rfq.deadline).toISOString().split('T')[0]);
          setStatus(rfq.status);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch RFQ details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRfq();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await api.put<ApiResponse<RFQ>>(`/rfqs/${id}`, {
        title,
        description,
        quantity: Number(quantity),
        unit,
        deliveryLocation,
        deadline: new Date(deadline).toISOString(),
        status,
      });

      if (res.success) {
        navigate('/buyer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update RFQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading RFQ data..." />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/buyer/dashboard"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Buyer Dashboard</span>
      </Link>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
            <Edit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Edit RFQ</h1>
            <p className="text-xs text-slate-500">Update specification details or RFQ status</p>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Product / Service Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Requirement Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Quantity *
              </label>
              <input
                type="number"
                required
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Unit *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              >
                <option value="units">units</option>
                <option value="pieces">pieces</option>
                <option value="kg">kilograms (kg)</option>
                <option value="meters">meters</option>
                <option value="hours">service hours</option>
                <option value="boxes">boxes / crates</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                RFQ Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 font-semibold"
              >
                <option value="OPEN">OPEN</option>
                <option value="CLOSED">CLOSED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Delivery Location *
              </label>
              <input
                type="text"
                required
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Quotation Deadline *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <Link
              to="/buyer/dashboard"
              className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl transition shadow-md flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
