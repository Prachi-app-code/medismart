import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Save, ArrowLeft, Pill, AlertTriangle, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { MEDICATION_FORMS, PILL_COLORS, PILL_SHAPES } from '../../utils/constants';
import { useMedicationContext } from '../../context/MedicationContext';
import QRScanner from './QRScanner';
import SchedulePicker from './SchedulePicker';
import CompartmentSelector from './CompartmentSelector';
import CaregiverSettings from './CaregiverSettings';
import Modal from '../shared/Modal';

export default function MedicationForm({ existingMed, onSaveComplete }) {
  const navigate = useNavigate();
  const { addMedication, updateMedication, deleteMedication } = useMedicationContext();

  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: existingMed?.name || '',
    dosage: existingMed?.dosage || '',
    form: existingMed?.form || 'Tablet',
    pillColor: existingMed?.pillColor || 'White',
    pillShape: existingMed?.pillShape || 'round',
    notes: existingMed?.notes || '',
    instructions: existingMed?.instructions || '',
    compartment: existingMed?.compartment || 'Morning',
    startDate: existingMed?.startDate || new Date().toISOString().split('T')[0],
    endDate: existingMed?.endDate || '',
    times: existingMed?.times || ['08:00'],
    caregiverNotify: existingMed?.caregiverNotify ?? true,
    escalationDelay: existingMed?.escalationDelay || '30'
  });

  const [errors, setErrors] = useState({});

  const handleScanFill = (scannedData) => {
    setFormData(prev => ({
      ...prev,
      name: scannedData.name || prev.name,
      dosage: scannedData.dosage || prev.dosage,
      form: scannedData.form || prev.form,
      pillColor: scannedData.pillColor || prev.pillColor,
      pillShape: scannedData.pillShape || prev.pillShape,
      notes: scannedData.notes || prev.notes,
      instructions: scannedData.instructions || prev.instructions,
      compartment: scannedData.compartment || prev.compartment,
      times: scannedData.times || prev.times,
      startDate: scannedData.startDate || prev.startDate,
      endDate: scannedData.endDate || prev.endDate,
      caregiverNotify: scannedData.caregiverNotify ?? prev.caregiverNotify
    }));
    setIsScannerOpen(false);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Medication name is required';
    if (!formData.dosage.trim()) errs.dosage = 'Dosage amount is required (e.g. 10mg)';
    if (!formData.startDate) errs.startDate = 'Start date is required';
    if (!formData.compartment) errs.compartment = 'Pillbox compartment is required';
    if (!formData.times || formData.times.length === 0) errs.times = 'At least one time slot is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (existingMed?.id) {
      updateMedication(existingMed.id, formData);
    } else {
      addMedication(formData);
    }

    if (onSaveComplete) {
      onSaveComplete();
    } else {
      navigate('/');
    }
  };

  const handleDelete = () => {
    if (existingMed?.id && window.confirm(`Are you sure you want to remove ${existingMed.name}?`)) {
      deleteMedication(existingMed.id);
      if (onSaveComplete) {
        onSaveComplete();
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Banner: QR Scanner Promo */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-100/60 rounded-3xl p-5 border border-primary-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-primary-500 text-white rounded-2xl shadow-sm">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-text text-base">Have a Prescription Barcode / QR?</h3>
            <p className="text-xs text-slate-600">Scan packaging to auto-fill medication details instantly.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap shadow-sm"
        >
          <QrCode className="w-4 h-4" />
          <span>Launch Scanner</span>
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-6">
        
        <h2 className="text-2xl font-black text-text pb-4 border-b border-slate-100">
          {existingMed ? 'Edit Medication Schedule' : 'Add New Medication'}
        </h2>

        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            1. Medication Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-text mb-1">
                Medication / Drug Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Amlodipine, Metformin, Lisinopril"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 bg-white border rounded-xl text-base focus:ring-2 focus:ring-primary-500 outline-none min-h-[44px] ${
                  errors.name ? 'border-danger bg-rose-50/50' : 'border-slate-200'
                }`}
              />
              {errors.name && <p className="text-xs text-danger font-semibold mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-text mb-1">
                Dosage & Strength <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 5mg, 500mg, 1 Tablet, 10ml"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className={`w-full px-4 py-3 bg-white border rounded-xl text-base focus:ring-2 focus:ring-primary-500 outline-none min-h-[44px] ${
                  errors.dosage ? 'border-danger bg-rose-50/50' : 'border-slate-200'
                }`}
              />
              {errors.dosage && <p className="text-xs text-danger font-semibold mt-1">{errors.dosage}</p>}
            </div>
          </div>

          {/* Form / Type picker */}
          <div>
            <label className="block text-sm font-bold text-text mb-2">Form Factor</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {MEDICATION_FORMS.map((form) => (
                <button
                  key={form.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, form: form.id })}
                  className={`p-3 rounded-xl border text-center transition-all text-xs font-bold min-h-[44px] cursor-pointer ${
                    formData.form === form.id
                      ? 'border-primary-500 bg-primary-50 text-primary-800 ring-2 ring-primary-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {form.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pill Color & Shape Selector for Senior Recognition */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Visual Pill Appearance (Helps Senior Identification)
            </label>
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">Color:</span>
              {PILL_COLORS.map(color => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, pillColor: color.name })}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                    formData.pillColor === color.name ? 'scale-125 ring-2 ring-primary-500 shadow-sm' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.hex, borderColor: color.border }}
                  title={color.name}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-slate-500 font-medium">Shape:</span>
              {PILL_SHAPES.map(shape => (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, pillShape: shape.id })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    formData.pillShape === shape.id
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {shape.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Compartment Selection */}
        <div className="pt-4 border-t border-slate-100">
          <CompartmentSelector
            value={formData.compartment}
            onChange={(val) => setFormData({ ...formData, compartment: val })}
          />
        </div>

        {/* Section 3: Schedule & Times */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            2. Schedule & Daily Dose Times
          </h3>
          <SchedulePicker
            startDate={formData.startDate}
            endDate={formData.endDate}
            times={formData.times}
            onStartDateChange={(val) => setFormData({ ...formData, startDate: val })}
            onEndDateChange={(val) => setFormData({ ...formData, endDate: val })}
            onTimesChange={(val) => setFormData({ ...formData, times: val })}
          />
        </div>

        {/* Section 4: Notes & Instructions */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            3. Meal Timing & Precautions
          </h3>

          <div>
            <label className="block text-sm font-bold text-text mb-1">
              Instructions (e.g. With food / After Breakfast)
            </label>
            <input
              type="text"
              placeholder="e.g. Take immediately after breakfast with full glass of water"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text mb-1">
              Clinical Precautions / Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Avoid grapefruit. If dizziness occurs, sit down immediately."
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 min-h-[44px]"
            />
          </div>
        </div>

        {/* Section 5: Caregiver Notifications */}
        <div className="pt-4 border-t border-slate-100">
          <CaregiverSettings
            caregiverNotify={formData.caregiverNotify}
            escalationDelay={formData.escalationDelay}
            onNotifyToggle={(val) => setFormData({ ...formData, caregiverNotify: val })}
            onDelayChange={(val) => setFormData({ ...formData, escalationDelay: val })}
          />
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {existingMed && (
            <button
              type="button"
              onClick={handleDelete}
              className="btn-danger w-full sm:w-auto"
            >
              Delete Medication
            </button>
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary w-full sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary w-full sm:w-auto px-8"
            >
              <Save className="w-5 h-5" />
              <span>{existingMed ? 'Save Changes' : 'Save Medication'}</span>
            </button>
          </div>
        </div>

      </form>

      {/* QR Scanner Modal */}
      <Modal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        title="Scan Prescription Barcode / QR"
        subtitle="Point camera at medication box or pick a demo sample below"
      >
        <QRScanner
          onScanComplete={handleScanFill}
          onClose={() => setIsScannerOpen(false)}
        />
      </Modal>

    </div>
  );
}
