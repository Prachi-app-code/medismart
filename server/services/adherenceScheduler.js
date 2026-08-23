import cron from 'node-cron';
import { supabaseAdmin } from './supabaseAdmin.js';

export function startAdherenceScheduler() {
  if (!supabaseAdmin) {
    console.log('ℹ️ [Scheduler] Supabase Admin not configured. Running in standby mode.');
    return;
  }

  // Check every 5 minutes for missed doses
  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('⏰ [Scheduler] Running missed dose check cycle...');
      const now = new Date();
      const todayDateStr = now.toISOString().split('T')[0];

      // Query pending doses for today
      const { data: pendingDoses, error } = await supabaseAdmin
        .from('dose_logs')
        .select('*, medications(*), profiles!patient_id(*)')
        .eq('scheduled_date', todayDateStr)
        .eq('status', 'pending');

      if (error) {
        console.error('❌ [Scheduler] Error querying pending doses:', error);
        return;
      }

      if (!pendingDoses || pendingDoses.length === 0) {
        return;
      }

      for (const dose of pendingDoses) {
        // Compare scheduled time with current time (e.g., if scheduled time was > 30m ago)
        const [schHour, schMin] = dose.scheduled_time.split(':').map(Number);
        const scheduledDateTime = new Date();
        scheduledDateTime.setHours(schHour, schMin, 0, 0);

        const diffMinutes = Math.floor((now - scheduledDateTime) / (1000 * 60));

        if (diffMinutes >= 30) {
          console.log(`🚨 [Scheduler] Missed dose detected for patient ${dose.patient_id}: ${dose.med_name}`);

          // Mark dose as missed
          await supabaseAdmin
            .from('dose_logs')
            .update({ status: 'missed', notes: 'Automated timeout: Lid not opened within 30 minutes.' })
            .eq('id', dose.id);

          // Find linked caregivers
          const { data: links } = await supabaseAdmin
            .from('caregiver_patients')
            .select('caregiver_id')
            .eq('patient_id', dose.patient_id);

          if (links && links.length > 0) {
            for (const link of links) {
              await supabaseAdmin.from('caregiver_alerts').insert({
                patient_id: dose.patient_id,
                caregiver_id: link.caregiver_id,
                dose_log_id: dose.id,
                title: 'Missed Medication Alert',
                message: `Patient has missed their ${dose.compartment} dose of ${dose.med_name} (${dose.dosage}). Smart Pillbox lid remained closed.`,
                severity: 'high'
              });
            }
          }
        }
      }
    } catch (err) {
      console.error('❌ [Scheduler] Exception in adherence scheduler:', err);
    }
  });

  console.log('✅ [Scheduler] Adherence background monitoring active (Checking every 5m)');
}
