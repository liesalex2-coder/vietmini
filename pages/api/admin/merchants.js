import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { action, access_token } = req.body
  if (!access_token) return res.status(401).json({ error: 'Non authentifié' })

  // Vérifier le token
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(access_token)
  if (authError || !user) return res.status(401).json({ error: 'Session invalide' })

  // Vérifier que c'est l'admin
  const adminId = process.env.NEXT_PUBLIC_ADMIN_USER_ID
  if (!adminId || user.id !== adminId) {
    return res.status(403).json({ error: 'Accès refusé' })
  }

  try {
    // LIST
    if (action === 'list') {
      const { data: merchants, error } = await supabaseAdmin
        .from('merchants')
        .select('id, user_id, name, vertical, phone, address, subscription_active, subscription_expires_at, created_at')
        .order('created_at', { ascending: false })
      if (error) throw error

      // Récupérer les emails depuis auth.users en une passe
      const userIds = (merchants || []).map(m => m.user_id).filter(Boolean)
      const emailsMap = {}
      if (userIds.length > 0) {
        // Pagination par défaut 50 users par page ; pour VietMini on est loin du plafond
        const { data: authList } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
        for (const u of (authList?.users || [])) {
          emailsMap[u.id] = u.email
        }
      }

      const enriched = (merchants || []).map(m => ({
        ...m,
        email: emailsMap[m.user_id] || null,
      }))

      return res.status(200).json({ merchants: enriched })
    }

    // EXTEND (prolonger un abonnement de N jours)
    if (action === 'extend') {
      const { merchant_id, days } = req.body
      const n = parseInt(days)
      if (!merchant_id || !n || n < 1 || n > 3650) {
        return res.status(400).json({ error: 'Paramètres invalides' })
      }

      const { data: current } = await supabaseAdmin
        .from('merchants')
        .select('subscription_expires_at')
        .eq('id', merchant_id)
        .single()

      // Base = max(aujourd'hui, date d'expiration actuelle)
      const now = new Date()
      const currentExpiry = current?.subscription_expires_at ? new Date(current.subscription_expires_at) : null
      const base = currentExpiry && currentExpiry > now ? currentExpiry : now
      const newExpiry = new Date(base.getTime() + n * 24 * 60 * 60 * 1000)

      const { error } = await supabaseAdmin
        .from('merchants')
        .update({
          subscription_active: true,
          subscription_expires_at: newExpiry.toISOString(),
        })
        .eq('id', merchant_id)
      if (error) throw error

      return res.status(200).json({ subscription_expires_at: newExpiry.toISOString() })
    }

    // TOGGLE ACTIVE (activer/désactiver manuellement)
    if (action === 'toggle_active') {
      const { merchant_id, active } = req.body
      if (!merchant_id || typeof active !== 'boolean') {
        return res.status(400).json({ error: 'Paramètres invalides' })
      }
      const { error } = await supabaseAdmin
        .from('merchants')
        .update({ subscription_active: active })
        .eq('id', merchant_id)
      if (error) throw error
      return res.status(200).json({ ok: true })
    }

    return res.status(400).json({ error: 'Action inconnue' })

  } catch (e) {
    console.error('Erreur API admin/merchants:', e)
    return res.status(500).json({ error: e.message })
  }
}
