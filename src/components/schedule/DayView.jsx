import React, { useState } from 'react';
import { COMPARTMENTS } from '../../utils/constants';
import MedicationCard from './MedicationCard';
import { useMedicationContext } from '../../context/MedicationContext';
import { Filter } from 'lucide-react';

export default function DayView({ selectedDate, onEditMed }) {
  const { todayDoses, confirmDose, snoozeDose, markMissed } = useMedicationContext();
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, taken, missed

  const filteredDoses = todayDoses.filter(d => {
    if (statusFilter === 'all') return true;
    return d.status === statusFilter;
  });

  if (todayDoses.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-card text-center space-y-4">
        <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mx-auto">
          <Filter className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-text">No Medications Scheduled</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You haven't added any prescriptions to your schedule yet. Add a medication to begin tracking your doses.
          </p>
        </div>
        <a
          href="/add"
          className="btn-primary text-sm px-6 py-3 inline-flex items-center gap-2 shadow-md"
        >
          <span>+ Add Your First Medication</span>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Filter Chips */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase">Filter Status:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'pending', 'taken', 'missed'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all min-h-[38px] ${
                statusFilter === status
                  ? 'bg-primary-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status} ({status === 'all' ? todayDoses.length : todayDoses.filter(d => d.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* Compartment Timeline Sections */}
      <div className="space-y-6">
        {COMPARTMENTS.map((comp) => {
          const compDoses = filteredDoses.filter(d => d.compartment === comp.id);
          if (compDoses.length === 0 && statusFilter !== 'all') return null;

          return (
            <div key={comp.id} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: comp.color }} />
                <h3 className="text-base font-bold text-text">
                  {comp.label} <span className="text-xs text-slate-500 font-medium">({comp.timeLabel})</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400">
                  {compDoses.length} {compDoses.length === 1 ? 'dose' : 'doses'}
                </span>
                <div className="flex-1 border-t border-slate-200/80" />
              </div>

              {compDoses.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 italic">
                  No medications matching filter in {comp.label}.
                </div>
              ) : (
                <div className="space-y-3">
                  {compDoses.map((dose) => (
                    <MedicationCard
                      key={dose.id}
                      dose={dose}
                      onConfirm={() => confirmDose(dose.id)}
                      onSnooze={() => snoozeDose(dose.id, 15)}
                      onMarkMissed={() => markMissed(dose.id)}
                      onEdit={() => onEditMed && onEditMed(dose.medId)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
