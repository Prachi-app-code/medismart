import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, HeartPulse, Send, PhoneCall, AlertTriangle, FileText, UserPlus } from 'lucide-react';
import PatientCard from './PatientCard';
import AlertList from './AlertList';
import ExportModal from '../history/ExportModal';
import { useCaregiverContext } from '../../context/CaregiverContext';
import { useMedicationContext } from '../../context/MedicationContext';
import { useAuth } from '../../context/AuthContext';

export default function PatientList() {
  const { patients, activePatient, switchPatient, sendPatientReminder, callEmergencyContact } = useCaregiverContext();
  const { medications } = useMedicationContext();
  const { profile } = useAuth();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-500 text-white font-black text-2xl flex items-center justify-center shadow-lg">
            {getInitials(profile?.full_name || 'Care Team')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{profile?.full_name || 'Caregiver Portal'}</h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">
                {profile?.role || 'Caregiver'}
              </span>
            </div>
            <p className="text-sm text-slate-300">
              {profile?.doctor_name ? `${profile.doctor_name} • ` : ''}Real-Time Adherence Monitoring Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-2 border border-white/20 transition-all min-h-[44px]"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Doctor Report</span>
          </button>
        </div>
      </div>

      {/* Multi-Patient Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-text flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            <span>Monitored Patients ({patients.length})</span>
          </h3>
          {patients.length > 0 && (
            <span className="text-xs text-slate-400 font-semibold">Click a patient to switch dashboard view</span>
          )}
        </div>

        {patients.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-200 text-center space-y-3">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <UserPlus className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-text">No Monitored Patients Linked Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Patients who register and assign your account as their primary caregiver will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                isSelected={patient.id === activePatient?.id}
                onSelect={() => switchPatient(patient.id)}
                onSendReminder={sendPatientReminder}
                onCall={callEmergencyContact}
              />
            ))}
          </div>
        )}
      </div>

      {/* Live Alerts Feed */}
      <AlertList />

      {/* Selected Patient Overview Summary */}
      {activePatient && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
          <h3 className="text-lg font-bold text-text pb-3 border-b border-slate-100">
            Active Medication Plan for {activePatient.name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Prescriptions ({medications.length})</span>
              {medications.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No prescriptions logged.</p>
              ) : (
                <div className="space-y-2">
                  {medications.map(med => (
                    <div key={med.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-sm">
                      <div>
                        <span className="font-bold text-text">{med.name}</span>
                        <span className="text-xs text-slate-500 ml-2">({med.dosage})</span>
                      </div>
                      <span className="text-xs bg-primary-50 text-primary-700 font-bold px-2 py-0.5 rounded-md">
                        {med.compartment}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Care Team & Emergency Details</span>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-600">
                <p><strong className="text-text">Primary Physician:</strong> {activePatient.doctor || 'Unassigned'}</p>
                <p><strong className="text-text">Patient Phone:</strong> {activePatient.phone || 'N/A'}</p>
                <p><strong className="text-text">Emergency Hotline:</strong> {activePatient.emergencyContact || 'N/A'}</p>
                <p><strong className="text-text">Smart Box Telemetry:</strong> {activePatient.organizerId ? `Box ${activePatient.organizerId}` : 'Not paired'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Report Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

    </div>
  );
}
