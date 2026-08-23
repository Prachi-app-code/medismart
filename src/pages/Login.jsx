import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Pill, Mail, Lock, Eye, EyeOff, LogIn, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loginWithDemoRole, isConfigured } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (roleKey) => {
    loginWithDemoRole(roleKey);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white shadow-elevated mb-2">
            <Pill className="w-9 h-9 transform -rotate-45" />
          </div>
          <h1 className="text-3xl font-black text-text tracking-tight">Welcome to MediSmart</h1>
          <p className="text-sm text-slate-500 font-medium">
            Smart Medication Adherence & IoT Dispenser Portal
          </p>
        </div>

        {/* Backend Status Banner */}
        <div className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
          isConfigured 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-blue-50 text-primary-800 border-blue-200'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-primary-500'}`} />
          <span>
            {isConfigured ? 'Supabase Backend Connected (Live Cloud Auth)' : 'Demo Sandbox Mode Active (1-Click Login Available)'}
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Logins */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span>Instant Demo Accounts (Click to Test)</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('patient')}
              className="p-3 bg-slate-50 hover:bg-primary-50 hover:border-primary-300 border border-slate-200 rounded-2xl text-center transition-all group min-h-[44px]"
            >
              <span className="text-lg block">👵</span>
              <span className="text-xs font-bold text-slate-700 group-hover:text-primary-700 block mt-0.5">
                Patient
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('caregiver')}
              className="p-3 bg-slate-50 hover:bg-primary-50 hover:border-primary-300 border border-slate-200 rounded-2xl text-center transition-all group min-h-[44px]"
            >
              <span className="text-lg block">👩‍⚕️</span>
              <span className="text-xs font-bold text-slate-700 group-hover:text-primary-700 block mt-0.5">
                Caregiver
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('doctor')}
              className="p-3 bg-slate-50 hover:bg-primary-50 hover:border-primary-300 border border-slate-200 rounded-2xl text-center transition-all group min-h-[44px]"
            >
              <span className="text-lg block">👨‍⚕️</span>
              <span className="text-xs font-bold text-slate-700 group-hover:text-primary-700 block mt-0.5">
                Doctor
              </span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-5">
          
          <div>
            <label className="block text-sm font-bold text-text mb-1.5">
              Email Address <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-bold text-text">
                Password <span className="text-danger">*</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-primary-600 hover:text-primary-800"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none min-h-[44px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-base py-3.5 shadow-md hover:scale-[1.01] transition-all min-h-[50px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </span>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-sm text-slate-500">Don't have an account? </span>
            <Link
              to="/register"
              className="text-sm font-bold text-primary-600 hover:text-primary-800 underline underline-offset-2"
            >
              Create Account
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
}
