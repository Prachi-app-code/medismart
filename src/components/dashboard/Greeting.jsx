import React from 'react';
import { Sun, SunMedium, Sunset, Moon, PhoneCall, Volume2, Sparkles } from 'lucide-react';
import { useCaregiverContext } from '../../context/CaregiverContext';
import { useMedicationContext } from '../../context/MedicationContext';
import { useAuth } from '../../context/AuthContext';
import { getGreetingByTime, formatDate } from '../../utils/dateHelpers';
import { useSpeech } from '../../hooks/useSpeech';

export default function Greeting() {
  const { callEmergencyContact } = useCaregiverContext();
  const { todayDoses } = useMedicationContext();
  const { profile } = useAuth();
  const { speak, isSpeaking } = useSpeech();

  const greeting = getGreetingByTime();
  const pendingDoses = todayDoses.filter(d => d.status === 'pending');
  const todayDateStr = formatDate(new Date(), 'EEEE, MMMM do, yyyy');
  const userName = profile?.full_name || 'Welcome';

  const icons = {
    Sun: <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />,
    SunMedium: <SunMedium className="w-8 h-8 text-blue-500 animate-pulse-subtle" />,
    Sunset: <Sunset className="w-8 h-8 text-rose-500 animate-pulse-subtle" />,
    Moon: <Moon className="w-8 h-8 text-indigo-400" />
  };

  const handleVoiceGuidance = () => {
    if (todayDoses.length === 0) {
      speak(`Hello ${userName}. You do not have any medications scheduled yet. Click Add Medication to begin.`);
    } else if (pendingDoses.length === 0) {
      speak(`Good day, ${userName}. All of your medications for today are complete! You are doing great.`);
    } else {
      speak(`Hello ${userName}. Today is ${todayDateStr}. You have ${pendingDoses.length} dose${pendingDoses.length > 1 ? 's' : ''} left today. Your next medication is ${pendingDoses[0].name} scheduled for ${pendingDoses[0].compartment}.`);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-20 top-2 w-32 h-32 bg-primary-300/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Greeting text */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-2xl">
              {icons[greeting.icon] || icons.Sun}
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase text-primary-100 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
              {todayDateStr}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {greeting.text}, {userName}!
          </h1>

          <p className="text-base sm:text-lg text-primary-100 font-medium leading-relaxed">
            {todayDoses.length === 0 ? (
              <span>
                No prescriptions scheduled for today. Click <strong className="text-white underline decoration-warning decoration-2">+ Add Med</strong> to setup your pill organizer.
              </span>
            ) : pendingDoses.length === 0 ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-200 font-bold">
                <Sparkles className="w-5 h-5 inline" /> Excellent adherence! You have completed all doses for today.
              </span>
            ) : (
              <span>
                You have <strong className="text-white underline decoration-warning decoration-2">{pendingDoses.length} medication{pendingDoses.length > 1 ? 's' : ''}</strong> scheduled for today.
              </span>
            )}
          </p>
        </div>

        {/* Action quick buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <button
            onClick={handleVoiceGuidance}
            className={`px-5 py-3 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-md min-h-[48px] ${
              isSpeaking
                ? 'bg-amber-400 text-slate-900 animate-bounce-soft'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30'
            }`}
          >
            <Volume2 className="w-5 h-5 text-warning" />
            <span>{isSpeaking ? 'Speaking...' : 'Listen to Plan'}</span>
          </button>

          <button
            onClick={() => callEmergencyContact(profile?.id)}
            className="px-5 py-3 rounded-2xl bg-white text-primary-700 hover:bg-primary-50 font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-md min-h-[48px]"
          >
            <PhoneCall className="w-5 h-5 text-danger" />
            <span>Caregiver SOS</span>
          </button>
        </div>

      </div>
    </div>
  );
}
