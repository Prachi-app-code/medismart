import React from 'react';
import { Cpu, Wifi, BatteryCharging, Volume2, BellRing, RefreshCw, CheckCircle2, Lock, Unlock } from 'lucide-react';
import { COMPARTMENTS } from '../../utils/constants';
import { useMedicationContext } from '../../context/MedicationContext';
import { audioChime } from '../../utils/audioSynth';
import Modal from '../shared/Modal';

export default function HardwareSimulatorModal({ isOpen, onClose }) {
  const { organizerState, toggleCompartmentLid, setOrganizerState, resetTodayDoses, todayDoses } = useMedicationContext();

  const handleTestChime = () => {
    audioChime.playReminder();
  };

  const handleTestAlarm = () => {
    audioChime.playAlert();
  };

  const handleTestSuccess = () => {
    audioChime.playSuccess();
  };

  const toggleConnection = () => {
    setOrganizerState(prev => ({
      ...prev,
      connected: !prev.connected,
      syncStatus: !prev.connected ? 'Live (Bluetooth Low Energy 5.2)' : 'Offline / Reconnecting...'
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Smart Pillbox Hardware Testing Lab"
      subtitle="Interactive simulator for 4-compartment IoT dispenser hardware"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        
        {/* Device Status Bar */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm">BOX-MED-8492</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  organizerState.connected ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                }`}>
                  {organizerState.connected ? 'BLE 5.2 ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Firmware: v3.2.1 • Nordic nRF52840 SoC</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleConnection}
              className="text-xs font-bold px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
            >
              {organizerState.connected ? 'Simulate Disconnect' : 'Reconnect BLE'}
            </button>
          </div>
        </div>

        {/* 4 Interactive Compartments Sensor Trigger */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Magnetic Reed Sensor / Lid Trigger
            </h4>
            <span className="text-xs text-primary-600 font-semibold">
              Opening a lid simulates patient taking pills!
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {COMPARTMENTS.map((comp) => {
              const state = organizerState.compartments[comp.id] || { lidOpen: false, ledStatus: 'idle' };
              const compDoses = todayDoses.filter(d => d.compartment === comp.id);
              const pendingDose = compDoses.find(d => d.status === 'pending');

              return (
                <div
                  key={comp.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between min-h-[160px] ${
                    state.lidOpen
                      ? 'border-primary-500 bg-primary-50/40 shadow-sm'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-text text-sm">{comp.label}</h5>
                      <span className="text-xs text-slate-500">{comp.timeLabel}</span>
                    </div>
                    {state.lidOpen ? (
                      <Unlock className="w-5 h-5 text-primary-600" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="my-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase ${
                      state.ledStatus === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : state.ledStatus === 'active'
                        ? 'bg-emerald-200 text-emerald-900 animate-pulse'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      LED: {state.ledStatus}
                    </span>
                    {pendingDose && (
                      <p className="text-[11px] text-primary-700 font-semibold mt-1 truncate">
                        Due: {pendingDose.name}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCompartmentLid(comp.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      state.lidOpen
                        ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        : 'bg-primary-500 hover:bg-primary-600 text-white shadow-xs'
                    }`}
                  >
                    {state.lidOpen ? 'Close Lid' : 'Simulate Lid Open'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audio & Buzzer Test Controls */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Hardware Audio & Buzzer Synthesizer
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={handleTestChime}
              className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <Volume2 className="w-4 h-4 text-primary-500" />
              <span>Test Reminder Chime</span>
            </button>

            <button
              type="button"
              onClick={handleTestSuccess}
              className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Test Dose Success</span>
            </button>

            <button
              type="button"
              onClick={handleTestAlarm}
              className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <BellRing className="w-4 h-4 text-rose-500" />
              <span>Test Alert Buzzer</span>
            </button>
          </div>
        </div>

        {/* Reset Demo Data Trigger */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <button
            type="button"
            onClick={resetTodayDoses}
            className="text-xs font-bold text-slate-600 hover:text-text bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 min-h-[40px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Schedule for Testing</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn-primary text-xs sm:text-sm px-6 py-2.5"
          >
            Done
          </button>
        </div>

      </div>
    </Modal>
  );
}
