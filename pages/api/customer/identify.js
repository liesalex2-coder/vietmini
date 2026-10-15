import {
  supabaseAdmin, normalizePhone, cleanName, cors,
  getActiveMerchant, getLoyalty, publicLoyalty, publicCard,
} from '../../../lib/customer'

// POST { merchant_id, name, phone, preview }
// Crée ou retrouve le client (contacts + loyalty_cards) à partir de son numéro.
export default async function handler(req, res) {
  if (cors(req, res, 'POST')) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })

  const { merchant_id, name, phone, preview } = req.body || {}
  const cleanPhone = normalizePhone(phone)
  const displayName = cleanName(name)
  if (!cleanPhone) return res.status(400).json({ error: 'invalid_phone' })
  if (!displayName) return res.status(400).json({ error: 'invalid_name' })

  try {
    const merchant = await getActiveMerchant(merchant_id, preview === true || preview === '1')
    if (!merchant) return res.status(404).json({ error: 'merchant_unavailable' })

    // Liste clients du commerçant
    const { data: contact } = await supabaseAdmin
      .from('contacts')
      .select('id')
      .eq('merchant_id', merchant.id)
      .eq('phone', cleanPhone)
      .maybeSingle()
    if (contact) {
      await supabaseAdmin.from('contacts').update({ display_name: displayName }).eq('id', contact.id)
    } else {
      await supabaseAdmin.from('contacts').insert({
        merchant_id: merchant.id,
        phone: cleanPhone,
        display_name: displayName,
        source: 'web',
      })
    }

    // Carte de fidélité (une par client et par commerçant)
    let { data: card } = await supabaseAdmin
      .from('loyalty_cards')
      .select('*')
      .eq('merchant_id', merchant.id)
      .eq('phone', cleanPhone)
      .maybeSingle()

    if (card) {
      if (card.display_name !== displayName) {
        await supabaseAdmin.from('loyalty_cards').update({ display_name: displayName }).eq('id', card.id)
        card.display_name = displayName
      }
    } else {
      const { data: created, error } = await supabaseAdmin
        .from('loyalty_cards')
        .insert({
          merchant_id: merchant.id,
          phone: cleanPhone,
          display_name: displayName,
          visit_count: 0,
        })
        .select('*')
        .single()
      if (error) throw error
      card = created
    }

    const loyalty = await getLoyalty(merchant.id)
    return res.status(200).json({ card: publicCard(card), loyalty: publicLoyalty(loyalty) })
  } catch (e) {
    console.error('[customer/identify]', e)
    return res.status(500).json({ error: 'server_error' })
  }
}
