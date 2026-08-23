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

export const SAMPLE_BARCODES = [
  {
    barcode: '8901030382910',
    name: 'Amlodipine Besylate',
    dosage: '5mg',
    form: 'Tablet',
    pillColor: 'White',
    pillShape: 'round',
    times: ['08:00'],
    notes: 'Take with full glass of water after breakfast',
    compartment: 'Morning',
    startDate: '2026-08-01',
    endDate: '2026-11-30',
    instructions: 'Blood pressure regulator. Avoid grapefruit juice.',
    caregiverNotify: true
  },
  {
    barcode: '8901234567890',
    name: 'Metformin HCl',
    dosage: '500mg',
    form: 'Tablet',
    pillColor: 'White',
    pillShape: 'oval',
    times: ['08:00', '18:00'],
    notes: 'Take during or immediately after meals',
    compartment: 'Morning',
    startDate: '2026-08-01',
    endDate: '2026-12-31',
    instructions: 'Blood sugar control. Drink plenty of water.',
    caregiverNotify: true
  },
  {
    barcode: '8909876543210',
    name: 'Atorvastatin Calcium',
    dosage: '20mg',
    form: 'Tablet',
    pillColor: 'Yellow',
    pillShape: 'round',
    times: ['21:30'],
    notes: 'Take at bedtime',
    compartment: 'Night',
    startDate: '2026-08-10',
    endDate: '2026-12-10',
    instructions: 'Cholesterol management.',
    caregiverNotify: true
  },
  {
    barcode: '8905544332211',
    name: 'Vitamin D3 & Calcium',
    dosage: '1000 IU',
    form: 'Capsule',
    pillColor: 'Orange',
    pillShape: 'capsule',
    times: ['13:00'],
    notes: 'Take with lunchtime meal',
    compartment: 'Afternoon',
    startDate: '2026-08-01',
    endDate: '2026-10-31',
    instructions: 'Bone density supplement.',
    caregiverNotify: false
  },
  {
    barcode: '8907788990011',
    name: 'Lisinopril',
    dosage: '10mg',
    form: 'Tablet',
    pillColor: 'Pink / Red',
    pillShape: 'round',
    times: ['08:00'],
    notes: 'Take morning before food',
    compartment: 'Morning',
    startDate: '2026-08-01',
    endDate: '2026-12-31',
    instructions: 'ACE inhibitor for heart health.',
    caregiverNotify: true
  }
];

export const INITIAL_PATIENTS = [
  {
    id: 'pat_001',
    name: 'Margaret Vance',
    age: 76,
    relation: 'Mother',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    organizerId: 'BOX-MED-8492',
    battery: 92,
    online: true,
    lastSync: '2 minutes ago',
    todayAdherence: 75,
    streak: 14,
    phone: '+1 (555) 234-8901',
    doctor: 'Dr. Robert Chen (Cardiology)',
    emergencyContact: 'Sarah Vance (Daughter) - +1 (555) 987-6543'
  },
  {
    id: 'pat_002',
    name: 'Arthur Vance',
    age: 79,
    relation: 'Father',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    organizerId: 'BOX-MED-9104',
    battery: 68,
    online: true,
    lastSync: '10 minutes ago',
    todayAdherence: 50,
    streak: 8,
    phone: '+1 (555) 234-8902',
    doctor: 'Dr. Emily Watson (Geriatrics)',
    emergencyContact: 'Sarah Vance (Daughter) - +1 (555) 987-6543'
  },
  {
    id: 'pat_003',
    name: 'Eleanor Brooks',
    age: 82,
    relation: 'Aunt',
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=200',
    organizerId: 'BOX-MED-6211',
    battery: 85,
    online: false,
    lastSync: '1 hour ago',
    todayAdherence: 100,
    streak: 21,
    phone: '+1 (555) 456-7890',
    doctor: 'Dr. Marcus Brody (Neurology)',
    emergencyContact: 'Thomas Brooks (Son) - +1 (555) 321-7654'
  }
];

export const INITIAL_MEDICATIONS = [
  {
    id: 'med_001',
    name: 'Amlodipine',
    dosage: '5mg',
    form: 'Tablet',
    pillColor: 'White',
    pillShape: 'round',
    times: ['08:00'],
    notes: 'Take with full glass of water after breakfast',
    compartment: 'Morning',
    status: 'taken',
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    instructions: 'Blood pressure control. Do not skip doses.',
    caregiverNotify: true
  },
  {
    id: 'med_002',
    name: 'Metformin HCl',
    dosage: '500mg',
    form: 'Tablet',
    pillColor: 'White',
    pillShape: 'oval',
    times: ['08:00', '18:00'],
    notes: 'Take with meal to reduce stomach upset',
    compartment: 'Morning',
    status: 'taken',
    startDate: '2026-08-01',
    endDate: '2026-10-31',
    instructions: 'Blood glucose regulation.',
    caregiverNotify: true
  },
  {
    id: 'med_003',
    name: 'Vitamin D3 & Calcium',
    dosage: '1000 IU',
    form: 'Capsule',
    pillColor: 'Orange',
    pillShape: 'capsule',
    times: ['13:00'],
    notes: 'Take with lunch',
    compartment: 'Afternoon',
    status: 'pending',
    startDate: '2026-08-01',
    endDate: '2026-11-15',
    instructions: 'Bone density support.',
    caregiverNotify: false
  },
  {
    id: 'med_004',
    name: 'Metformin HCl (Evening Dose)',
    dosage: '500mg',
    form: 'Tablet',
    pillColor: 'White',
    pillShape: 'oval',
    times: ['18:00'],
    notes: 'Take with dinner',
    compartment: 'Evening',
    status: 'pending',
    startDate: '2026-08-01',
    endDate: '2026-10-31',
    instructions: 'Evening blood sugar balance.',
    caregiverNotify: true
  },
  {
    id: 'med_005',
    name: 'Atorvastatin',
    dosage: '20mg',
    form: 'Tablet',
    pillColor: 'Yellow',
    pillShape: 'round',
    times: ['21:30'],
    notes: 'Take right before going to bed',
    compartment: 'Night',
    status: 'pending',
    startDate: '2026-08-10',
    endDate: '2026-12-15',
    instructions: 'Lipid and cholesterol management.',
    caregiverNotify: true
  }
];
