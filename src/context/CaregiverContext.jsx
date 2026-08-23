import React, { createContext, useContext, useState } from 'react';
import { audioChime } from '../utils/audioSynth';
import { useMedicationContext } from './MedicationContext';

const CaregiverContext = createContext();

export function CaregiverProvider({ children }) {
  const { addToast } = useMedicationContext();
  const [patients, setPatients] = useState([]);
  const [activePatientId, setActivePatientId] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0] || null;

  const switchPatient = (patientId) => {
    setActivePatientId(patientId);
    const p = patients.find(pat => pat.id === patientId);
    if (p) {
      addToast(`Switched active view to patient: ${p.name}`, 'info', 'Patient Switched');
    }
  };

  const sendPatientReminder = (patientId, customMessage = '') => {
    const p = patients.find(pat => pat.id === patientId) || activePatient;
    audioChime.playReminder();
    addToast(
      customMessage || `Chime reminder & push notification dispatched to ${p ? p.name : 'patient'}'s Smart Pillbox.`,
      'success',
      'Reminder Dispatched'
    );
  };

  const callEmergencyContact = (patientId) => {
    const p = patients.find(pat => pat.id === patientId) || activePatient;
    if (p && p.emergencyContact) {
      addToast(`Initiating emergency contact call to ${p.emergencyContact}...`, 'warning', 'Emergency Call');
    } else {
      addToast('No emergency contact number configured yet.', 'info', 'Emergency Contact');
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    addToast('Alert cleared from queue.', 'info', 'Alert Dismissed');
  };

  const escalateAlert = (alertId) => {
    audioChime.playAlert();
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, actionTaken: true } : a));
    addToast('SMS Notification & automated voice call sent to caregiver.', 'danger', 'Alert Escalated');
  };

  return (
    <CaregiverContext.Provider
      value={{
        patients,
        setPatients,
        activePatient,
        activePatientId,
        alerts,
        setAlerts,
        switchPatient,
        sendPatientReminder,
        callEmergencyContact,
        dismissAlert,
        escalateAlert
      }}
    >
      {children}
    </CaregiverContext.Provider>
  );
}

export function useCaregiverContext() {
  const context = useContext(CaregiverContext);
  if (!context) {
    throw new Error('useCaregiverContext must be used within a CaregiverProvider');
  }
  return context;
}
