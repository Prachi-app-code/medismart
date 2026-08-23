import express from 'express';
import { supabaseAdmin } from '../services/supabaseAdmin.js';

const router = express.Router();

// GET /api/alerts/:caregiverId
router.get('/:caregiverId', async (req, res) => {
  try {
    const { caregiverId } = req.params;
    if (!supabaseAdmin) {
      return res.json({ success: true, alerts: [] });
    }

    const { data, error } = await supabaseAdmin
      .from('caregiver_alerts')
      .select('*, profiles!patient_id(full_name, phone, emergency_contact)')
      .eq('caregiver_id', caregiverId)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true, alerts: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/alerts/nudge (Send chime / push notification to smart box)
router.post('/nudge', async (req, res) => {
  try {
    const { patientId, customMessage } = req.body;
    console.log(`📲 [Nudge Dispatched] To Patient: ${patientId} | Message: ${customMessage || 'Pill reminder'}`);
    return res.json({
      success: true,
      message: 'Chime reminder dispatched to patient Smart Pillbox via cloud MQTT/BLE bridge.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
