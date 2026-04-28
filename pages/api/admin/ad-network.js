// pages/api/admin/ad-network.js
// API admin pour la console /admin/ad-network.
// Suit le pattern existant /api/admin/merchants : POST unique, body { action, access_token, ... }.
//
// Actions disponibles :
//   - list_campaigns : { city?, source?, status? }       — liste les campagnes avec filtres
//   - grant          : { merchant_id, days, source?, note? } — offrir des jours à un marchand
//   - get_settings   : ()                                 — lire tous les paramètres
//   - update_setting : { key, value }                     — modifier un paramètre
//   - inventory      : ()                                 — vue par ville
//   - cities         : ()                                 — liste des villes (pour les selects)
//   - search_merchants: { q }                             — chercher un marchand (pour la modal grant)

import { createClient } from '@supabase/supabase-js'

const ALLOWED_SETTINGS = [
  'welcome_bonus_days',
  'welcome_bonus_enabled',
  'monthly_recurring_days',
  'monthly_recurring_enabled'
]

const ALLOWED_SOURCES = ['welcome', 'monthly', 'addon', 'admin_grant']

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { action, access_token, ...params } = req.body || {}

  if (!action || !access_token) {
    return res.status(400).json({ error: 'action and access_token required' })
  }

  // Vérification admin via access_token (même pattern que /api/admin/merchants)
  const supaAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const { data: { user }, error: authErr } = await supaAuth.auth.getUser(access_token)
  if (authErr || !user) {
    return res.status(401).json({ error: 'invalid token' })
  }
  if (user.id !== process.env.NEXT_PUBLIC_ADMIN_USER_ID) {
    return res.status(403).json({ error: 'forbidden' })
  }

  // Service role pour les opérations
  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // ============================================================
  // LIST_CAMPAIGNS
  // ============================================================
  if (action === 'list_campaigns') {
    const { city, source, status } = params

    let query = supa
      .from('ad_campaigns')
      .select(`
        id, source, days_total, days_remaining, started_at, last_shown_date,
        active, created_by_admin, admin_note, created_at,
        merchants ( id, name, email, city_code, vertical, subscription_active )
      `)
      .order('created_at', { ascending: false })

    if (source) query = query.eq('source', source)

    if (status === 'active') {
      query = query.eq('active', true).gt('days_remaining', 0)
    } else if (status === 'expired') {
      query = query.or('active.eq.false,days_remaining.eq.0')
    }

    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })

    let filtered = data || []
    if (city) {
      filtered = filtered.filter(c => c.merchants && c.merchants.city_code === city)
    }

    return res.status(200).json({ campaigns: filtered })
  }

  // ============================================================
  // GRANT
  // ============================================================
  if (action === 'grant') {
    const { merchant_id, days, source, note } = params

    if (!merchant_id) return res.status(400).json({ error: 'merchant_id required' })
    const daysInt = parseInt(days, 10)
    if (!Number.isFinite(daysInt) || daysInt <= 0) {
      return res.status(400).json({ error: 'days must be > 0' })
    }
    const finalSource = source || 'admin_grant'
    if (!ALLOWED_SOURCES.includes(finalSource)) {
      return res.status(400).json({ error: 'invalid source' })
    }

    const { data: merchant } = await supa
      .from('merchants')
      .select('id, name')
      .eq('id', merchant_id)
      .maybeSingle()
    if (!merchant) return res.status(404).json({ error: 'merchant not found' })

    const { data: campaign, error } = await supa
      .from('ad_campaigns')
      .insert({
        merchant_id,
        source: finalSource,
        days_total: daysInt,
        days_remaining: daysInt,
        active: true,
        created_by_admin: true,
        admin_note: note || null
      })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true, campaign })
  }

  // ============================================================
  // GET_SETTINGS
  // ============================================================
  if (action === 'get_settings') {
    const { data, error } = await supa
      .from('ad_settings')
      .select('key, value, updated_at')
      .order('key')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ settings: data || [] })
  }

  // ============================================================
  // UPDATE_SETTING
  // ============================================================
  if (action === 'update_setting') {
    const { key, value } = params
    if (!ALLOWED_SETTINGS.includes(key)) {
      return res.status(400).json({ error: `unknown key: ${key}` })
    }
    const { error } = await supa
      .from('ad_settings')
      .upsert({ key, value: String(value), updated_at: new Date().toISOString() })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  // ============================================================
  // INVENTORY
  // ============================================================
  if (action === 'inventory') {
    const { data: campaigns } = await supa
      .from('ad_campaigns')
      .select(`
        merchant_id, days_remaining, source, last_shown_date,
        merchants ( city_code, subscription_active )
      `)
      .eq('active', true)
      .gt('days_remaining', 0)

    const today = todayStr()
    const byCity = {}

    for (const c of campaigns || []) {
      if (!c.merchants || !c.merchants.subscription_active) continue
      const code = c.merchants.city_code || '(non défini)'
      if (!byCity[code]) {
        byCity[code] = {
          city_code: code,
          merchants_active: new Set(),
          shown_today: new Set(),
          total_days_remaining: 0
        }
      }
      byCity[code].merchants_active.add(c.merchant_id)
      if (c.last_shown_date === today) byCity[code].shown_today.add(c.merchant_id)
      byCity[code].total_days_remaining += c.days_remaining
    }

    const inventory = Object.values(byCity).map(b => ({
      city_code: b.city_code,
      merchants_active_count: b.merchants_active.size,
      shown_today_count: b.shown_today.size,
      total_days_remaining: b.total_days_remaining
    }))

    const codes = inventory.map(i => i.city_code).filter(c => c !== '(non défini)')
    let nameMap = {}
    if (codes.length > 0) {
      const { data: cityRows } = await supa
        .from('cities')
        .select('code, name_vi')
        .in('code', codes)
      nameMap = Object.fromEntries((cityRows || []).map(c => [c.code, c.name_vi]))
    }
    const result = inventory.map(i => ({
      ...i,
      name_vi: nameMap[i.city_code] || i.city_code
    }))

    return res.status(200).json({ inventory: result })
  }

  // ============================================================
  // CITIES
  // ============================================================
  if (action === 'cities') {
    const { data, error } = await supa
      .from('cities')
      .select('code, name_vi, parent, active')
      .eq('active', true)
      .order('parent', { nullsFirst: true })
      .order('name_vi')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ cities: data || [] })
  }

  // ============================================================
  // SEARCH_MERCHANTS
  // ============================================================
  if (action === 'search_merchants') {
    const { q } = params
    let query = supa
      .from('merchants')
      .select('id, name, email, city_code, subscription_active')
      .order('name')
      .limit(20)
    if (q && q.trim()) {
      const term = q.trim()
      query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%`)
    }
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ merchants: data || [] })
  }

  return res.status(400).json({ error: 'unknown action' })
}
