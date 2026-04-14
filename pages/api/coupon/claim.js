import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' })

  const { coupon_id, merchant_id, phone } = req.body

  if (!coupon_id || !merchant_id || !phone) {
    return res.status(400).json({ error: 'coupon_id, merchant_id et phone requis' })
  }

  // Normaliser le numéro (enlever espaces)
  const cleanPhone = phone.replace(/\s/g, '')

  try {
    // Vérifier que le coupon existe et est actif
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', coupon_id)
      .eq('merchant_id', merchant_id)
      .eq('active', true)
      .single()

    if (!coupon) return res.status(404).json({ error: 'Coupon introuvable' })

    // Vérifier expiration
    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      return res.status(400).json({ error: 'Ce coupon a expiré' })
    }

    // Vérifier si ce numéro a déjà activé ce coupon
    const { data: existing } = await supabase
      .from('coupon_claims')
      .select('id')
      .eq('coupon_id', coupon_id)
      .eq('phone', cleanPhone)
      .single()

    if (existing) {
      return res.status(409).json({ error: 'Ce numéro a déjà activé ce coupon' })
    }

    // Enregistrer le claim
    await supabase.from('coupon_claims').insert({
      coupon_id,
      merchant_id,
      phone: cleanPhone,
    })

    // Ajouter le contact si pas déjà présent
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('id')
      .eq('merchant_id', merchant_id)
      .eq('phone', cleanPhone)
      .single()

    if (!existingContact) {
      await supabase.from('contacts').insert({
        merchant_id,
        phone: cleanPhone,
        source: 'coupon',
      })
    }

    return res.status(200).json({
      success: true,
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        valid_until: coupon.valid_until,
      }
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}
