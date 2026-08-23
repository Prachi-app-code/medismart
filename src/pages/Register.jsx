import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill, Mail, Lock, User, Phone, ShieldCheck, UserPlus, AlertCircle, CheckCircle2, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { signUp, isConfigured } = useAuth();

  const [role, setRole] = useState('patient'); // 'patient', 'caregiver', 'doctor'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const data = await signUp({
        email,
        password,
        fullName,
        role,
        phone,
        emergencyContact,
        doctorName
      });

      if (data?.user && !data?.session && isConfigured) {
        setSuccessMessage('Account created! A confirmation email has been sent to your address. Redirecting to login...');
      } else {
        setSuccessMessage('Account created successfully! Redirecting to your dashboard...');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(data?.session || !isConfigured ? '/' : '/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="max-w-lg w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white shadow-elevated mb-1">
            <Pill className="w-8 h-8 transform -rotate-45" />
          </div>
          <h1 className="text-3xl font-black text-text tracking-tight">Create MediSmart Account</h1>
          <p className="text-sm text-slate-500 font-medium">
            Join the smart adherence platform for patients & care teams
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-5">
          
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-bold text-text mb-2">
              Select Your Role <span className="text-danger">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`p-3 rounded-2xl border-2 text-center transition-all min-h-[70px] ${
                  role === 'patient'
                    ? 'border-primary-500 bg-primary-50 text-primary-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-lg block">👵</span>
                <span className="text-xs font-bold block mt-0.5">Patient</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('caregiver')}
                className={`p-3 rounded-2xl border-2 text-center transition-all min-h-[70px] ${
                  role === 'caregiver'
                    ? 'border-primary-500 bg-primary-50 text-primary-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-lg block">👩‍⚕️</span>
                <span className="text-xs font-bold block mt-0.5">Caregiver</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`p-3 rounded-2xl border-2 text-center transition-all min-h-[70px] ${
                  role === 'doctor'
                    ? 'border-primary-500 bg-primary-50 text-primary-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-lg block">👨‍⚕️</span>
                <span className="text-xs font-bold block mt-0.5">Physician</span>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-text mb-1.5">
              Full Name <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Margaret Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none min-h-[44px]"
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold text-text mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none min-h-[44px]"
              />
            </div>
          </div>

          {/* Role specific field */}
          {role === 'patient' ? (
            <div>
              <label className="block text-sm font-bold text-text mb-1.5">
                Primary Emergency Contact & Phone
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Vance (Daughter) - +1 (555) 987-6543"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none min-h-[44px]"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-text mb-1.5">
                Clinical Specialization or Hospital Affiliation
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Robert Chen (Cardiology Dept)"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none min-h-[44px]"
              />
            </div>
          )}

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-text mb-1.5">
                Password <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text mb-1.5">
                Confirm Password <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Re-type password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none min-h-[44px]"
                />
              </div>
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
                <span>Creating Account...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                <span>Register as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
              </span>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-sm text-slate-500">Already registered? </span>
            <Link
              to="/login"
              className="text-sm font-bold text-primary-600 hover:text-primary-800 underline underline-offset-2"
            >
              Sign In Here
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
}
