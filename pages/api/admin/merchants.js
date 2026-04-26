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
        .select('id, user_id, name, vertical, phone, address, subscription_active, subscription_expires_at, signed_at, last_renewal_at, created_at, commercial_id, commercial_nom_historique')
        .order('created_at', { ascending: false })
      if (error) throw error

      // Récupérer les emails depuis auth.users en une passe
      const userIds = (merchants || []).map(m => m.user_id).filter(Boolean)
      const emailsMap = {}
      if (userIds.length > 0) {
        const { data: authList } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
        for (const u of (authList?.users || [])) {
          emailsMap[u.id] = u.email
        }
      }

      // Récupérer la liste des commerciaux
      const { data: commerciaux } = await supabaseAdmin
        .from('commerciaux')
        .select('id, nom, actif')
        .order('nom', { ascending: true })

      const commerciauxMap = {}
      for (const c of (commerciaux || [])) {
        commerciauxMap[c.id] = c
      }

      const enriched = (merchants || []).map(m => ({
        ...m,
        email: emailsMap[m.user_id] || null,
        commercial_nom: m.commercial_id ? (commerciauxMap[m.commercial_id]?.nom || null) : null,
      }))

      return res.status(200).json({
        merchants: enriched,
        commerciaux: commerciaux || [],
      })
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
        .select('subscription_expires_at, signed_at')
        .eq('id', merchant_id)
        .single()

      const now = new Date()
      const currentExpiry = current?.subscription_expires_at ? new Date(current.subscription_expires_at) : null
      const base = currentExpiry && currentExpiry > now ? currentExpiry : now
      const newExpiry = new Date(base.getTime() + n * 24 * 60 * 60 * 1000)
      const nowISO = now.toISOString()

      const updates = {
        subscription_active: true,
        subscription_expires_at: newExpiry.toISOString(),
        last_renewal_at: nowISO,
      }
      // signed_at uniquement si null (première signature)
      if (!current?.signed_at) {
        updates.signed_at = nowISO
      }

      const { error } = await supabaseAdmin
        .from('merchants')
        .update(updates)
        .eq('id', merchant_id)
      if (error) throw error

      return res.status(200).json({ subscription_expires_at: newExpiry.toISOString() })
    }

    // TOGGLE ACTIVE
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

    // ASSIGN COMMERCIAL
    if (action === 'assign_commercial') {
      const { merchant_id, commercial_id } = req.body
      if (!merchant_id) {
        return res.status(400).json({ error: 'Paramètres invalides' })
      }
      const { error } = await supabaseAdmin
        .from('merchants')
        .update({ commercial_id: commercial_id || null })
        .eq('id', merchant_id)
      if (error) throw error
      return res.status(200).json({ ok: true })
    }

    // DELETE (suppression définitive : merchants row CASCADE + auth.users)
    if (action === 'delete') {
      const { merchant_id } = req.body
      if (!merchant_id) return res.status(400).json({ error: 'ID requis' })

      // 1. Récupérer le user_id avant suppression
      const { data: merchant, error: fetchError } = await supabaseAdmin
        .from('merchants')
        .select('user_id')
        .eq('id', merchant_id)
        .single()
      if (fetchError) throw fetchError
      if (!merchant) return res.status(404).json({ error: 'Marchand introuvable' })

      // 2. Supprimer le row merchants (CASCADE sur toutes les tables liées)
      const { error: deleteError } = await supabaseAdmin
        .from('merchants')
        .delete()
        .eq('id', merchant_id)
      if (deleteError) throw deleteError

      // 3. Supprimer le compte auth.users si user_id présent
      if (merchant.user_id) {
        const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(merchant.user_id)
        if (authDeleteError) {
          // On log mais on ne fait pas échouer la suppression — le merchants row est déjà parti
          console.error('Erreur suppression auth.users:', authDeleteError)
        }
      }

      return res.status(200).json({ ok: true })
    }

    return res.status(400).json({ error: 'Action inconnue' })

  } catch (e) {
    console.error('Erreur API admin/merchants:', e)
    return res.status(500).json({ error: e.message })
  }
}