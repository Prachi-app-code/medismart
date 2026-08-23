import { useMemo } from 'react';
import { useMedicationContext } from '../context/MedicationContext';
import { calculateAdherence, getWeeklyTrend } from '../utils/adherenceCalculator';

export function useAdherence() {
  const { todayDoses, history } = useMedicationContext();

  const todayStats = useMemo(() => {
    return calculateAdherence(todayDoses);
  }, [todayDoses]);

  const weeklyTrend = useMemo(() => {
    return getWeeklyTrend(history, todayDoses);
  }, [history, todayDoses]);

  const overallStats = useMemo(() => {
    const totalDosesLogged = history.length + todayDoses.length;
    const totalTaken = history.filter(h => h.status === 'taken').length + todayDoses.filter(d => d.status === 'taken').length;
    const totalMissed = history.filter(h => h.status === 'missed').length + todayDoses.filter(d => d.status === 'missed').length;
    const rate = totalDosesLogged > 0 ? Math.round((totalTaken / (totalTaken + totalMissed || 1)) * 100) : 100;

    // Calculate dynamic streak
    let streakDays = 0;
    if (totalTaken > 0 && totalMissed === 0) {
      streakDays = Math.max(1, Math.min(30, Math.ceil(totalTaken / 3)));
    } else if (totalTaken > 0) {
      streakDays = 1;
    }

    return {
      totalDosesLogged,
      totalTaken,
      totalMissed,
      rate,
      streakDays
    };
  }, [history, todayDoses]);

  return {
    todayStats,
    weeklyTrend,
    overallStats
  };
}
