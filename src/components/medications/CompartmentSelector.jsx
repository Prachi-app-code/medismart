import React from 'react';
import { Sun, SunMedium, Sunset, Moon, Check } from 'lucide-react';
import { COMPARTMENTS } from '../../utils/constants';

export default function CompartmentSelector({ value, onChange }) {
  const iconMap = {
    Sun: Sun,
    SunMedium: SunMedium,
    Sunset: Sunset,
    Moon: Moon
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-text">
        Smart Pill Organizer Compartment <span className="text-danger">*</span>
      </label>
      <p className="text-xs text-slate-500">
        Choose which physical slot will illuminate when this medication is due:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {COMPARTMENTS.map((comp) => {
          const Icon = iconMap[comp.icon] || Sun;
          const isSelected = value === comp.id;

          return (
            <button
              key={comp.id}
              type="button"
              onClick={() => onChange(comp.id)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center relative min-h-[96px] cursor-pointer ${
                isSelected
                  ? 'border-primary-500 bg-primary-50/80 shadow-md ring-2 ring-primary-200'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary-500 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className={`p-2.5 rounded-xl ${comp.bgLight} mb-2`}>
                <Icon className="w-6 h-6" style={{ color: comp.color }} />
              </div>

              <span className={`text-sm font-bold ${isSelected ? 'text-primary-900' : 'text-text'}`}>
                {comp.label}
              </span>
              <span className="text-xs text-slate-500 font-medium">{comp.timeLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
