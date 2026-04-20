import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // 1. CORS-OTSIKOT (Nämä sallivat AI Studion lukea dataa)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 2. PREFLIGHT-PYYNTÖ (Selain tarkistaa luvat tällä)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 3. GET - HAETAAN VARAUKSET
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    }

    // 4. POST - TEHDÄÄN VARAUS
    if (req.method === 'POST') {
      const { name, phone, email, time, guests } = req.body;
      const { data, error } = await supabase
        .from('reservations')
        .insert([{ name, phone, email, time, guests }]);

      if (error) throw error;
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error("Palvelinvirhe:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}