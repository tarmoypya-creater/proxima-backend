import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // 1. Asetetaan CORS-otsikot heti (tämä sallii AI Studion yhteyden)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-client-info, apikey');

  // 2. Käsitellään OPTIONS-pyyntö
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 3. GET - Haetaan varaukset
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    }

    // 4. POST - Tallennetaan varaus
    if (req.method === 'POST') {
      const { name, phone, email, time, guests } = req.body;
      const { data, error } = await supabase
        .from('reservations')
        .insert([{ name, phone, email, time, guests }]);

      if (error) throw error;
      return res.status(200).json(data);
    }

    // Jos käytetään jotain muuta HTTP-metodia
    return res.status(405).json({ message: 'Method not allowed' });

  } catch (err) {
    // 5. Virheen käsittely - Tämä estää "Crashin" ja kertoo mikä meni vikaan
    console.error("Server error:", err);
    return res.status(500).json({ error: err.message });
  }
}