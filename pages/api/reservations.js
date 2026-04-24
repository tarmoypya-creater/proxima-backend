import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // 🌐 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-client-info, apikey'
  );

  // ✅ Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // =========================
    // 🔐 SUOJATTU GET (dashboard)
    // =========================
    if (req.method === 'GET') {
      const authHeader = req.headers.authorization;

      if (!authHeader || authHeader !== `Bearer ${process.env.API_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json(data);
    }

    // =========================
    // 🔓 JULKINEN POST (AI/widget)
    // =========================
    if (req.method === 'POST') {
      const { name, phone, email, time, guests } = req.body;

      // 🔍 basic validointi (tärkeä!)
      if (!name || !time || !guests) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { data, error } = await supabase
        .from('reservations')
        .insert([{ name, phone, email, time, guests }]);

      if (error) throw error;

      return res.status(200).json(data);
    }

    // ❌ muut metodit
    return res.status(405).json({ message: 'Method not allowed' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}