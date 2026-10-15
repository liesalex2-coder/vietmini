import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Numéro au format international : +84909123456, +33612345678…
// Un numéro local vietnamien (0909…) devient +84909…
export function normalizePhone(raw) {
  const s = String(raw || '').trim()
  let digits = s.replace(/\D/g, '')
  if (!digits) return null
  if (s.startsWith('+')) {
    // déjà international
  } else if (digits.startsWith('00')) {
    digits = digits.slice(2)
  } else if (digits.startsWith('0')) {
    digits = '84' + digits.slice(1)
  }
  if (digits.length < 8 || digits.length > 15) return null
  return '+' + digits
}

export function cleanName(raw) {
  const s = String(raw || '').replace(/\s+/g, ' ').trim()
  if (!s || s.length > 60) return null
  return s
}

export function cors(req, res, methods) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', methods + ', OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-store')
  if (req.method === 'OPTIONS') { res.status(200).end(); return true }
  return false
}

// Le commerçant existe et son abonnement est actif (ou aperçu depuis le dashboard)
export async function getActiveMerchant(merchantId, preview) {
  if (!merchantId) return null
  const { data } = await supabaseAdmin
    .from('merchants')
    .select('id, subscription_active')
    .eq('id', merchantId)
    .maybeSingle()
  if (!data) return null
  if (!data.subscription_active && !preview) return null
  return data
}

export async function getLoyalty(merchantId) {
  const { data } = await supabaseAdmin
    .from('loyalty_config')
    .select('enabled, visits_required, reward_text, pin_code')
    .eq('merchant_id', merchantId)
    .maybeSingle()
  return data
}

export function publicLoyalty(l) {
  if (!l) return { enabled: false, visits_required: 10, reward_text: '' }
  return {
    enabled: !!l.enabled,
    visits_required: l.visits_required || 10,
    reward_text: l.reward_text || '',
  }
}

export function publicCard(c) {
  return {
    id: c.id,
    name: c.display_name || '',
    phone: c.phone || '',
    visit_count: c.visit_count || 0,
    rewards_redeemed: c.rewards_redeemed || 0,
  }
}

// ── VÒNG QUAY ────────────────────────────────────────────────
export const PRIZE_DAYS = 30

// Jour courant au Vietnam (UTC+7), format AAAA-MM-JJ
export function vnToday() {
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10)
}

// Cases « perdantes » de la roue (pas de lot)
const LOSING = ['thử lần sau', 'chúc may mắn', 'chúc may mắn lần sau', 'may mắn lần sau', 'hẹn lần sau', 'thử lại', 'chúc bạn may mắn lần sau']
export function isLosingLabel(label) {
  const s = String(label || '').toLowerCase().replace(/[!.\s]+/g, ' ').trim()
  return LOSING.includes(s)
}

export async function getWheel(merchantId) {
  const { data } = await supabaseAdmin
    .from('wheel_config')
    .select('enabled, prizes')
    .eq('merchant_id', merchantId)
    .maybeSingle()
  return data
}

export function publicSpin(s) {
  return {
    id: s.id,
    label: s.prize_label,
    is_win: !!s.is_win,
    date: s.spin_date,
    expires_at: s.expires_at,
  }
}

// Lots gagnés, non utilisés et non expirés
export async function getActivePrizes(merchantId, cardId) {
  const { data } = await supabaseAdmin
    .from('wheel_spins')
    .select('*')
    .eq('merchant_id', String(merchantId))
    .eq('card_id', String(cardId))
    .eq('is_win', true)
    .is('redeemed_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
  return (data || []).map(publicSpin)
}
