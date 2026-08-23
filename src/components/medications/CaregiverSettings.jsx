import React from 'react';
import { BellRing, ShieldAlert, Smartphone } from 'lucide-react';

export default function CaregiverSettings({
  caregiverNotify = true,
  escalationDelay = '30',
  onNotifyToggle,
  onDelayChange
}) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-primary-500" />
        <h4 className="font-bold text-text text-base">Caregiver Alert & Escalation Settings</h4>
      </div>

      {/* Toggle */}
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={caregiverNotify}
          onChange={(e) => onNotifyToggle(e.target.checked)}
          className="w-5 h-5 mt-0.5 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
        />
        <div>
          <span className="text-sm font-bold text-text block">
            Notify caregiver if this medication dose is missed
          </span>
          <span className="text-xs text-slate-500">
            Sends an automated push notification and SMS alert to primary contact if organizer lid is not opened.
          </span>
        </div>
      </label>

      {caregiverNotify && (
        <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-4">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <BellRing className="w-4 h-4 text-amber-500" />
            <span>Escalate alert after:</span>
          </label>
          <select
            value={escalationDelay}
            onChange={(e) => onDelayChange(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 min-h-[40px]"
          >
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes (Standard)</option>
            <option value="60">1 Hour</option>
            <option value="120">2 Hours</option>
          </select>
        </div>
      )}
    </div>
  );
}
