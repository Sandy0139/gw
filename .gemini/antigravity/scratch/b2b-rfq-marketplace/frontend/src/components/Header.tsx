import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AuthResponse } from '../types';
import { Logo } from './Logo';
import {
  Search,
  MapPin,
  Menu,
  ShoppingCart,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Zap,
  UserCheck,
  Truck,
  HelpCircle,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isBuyer, isSupplier, login, logout } = useAuth();
  const navigate = useNavigate();

  const [searchCategory, setSearchCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSwitching, setIsSwitching] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickSwitchPersona = async (targetEmail: string) => {
    setIsSwitching(true);
    try {
      const res = await api.post<AuthResponse>('/auth/login', {
        email: targetEmail,
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
    } catch (err) {
      console.error('Failed to switch persona', err);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm) query.append('search', searchTerm);
    if (searchCategory !== 'ALL') query.append('category', searchCategory);
    navigate(`/browse?${query.toString()}`);
  };

  return (
    <header className="w-full select-none shadow-md">
      {/* Announcement & Quick Persona Switcher Bar */}
      <div className="bg-slate-950 text-white text-[11px] font-bold py-1.5 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>QUOTIO B2B — BHARAT INDUSTRIAL PROCUREMENT MARKETPLACE</span>
        </div>

        {/* 1-Click Demo Persona Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider hidden md:inline">⚡ Demo Switcher:</span>
          <button
            onClick={() => handleQuickSwitchPersona('rajesh@sharma-enterprises.in')}
            disabled={isSwitching}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center space-x-1 transition ${
              user?.email === 'rajesh@sharma-enterprises.in'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>Rajesh Sharma (Buyer)</span>
          </button>

          <button
            onClick={() => handleQuickSwitchPersona('vikram@malhotra-electronics.in')}
            disabled={isSwitching}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center space-x-1 transition ${
              user?.email === 'vikram@malhotra-electronics.in'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Truck className="w-3 h-3" />
            <span>Vikram Malhotra (Supplier)</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="bg-[#0f172a] text-white px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Quotio B2B Vector Logo */}
        <Link to="/" className="flex-shrink-0">
          <Logo size="sm" />
        </Link>

        {/* Location Badge */}
        <div className="hidden lg:flex items-center space-x-1.5 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl cursor-pointer text-xs bg-slate-900/50">
          <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] text-slate-400">Location</span>
            <span className="font-bold text-slate-200">India 🇮🇳</span>
          </div>
        </div>

        {/* Global Mega Search Box */}
        <form onSubmit={handleSearchSubmit} className="flex flex-1 max-w-2xl items-center bg-white rounded-xl overflow-hidden shadow-inner border border-slate-200">
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2.5 border-r border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Machining & CNC">Machining & CNC</option>
            <option value="Energy & Power">Energy & Power</option>
            <option value="Raw Materials">Raw Materials</option>
          </select>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Quotio RFQs, microcontrollers, CNC parts, suppliers..."
            className="w-full px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 transition flex items-center justify-center font-bold"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Account Menu */}
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl text-xs leading-tight flex items-center space-x-2 bg-slate-900/50">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-white">{user.name}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">{user.role}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-rose-950 hover:text-rose-400 transition border border-slate-700"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link to="/login" className="px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition shadow-md">
              Join B2B
            </Link>
          </div>
        )}

        {/* Cart / RFQ Basket */}
        <Link
          to={isBuyer ? '/buyer/dashboard' : isSupplier ? '/supplier/quotations' : '/browse'}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-xs font-bold text-white transition"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
          </div>
          <span className="hidden sm:inline">Workspace</span>
        </Link>
      </div>

      {/* Sub-Nav Bar (#1e293b) */}
      <div className="bg-[#1e293b] text-white px-4 py-2 flex items-center justify-between text-xs font-semibold overflow-x-auto scrollbar-none border-t border-slate-800">
        <div className="flex items-center space-x-4 flex-shrink-0">
          <Link to="/" className="flex items-center space-x-1 text-blue-400 hover:text-white font-bold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Overview & How It Works</span>
          </Link>

          <Link to="/browse?category=Electronics" className="text-slate-300 hover:text-white transition">
            Electronics
          </Link>
          <Link to="/browse?category=Machining %26 CNC" className="text-slate-300 hover:text-white transition">
            Machining & CNC
          </Link>
          <Link to="/browse?category=Energy %26 Power" className="text-slate-300 hover:text-white transition">
            Energy & Power
          </Link>
          <Link to="/browse?category=Raw Materials" className="text-slate-300 hover:text-white transition">
            Raw Materials
          </Link>

          {isBuyer && (
            <Link to="/rfqs/create" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-lg transition shadow-xs">
              + Post Requirement
            </Link>
          )}
        </div>

        <div className="hidden lg:flex items-center space-x-1 text-amber-400 font-bold">
          <ShieldCheck className="w-4 h-4 mr-1" />
          <span>Quotio Verified Trade Assurance</span>
        </div>
      </div>
    </header>
  );
};
