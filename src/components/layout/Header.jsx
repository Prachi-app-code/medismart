import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill, Cpu, Volume2, ChevronDown, LogOut, User, LogIn } from 'lucide-react';
import { useMedicationContext } from '../../context/MedicationContext';
import { useSpeech } from '../../hooks/useSpeech';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onOpenSimulator }) {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { todayDoses } = useMedicationContext();
  const { speak, isSpeaking } = useSpeech();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const pendingDoses = todayDoses.filter(d => d.status === 'pending');

  const handleReadSummary = () => {
    const name = profile?.full_name || 'User';
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

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
                100%
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
                  <div className="w-9 h-9 rounded-xl bg-primary-600 text-white font-bold text-sm flex items-center justify-center ring-2 ring-primary-300 shadow-2xs">
                    {getInitials(profile?.full_name || user?.email)}
                  </div>
                  <div className="text-left hidden lg:block pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${roleBadges[profile?.role || 'patient']}`}>
                        {profile?.role || 'Patient'}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-text leading-tight mt-0.5 max-w-[130px] truncate">
                      {profile?.full_name || user?.email || 'Account'}
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
                        <div className="w-11 h-11 rounded-2xl bg-primary-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                          {getInitials(profile?.full_name || user?.email)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-text truncate">{profile?.full_name || 'My Account'}</p>
                          <p className="text-xs text-slate-400 truncate">{profile?.email || user?.email}</p>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border inline-block mt-1 ${roleBadges[profile?.role || 'patient']}`}>
                            {profile?.role || 'Patient'} Account
                          </span>
                        </div>
                      </div>

                      {/* Navigation Link */}
                      <div className="pt-1 px-2">
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
