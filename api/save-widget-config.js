import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    // ✅ Only POST allowed
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // ✅ Env check (estää "supabaseKey is required" -errorin)
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return res.status(500).json({ error: 'Missing Supabase env variables' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { place_id, config_json } = req.body;

    // ✅ Input validation
    if (!place_id || !config_json) {
      return res.status(400).json({
        error: 'place_id and config_json required'
      });
    }

    // ✅ UPSERT (päivittää jos löytyy, luo jos ei)
    const { data, error } = await supabase
      .from('widget_configs')
      .upsert(
        {
          place_id,
          config_json
        },
        {
          onConflict: 'place_id'
        }
      )
      .select();

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}