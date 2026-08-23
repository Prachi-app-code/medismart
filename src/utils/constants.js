export const COMPARTMENTS = [
  {
    id: 'Morning',
    label: 'Morning',
    time: '08:00',
    timeLabel: '8:00 AM',
    color: '#FFB800',
    bgLight: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'Sun',
    description: 'Breakfast time'
  },
  {
    id: 'Afternoon',
    label: 'Afternoon',
    time: '13:00',
    timeLabel: '1:00 PM',
    color: '#3A84E6',
    bgLight: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'SunMedium',
    description: 'Lunch time'
  },
  {
    id: 'Evening',
    label: 'Evening',
    time: '18:00',
    timeLabel: '6:00 PM',
    color: '#FF6B6B',
    bgLight: 'bg-rose-50',
    border: 'border-rose-200',
    icon: 'Sunset',
    description: 'Dinner time'
  },
  {
    id: 'Night',
    label: 'Night',
    time: '21:30',
    timeLabel: '9:30 PM',
    color: '#8BB8F2',
    bgLight: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: 'Moon',
    description: 'Bedtime'
  }
];

export const MEDICATION_FORMS = [
  { id: 'Tablet', label: 'Tablet', icon: 'Pill' },
  { id: 'Capsule', label: 'Capsule', icon: 'Capsule' },
  { id: 'Liquid', label: 'Liquid / Syrup', icon: 'FlaskConical' },
  { id: 'Injection', label: 'Injection', icon: 'Syringe' },
  { id: 'Inhaler', label: 'Inhaler', icon: 'Wind' },
  { id: 'Drops', label: 'Eye / Ear Drops', icon: 'Droplets' }
];

export const PILL_COLORS = [
  { name: 'White', hex: '#FFFFFF', border: '#CBD5E1' },
  { name: 'Blue', hex: '#60A5FA', border: '#2563EB' },
  { name: 'Yellow', hex: '#FDE047', border: '#CA8A04' },
  { name: 'Pink / Red', hex: '#F87171', border: '#DC2626' },
  { name: 'Green', hex: '#4ADE80', border: '#16A34A' },
  { name: 'Orange', hex: '#FB923C', border: '#EA580C' },
  { name: 'Purple', hex: '#C084FC', border: '#9333EA' }
];

export const PILL_SHAPES = [
  { id: 'round', label: 'Round Circle' },
  { id: 'oval', label: 'Oval / Oblong' },
  { id: 'capsule', label: 'Two-tone Capsule' },
  { id: 'square', label: 'Diamond / Square' }
];

// Clean empty arrays for production use (No demo dummy data)
export const SAMPLE_BARCODES = [];
export const INITIAL_PATIENTS = [];
export const INITIAL_MEDICATIONS = [];
