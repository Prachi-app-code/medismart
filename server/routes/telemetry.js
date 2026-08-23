import express from 'express';
import { supabaseAdmin } from '../services/supabaseAdmin.js';

const router = express.Router();

// POST /api/telemetry/lid-event (Hardware IoT webhook)
router.post('/lid-event', async (req, res) => {
  try {
    const { deviceId, compartment, action = 'open', battery = 100 } = req.body;
    console.log(`📡 [IoT Telemetry] Device: ${deviceId} | Compartment: ${compartment} | Action: ${action} | Battery: ${battery}%`);

    if (!supabaseAdmin) {
      return res.json({
        success: true,
        message: 'Demo IoT event simulated',
        ledCommand: 'GREEN_PULSE_OFF',
        audioTone: 'SUCCESS_CHIME'
      });
    }

    // 1. Find device & linked patient
    const { data: device, error: devError } = await supabaseAdmin
      .from('smart_pillboxes')
      .select('*, profiles!patient_id(*)')
      .eq('device_id', deviceId)
      .maybeSingle();

    if (devError || !device) {
      return res.status(404).json({ error: `Unknown device ${deviceId}` });
    }

    // 2. Update device battery & last sync
    await supabaseAdmin
      .from('smart_pillboxes')
      .update({
        battery_level: battery,
        is_online: true,
        last_synced_at: new Date().toISOString()
      })
      .eq('id', device.id);

    // 3. If lid was opened, find pending dose for this compartment today
    if (action === 'open') {
      const todayStr = new Date().toISOString().split('T')[0];
      const { data: pendingDose } = await supabaseAdmin
        .from('dose_logs')
        .select('*')
        .eq('patient_id', device.patient_id)
        .eq('compartment', compartment)
        .eq('scheduled_date', todayStr)
        .eq('status', 'pending')
        .maybeSingle();

      if (pendingDose) {
        // Auto-confirm dose via hardware reed switch sensor!
        await supabaseAdmin
          .from('dose_logs')
          .update({
            status: 'taken',
            logged_at: new Date().toISOString(),
            confirmed_by: `Smart Pillbox Sensor (${deviceId})`,
            notes: `Magnetic reed sensor triggered for ${compartment} compartment.`
          })
          .eq('id', pendingDose.id);

        console.log(`✅ [IoT Telemetry] Dose ${pendingDose.med_name} automatically confirmed for patient!`);

        return res.json({
          success: true,
          event: 'DOSE_CONFIRMED',
          medName: pendingDose.med_name,
          dosage: pendingDose.dosage,
          ledCommand: 'TURN_OFF_LED',
          buzzerCommand: 'PLAY_SUCCESS_CHIME'
        });
      }
    }

    return res.json({
      success: true,
      event: 'TELEMETRY_RECORDED',
      batteryStatus: 'OK'
    });
  } catch (err) {
    console.error('❌ [IoT Telemetry] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/telemetry/heartbeat
router.post('/heartbeat', async (req, res) => {
  try {
    const { deviceId, battery, rssi } = req.body;
    if (supabaseAdmin && deviceId) {
      await supabaseAdmin
        .from('smart_pillboxes')
        .update({
          battery_level: battery || 100,
          is_online: true,
          last_synced_at: new Date().toISOString()
        })
        .eq('device_id', deviceId);
    }
    return res.json({ status: 'ACK', serverTime: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
