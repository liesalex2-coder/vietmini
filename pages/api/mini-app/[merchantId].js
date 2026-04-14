import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const { merchantId } = req.query

  if (!merchantId) return res.status(400).json({ error: 'merchantId requis' })

  try {
    const [
      { data: merchant },
      { data: services },
      { data: categories },
      { data: wheel },
      { data: loyalty },
      { data: flash },
      { data: reviews },
      { data: coupons },
    ] = await Promise.all([
      supabase.from('merchants').select('*').eq('id', merchantId).single(),
      supabase.from('services').select('*').eq('merchant_id', merchantId).eq('active', true).order('display_order'),
      supabase.from('service_categories').select('*').eq('merchant_id', merchantId).order('display_order'),
      supabase.from('wheel_config').select('*').eq('merchant_id', merchantId).single(),
      supabase.from('loyalty_config').select('*').eq('merchant_id', merchantId).single(),
      supabase.from('flash_sales').select('*').eq('merchant_id', merchantId).single(),
      supabase.from('reviews').select('*').eq('merchant_id', merchantId).eq('visible', true).order('created_at', { ascending: false }).limit(10),
      supabase.from('coupons').select('*').eq('merchant_id', merchantId).eq('active', true),
    ])

    if (!merchant) return res.status(404).json({ error: 'Marchand introuvable' })

    // Grouper les services par catégorie
    const servicesByCategory = (categories || []).map(cat => ({
      name: cat.name,
      image: cat.image_base64 || null,
      items: (services || [])
        .filter(s => s.category === cat.name)
        .map(s => ({
          id: s.id,
          name: s.name,
          price: s.price,
          description: s.description || '',
          image: s.image_base64 || null,
        }))
    })).filter(cat => cat.items.length > 0)

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 'no-store')

    return res.status(200).json({
      merchant: {
        id: merchant.id,
        name: merchant.name || '',
        vertical: merchant.vertical || '',
        phone: merchant.phone || '',
        address: merchant.address || '',
        hours: merchant.hours || '',
        primary_color: merchant.primary_color || '#D0021B',
        secondary_color: merchant.secondary_color || '#F5A623',
        hero_image: merchant.hero_image || null,
        welcome_enabled: merchant.welcome_enabled || false,
        welcome_discount: merchant.welcome_discount || 0,
        welcome_message: merchant.welcome_message || '',
      },
      services: servicesByCategory,
      wheel: wheel ? {
        enabled: wheel.enabled,
        prizes: wheel.prizes || [],
      } : { enabled: false, prizes: [] },
      loyalty: loyalty ? {
        enabled: loyalty.enabled,
        visits_required: loyalty.visits_required || 10,
        reward_text: loyalty.reward_text || '',
        pin: loyalty.pin_code || '0000',
      } : { enabled: false, visits_required: 10, reward_text: '', pin: '0000' },
      flash: flash ? {
        enabled: flash.enabled,
        discount_value: flash.discount_value || 0,
        service_name: flash.service_name || '',
        start_time: flash.start_time || null,
        end_time: flash.end_time || null,
      } : { enabled: false },
      reviews: (reviews || []).map(r => ({
        id: r.id,
        author: r.author || 'Client',
        rating: r.rating || 5,
        text: r.text || '',
      })),
      coupons: (coupons || []).filter(c => !c.valid_until || new Date(c.valid_until) > new Date()).map(c => ({
        id: c.id,
        code: c.code,
        discount_type: c.discount_type,
        discount_value: c.discount_value,
        valid_until: c.valid_until || null,
      })),
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}