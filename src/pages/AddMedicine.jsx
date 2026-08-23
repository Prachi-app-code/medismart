import React from 'react';
import { useSearchParams } from 'react-router-dom';
import MedicationForm from '../components/medications/MedicationForm';
import { useMedicationContext } from '../context/MedicationContext';

export default function AddMedicine() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { medications } = useMedicationContext();

  const existingMed = editId ? medications.find(m => m.id === editId) : null;

  return (
    <div className="space-y-6 pb-12">
      <MedicationForm existingMed={existingMed} />
    </div>
  );
}
