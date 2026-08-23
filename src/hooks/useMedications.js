import { useMedicationContext } from '../context/MedicationContext';

export function useMedications() {
  const {
    medications,
    todayDoses,
    history,
    addMedication,
    updateMedication,
    deleteMedication,
    confirmDose,
    snoozeDose,
    markMissed
  } = useMedicationContext();

  return {
    medications,
    todayDoses,
    history,
    addMedication,
    updateMedication,
    deleteMedication,
    confirmDose,
    snoozeDose,
    markMissed
  };
}
