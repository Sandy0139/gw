import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { RFQ, ApiResponse } from '../types';
import { PlusCircle, ArrowLeft, Send, AlertCircle, Zap } from 'lucide-react';
import { ErrorMessage } from '../components/ErrorMessage';

export const CreateRFQ: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState('units');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const getDefaultDeadline = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  };

  const handleAutoFill = () => {
    setTitle('High-Precision Stepper Motors (NEMA 23 series)');
    setDescription('Looking for 2,500 units of NEMA 23 bipolar stepper motors (1.9 Nm holding torque, 2.8A rated current). Must include 100% factory torque testing certification, ESD protective packaging, and 1-year replacement warranty.');
    setQuantity(2500);
    setUnit('units');
    setDeliveryLocation('Bengaluru, Karnataka');
    setDeadline(getDefaultDeadline());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!quantity || Number(quantity) <= 0) {
      setError('Please provide a valid positive quantity');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post<ApiResponse<RFQ>>('/rfqs', {
        title,
        description,
        quantity: Number(quantity),
        unit,
        deliveryLocation,
        deadline: new Date(deadline || getDefaultDeadline()).toISOString(),
      });

      if (res.success) {
        navigate('/buyer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create RFQ');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create New RFQ</h1>
              <p className="text-sm text-slate-500">Post your business procurement requirement for verified suppliers</p>
            </div>
          </div>

          {/* Auto-Fill Sample Button */}
          <button
            type="button"
            onClick={handleAutoFill}
            className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-2xs self-start sm:self-auto"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>Auto-Fill Sample RFQ</span>
          </button>
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
              placeholder="e.g. High-Precision Stepper Motors"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Requirement Description & Specifications *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed specifications, quality standards, certification needs, or packaging instructions..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 leading-relaxed font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Quantity Required *
              </label>
              <input
                type="number"
                required
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                placeholder="2500"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Unit of Measurement *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 cursor-pointer font-medium"
              >
                <option value="units">units</option>
                <option value="pieces">pieces</option>
                <option value="kg">kilograms (kg)</option>
                <option value="meters">meters</option>
                <option value="hours">service hours</option>
                <option value="boxes">boxes / crates</option>
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
                placeholder="e.g. Bengaluru, Karnataka"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Quotation Deadline *
              </label>
              <input
                type="date"
                required
                value={deadline || getDefaultDeadline()}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold"
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition shadow-md flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Posting RFQ...' : 'Publish RFQ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
