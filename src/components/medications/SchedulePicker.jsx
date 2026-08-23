import React from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { formatTime } from '../../utils/dateHelpers';

export default function SchedulePicker({
  startDate,
  endDate,
  times = ['08:00'],
  onStartDateChange,
  onEndDateChange,
  onTimesChange
}) {
  const addTimeSlot = () => {
    if (times.length < 5) {
      onTimesChange([...times, '12:00']);
    }
  };

  const removeTimeSlot = (index) => {
    if (times.length > 1) {
      onTimesChange(times.filter((_, idx) => idx !== index));
    }
  };

  const updateTimeSlot = (index, newTime) => {
    const updated = [...times];
    updated[index] = newTime;
    onTimesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Start Date */}
        <div>
          <label className="block text-sm font-bold text-text mb-1">
            Start Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[44px]"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-bold text-text mb-1">
            End Date (Optional)
          </label>
          <input
            type="date"
            value={endDate || ''}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[44px]"
          />
        </div>
      </div>

      {/* Dynamic Time Slots */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-text flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary-500" />
            <span>Daily Dose Times</span>
          </label>
          {times.length < 5 && (
            <button
              type="button"
              onClick={addTimeSlot}
              className="text-xs font-bold text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors min-h-[36px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Time</span>
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {times.map((time, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 px-2">Dose #{idx + 1}</span>
              <input
                type="time"
                value={time}
                onChange={(e) => updateTimeSlot(idx, e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-base font-medium focus:ring-2 focus:ring-primary-500 min-h-[44px]"
              />
              <span className="text-sm font-semibold text-slate-600 flex-1">
                ({formatTime(time)})
              </span>
              {times.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTimeSlot(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                  aria-label={`Remove dose time ${idx + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
