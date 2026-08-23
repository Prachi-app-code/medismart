import React from 'react';
import Greeting from '../components/dashboard/Greeting';
import AdherenceSummary from '../components/dashboard/AdherenceSummary';
import OrganizerStatus from '../components/dashboard/OrganizerStatus';
import TodaySchedule from '../components/dashboard/TodaySchedule';
import CaregiverQuickView from '../components/dashboard/CaregiverQuickView';

export default function Dashboard({ onOpenSimulator }) {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hero Greeting Banner */}
      <Greeting />

      {/* 2. Adherence Summary with Circular SVG Indicator & Stats */}
      <AdherenceSummary />

      {/* 3. Smart Pill Organizer 4-Compartment Status with LEDs */}
      <OrganizerStatus onOpenSimulator={onOpenSimulator} />

      {/* 4. Today's Medication Schedule with Confirm Buttons */}
      <TodaySchedule />

      {/* 5. Caregiver Quick View & Emergency Status */}
      <CaregiverQuickView />
    </div>
  );
}
