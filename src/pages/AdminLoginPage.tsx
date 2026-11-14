import React, { useState } from 'react';
import { useTrade } from '../context/TradeContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  LogIn,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, initializeAdmin, isAdminSetupRequired, navigateTo, settings } = useTrade();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMessage('');
    if (isAdminSetupRequired && password.length < 12) {
      setErrorMessage('Use a password with at least 12 characters.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = isAdminSetupRequired
        ? await initializeAdmin(username, password)
        : await loginAdmin(username, password);
      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {settings.brandName} Storefront</span>
        </button>

        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-700/40 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Protected Admin Route</span>
        </div>
      </div>

      {/* Centered Login Card */}
      <div className="w-full max-w-md mx-auto my-8">
        <div className="bg-white text-slate-900 rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-slate-950 px-6 py-6 sm:px-8 sm:py-7 text-center border-b border-slate-800 space-y-3">
            <img
              src="/assets/aistudio/Catify_Trade_Circular_Logo_df00bcb5.png"
              alt="Catify Trade Emblem"
              referrerPolicy="no-referrer"
              className="w-16 h-16 mx-auto rounded-full object-contain bg-white border-2 border-amber-400 shadow-lg"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Authentication</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Catify Trade Console
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Sign in with your administrator email and password to access the dashboard.
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="admin-username" className="block text-xs font-bold text-slate-700">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-username"
                  type="email"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@yourcompany.com"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:bg-white disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:bg-white disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>



            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-950 to-blue-900 hover:from-blue-900 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-400 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>
                {isSubmitting ? 'Please wait…' : 'Login to Admin Dashboard'}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-[11px] text-slate-400">
        {settings.brandName} · Secured Operations Gateway · Access restricted to authorized staff
      </div>
    </div>
  );
};
