import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AuthResponse, UserRole } from '../types';
import { UserPlus, ShoppingBag, Truck } from 'lucide-react';
import { ErrorMessage } from '../components/ErrorMessage';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState<UserRole>('BUYER');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
        companyName: companyName || undefined,
        role,
      });

      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        if (res.data.user.role === 'BUYER') {
          navigate('/buyer/dashboard');
        } else {
          navigate('/browse');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-lg mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="mt-1 text-sm text-slate-500">Join the B2B RFQ Marketplace</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('BUYER')}
                className={`p-3 border rounded-xl flex flex-col items-center justify-center space-y-1 transition ${
                  role === 'BUYER'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShoppingBag className={`w-5 h-5 ${role === 'BUYER' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="text-sm">Buyer</span>
                <span className="text-[10px] text-slate-500 font-normal">Post Requirements</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('SUPPLIER')}
                className={`p-3 border rounded-xl flex flex-col items-center justify-center space-y-1 transition ${
                  role === 'SUPPLIER'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Truck className={`w-5 h-5 ${role === 'SUPPLIER' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-sm">Supplier</span>
                <span className="text-[10px] text-slate-500 font-normal">Submit Quotations</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Company Name (Optional)
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Corp"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@company.com"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-lg transition shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : `Register as ${role === 'BUYER' ? 'Buyer' : 'Supplier'}`}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
