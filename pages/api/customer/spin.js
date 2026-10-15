import {
  supabaseAdmin, cors, getActiveMerchant, getWheel, vnToday, isLosingLabel,
  publicSpin, PRIZE_DAYS,
} from '../../../lib/customer'

// POST { merchant_id, card_id, preview }
// Le lot est tiré par le serveur. Une partie par client et par jour (heure du Vietnam).
// En aperçu (commerçant), pas de limite et les parties sont marquées is_preview.
export default async function handler(req, res) {
  if (cors(req, res, 'POST')) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })

  const { merchant_id, card_id, preview } = req.body || {}
  if (!merchant_id || !card_id) return res.status(400).json({ error: 'missing_params' })
  const isPreview = preview === true || preview === '1'

  try {
    const merchant = await getActiveMerchant(merchant_id, isPreview)
    if (!merchant) return res.status(404).json({ error: 'merchant_unavailable' })

    const wheel = await getWheel(merchant.id)
    const prizes = (wheel && wheel.prizes) || []
    if (!wheel || !wheel.enabled || prizes.length === 0) {
      return res.status(400).json({ error: 'wheel_disabled' })
    }

    const { data: card } = await supabaseAdmin
      .from('loyalty_cards')
      .select('id')
      .eq('id', card_id)
      .eq('merchant_id', merchant.id)
      .maybeSingle()
    if (!card) return res.status(404).json({ error: 'card_not_found' })

    const today = vnToday()

    if (!isPreview) {
      const { data: existing } = await supabaseAdmin
        .from('wheel_spins')
        .select('*')
        .eq('card_id', String(card.id))
        .eq('spin_date', today)
        .eq('is_preview', false)
        .maybeSingle()
      if (existing) {
        return res.status(409).json({ error: 'already_spun', spin: publicSpin(existing) })
      }
    }

    // Tirage équiprobable, comme l'affichage de la roue
    const index = Math.floor(Math.random() * prizes.length)
    const label = String(prizes[index].label || '')
    const isWin = !isLosingLabel(label)

    const { data: spin, error } = await supabaseAdmin
      .from('wheel_spins')
      .insert({
        merchant_id: String(merchant.id),
        card_id: String(card.id),
        spin_date: today,
        prize_label: label,
        is_win: isWin,
        expires_at: isWin ? new Date(Date.now() + PRIZE_DAYS * 86400000).toISOString() : null,
        is_preview: isPreview,
      })
      .select('*')
      .single()

    if (error) {
      // Deux clics simultanés : l'index unique bloque la seconde partie
      if (error.code === '23505') return res.status(409).json({ error: 'already_spun' })
      throw error
    }

    return res.status(200).json({ index, spin: publicSpin(spin) })
  } catch (e) {
    console.error('[customer/spin]', e)
    return res.status(500).json({ error: 'server_error' })
  }
}
