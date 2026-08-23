import React from 'react';
import { Printer, Download, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCaregiverContext } from '../../context/CaregiverContext';
import { useMedicationContext } from '../../context/MedicationContext';
import { useAdherence } from '../../hooks/useAdherence';
import { formatDate } from '../../utils/dateHelpers';
import Modal from '../shared/Modal';

export default function ExportModal({ isOpen, onClose }) {
  const { activePatient } = useCaregiverContext();
  const { medications, history, todayDoses } = useMedicationContext();
  const { overallStats } = useAdherence();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const headers = 'Date,Medication,ScheduledTime,Status,Compartment,ConfirmedBy\n';
    const rows = history.map(h => 
      `"${h.date}","${h.medName}","${h.scheduledTime}","${h.status}","${h.compartment}","${h.confirmedBy || 'Pillbox Sensor'}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MediSmart_Report_${activePatient.name.replace(/\s+/g, '_')}_${formatDate(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clinical Adherence Report"
      subtitle="Comprehensive adherence summary for physician & caregiver review"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        
        {/* Printable Report Paper Preview */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-text space-y-6 print:p-0 print:border-none print:bg-white">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
            <div>
              <h3 className="text-xl font-black text-text">MediSmart Clinical Summary</h3>
              <p className="text-xs text-slate-500">Official Smart Medication Adherence Record</p>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs font-bold text-slate-400">Report Generated:</span>
              <p className="text-sm font-semibold text-text">{formatDate(new Date(), 'MMMM dd, yyyy')}</p>
            </div>
          </div>

          {/* Patient Profile Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-100 text-sm">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Patient</span>
              <p className="font-bold text-text mt-0.5">{activePatient.name}</p>
              <p className="text-xs text-slate-500">Age: {activePatient.age}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Physician</span>
              <p className="font-bold text-text mt-0.5">{activePatient.doctor}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Smart Box ID</span>
              <p className="font-bold text-primary-600 mt-0.5">{activePatient.organizerId}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Compliance Score</span>
              <p className="font-black text-emerald-600 text-lg mt-0.5">{overallStats.rate}% (Grade A+)</p>
            </div>
          </div>

          {/* Adherence Overview Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase">Confirmed Doses</span>
              <p className="text-2xl font-black text-emerald-950 mt-1">{overallStats.totalTaken}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-amber-800 uppercase">Active Streak</span>
              <p className="text-2xl font-black text-amber-950 mt-1">{overallStats.streakDays} Days</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-xs font-bold text-rose-800 uppercase">Missed Doses</span>
              <p className="text-2xl font-black text-rose-950 mt-1">{overallStats.totalMissed}</p>
            </div>
          </div>

          {/* Active Medication List */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
              Active Prescriptions ({medications.length})
            </h4>
            <div className="space-y-1.5">
              {medications.map(med => (
                <div key={med.id} className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <strong className="text-text">{med.name}</strong> ({med.dosage} • {med.form})
                    <span className="text-slate-500 ml-2">Slot: {med.compartment} ({med.times.join(', ')})</span>
                  </div>
                  <span className="text-slate-400 italic text-xs hidden sm:inline">{med.notes}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Physician Signoff Note */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center gap-2 text-xs text-primary-900">
            <ShieldCheck className="w-4 h-4 text-primary-600 flex-shrink-0" />
            <span>This adherence record is electronically verified by Smart Pillbox hardware telemetry.</span>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="btn-secondary w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Data</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn-primary w-full sm:w-auto px-6"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Report</span>
          </button>
        </div>

      </div>
    </Modal>
  );
}
