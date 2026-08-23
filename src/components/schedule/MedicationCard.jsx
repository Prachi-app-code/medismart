import React from 'react';
import { Clock, Volume2, CheckCircle2, AlertCircle, Edit3, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { formatTime } from '../../utils/dateHelpers';
import { useSpeech } from '../../hooks/useSpeech';

export default function MedicationCard({
  dose,
  onConfirm,
  onSnooze,
  onMarkMissed,
  onEdit
}) {
  const { speak } = useSpeech();

  const isTaken = dose.status === 'taken';
  const isMissed = dose.status === 'missed';
  const isSnoozed = dose.status === 'snoozed';

  const handleSpeak = () => {
    speak(`${dose.name}, ${dose.dosage}. Take for ${dose.compartment} at ${formatTime(dose.time)}. Note: ${dose.notes || 'No special food requirements.'}`);
  };

  return (
    <div
      className={`card transition-all duration-200 border-2 ${
        isTaken
          ? 'bg-emerald-50/30 border-emerald-200'
          : isMissed
          ? 'bg-rose-50/30 border-rose-200'
          : isSnoozed
          ? 'bg-amber-50/30 border-amber-200'
          : 'bg-white border-slate-200 hover:border-primary-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left Side: Pill visual & Info */}
        <div className="flex items-start gap-3.5">
          {/* Time Block */}
          <div className="p-3 bg-slate-100 rounded-2xl flex flex-col items-center justify-center min-w-[70px] text-center">
            <Clock className="w-4 h-4 text-primary-500 mb-0.5" />
            <span className="text-xs font-bold text-slate-800">{formatTime(dose.time)}</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase">{dose.compartment}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="w-3.5 h-3.5 rounded-full border shadow-2xs inline-block"
                style={{ backgroundColor: dose.pillColor === 'White' ? '#FFFFFF' : dose.pillColor || '#3A84E6', borderColor: '#94A3B8' }}
              />
              <h3 className="text-lg font-bold text-text">{dose.name}</h3>
              <span className="bg-primary-50 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {dose.dosage}
              </span>
              <span className="text-xs text-slate-400 font-medium">{dose.form || 'Tablet'}</span>
            </div>

            {dose.notes && (
              <p className="text-sm text-slate-600 font-medium">
                👉 {dose.notes}
              </p>
            )}

            {dose.instructions && (
              <p className="text-xs text-slate-400">
                Care note: {dose.instructions}
              </p>
            )}

            {dose.caregiverNotify && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-primary-600">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Caregiver escalation active</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Actions & Status */}
        <div className="flex items-center gap-2.5 self-end sm:self-center flex-wrap">
          
          <button
            type="button"
            onClick={handleSpeak}
            aria-label={`Read ${dose.name} instructions`}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Read instructions aloud"
          >
            <Volume2 className="w-5 h-5 text-primary-600" />
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${dose.name}`}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Edit medication"
            >
              <Edit3 className="w-5 h-5 text-slate-600" />
            </button>
          )}

          {isTaken ? (
            <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 px-4 py-2.5 rounded-xl font-bold text-sm min-h-[44px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Taken {dose.confirmedAt ? `at ${dose.confirmedAt}` : 'Today'}</span>
            </div>
          ) : isMissed ? (
            <div className="flex items-center gap-1.5 bg-rose-100 text-rose-900 border border-rose-300 px-4 py-2.5 rounded-xl font-bold text-sm min-h-[44px]">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Missed</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {onSnooze && (
                <button
                  type="button"
                  onClick={onSnooze}
                  className="px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors min-h-[44px]"
                >
                  Snooze
                </button>
              )}
              {onConfirm && (
                <button
                  type="button"
                  onClick={onConfirm}
                  className="btn-success text-sm px-5 py-2.5 shadow-sm"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Confirm</span>
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
