import { subDays, format } from 'date-fns';

export function calculateAdherence(doses = []) {
  if (!doses || doses.length === 0) {
    return {
      total: 0,
      taken: 0,
      missed: 0,
      pending: 0,
      percentage: 100
    };
  }

  const total = doses.length;
  const taken = doses.filter(d => d.status === 'taken').length;
  const missed = doses.filter(d => d.status === 'missed').length;
  const pending = doses.filter(d => d.status === 'pending' || d.status === 'snoozed').length;

  const resolved = taken + missed;
  const percentage = resolved > 0 ? Math.round((taken / resolved) * 100) : (total > 0 ? Math.round((taken / total) * 100) : 100);

  return {
    total,
    taken,
    missed,
    pending,
    percentage
  };
}

export function generateInitialHistory() {
  return [];
}

export function getWeeklyTrend(history = [], todayDoses = []) {
  const result = [];
  const baseDate = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = subDays(baseDate, i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayLabel = format(d, 'EEE');

    let dayLogs = [];
    if (i === 0) {
      dayLogs = todayDoses;
    } else {
      dayLogs = history.filter(h => h.date === dateStr);
    }

    const taken = dayLogs.filter(item => item.status === 'taken').length;
    const total = dayLogs.length || 4;
    const pct = total > 0 ? Math.round((taken / total) * 100) : 100;

    result.push({
      date: dateStr,
      day: dayLabel,
      taken,
      total,
      percentage: Math.min(pct, 100)
    });
  }

  return result;
}
