import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // 1. Asetetaan CORS-otsikot heti ensimmäisenä
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-client-info, apikey');

  // 2. Vastataan selaimen esikyselyyn
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 3. Haku (GET)
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('reservations')
        .select('*');
      
      if (error) throw error;
      return res.status(200).json(data);
    }

    // 4. Tallennus (POST)
    if (req.method === 'POST') {
      const { name, phone, email, time, guests } = req.body;
      const { data, error } = await supabase
        .from('reservations')
        .insert([{ name, phone, email, time, guests }]);
      
      if (error) throw error;
      return res.status(200).json(data);
    }

    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (err) {
    console.error("Palvelinvirhe:", err);
    return res.status(500).json({ error: err.message });
  }
}