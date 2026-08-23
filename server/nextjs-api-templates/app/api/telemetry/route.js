import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// POST /api/telemetry (Smart Pillbox IoT Sensor Event)
export async function POST(request) {
  try {
    const { deviceId, compartment, action = 'open', battery = 100 } = await request.json();

    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId is required' }, { status: 400 });
    }

    // 1. Locate device and patient
    const { data: device, error: devError } = await supabase
      .from('smart_pillboxes')
      .select('*, profiles!patient_id(*)')
      .eq('device_id', deviceId)
      .maybeSingle();

    if (devError || !device) {
      return NextResponse.json({ error: `Device ${deviceId} not registered` }, { status: 404 });
    }

    // 2. Update battery & sync timestamp
    await supabase
      .from('smart_pillboxes')
      .update({
        battery_level: battery,
        is_online: true,
        last_synced_at: new Date().toISOString()
      })
      .eq('id', device.id);

    // 3. Auto-confirm active pending dose if lid opened
    if (action === 'open' && compartment) {
      const todayStr = new Date().toISOString().split('T')[0];
      const { data: pendingDose } = await supabase
        .from('dose_logs')
        .select('*')
        .eq('patient_id', device.patient_id)
        .eq('compartment', compartment)
        .eq('scheduled_date', todayStr)
        .eq('status', 'pending')
        .maybeSingle();

      if (pendingDose) {
        await supabase
          .from('dose_logs')
          .update({
            status: 'taken',
            logged_at: new Date().toISOString(),
            confirmed_by: `Smart Pillbox (${deviceId})`,
            notes: `Sensor triggered for ${compartment} compartment`
          })
          .eq('id', pendingDose.id);

        return NextResponse.json({
          success: true,
          event: 'DOSE_CONFIRMED',
          medName: pendingDose.med_name,
          dosage: pendingDose.dosage,
          ledCommand: 'TURN_OFF_LED',
          buzzerCommand: 'PLAY_SUCCESS_CHIME'
        });
      }
    }

    return NextResponse.json({ success: true, event: 'TELEMETRY_RECORDED' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
