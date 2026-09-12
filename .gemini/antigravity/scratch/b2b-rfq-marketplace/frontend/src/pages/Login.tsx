import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AuthResponse } from '../types';
import { LogIn, Building2, UserCheck, Shield, Truck, Zap } from 'lucide-react';
import { ErrorMessage } from '../components/ErrorMessage';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        if (res.data.user.role === 'BUYER') {
          navigate('/buyer/dashboard');
        } else {
          navigate('/browse');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password123');
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.post<AuthResponse>('/auth/login', {
        email: userEmail,
        password: 'password123',
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
      setError(err.message || 'Quick login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to Quotio B2B</h2>
          <p className="mt-1 text-xs text-slate-500 font-medium">Access your enterprise procurement dashboard</p>
        </div>

        {/* Evaluator Demo Cards */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>1-Click Evaluator Sign In</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">No Password Needed</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('rajesh@sharma-enterprises.in')}
              disabled={isLoading}
              className="p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded-xl text-left transition space-y-0.5 group"
            >
              <div className="flex items-center space-x-1 text-xs font-bold text-indigo-700 group-hover:text-indigo-950">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Rajesh Sharma</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block">Sharma Enterprises</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('vikram@malhotra-electronics.in')}
              disabled={isLoading}
              className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl text-left transition space-y-0.5 group"
            >
              <div className="flex items-center space-x-1 text-xs font-bold text-emerald-700 group-hover:text-emerald-950">
                <Truck className="w-3.5 h-3.5" />
                <span>Vikram Malhotra</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block">Malhotra Electronics</span>
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@company.in"
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Sign In to Quotio B2B</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Create Free Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
