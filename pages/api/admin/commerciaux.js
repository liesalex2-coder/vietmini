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
      const { data: commerciaux, error } = await supabaseAdmin
        .from('commerciaux')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error

      // Compter les marchands par commercial
      const { data: merchants } = await supabaseAdmin
        .from('merchants')
        .select('commercial_id')

      const counts = {}
      for (const m of (merchants || [])) {
        if (m.commercial_id) {
          counts[m.commercial_id] = (counts[m.commercial_id] || 0) + 1
        }
      }

      const enriched = (commerciaux || []).map(c => ({
        ...c,
        nb_marchands: counts[c.id] || 0,
      }))

      return res.status(200).json({ commerciaux: enriched })
    }

    // CREATE
    if (action === 'create') {
      const { nom, telephone } = req.body
      if (!nom || !nom.trim()) {
        return res.status(400).json({ error: 'Nom requis' })
      }

      const { data, error } = await supabaseAdmin
        .from('commerciaux')
        .insert({
          nom: nom.trim(),
          telephone: telephone?.trim() || null,
        })
        .select()
        .single()
      if (error) throw error

      return res.status(200).json({ commercial: data })
    }

    // UPDATE (nom + téléphone)
    if (action === 'update') {
      const { commercial_id, nom, telephone } = req.body
      if (!commercial_id) return res.status(400).json({ error: 'ID requis' })
      if (!nom || !nom.trim()) {
        return res.status(400).json({ error: 'Nom requis' })
      }

      const { error } = await supabaseAdmin
        .from('commerciaux')
        .update({
          nom: nom.trim(),
          telephone: telephone?.trim() || null,
        })
        .eq('id', commercial_id)
      if (error) throw error

      return res.status(200).json({ ok: true })
    }

    // TOGGLE ACTIVE
    if (action === 'toggle_active') {
      const { commercial_id, actif } = req.body
      if (!commercial_id || typeof actif !== 'boolean') {
        return res.status(400).json({ error: 'Paramètres invalides' })
      }
      const { error } = await supabaseAdmin
        .from('commerciaux')
        .update({ actif })
        .eq('id', commercial_id)
      if (error) throw error
      return res.status(200).json({ ok: true })
    }

    // DELETE (suppression définitive avec archivage du nom dans les marchands)
    if (action === 'delete') {
      const { commercial_id } = req.body
      if (!commercial_id) return res.status(400).json({ error: 'ID requis' })

      // 1. Récupérer le nom du commercial pour archivage
      const { data: commercial, error: fetchError } = await supabaseAdmin
        .from('commerciaux')
        .select('nom')
        .eq('id', commercial_id)
        .single()
      if (fetchError) throw fetchError
      if (!commercial) return res.status(404).json({ error: 'Commercial introuvable' })

      // 2. Archiver le nom sur les marchands signés par ce commercial
      const { error: archiveError } = await supabaseAdmin
        .from('merchants')
        .update({ commercial_nom_historique: commercial.nom })
        .eq('commercial_id', commercial_id)
      if (archiveError) throw archiveError

      // 3. Supprimer le commercial (le ON DELETE SET NULL passe automatiquement commercial_id à null)
      const { error: deleteError } = await supabaseAdmin
        .from('commerciaux')
        .delete()
        .eq('id', commercial_id)
      if (deleteError) throw deleteError

      return res.status(200).json({ ok: true })
    }

    return res.status(400).json({ error: 'Action inconnue' })

  } catch (e) {
    console.error('Erreur API admin/commerciaux:', e)
    return res.status(500).json({ error: e.message })
  }
}