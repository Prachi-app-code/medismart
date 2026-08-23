import React from 'react';
import { Sun, SunMedium, Sunset, Moon, Wifi, BatteryCharging, Check, Bell, Lock, Unlock } from 'lucide-react';
import { COMPARTMENTS } from '../../utils/constants';
import { useMedicationContext } from '../../context/MedicationContext';

export default function OrganizerStatus({ onOpenSimulator }) {
  const { organizerState, toggleCompartmentLid, todayDoses } = useMedicationContext();

  const iconMap = {
    Sun: Sun,
    SunMedium: SunMedium,
    Sunset: Sunset,
    Moon: Moon
  };

  const getLedVisual = (ledStatus) => {
    switch (ledStatus) {
      case 'active':
        return {
          glow: 'led-glow-active',
          color: 'bg-emerald-400 border-emerald-300',
          label: 'Active (Dose Due Now)',
          labelColor: 'text-emerald-700 bg-emerald-100',
          text: 'TAKE NOW'
        };
      case 'alert':
        return {
          glow: 'led-glow-alert',
          color: 'bg-rose-500 border-rose-400',
          label: 'Missed Dose Alert',
          labelColor: 'text-rose-700 bg-rose-100',
          text: 'MISSED'
        };
      case 'warning':
        return {
          glow: 'led-glow-warning',
          color: 'bg-amber-400 border-amber-300',
          label: 'Approaching Time',
          labelColor: 'text-amber-700 bg-amber-100',
          text: 'SOON'
        };
      case 'completed':
        return {
          glow: '',
          color: 'bg-emerald-500 border-emerald-400',
          label: 'Dose Confirmed',
          labelColor: 'text-emerald-700 bg-emerald-50',
          text: 'TAKEN'
        };
      default:
        return {
          glow: '',
          color: 'bg-slate-300 border-slate-200',
          label: 'Standby',
          labelColor: 'text-slate-500 bg-slate-100',
          text: 'IDLE'
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
      
      {/* Top Bar: Device Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-text">Smart Pill Organizer</h2>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Connected
            </span>
          </div>
          <p className="text-sm text-slate-500">4-Compartment Smart Dispenser (BOX-8492)</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <BatteryCharging className="w-4 h-4 text-emerald-500" />
            <span>{organizerState.battery}% Battery</span>
          </div>
          
          <button
            onClick={onOpenSimulator}
            className="text-xs font-bold text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-xl transition-colors min-h-[36px]"
          >
            Hardware Lab ↗
          </button>
        </div>
      </div>

      {/* 4 Compartment Physical Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {COMPARTMENTS.map((comp) => {
          const state = organizerState.compartments[comp.id] || { lidOpen: false, ledStatus: 'idle', pillCount: 0 };
          const Icon = iconMap[comp.icon] || Sun;
          const ledVisual = getLedVisual(state.ledStatus);
          const compDoses = todayDoses.filter(d => d.compartment === comp.id);

          return (
            <div
              key={comp.id}
              className={`relative rounded-2xl border-2 transition-all p-4 flex flex-col justify-between min-h-[220px] ${
                state.ledStatus === 'active'
                  ? 'border-emerald-400 bg-emerald-50/30 shadow-md ring-2 ring-emerald-200'
                  : state.ledStatus === 'alert'
                  ? 'border-rose-400 bg-rose-50/30 shadow-md ring-2 ring-rose-200'
                  : state.lidOpen
                  ? 'border-primary-400 bg-primary-50/20'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              {/* Header inside compartment */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${comp.bgLight} text-slate-700`}>
                    <Icon className="w-5 h-5" style={{ color: comp.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text text-base">{comp.label}</h3>
                    <span className="text-xs text-slate-500 font-medium">{comp.timeLabel}</span>
                  </div>
                </div>

                {/* LED Indicator Ring */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${ledVisual.color} ${ledVisual.glow} transition-all duration-300`}
                    title={`LED: ${ledVisual.label}`}
                  />
                  <span className="text-[9px] font-black text-slate-400 mt-1 uppercase">LED</span>
                </div>
              </div>

              {/* Middle: Pill summary */}
              <div className="my-3 py-2 px-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Medications ({compDoses.length})
                </div>
                {compDoses.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No doses scheduled</p>
                ) : (
                  <div className="space-y-1">
                    {compDoses.map(dose => (
                      <div key={dose.id} className="flex items-center justify-between text-xs font-medium">
                        <span className="truncate pr-1 text-slate-800">{dose.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold uppercase ${
                          dose.status === 'taken' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : dose.status === 'missed' 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {dose.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom: Lid Status & Simulator Trigger */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {state.lidOpen ? (
                    <span className="text-primary-600 flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" /> Lid Open
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Lid Closed
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleCompartmentLid(comp.id)}
                  aria-label={`Simulate opening ${comp.label} lid`}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all min-h-[36px] ${
                    state.lidOpen
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                      : 'bg-primary-500 hover:bg-primary-600 text-white shadow-xs active:scale-95'
                  }`}
                >
                  {state.lidOpen ? 'Close Lid' : 'Test Open'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
