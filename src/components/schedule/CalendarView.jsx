import React, { useState } from 'react';
import { format, addDays, subDays, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import DayView from './DayView';
import { getCurrentWeekDays, getDaysForMonthView } from '../../utils/dateHelpers';
import { useMedicationContext } from '../../context/MedicationContext';

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'
  const { todayDoses } = useMedicationContext();

  const weekDays = getCurrentWeekDays(selectedDate);
  const monthDays = getDaysForMonthView(selectedDate.getFullYear(), selectedDate.getMonth());

  const handlePrev = () => {
    if (viewMode === 'month') {
      setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      setSelectedDate(prev => subDays(prev, 7));
    } else {
      setSelectedDate(prev => subDays(prev, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      setSelectedDate(prev => addDays(prev, 7));
    } else {
      setSelectedDate(prev => addDays(prev, 1));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Date Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={handlePrev}
              aria-label="Previous date"
              className="p-2 rounded-xl text-slate-600 hover:bg-white hover:text-text transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-white transition-colors min-h-[40px]"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              aria-label="Next date"
              className="p-2 rounded-xl text-slate-600 hover:bg-white hover:text-text transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-text">
              {format(selectedDate, 'MMMM yyyy')}
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              {format(selectedDate, 'EEEE, MMM do')}
            </p>
          </div>
        </div>

        {/* View Switcher & Add Button */}
        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
            {['day', 'week', 'month'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all min-h-[38px] ${
                  viewMode === mode
                    ? 'bg-primary-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-text'
                }`}
              >
                {mode} View
              </button>
            ))}
          </div>

          <Link
            to="/add"
            className="btn-primary text-xs sm:text-sm px-4 py-2.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Med</span>
          </Link>
        </div>

      </div>

      {/* Week Selector Bar (Visible on week/day modes) */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-card">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentToday = isToday(day);

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setSelectedDate(day)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer min-h-[72px] ${
                  isSelected
                    ? 'bg-primary-500 text-white shadow-md ring-2 ring-primary-300'
                    : isCurrentToday
                    ? 'bg-primary-50 text-primary-900 border border-primary-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className={`text-[11px] font-bold uppercase ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {format(day, 'EEE')}
                </span>
                <span className="text-lg font-black mt-0.5">
                  {format(day, 'd')}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Month Grid View */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-bold text-slate-400 uppercase">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentToday = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => {
                    setSelectedDate(day);
                    setViewMode('day');
                  }}
                  className={`p-3 rounded-xl text-center flex flex-col items-center justify-center transition-all min-h-[60px] ${
                    isSelected
                      ? 'bg-primary-500 text-white font-bold'
                      : isCurrentToday
                      ? 'bg-primary-50 text-primary-900 border border-primary-200 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-sm font-semibold">{format(day, 'd')}</span>
                  <div className="flex gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Day Schedule List */}
      <DayView selectedDate={selectedDate} />

    </div>
  );
}
