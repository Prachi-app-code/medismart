import React from 'react';
import { AlertCircle, AlertTriangle, Info, PhoneCall, Send, Check, BellRing } from 'lucide-react';
import { useCaregiverContext } from '../../context/CaregiverContext';

export default function AlertList() {
  const { alerts, dismissAlert, escalateAlert, sendPatientReminder, callEmergencyContact } = useCaregiverContext();

  const severityIcons = {
    high: <AlertCircle className="w-5 h-5 text-rose-600" />,
    medium: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    low: <Info className="w-5 h-5 text-primary-600" />
  };

  const severityStyles = {
    high: 'border-rose-300 bg-rose-50/70',
    medium: 'border-amber-300 bg-amber-50/70',
    low: 'border-primary-200 bg-primary-50/70'
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <BellRing className="w-5 h-5 text-danger" />
          <h3 className="text-xl font-bold text-text">Live Caregiver Alerts & Escalations</h3>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          {alerts.length} Pending
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">All clear! No active caregiver alerts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                severityStyles[alert.severity] || severityStyles.low
              }`}
            >
              {/* Alert Content */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white shadow-2xs">
                  {severityIcons[alert.severity] || severityIcons.low}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-text text-base">{alert.title}</h4>
                    <span className="text-xs font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-md">
                      Patient: {alert.patientName}
                    </span>
                    <span className="text-[11px] text-slate-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-slate-700 mt-1 leading-snug">{alert.message}</p>
                </div>
              </div>

              {/* Alert Actions */}
              <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                <button
                  type="button"
                  onClick={() => sendPatientReminder(alert.patientId)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-text transition-colors flex items-center gap-1.5 min-h-[40px]"
                >
                  <Send className="w-3.5 h-3.5 text-primary-500" />
                  <span>Send Nudge</span>
                </button>

                <button
                  type="button"
                  onClick={() => escalateAlert(alert.id)}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 min-h-[40px]"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Escalate SOS</span>
                </button>

                <button
                  type="button"
                  onClick={() => dismissAlert(alert.id)}
                  aria-label="Dismiss alert"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                  title="Dismiss alert"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
