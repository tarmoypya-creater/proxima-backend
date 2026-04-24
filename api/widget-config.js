import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    )

    const { place_id } = req.query

    if (!place_id) {
      return res.status(400).json({ error: 'place_id required' })
    }

    const { data, error } = await supabase
      .from('widget_configs')
      .select('config_json')
      .eq('place_id', place_id)
      .single()

    if (error || !data) {
      return res.status(200).json({
        chat: { enabled: true, autoOpen: false },
        booking: { enabled: true }
      })
    }

    return res.status(200).json(data.config_json)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}