import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AuthResponse } from '../types';
import { AssistanceStrip } from '../components/AssistanceStrip';
import {
  Building2,
  FileText,
  Search,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  UserCheck,
  Truck,
  DollarSign,
  Clock,
  Layers,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = async (userEmail: string) => {
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
    } catch (err) {
      console.error('Quick login failed', err);
    }
  };

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0a2540] text-white rounded-3xl p-8 md:p-14 shadow-2xl relative overflow-hidden border border-[#ffc72c]/30">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#ffc72c]/20 border border-[#ffc72c]/40 text-[#ffc72c] text-xs font-extrabold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-[#ffc72c] fill-[#ffc72c]" />
              <span>Next-Gen Enterprise Procurement Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              Industrial Sourcing, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-sky-200 to-[#ffc72c]">
                Simplified & Transparent.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium max-w-2xl mx-auto">
              Quotio B2B connects enterprise buyers and verified manufacturing suppliers for streamlined Request for Quotations (RFQ), live bidding, and side-by-side offer evaluations with trade escrow coverage.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/rfqs/create"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Requirement as Buyer</span>
              </Link>
              <Link
                to="/browse"
                className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-2xl border border-slate-700 transition flex items-center space-x-2"
              >
                <Search className="w-4 h-4 text-[#ffc72c]" />
                <span>Explore Marketplace as Supplier</span>
              </Link>
            </div>

            {/* Quick Demo Switcher Bar */}
            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                ⚡ Evaluator 1-Click Launch:
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuickLogin('rajesh@sharma-enterprises.in')}
                  className="px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-200 font-bold rounded-xl transition flex items-center space-x-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Buyer: Rajesh Sharma</span>
                </button>
                <button
                  onClick={() => handleQuickLogin('vikram@malhotra-electronics.in')}
                  className="px-4 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-200 font-bold rounded-xl transition flex items-center space-x-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Supplier: Vikram Malhotra</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Federal Bank Style Customer Assistance Strip */}
      <AssistanceStrip />

      {/* 3-Step "How It Works" Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Simple 3-Step Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">How Quotio B2B Works</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            From publishing specs to accepting competitive bids in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-lg">
              01
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">1. Post Requirements</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Buyers publish detailed product specifications, target quantities, unit of measurement, delivery location, and quotation deadline.
            </p>
            <div className="pt-2 text-xs font-bold text-blue-600 flex items-center space-x-1">
              <span>Zod Schema Validated</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-black text-lg">
              02
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">2. Receive Verified Bids</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Audited manufacturing suppliers discover active opportunities, calculate unit costs, and submit competitive price quotes & lead times.
            </p>
            <div className="pt-2 text-xs font-bold text-amber-600 flex items-center space-x-1">
              <span>Live Quote Calculator</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-4 relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-black text-lg">
              03
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">3. Compare & Award</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Buyers evaluate bids side-by-side using the automated matrix highlighting <strong>Lowest Price</strong>, <strong>Fastest Delivery</strong>, and accept with 1-click escrow protection.
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-600 flex items-center space-x-1">
              <span>Trade Escrow Covered</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Dual Persona Value Proposition Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Enterprise Buyers */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-6 border border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">For Enterprise Buyers</h3>
                <p className="text-xs text-slate-400">Streamline procurement & reduce sourcing costs</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Publish RFQs with custom specs, volume tiers, and target budgets.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Side-by-side offer evaluation matrix automatically awarding Lowest Price & Fastest Shipping.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>1-click offer acceptance with verified trade escrow protection.</span>
              </li>
            </ul>

            <button
              onClick={() => handleQuickLogin('rajesh@sharma-enterprises.in')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-2xl transition shadow-md flex items-center justify-center space-x-2"
            >
              <span>Explore as Buyer (Rajesh Sharma)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* For Verified Suppliers */}
          <div className="bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">For Manufacturing Suppliers</h3>
                <p className="text-xs text-slate-500">Access high-volume B2B buyer requirements</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Browse active industrial requirements filtered by category & delivery location.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Live unit-cost quotation calculator for exact profit & margin estimation.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Track submitted bids, review statuses, and update proposals anytime.</span>
              </li>
            </ul>

            <button
              onClick={() => handleQuickLogin('vikram@malhotra-electronics.in')}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl transition shadow-md flex items-center justify-center space-x-2"
            >
              <span>Explore as Supplier (Vikram Malhotra)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Platform Metrics Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block">₹450 Cr+</span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Procurement Volume</span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-blue-600 block">10,000+</span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Verified Buyers</span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">100%</span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Escrow Protected</span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-500 block">&lt; 2 Hours</span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Avg Quote Response</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
