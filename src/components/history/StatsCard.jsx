import React from 'react';
import { Award, Flame, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAdherence } from '../../hooks/useAdherence';

export default function StatsCard() {
  const { overallStats } = useAdherence();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Adherence Score */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card flex items-center gap-4">
        <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center p-3">
          <Award className="w-7 h-7" />
        </div>
        <div>
          <div className="text-3xl font-black text-emerald-900">{overallStats.rate}%</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Adherence</div>
          <span className="text-[11px] text-emerald-700 font-semibold">Grade: A+ (Excellent)</span>
        </div>
      </div>

      {/* 2. Streak */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card flex items-center gap-4">
        <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center p-3">
          <Flame className="w-7 h-7 fill-amber-500 text-amber-500" />
        </div>
        <div>
          <div className="text-3xl font-black text-amber-900">{overallStats.streakDays} Days</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Streak</div>
          <span className="text-[11px] text-amber-700 font-semibold">Personal Record!</span>
        </div>
      </div>

      {/* 3. Doses Taken */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card flex items-center gap-4">
        <div className="w-13 h-13 rounded-2xl bg-blue-50 text-primary-600 flex items-center justify-center p-3">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <div className="text-3xl font-black text-primary-900">{overallStats.totalTaken}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doses Confirmed</div>
          <span className="text-[11px] text-primary-700 font-semibold">Logged via Smart Box</span>
        </div>
      </div>

      {/* 4. Missed Doses */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card flex items-center gap-4">
        <div className="w-13 h-13 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center p-3">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div>
          <div className="text-3xl font-black text-rose-900">{overallStats.totalMissed}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Missed Doses</div>
          <span className="text-[11px] text-rose-700 font-semibold">Escalated to Caregiver</span>
        </div>
      </div>

    </div>
  );
}
