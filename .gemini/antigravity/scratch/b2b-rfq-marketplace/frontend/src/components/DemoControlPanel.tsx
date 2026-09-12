import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AuthResponse } from '../types';
import {
  Zap,
  UserCheck,
  Truck,
  ChevronUp,
  ChevronDown,
  Sparkles,
  PlusCircle,
  Search,
  ShieldCheck,
} from 'lucide-react';

export const DemoControlPanel: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleQuickSwitch = async (email: string, targetPath?: string) => {
    setIsSwitching(true);
    try {
      const res = await api.post<AuthResponse>('/auth/login', {
        email,
        password: 'password123',
      });
      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        if (targetPath) {
          navigate(targetPath);
        } else if (res.data.user.role === 'BUYER') {
          navigate('/buyer/dashboard');
        } else {
          navigate('/browse');
        }
      }
    } catch (err) {
      console.error('Quick switch failed', err);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 select-none">
      {/* Panel Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 flex items-center space-x-2 transition"
      >
        <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
        <span>Quotio Demo Assistant</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded Control Box */}
      {isOpen && (
        <div className="absolute bottom-12 left-0 w-80 bg-slate-900 border border-slate-700 text-white rounded-2xl shadow-2xl p-4 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Evaluator Panel</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">No Password Needed</span>
          </div>

          {/* Current Persona Badge */}
          {user && (
            <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Current Active User:</span>
                <span className="font-bold text-white">{user.name}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  user.role === 'BUYER' ? 'bg-indigo-900 text-indigo-300' : 'bg-emerald-900 text-emerald-300'
                }`}
              >
                {user.role} MODE
              </span>
            </div>
          )}

          {/* Switcher Buttons */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
              Switch Persona Instantly:
            </span>

            {/* Buyer Demo */}
            <button
              onClick={() => handleQuickSwitch('rajesh@sharma-enterprises.in')}
              disabled={isSwitching}
              className={`w-full p-2.5 rounded-xl text-xs text-left border transition flex items-center justify-between ${
                user?.email === 'rajesh@sharma-enterprises.in'
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-bold'
                  : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="font-bold block text-white">Rajesh Sharma (Buyer)</span>
                  <span className="text-[10px] text-slate-400">Sharma Enterprise Solutions</span>
                </div>
              </div>
              {user?.email === 'rajesh@sharma-enterprises.in' && (
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Supplier 1 Demo */}
            <button
              onClick={() => handleQuickSwitch('vikram@malhotra-electronics.in')}
              disabled={isSwitching}
              className={`w-full p-2.5 rounded-xl text-xs text-left border transition flex items-center justify-between ${
                user?.email === 'vikram@malhotra-electronics.in'
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold'
                  : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-bold block text-white">Vikram Malhotra (Supplier 1)</span>
                  <span className="text-[10px] text-slate-400">Malhotra Electronics</span>
                </div>
              </div>
              {user?.email === 'vikram@malhotra-electronics.in' && (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Supplier 2 Demo */}
            <button
              onClick={() => handleQuickSwitch('priya@sundaram-components.in')}
              disabled={isSwitching}
              className={`w-full p-2.5 rounded-xl text-xs text-left border transition flex items-center justify-between ${
                user?.email === 'priya@sundaram-components.in'
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold'
                  : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-bold block text-white">Priya Sundaram (Supplier 2)</span>
                  <span className="text-[10px] text-slate-400">Sundaram Precision Components</span>
                </div>
              </div>
              {user?.email === 'priya@sundaram-components.in' && (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            {user?.role === 'BUYER' ? (
              <button
                onClick={() => navigate('/rfqs/create')}
                className="text-blue-400 hover:underline font-bold flex items-center space-x-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Post New RFQ</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/browse')}
                className="text-blue-400 hover:underline font-bold flex items-center space-x-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Browse Active Bids</span>
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="text-slate-400 hover:text-white font-medium"
            >
              Overview Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
