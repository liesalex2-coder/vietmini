// pages/api/admin/ad-network.js
// API admin pour la console /admin/ad-network.
// Pattern aligné sur /api/admin/merchants : POST + body { action, access_token, ... }.
//
// Note importante : la table merchants n'a PAS de colonne email — l'email vit dans
// auth.users (Supabase Auth) et se récupère via supa.auth.admin.listUsers(), joint
// côté code via merchant.user_id → auth_user.id.

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

// Récupère un map { user_id → email } pour les merchant.user_id passés en argument.
// Tolère un échec silencieux : si l'email ne peut pas être récupéré, on renvoie {}.
async function buildEmailMap(supa, userIds) {
  if (!userIds || userIds.length === 0) return {}
  try {
    // listUsers ne supporte pas le filtre par id directement → on liste les pages
    // et on filtre côté code. Pour des volumes encore raisonnables, c'est OK.
    const wanted = new Set(userIds.filter(Boolean))
    const map = {}
    let page = 1
    const perPage = 1000
    while (page <= 5) { // garde-fou : 5000 utilisateurs max
      const { data, error } = await supa.auth.admin.listUsers({ page, perPage })
      if (error) break
      const users = data?.users || []
      for (const u of users) {
        if (wanted.has(u.id)) map[u.id] = u.email
      }
      if (users.length < perPage) break
      page += 1
    }
    return map
  } catch (e) {
    return {}
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { action, access_token, ...params } = req.body || {}

  if (!action || !access_token) {
    return res.status(400).json({ error: 'action and access_token required' })
  }

  // Vérification admin
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
        merchants ( id, user_id, name, city_code, vertical, subscription_active )
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

    // Joindre les emails depuis auth.users
    const userIds = filtered.map(c => c.merchants?.user_id).filter(Boolean)
    const emailMap = await buildEmailMap(supa, userIds)
    filtered = filtered.map(c => ({
      ...c,
      merchants: c.merchants
        ? { ...c.merchants, email: emailMap[c.merchants.user_id] || null }
        : null
    }))

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
      .select('id, user_id, name, city_code, subscription_active')
      .order('name')
      .limit(50)
    if (q && q.trim()) {
      const term = q.trim()
      // On ne peut filtrer que sur les colonnes de merchants (pas email)
      query = query.ilike('name', `%${term}%`)
    }
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })

    let merchants = data || []

    // Joindre les emails
    const userIds = merchants.map(m => m.user_id).filter(Boolean)
    const emailMap = await buildEmailMap(supa, userIds)
    merchants = merchants.map(m => ({ ...m, email: emailMap[m.user_id] || null }))

    // Si la recherche ressemble à un email, refiltrer côté code sur l'email
    if (q && q.trim() && q.includes('@')) {
      const term = q.trim().toLowerCase()
      merchants = merchants.filter(m =>
        (m.email || '').toLowerCase().includes(term) ||
        (m.name || '').toLowerCase().includes(term)
      )
    }

    return res.status(200).json({ merchants: merchants.slice(0, 20) })
  }

  return res.status(400).json({ error: 'unknown action' })
}