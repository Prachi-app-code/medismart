import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Send, AlertTriangle, ArrowRight, UserPlus } from 'lucide-react';
import { useCaregiverContext } from '../../context/CaregiverContext';
import { useAuth } from '../../context/AuthContext';

export default function CaregiverQuickView() {
  const { activePatient, alerts, sendPatientReminder, callEmergencyContact } = useCaregiverContext();
  const { profile } = useAuth();
  const patientAlerts = alerts.filter(a => activePatient && a.patientId === activePatient.id && !a.actionTaken);

  const emergencyContact = profile?.emergency_contact || activePatient?.emergencyContact;
  const doctorName = profile?.doctor_name || activePatient?.doctor;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">Caregiver & Care Team</h2>
            <p className="text-xs text-slate-500">Live monitoring & emergency escalation</p>
          </div>
        </div>
        
        <Link
          to="/caregiver"
          className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-xl transition-colors min-h-[36px]"
        >
          <span>Caregiver Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Caregiver Profile */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
          {emergencyContact ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  EM
                </div>
                <div>
                  <h4 className="font-bold text-text text-sm">{emergencyContact.split('-')[0]}</h4>
                  <p className="text-xs text-slate-500">Primary Contact</p>
                  <p className="text-xs font-semibold text-primary-600 mt-0.5">{emergencyContact.split('-')[1] || emergencyContact}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => callEmergencyContact(profile?.id)}
                  aria-label="Call emergency contact"
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-primary-600 border border-slate-200 transition-colors shadow-2xs"
                  title="Call emergency contact"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <h4 className="font-bold text-text text-sm">No Emergency Contact Linked</h4>
              <p className="text-xs text-slate-500">Add an emergency contact in your profile to enable SMS & calls.</p>
            </div>
          )}
        </div>

        {/* Doctor & Escalation status */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Assigned Physician</span>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                {doctorName ? 'Active Physician' : 'Unassigned'}
              </span>
            </div>
            <p className="text-sm font-bold text-text mt-1">{doctorName || 'No physician specified yet'}</p>
            <p className="text-xs text-slate-500">Weekly compliance reports can be exported directly for your clinic.</p>
          </div>

          {patientAlerts.length > 0 && (
            <div className="mt-2 bg-rose-50 border border-rose-200 rounded-xl p-2.5 flex items-center gap-2 text-xs text-rose-800 font-semibold">
              <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0" />
              <span>{patientAlerts.length} active alert pending check</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
