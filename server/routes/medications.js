import express from 'express';
import { supabaseAdmin } from '../services/supabaseAdmin.js';

const router = express.Router();

// GET /api/medications/:patientId
router.get('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!supabaseAdmin) {
      return res.json({ success: true, medications: [] });
    }

    const { data, error } = await supabaseAdmin
      .from('medications')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true, medications: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/medications
router.post('/', async (req, res) => {
  try {
    const medData = req.body;
    if (!supabaseAdmin) {
      return res.status(201).json({ success: true, medication: { id: `med_${Date.now()}`, ...medData } });
    }

    const { data, error } = await supabaseAdmin
      .from('medications')
      .insert(medData)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    // Also auto-generate today's pending dose logs for this med
    const todayStr = new Date().toISOString().split('T')[0];
    const times = Array.isArray(data.times) ? data.times : ['08:00'];
    const dosesToInsert = times.map(t => ({
      patient_id: data.patient_id,
      medication_id: data.id,
      med_name: data.name,
      dosage: data.dosage,
      compartment: data.compartment,
      scheduled_time: t,
      scheduled_date: todayStr,
      status: 'pending'
    }));

    await supabaseAdmin.from('dose_logs').insert(dosesToInsert);

    return res.status(201).json({ success: true, medication: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/medications/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!supabaseAdmin) {
      return res.json({ success: true, message: 'Deleted' });
    }

    const { error } = await supabaseAdmin
      .from('medications')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true, message: 'Medication removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
