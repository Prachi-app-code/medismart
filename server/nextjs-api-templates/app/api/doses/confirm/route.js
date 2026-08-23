import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// POST /api/doses/confirm
export async function POST(request) {
  try {
    const { doseId, confirmedBy = 'Next.js App', notes = '' } = await request.json();

    if (!doseId) {
      return NextResponse.json({ error: 'doseId is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('dose_logs')
      .update({
        status: 'taken',
        logged_at: new Date().toISOString(),
        confirmed_by: confirmedBy,
        notes: notes || 'Confirmed by patient'
      })
      .eq('id', doseId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, dose: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
