import {
  supabaseAdmin, cors, getActiveMerchant, getLoyalty, publicLoyalty, publicCard, getActivePrizes,
} from '../../../lib/customer'

const MAX_FAILURES = 5
const LOCK_MINUTES = 15
const ACTIONS = ['stamp', 'redeem', 'use_prize']

// POST { merchant_id, card_id, pin, action, spin_id?, preview }
//  - stamp     : +1 tampon
//  - redeem    : carte pleine → récompense utilisée, carte remise à zéro
//  - use_prize : lot de la roue (spin_id) marqué comme utilisé
// Le PIN est vérifié ici : il n'est jamais envoyé au navigateur.
export default async function handler(req, res) {
  if (cors(req, res, 'POST')) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })

  const { merchant_id, card_id, pin, action, spin_id, preview } = req.body || {}
  if (!merchant_id || !card_id || !pin) return res.status(400).json({ error: 'missing_params' })
  if (!ACTIONS.includes(action)) return res.status(400).json({ error: 'invalid_action' })
  if (action === 'use_prize' && !spin_id) return res.status(400).json({ error: 'missing_params' })

  try {
    const merchant = await getActiveMerchant(merchant_id, preview === true || preview === '1')
    if (!merchant) return res.status(404).json({ error: 'merchant_unavailable' })

    const loyalty = await getLoyalty(merchant.id)
    if (!loyalty || !loyalty.pin_code) return res.status(400).json({ error: 'no_pin' })
    if (action !== 'use_prize' && !loyalty.enabled) return res.status(400).json({ error: 'loyalty_disabled' })

    const { data: card } = await supabaseAdmin
      .from('loyalty_cards')
      .select('*')
      .eq('id', card_id)
      .eq('merchant_id', merchant.id)
      .maybeSingle()
    if (!card) return res.status(404).json({ error: 'card_not_found' })

    const now = new Date()
    if (card.pin_locked_until && new Date(card.pin_locked_until) > now) {
      return res.status(429).json({ error: 'locked' })
    }

    if (String(pin) !== String(loyalty.pin_code)) {
      const failures = (card.pin_failures || 0) + 1
      const update = { pin_failures: failures }
      if (failures >= MAX_FAILURES) {
        update.pin_failures = 0
        update.pin_locked_until = new Date(now.getTime() + LOCK_MINUTES * 60000).toISOString()
      }
      await supabaseAdmin.from('loyalty_cards').update(update).eq('id', card.id)
      return res.status(403).json({ error: failures >= MAX_FAILURES ? 'locked' : 'wrong_pin' })
    }

    const update = { pin_failures: 0, pin_locked_until: null }

    if (action === 'use_prize') {
      const { data: spin } = await supabaseAdmin
        .from('wheel_spins')
        .select('*')
        .eq('id', spin_id)
        .eq('merchant_id', String(merchant.id))
        .eq('card_id', String(card.id))
        .maybeSingle()
      if (!spin || !spin.is_win) return res.status(404).json({ error: 'prize_not_found' })
      if (spin.redeemed_at) return res.status(400).json({ error: 'prize_used' })
      if (spin.expires_at && new Date(spin.expires_at) < now) return res.status(400).json({ error: 'prize_expired' })
      await supabaseAdmin.from('wheel_spins').update({ redeemed_at: now.toISOString() }).eq('id', spin.id)
    } else {
      const required = loyalty.visits_required || 10
      const current = card.visit_count || 0
      if (action === 'stamp') {
        if (current >= required) return res.status(400).json({ error: 'card_full' })
        update.visit_count = current + 1
        update.last_visit_at = now.toISOString()
      } else {
        if (current < required) return res.status(400).json({ error: 'card_not_full' })
        update.visit_count = 0
        update.rewards_redeemed = (card.rewards_redeemed || 0) + 1
      }
    }

    const { data: saved, error } = await supabaseAdmin
      .from('loyalty_cards')
      .update(update)
      .eq('id', card.id)
      .select('*')
      .single()
    if (error) throw error

    const prizes = await getActivePrizes(merchant.id, card.id).catch(() => [])
    return res.status(200).json({ card: publicCard(saved), loyalty: publicLoyalty(loyalty), prizes })
  } catch (e) {
    console.error('[customer/stamp]', e)
    return res.status(500).json({ error: 'server_error' })
  }
}
