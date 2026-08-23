import React from 'react';
import { BatteryCharging, Wifi, WifiOff, Phone, Send, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useCaregiverContext } from '../../context/CaregiverContext';

export default function PatientCard({
  patient,
  isSelected,
  onSelect,
  onSendReminder,
  onCall
}) {
  return (
    <div
      onClick={onSelect}
      className={`card transition-all duration-200 border-2 cursor-pointer ${
        isSelected
          ? 'border-primary-500 bg-primary-50/20 shadow-md ring-2 ring-primary-200'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-card-hover'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left: Patient Profile */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={patient.avatar}
              alt={patient.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-400 shadow-sm"
            />
            {patient.online ? (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Online" />
            ) : (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-400 border-2 border-white rounded-full" title="Offline" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-text">{patient.name}</h3>
              {isSelected && (
                <span className="bg-primary-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">{patient.relation} • Age {patient.age}</p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Box: {patient.organizerId}</p>
          </div>
        </div>

        {/* Middle: Adherence & Hardware */}
        <div className="flex items-center gap-6 self-start sm:self-center">
          <div className="text-center">
            <div className="text-2xl font-black text-emerald-600">{patient.todayAdherence}%</div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Today Adherence</span>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-medium">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
              <span>{patient.battery}% Battery</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              {patient.online ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-700">Synced {patient.lastSync}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-400">Offline ({patient.lastSync})</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSendReminder(patient.id);
            }}
            className="p-3 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Send Chime Nudge to Smart Pillbox"
          >
            <Send className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCall(patient.id);
            }}
            className="p-3 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Call emergency phone number"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
