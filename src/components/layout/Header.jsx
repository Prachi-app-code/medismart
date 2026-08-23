import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Pill, Cpu, Volume2, ChevronDown, CheckCircle, LogOut, User, Sparkles, LogIn } from 'lucide-react';
import { useMedicationContext } from '../../context/MedicationContext';
import { useCaregiverContext } from '../../context/CaregiverContext';
import { useSpeech } from '../../hooks/useSpeech';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onOpenSimulator }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, loginWithDemoRole, isConfigured } = useAuth();
  const { todayDoses } = useMedicationContext();
  const { patients, activePatient, switchPatient } = useCaregiverContext();
  const { speak, isSpeaking } = useSpeech();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const pendingDoses = todayDoses.filter(d => d.status === 'pending');

  const handleReadSummary = () => {
    const name = profile?.full_name || activePatient.name;
    if (pendingDoses.length === 0) {
      speak(`Hello ${name}. All of your medications for today are taken! Great job.`);
    } else {
      const nextDose = pendingDoses[0];
      speak(`Hello ${name}. You have ${pendingDoses.length} medications remaining today. Next is ${nextDose.name} ${nextDose.dosage} for ${nextDose.compartment}. ${nextDose.notes || ''}`);
    }
  };

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await signOut();
    navigate('/login');
  };

  const roleBadges = {
    patient: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    caregiver: 'bg-blue-50 text-primary-800 border-blue-200',
    doctor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Pill className="w-7 h-7 transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-text">
                  Medi<span className="text-primary-500">Smart</span>
                </span>
                <span className="bg-primary-50 text-primary-600 text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider hidden sm:inline-block">
                  v2.4
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Smart Adherence & Pillbox</p>
            </div>
          </Link>

          {/* Center / Right controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Senior Voice Readout Assistant */}
            <button
              onClick={handleReadSummary}
              aria-label="Read schedule aloud"
              className={`p-3 rounded-2xl border transition-all flex items-center gap-2 font-medium text-sm min-h-[44px] ${
                isSpeaking 
                  ? 'bg-primary-500 text-white border-primary-500 animate-pulse' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-text'
              }`}
              title="Click to hear today's medication summary aloud"
            >
              <Volume2 className="w-5 h-5 text-primary-500" />
              <span className="hidden md:inline font-semibold">Voice Readout</span>
            </button>

            {/* Smart Pillbox Hardware Connection Status */}
            <button
              onClick={onOpenSimulator}
              aria-label="Open Smart Pillbox Simulator"
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all flex items-center gap-2 text-sm font-semibold min-h-[44px]"
              title="Smart Pillbox Connected. Click to open Hardware Testing Simulator."
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <Cpu className="w-4 h-4 text-emerald-600 hidden sm:inline" />
              <span className="hidden sm:inline">Pillbox: <strong className="text-emerald-900">{profile?.organizer_id || 'BOX-8492'}</strong></span>
              <span className="text-xs bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full font-bold ml-1">
                92%
              </span>
            </button>

            {/* User Profile / Auth Dropdown */}
            {user || profile ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all min-h-[44px]"
                  aria-haspopup="true"
                  aria-expanded={userDropdownOpen}
                >
                  <img
                    src={profile?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'}
                    alt={profile?.full_name || 'User'}
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-primary-400 shadow-2xs"
                  />
                  <div className="text-left hidden lg:block pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${roleBadges[profile?.role || 'patient']}`}>
                        {profile?.role || 'Patient'}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-text leading-tight mt-0.5 max-w-[120px] truncate">
                      {profile?.full_name || 'User'}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-40 animate-fadeIn space-y-2">
                      
                      {/* User Info Header */}
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-3">
                        <img
                          src={profile?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'}
                          alt={profile?.full_name}
                          className="w-11 h-11 rounded-2xl object-cover ring-2 ring-primary-500"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-text truncate">{profile?.full_name}</p>
                          <p className="text-xs text-slate-400 truncate">{profile?.email || user?.email}</p>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border inline-block mt-1 ${roleBadges[profile?.role || 'patient']}`}>
                            {profile?.role || 'Patient'} Account
                          </span>
                        </div>
                      </div>

                      {/* Quick Switch Demo Roles */}
                      <div className="px-3 py-1">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-primary-500" />
                          <span>Switch Demo Role</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              loginWithDemoRole('patient');
                              setUserDropdownOpen(false);
                            }}
                            className="p-1.5 text-center hover:bg-primary-50 rounded-xl transition-colors text-xs font-semibold text-slate-700"
                          >
                            👵 Patient
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              loginWithDemoRole('caregiver');
                              setUserDropdownOpen(false);
                            }}
                            className="p-1.5 text-center hover:bg-primary-50 rounded-xl transition-colors text-xs font-semibold text-slate-700"
                          >
                            👩‍⚕️ Caregiver
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              loginWithDemoRole('doctor');
                              setUserDropdownOpen(false);
                            }}
                            className="p-1.5 text-center hover:bg-primary-50 rounded-xl transition-colors text-xs font-semibold text-slate-700"
                          >
                            👨‍⚕️ Doctor
                          </button>
                        </div>
                      </div>

                      {/* Navigation Link */}
                      <div className="border-t border-slate-100 pt-2 px-2">
                        <Link
                          to="/caregiver"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-primary-600 hover:bg-primary-50 rounded-xl transition-colors flex items-center justify-between"
                        >
                          <span>Caregiver & Patient Portal</span>
                          <span>→</span>
                        </Link>
                      </div>

                      {/* Sign Out Button */}
                      <div className="border-t border-slate-100 pt-2 px-2">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full text-left px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>

                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary text-xs sm:text-sm px-4 py-2.5 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
