import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_MEDICATIONS, COMPARTMENTS } from '../utils/constants';
import { generateInitialHistory, calculateAdherence } from '../utils/adherenceCalculator';
import { audioChime } from '../utils/audioSynth';

const MedicationContext = createContext();

export function MedicationProvider({ children }) {
  // 1. Medications list
  const [medications, setMedications] = useState(() => {
    try {
      const saved = localStorage.getItem('medi_medications');
      return saved ? JSON.parse(saved) : INITIAL_MEDICATIONS;
    } catch (e) {
      return INITIAL_MEDICATIONS;
    }
  });

  // 2. Today's Doses state
  const [todayDoses, setTodayDoses] = useState(() => {
    try {
      const saved = localStorage.getItem('medi_today_doses');
      if (saved) return JSON.parse(saved);
      
      // Initialize from medications
      return INITIAL_MEDICATIONS.map((med, idx) => ({
        id: `dose_${med.id}_${idx}`,
        medId: med.id,
        name: med.name,
        dosage: med.dosage,
        form: med.form,
        pillColor: med.pillColor || 'White',
        pillShape: med.pillShape || 'round',
        time: med.times[0] || '08:00',
        compartment: med.compartment || 'Morning',
        status: med.status || 'pending',
        notes: med.notes,
        instructions: med.instructions,
        caregiverNotify: med.caregiverNotify,
        confirmedAt: med.status === 'taken' ? '08:12 AM' : null
      }));
    } catch (e) {
      return [];
    }
  });

  // 3. Past Doses History
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('medi_history');
      return saved ? JSON.parse(saved) : generateInitialHistory();
    } catch (e) {
      return generateInitialHistory();
    }
  });

  // 4. Smart Pill Organizer Hardware State
  const [organizerState, setOrganizerState] = useState({
    connected: true,
    battery: 92,
    syncStatus: 'Live (Bluetooth Low Energy 5.2)',
    lastSync: 'Just now',
    compartments: {
      Morning: { lidOpen: false, ledStatus: 'completed', pillCount: 2, label: 'Morning (8:00 AM)' },
      Afternoon: { lidOpen: false, ledStatus: 'active', pillCount: 1, label: 'Afternoon (1:00 PM)' },
      Evening: { lidOpen: false, ledStatus: 'idle', pillCount: 1, label: 'Evening (6:00 PM)' },
      Night: { lidOpen: false, ledStatus: 'idle', pillCount: 1, label: 'Night (9:30 PM)' },
    }
  });

  // 5. Toast Notifications Queue
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', title = '') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('medi_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('medi_today_doses', JSON.stringify(todayDoses));
  }, [todayDoses]);

  useEffect(() => {
    localStorage.setItem('medi_history', JSON.stringify(history));
  }, [history]);

  // Sync organizer LEDs based on today's dose statuses
  useEffect(() => {
    setOrganizerState(prev => {
      const updatedCompartments = { ...prev.compartments };
      ['Morning', 'Afternoon', 'Evening', 'Night'].forEach(comp => {
        const compDoses = todayDoses.filter(d => d.compartment === comp);
        if (compDoses.length === 0) {
          updatedCompartments[comp].ledStatus = 'idle';
        } else if (compDoses.every(d => d.status === 'taken')) {
          updatedCompartments[comp].ledStatus = 'completed';
        } else if (compDoses.some(d => d.status === 'missed')) {
          updatedCompartments[comp].ledStatus = 'alert';
        } else if (compDoses.some(d => d.status === 'pending' || d.status === 'snoozed')) {
          // Current next dose gets active green pulse
          updatedCompartments[comp].ledStatus = 'active';
        }
      });
      return { ...prev, compartments: updatedCompartments };
    });
  }, [todayDoses]);

  // Actions
  const confirmDose = (doseId) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = now.toISOString().split('T')[0];

    let confirmedDoseInfo = null;

    setTodayDoses(prev =>
      prev.map(d => {
        if (d.id === doseId) {
          confirmedDoseInfo = d;
          return {
            ...d,
            status: 'taken',
            confirmedAt: timeFormatted
          };
        }
        return d;
      })
    );

    // Audio chime
    audioChime.playSuccess();

    if (confirmedDoseInfo) {
      addToast(
        `Great job! Dose of ${confirmedDoseInfo.name} (${confirmedDoseInfo.dosage}) recorded at ${timeFormatted}.`,
        'success',
        'Dose Confirmed'
      );

      // Add to history log
      const newHistoryItem = {
        id: `hist_${Date.now()}`,
        medName: `${confirmedDoseInfo.name} ${confirmedDoseInfo.dosage}`,
        date: dateFormatted,
        scheduledTime: confirmedDoseInfo.time,
        loggedTime: now.toISOString(),
        status: 'taken',
        compartment: confirmedDoseInfo.compartment,
        notes: 'Confirmed by patient in app',
        confirmedBy: 'App Confirmation'
      };
      setHistory(prev => [newHistoryItem, ...prev]);

      // Check if all today's doses are taken for confetti celebration!
      const remainingDoses = todayDoses.filter(d => d.id !== doseId && d.status !== 'taken');
      if (remainingDoses.length === 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2A7DE1', '#00C9A7', '#FFB800', '#1A2B4C']
        });
        addToast("🎉 You've taken all your medications for today! Fantastic adherence.", 'success', 'All Doses Complete!');
      }
    }
  };

  const snoozeDose = (doseId, minutes = 15) => {
    setTodayDoses(prev =>
      prev.map(d => {
        if (d.id === doseId) {
          return { ...d, status: 'snoozed' };
        }
        return d;
      })
    );
    audioChime.playReminder();
    addToast(`Reminder snoozed for ${minutes} minutes. Smart Pillbox will chime again.`, 'info', 'Dose Snoozed');
  };

  const markMissed = (doseId) => {
    setTodayDoses(prev =>
      prev.map(d => {
        if (d.id === doseId) {
          return { ...d, status: 'missed' };
        }
        return d;
      })
    );
    audioChime.playAlert();
    addToast('Dose marked as missed. Caregiver alert has been logged.', 'warning', 'Dose Missed');
  };

  const addMedication = (newMed) => {
    const medId = `med_${Date.now()}`;
    const formattedMed = {
      id: medId,
      ...newMed,
      status: 'pending'
    };

    setMedications(prev => [formattedMed, ...prev]);

    // Also add to todayDoses
    const newDoses = (newMed.times || ['08:00']).map((time, idx) => ({
      id: `dose_${medId}_${idx}`,
      medId: medId,
      name: newMed.name,
      dosage: newMed.dosage,
      form: newMed.form || 'Tablet',
      pillColor: newMed.pillColor || 'White',
      pillShape: newMed.pillShape || 'round',
      time: time,
      compartment: newMed.compartment || 'Morning',
      status: 'pending',
      notes: newMed.notes || '',
      instructions: newMed.instructions || '',
      caregiverNotify: newMed.caregiverNotify ?? true,
      confirmedAt: null
    }));

    setTodayDoses(prev => [...prev, ...newDoses]);
    audioChime.playSuccess();
    addToast(`${newMed.name} added to schedule and assigned to ${newMed.compartment} compartment.`, 'success', 'Medication Saved');
  };

  const updateMedication = (id, updates) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    setTodayDoses(prev => prev.map(d => d.medId === id ? { ...d, ...updates } : d));
    addToast('Medication details updated successfully.', 'info', 'Updated');
  };

  const deleteMedication = (id) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    setTodayDoses(prev => prev.filter(d => d.medId !== id));
    addToast('Medication removed from schedule.', 'info', 'Deleted');
  };

  // Hardware Simulator Actions
  const toggleCompartmentLid = (compartmentName) => {
    setOrganizerState(prev => {
      const isCurrentlyOpen = prev.compartments[compartmentName]?.lidOpen;
      const willBeOpen = !isCurrentlyOpen;

      if (willBeOpen) {
        audioChime.playReminder();
        // If there's an active pending dose in this compartment, auto-confirm it as sensor detected!
        const matchingDose = todayDoses.find(d => d.compartment === compartmentName && (d.status === 'pending' || d.status === 'snoozed'));
        if (matchingDose) {
          setTimeout(() => {
            confirmDose(matchingDose.id);
            addToast(`Smart Sensor detected lid opening for ${compartmentName} compartment. Dose confirmed!`, 'success', 'Sensor Event');
          }, 600);
        }
      }

      return {
        ...prev,
        compartments: {
          ...prev.compartments,
          [compartmentName]: {
            ...prev.compartments[compartmentName],
            lidOpen: willBeOpen
          }
        }
      };
    });
  };

  const resetTodayDoses = () => {
    setTodayDoses(prev => prev.map(d => ({ ...d, status: 'pending', confirmedAt: null })));
    addToast('Today schedule reset for testing purposes.', 'info', 'Schedule Reset');
  };

  const adherence = calculateAdherence(todayDoses);

  return (
    <MedicationContext.Provider
      value={{
        medications,
        todayDoses,
        history,
        organizerState,
        adherence,
        toasts,
        addToast,
        removeToast,
        confirmDose,
        snoozeDose,
        markMissed,
        addMedication,
        updateMedication,
        deleteMedication,
        toggleCompartmentLid,
        resetTodayDoses,
        setOrganizerState
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
}

export function useMedicationContext() {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedicationContext must be used within a MedicationProvider');
  }
  return context;
}
