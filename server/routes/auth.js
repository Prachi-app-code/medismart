import express from 'express';
import { supabaseAdmin } from '../services/supabaseAdmin.js';

const router = express.Router();

// GET /api/auth/profile/:userId
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!supabaseAdmin) {
      return res.json({ success: true, message: 'Running in demo mode without DB' });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return res.status(404).json({ error: error.message });
    return res.json({ success: true, profile: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/profile/:userId
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    if (!supabaseAdmin) {
      return res.json({ success: true, message: 'Profile updated in demo mode', profile: updates });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true, profile: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
