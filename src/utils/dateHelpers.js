import { format, parseISO, isToday, isYesterday, formatDistanceToNow, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

export function formatDate(dateString, pattern = 'MMM dd, yyyy') {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, pattern);
  } catch (err) {
    return dateString;
  }
}

export function formatTime(time24) {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

export function getGreetingByTime() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', icon: 'Sun', color: 'text-amber-500' };
  if (hour < 17) return { text: 'Good Afternoon', icon: 'SunMedium', color: 'text-blue-500' };
  if (hour < 21) return { text: 'Good Evening', icon: 'Sunset', color: 'text-rose-500' };
  return { text: 'Good Night', icon: 'Moon', color: 'text-indigo-400' };
}

export function getRelativeTimeString(dateString) {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`;
    if (isYesterday(date)) return `Yesterday at ${format(date, 'h:mm a')}`;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (err) {
    return dateString;
  }
}

export function getCurrentWeekDays(baseDate = new Date()) {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 }); // Monday start
  const end = endOfWeek(baseDate, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function getDaysForMonthView(year = 2026, month = 7) { // 0-indexed month
  // Generate a list of days in the month
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return eachDayOfInterval({ start, end });
}

export { isToday, isSameDay, addDays, subDays };
