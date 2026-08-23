import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, FileText } from 'lucide-react';
import StatsCard from './StatsCard';
import TimelineItem from './TimelineItem';
import ExportModal from './ExportModal';
import { useMedicationContext } from '../../context/MedicationContext';

export default function HistoryList() {
  const { history } = useMedicationContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, taken, missed
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.medName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.compartment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Stats Overview */}
      <StatsCard />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dose logs by medication or compartment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none min-h-[44px]"
          />
        </div>

        {/* Status Filter & Export Button */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
            {['all', 'taken', 'missed'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all min-h-[38px] ${
                  statusFilter === status
                    ? 'bg-primary-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-text'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="btn-primary text-xs sm:text-sm px-4 py-2.5 shadow-sm whitespace-nowrap"
          >
            <FileText className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>

      </div>

      {/* Timeline Stream */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
        <h3 className="text-lg font-bold text-text mb-6 pb-3 border-b border-slate-100 flex items-center justify-between">
          <span>Historical Dose Timeline ({filteredHistory.length} records)</span>
          <span className="text-xs text-slate-400 font-semibold">Ordered by Date</span>
        </h3>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">No dose records matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredHistory.map((item, idx) => (
              <TimelineItem
                key={item.id}
                item={item}
                isLast={idx === filteredHistory.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Export Clinical Report Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

    </div>
  );
}
