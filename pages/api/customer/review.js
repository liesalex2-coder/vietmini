import {
  supabaseAdmin, cors, getActiveMerchant, publicCard,
  getReviewSetup, getReviewState, createReward, getAllRewards,
} from '../../../lib/customer'
import { containsBanned } from '../../../lib/moderation'
import { sendReviewEmail } from '../../../lib/sendReviewEmail'

// POST { merchant_id, card_id, rating (1-5), text, preview }
// Avis d'un client identifié déjà venu au moins une fois. Publié immédiatement (badge vérifié).
// Réduction donnée si l'option est activée, quelle que soit la note.
export default async function handler(req, res) {
  if (cors(req, res, 'POST')) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })

  const { merchant_id, card_id, rating, text, preview } = req.body || {}
  const stars = parseInt(rating, 10)
  const content = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 500)
  if (!merchant_id || !card_id) return res.status(400).json({ error: 'missing_params' })
  if (!(stars >= 1 && stars <= 5)) return res.status(400).json({ error: 'invalid_rating' })
  if (content && containsBanned(content)) return res.status(400).json({ error: 'banned_content' })

  try {
    const merchant = await getActiveMerchant(merchant_id, preview === true || preview === '1')
    if (!merchant) return res.status(404).json({ error: 'merchant_unavailable' })

    const { data: card } = await supabaseAdmin
      .from('loyalty_cards')
      .select('*')
      .eq('id', card_id)
      .eq('merchant_id', merchant.id)
      .maybeSingle()
    if (!card) return res.status(404).json({ error: 'card_not_found' })

    const setup = await getReviewSetup(merchant.id)
    const state = await getReviewState(merchant.id, card, setup)
    if (!state.enabled) return res.status(400).json({ error: 'reviews_disabled' })
    if (!state.visited) return res.status(403).json({ error: 'not_visited' })
    if (!state.can_review) return res.status(409).json({ error: 'too_soon', next_date: state.next_date })

    const review = {
      merchant_id: merchant.id,
      card_id: String(card.id),
      author_name: card.display_name || 'Khách hàng',
      rating: stars,
      content,
      verified: true,
      visible: true,
    }
    const { error } = await supabaseAdmin.from('reviews').insert(review)
    if (error) throw error

    // Réduction pour avis (option du commerçant), quelle que soit la note
    if (setup.config && setup.config.enabled) {
      await createReward({
        merchantId: merchant.id,
        cardId: card.id,
        source: 'review',
        percent: setup.config.reward_percent || 10,
        serviceName: setup.config.service_name || '',
        validDays: 30,
      })
    }

    await sendReviewEmail(merchant.id, review).catch(() => {})

    const prizes = await getAllRewards(merchant.id, card.id).catch(() => [])
    const newState = await getReviewState(merchant.id, card, setup)
    return res.status(200).json({ card: publicCard(card), review_state: newState, prizes })
  } catch (e) {
    console.error('[customer/review]', e)
    return res.status(500).json({ error: 'server_error' })
  }
}
