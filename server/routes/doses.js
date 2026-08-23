import express from 'express';
import { supabaseAdmin } from '../services/supabaseAdmin.js';

const router = express.Router();

// GET /api/doses/today/:patientId
router.get('/today/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const todayStr = new Date().toISOString().split('T')[0];

    if (!supabaseAdmin) {
      return res.json({ success: true, doses: [] });
    }

    const { data, error } = await supabaseAdmin
      .from('dose_logs')
      .select('*')
      .eq('patient_id', patientId)
      .eq('scheduled_date', todayStr)
      .order('scheduled_time', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true, doses: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/doses/confirm
router.post('/confirm', async (req, res) => {
  try {
    const { doseId, confirmedBy = 'Web App', notes = '' } = req.body;
    const now = new Date().toISOString();

    if (!supabaseAdmin) {
      return res.json({ success: true, message: 'Dose confirmed in demo mode' });
    }

    const { data, error } = await supabaseAdmin
      .from('dose_logs')
      .update({
        status: 'taken',
        logged_at: now,
        confirmed_by: confirmedBy,
        notes: notes || 'Confirmed by patient'
      })
      .eq('id', doseId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true, dose: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
