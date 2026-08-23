import React, { createContext, useContext, useState } from 'react';
import { INITIAL_PATIENTS } from '../utils/constants';
import { audioChime } from '../utils/audioSynth';
import { useMedicationContext } from './MedicationContext';

const CaregiverContext = createContext();

export function CaregiverProvider({ children }) {
  const { addToast } = useMedicationContext();
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [activePatientId, setActivePatientId] = useState('pat_001');

  const [alerts, setAlerts] = useState([
    {
      id: 'alt_001',
      patientId: 'pat_002',
      patientName: 'Arthur Vance',
      severity: 'high',
      time: '35 mins ago',
      title: 'Missed Dose Alert',
      message: 'Morning Lisinopril (10mg) not taken. Organizer lid was not opened.',
      actionTaken: false
    },
    {
      id: 'alt_002',
      patientId: 'pat_001',
      patientName: 'Margaret Vance',
      severity: 'medium',
      time: '2 hours ago',
      title: 'Low Compartment Supply',
      message: 'Afternoon compartment only has 2 days of Vitamin D3 remaining.',
      actionTaken: false
    },
    {
      id: 'alt_003',
      patientId: 'pat_003',
      patientName: 'Eleanor Brooks',
      severity: 'low',
      time: '4 hours ago',
      title: 'Organizer Battery Check',
      message: 'Smart pillbox battery is at 85%. Operating normally.',
      actionTaken: true
    }
  ]);

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

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
      customMessage || `Chime reminder & push notification dispatched to ${p.name}'s Smart Pillbox (${p.organizerId}).`,
      'success',
      'Reminder Dispatched'
    );
  };

  const callEmergencyContact = (patientId) => {
    const p = patients.find(pat => pat.id === patientId) || activePatient;
    addToast(`Initiating emergency contact call to ${p.emergencyContact}...`, 'warning', 'Emergency Call');
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
        activePatient,
        activePatientId,
        alerts,
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
