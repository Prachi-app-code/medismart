import React from 'react';
import { Check, Clock, Volume2, AlertCircle, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { useMedicationContext } from '../../context/MedicationContext';
import { formatTime } from '../../utils/dateHelpers';
import { useSpeech } from '../../hooks/useSpeech';

export default function TodaySchedule() {
  const { todayDoses, confirmDose, snoozeDose, markMissed } = useMedicationContext();
  const { speak } = useSpeech();

  const handleSpeakMed = (dose) => {
    speak(`${dose.name}, ${dose.dosage}. Scheduled for ${dose.compartment} at ${formatTime(dose.time)}. Special instruction: ${dose.notes || 'Take as prescribed.'}`);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-text">Today's Medication Schedule</h2>
          <p className="text-sm text-slate-500">Touch 'Confirm' once you have taken your pills</p>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          {todayDoses.length} Meds Scheduled
        </span>
      </div>

      {todayDoses.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">No medications scheduled for today.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todayDoses.map((dose) => {
            const isTaken = dose.status === 'taken';
            const isMissed = dose.status === 'missed';
            const isSnoozed = dose.status === 'snoozed';

            return (
              <div
                key={dose.id}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isTaken
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : isMissed
                    ? 'bg-rose-50/40 border-rose-200'
                    : isSnoozed
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-white border-slate-200/90 hover:border-primary-300 shadow-xs'
                }`}
              >
                {/* Left: Time & Pill details */}
                <div className="flex items-start gap-4">
                  {/* Time Badge */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 text-slate-800 font-bold min-w-[76px] text-center">
                    <Clock className="w-4 h-4 text-primary-500 mb-1" />
                    <span className="text-xs leading-tight">{formatTime(dose.time)}</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">{dose.compartment}</span>
                  </div>

                  {/* Pill Visual & Name */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {/* Pill Shape Indicator */}
                      <span
                        className="w-4 h-4 rounded-full border shadow-2xs inline-block"
                        style={{
                          backgroundColor: dose.pillColor === 'White' ? '#FFFFFF' : dose.pillColor || '#3A84E6',
                          borderColor: '#94A3B8'
                        }}
                        title={`Pill Color: ${dose.pillColor || 'White'}`}
                      />
                      <h3 className="text-lg sm:text-xl font-bold text-text">{dose.name}</h3>
                      <span className="bg-slate-100 text-slate-700 font-bold text-xs px-2.5 py-0.5 rounded-full">
                        {dose.dosage}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">({dose.form || 'Tablet'})</span>
                    </div>

                    {dose.notes && (
                      <p className="text-sm text-slate-600 font-medium flex items-center gap-1.5">
                        <span className="text-primary-500 font-bold">•</span> {dose.notes}
                      </p>
                    )}

                    {dose.instructions && (
                      <p className="text-xs text-slate-400 font-normal">
                        Instruction: {dose.instructions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions & Status */}
                <div className="flex items-center gap-3 self-end md:self-center flex-wrap">
                  
                  {/* Voice Button */}
                  <button
                    onClick={() => handleSpeakMed(dose)}
                    aria-label={`Read ${dose.name} instructions aloud`}
                    className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Read instructions aloud"
                  >
                    <Volume2 className="w-5 h-5 text-primary-600" />
                  </button>

                  {/* Main Action or Completed Badge */}
                  {isTaken ? (
                    <div className="flex items-center gap-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-5 py-2.5 rounded-xl font-bold text-sm min-h-[44px]">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Taken at {dose.confirmedAt || '08:12 AM'}</span>
                    </div>
                  ) : isMissed ? (
                    <div className="flex items-center gap-2 bg-rose-100 text-rose-900 border border-rose-300 px-4 py-2.5 rounded-xl font-bold text-sm min-h-[44px]">
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                      <span>Missed Dose</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => snoozeDose(dose.id, 15)}
                        aria-label={`Snooze ${dose.name}`}
                        className="px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold transition-colors min-h-[44px]"
                      >
                        Snooze 15m
                      </button>

                      <button
                        type="button"
                        onClick={() => confirmDose(dose.id)}
                        aria-label={`Confirm dose for ${dose.name}`}
                        className="btn-success text-sm sm:text-base px-6 py-3 shadow-md hover:scale-102 transition-transform"
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                        <span>Confirm Dose</span>
                      </button>
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
