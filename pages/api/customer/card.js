import {
  supabaseAdmin, cors, getActiveMerchant, getLoyalty, publicLoyalty, publicCard, getActivePrizes,
} from '../../../lib/customer'

// GET ?merchant_id=…&card_id=…&preview=1
export default async function handler(req, res) {
  if (cors(req, res, 'GET')) return
  if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' })

  const { merchant_id, card_id, preview } = req.query
  if (!merchant_id || !card_id) return res.status(400).json({ error: 'missing_params' })

  try {
    const merchant = await getActiveMerchant(merchant_id, preview === '1')
    if (!merchant) return res.status(404).json({ error: 'merchant_unavailable' })

    const { data: card } = await supabaseAdmin
      .from('loyalty_cards')
      .select('*')
      .eq('id', card_id)
      .eq('merchant_id', merchant.id)
      .maybeSingle()
    if (!card) return res.status(404).json({ error: 'card_not_found' })

    const loyalty = await getLoyalty(merchant.id)
    const prizes = await getActivePrizes(merchant.id, card.id).catch(() => [])
    return res.status(200).json({ card: publicCard(card), loyalty: publicLoyalty(loyalty), prizes })
  } catch (e) {
    console.error('[customer/card]', e)
    return res.status(500).json({ error: 'server_error' })
  }
}
