import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('reservations')
      .select('*');

    if (error) return res.status(500).json(error);

    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { name, phone, email, time, guests } = req.body;

    const { data, error } = await supabase
      .from('reservations')
      .insert([{ name, phone, email, time, guests }]);

    if (error) return res.status(500).json(error);

    return res.status(200).json(data);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}