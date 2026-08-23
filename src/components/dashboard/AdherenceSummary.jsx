import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Flame, TrendingUp } from 'lucide-react';
import ProgressCircle from './ProgressCircle';
import { useMedicationContext } from '../../context/MedicationContext';
import { useAdherence } from '../../hooks/useAdherence';

export default function AdherenceSummary() {
  const { adherence } = useMedicationContext();
  const { weeklyTrend, overallStats } = useAdherence();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-text">Today's Adherence</h2>
          <p className="text-sm text-slate-500">Real-time daily compliance tracking</p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-bold">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{overallStats.streakDays} Day Streak!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Progress Circle */}
        <div className="lg:col-span-5 flex justify-center py-2">
          <ProgressCircle
            percentage={adherence.percentage}
            taken={adherence.taken}
            total={adherence.total}
            size={190}
            strokeWidth={16}
          />
        </div>

        {/* Right: 3 Stat Boxes + 7-Day Trend */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="grid grid-cols-3 gap-3">
            {/* Confirmed */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-emerald-900">{adherence.taken}</div>
              <div className="text-xs font-semibold text-emerald-700">Confirmed</div>
            </div>

            {/* Upcoming */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 text-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-primary-600 flex items-center justify-center mx-auto mb-1.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-primary-900">{adherence.pending}</div>
              <div className="text-xs font-semibold text-primary-700">Upcoming</div>
            </div>

            {/* Missed */}
            <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3.5 text-center">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-1.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-rose-900">{adherence.missed}</div>
              <div className="text-xs font-semibold text-rose-700">Missed</div>
            </div>
          </div>

          {/* 7-Day Trend Bar */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary-500" /> Past 7 Days Adherence
              </span>
              <span className="text-primary-600">{overallStats.rate}% avg</span>
            </div>

            <div className="grid grid-cols-7 gap-2 items-end">
              {weeklyTrend.map((day, idx) => (
                <div key={day.date} className="flex flex-col items-center gap-1.5">
                  <div className="w-full bg-slate-200/80 rounded-lg h-14 flex items-end p-0.5 overflow-hidden">
                    <div
                      className={`w-full rounded-md transition-all duration-500 ${
                        day.percentage >= 90
                          ? 'bg-emerald-500'
                          : day.percentage >= 60
                          ? 'bg-primary-500'
                          : 'bg-amber-400'
                      }`}
                      style={{ height: `${Math.max(15, day.percentage)}%` }}
                      title={`${day.day}: ${day.percentage}% (${day.taken}/${day.total})`}
                    />
                  </div>
                  <span className={`text-[11px] font-bold ${idx === 6 ? 'text-primary-600' : 'text-slate-500'}`}>
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
