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
      { data: referral },
      { data: reviews },
      { data: coupons },
      { data: gallery },
    ] = await Promise.all([
      supabase.from('merchants').select('*').eq('id', merchantId).maybeSingle(),
      supabase.from('services').select('*').eq('merchant_id', merchantId).eq('active', true).order('display_order'),
      supabase.from('service_categories').select('*').eq('merchant_id', merchantId).order('display_order'),
      supabase.from('wheel_config').select('*').eq('merchant_id', merchantId).maybeSingle(),
      supabase.from('loyalty_config').select('*').eq('merchant_id', merchantId).maybeSingle(),
      supabase.from('flash_sales').select('*').eq('merchant_id', merchantId).maybeSingle(),
      supabase.from('referral_config').select('*').eq('merchant_id', merchantId).maybeSingle(),
      supabase.from('reviews').select('*').eq('merchant_id', merchantId).eq('visible', true).order('created_at', { ascending: false }).limit(20),
      supabase.from('coupons').select('*').eq('merchant_id', merchantId).eq('active', true),
      supabase.from('gallery').select('*').eq('merchant_id', merchantId).eq('active', true).order('display_order'),
    ])

    if (!merchant) return res.status(404).json({ error: 'Marchand introuvable' })

    // Grouper les services par catégorie (sans perdre les orphelins)
    const categoriesList = categories || []
    const servicesList = services || []

    const grouped = categoriesList.map(cat => ({
      name: cat.name,
      image: cat.image_base64 || null,
      items: servicesList
        .filter(s => s.category === cat.name)
        .map(s => ({
          id: s.id,
          name: s.name,
          price: s.price,
          description: s.description || '',
          image: s.image_base64 || null,
        }))
    }))

    const knownCategoryNames = new Set(categoriesList.map(c => c.name))
    const orphanServices = servicesList.filter(s => !knownCategoryNames.has(s.category))

    if (orphanServices.length > 0) {
      grouped.push({
        name: 'Khác',
        image: null,
        items: orphanServices.map(s => ({
          id: s.id,
          name: s.name,
          price: s.price,
          description: s.description || '',
          image: s.image_base64 || null,
        }))
      })
    }

    const servicesByCategory = grouped.filter(cat => cat.items.length > 0)

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
        logo_url: merchant.logo_url || null,
        hero_image: merchant.hero_image || null,
        zalo_oa_id: merchant.zalo_oa_id || null,
        welcome_enabled: merchant.welcome_enabled || false,
        welcome_discount: merchant.welcome_discount || 0,
        welcome_message: merchant.welcome_message || '',
        subscription_active: merchant.subscription_active || false,
        subscription_expires_at: merchant.subscription_expires_at || null,
      },
      services: servicesByCategory,
      gallery: (gallery || []).map(g => ({
        id: g.id,
        image_url: g.image_url,
        caption: g.caption || '',
      })),
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
        recurring: flash.recurring || false,
        recurring_days: flash.recurring_days || [],
        recurring_start_time: flash.recurring_start_time || null,
        recurring_end_time: flash.recurring_end_time || null,
        start_time: flash.start_time || null,
        end_time: flash.end_time || null,
      } : { enabled: false },
      referral: referral ? {
        enabled: referral.enabled,
        discount_referrer: referral.discount_referrer || 0,
        discount_referred: referral.discount_referred || 0,
        valid_days: referral.valid_days || 30,
      } : { enabled: false, discount_referrer: 0, discount_referred: 0, valid_days: 30 },
      reviews: (reviews || []).map(r => ({
        id: r.id,
        author: r.author_name || 'Khách hàng',
        rating: r.rating || 5,
        text: r.content || '',
        created_at: r.created_at,
      })),
      coupons: (coupons || [])
        .filter(c => !c.valid_until || new Date(c.valid_until) > new Date())
        .map(c => ({
          id: c.id,
          code: c.code,
          discount_type: c.discount_type,
          discount_value: c.discount_value,
          service_name: c.service_name || '',
          valid_until: c.valid_until || null,
        })),
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}