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
  const history = [];
  const baseDate = new Date(); // e.g. Aug 23, 2026

  const pastMeds = [
    { name: 'Amlodipine 5mg', compartment: 'Morning', time: '08:00' },
    { name: 'Metformin HCl 500mg', compartment: 'Morning', time: '08:00' },
    { name: 'Vitamin D3 1000 IU', compartment: 'Afternoon', time: '13:00' },
    { name: 'Metformin HCl 500mg', compartment: 'Evening', time: '18:00' },
    { name: 'Atorvastatin 20mg', compartment: 'Night', time: '21:30' }
  ];

  for (let i = 1; i <= 14; i++) {
    const targetDate = subDays(baseDate, i);
    const dateStr = format(targetDate, 'yyyy-MM-dd');

    pastMeds.forEach((med, idx) => {
      // 92% adherence rate simulation with occasional missed dose
      const isMissed = (i === 3 && idx === 3) || (i === 9 && idx === 4);
      const status = isMissed ? 'missed' : 'taken';
      
      const loggedTime = isMissed 
        ? null 
        : `${med.time.split(':')[0]}:${String(Math.floor(Math.random() * 15) + 5).padStart(2, '0')}`;

      history.push({
        id: `hist_${i}_${idx}`,
        medName: med.name,
        date: dateStr,
        scheduledTime: med.time,
        loggedTime: loggedTime ? `${dateStr}T${loggedTime}:00` : null,
        status: status,
        compartment: med.compartment,
        notes: isMissed ? 'Patient was out for clinic visit' : 'Confirmed via Smart Pillbox sensor',
        confirmedBy: isMissed ? 'Escalation Alert' : 'Smart Pillbox Sensor'
      });
    });
  }

  return history;
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
