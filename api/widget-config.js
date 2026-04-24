const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

module.exports = async (req, res) => {
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
}