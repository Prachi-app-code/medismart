import React from 'react';
import { CheckCircle2, AlertCircle, Clock, ShieldCheck, Cpu } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateHelpers';

export default function TimelineItem({ item, isLast = false }) {
  const isTaken = item.status === 'taken';

  return (
    <div className="relative flex gap-4">
      {/* Timeline spine line */}
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-200" />
      )}

      {/* Status icon node */}
      <div className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs ${
        isTaken ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
      }`}>
        {isTaken ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      </div>

      {/* Content card */}
      <div className="flex-1 pb-6">
        <div className={`p-4 rounded-2xl border transition-all ${
          isTaken ? 'bg-white border-slate-200' : 'bg-rose-50/40 border-rose-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
            <h4 className="text-base font-bold text-text">{item.medName}</h4>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                isTaken ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {item.status}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{formatDate(item.date, 'MMM dd')}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-primary-500" />
              Scheduled: {formatTime(item.scheduledTime)} ({item.compartment})
            </span>
            {item.loggedTime && (
              <span className="text-emerald-700 font-medium">
                • Confirmed at {formatTime(item.loggedTime.split('T')[1]?.slice(0, 5) || '08:12')}
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              {item.confirmedBy || 'Smart Pillbox Sensor'}
            </span>
          </div>

          {item.notes && (
            <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
              Note: {item.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
