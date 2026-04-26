import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { code, access_token } = req.body
  if (!code || !access_token) return res.status(400).json({ error: 'Paramètres manquants' })

  // Vérifier le token utilisateur
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(access_token)
  if (authError || !user) return res.status(401).json({ error: 'Session invalide' })

  const normalizedCode = String(code).trim().toUpperCase()

  try {
    // 1. Re-vérifier le code (sécurité côté serveur, on ne fait pas confiance au front)
    const { data: codeData, error: codeError } = await supabaseAdmin
      .from('activation_codes')
      .select('id, code, discount_percentage, used')
      .eq('code', normalizedCode)
      .maybeSingle()

    if (codeError) return res.status(500).json({ error: 'Erreur base de données' })
    if (!codeData) return res.status(404).json({ error: 'Code invalide' })
    if (codeData.used) return res.status(409).json({ error: 'Code déjà utilisé' })

    // 2. Refuser les codes <100% : ils nécessitent un paiement résiduel via SePay
    if (codeData.discount_percentage !== 100) {
      return res.status(400).json({
        error: 'Ce code nécessite un paiement complémentaire. Le paiement par carte sera bientôt disponible.'
      })
    }

    // 3. Récupérer le marchand de l'utilisateur connecté
    const { data: merchant, error: merchantError } = await supabaseAdmin
      .from('merchants')
      .select('id, signed_at, subscription_expires_at')
      .eq('user_id', user.id)
      .single()

    if (merchantError) return res.status(500).json({ error: 'Erreur base de données' })
    if (!merchant) return res.status(404).json({ error: 'Marchand introuvable' })

    // 4. Calculer la nouvelle date d'expiration : max(aujourd'hui, expiry actuelle) + 1 an
    const now = new Date()
    const currentExpiry = merchant.subscription_expires_at ? new Date(merchant.subscription_expires_at) : null
    const base = currentExpiry && currentExpiry > now ? currentExpiry : now
    const newExpiry = new Date(base.getTime() + 365 * 24 * 60 * 60 * 1000)
    const nowISO = now.toISOString()

    // 5. Mettre à jour le marchand : abonnement actif + dates de signature
    const merchantUpdates = {
      subscription_active: true,
      subscription_expires_at: newExpiry.toISOString(),
      last_renewal_at: nowISO,
    }
    // signed_at uniquement si null (première signature)
    if (!merchant.signed_at) {
      merchantUpdates.signed_at = nowISO
    }

    const { error: updateMerchantError } = await supabaseAdmin
      .from('merchants')
      .update(merchantUpdates)
      .eq('id', merchant.id)
    if (updateMerchantError) throw updateMerchantError

    // 6. Marquer le code comme utilisé
    const { error: updateCodeError } = await supabaseAdmin
      .from('activation_codes')
      .update({
        used: true,
        used_by: merchant.id,
        used_at: nowISO,
      })
      .eq('id', codeData.id)
    if (updateCodeError) {
      console.error('Erreur marquage code comme utilisé:', updateCodeError)
      // On n'échoue pas : l'abonnement est déjà activé, le code sera juste réutilisable une fois (cas extrême)
    }

    return res.status(200).json({
      success: true,
      subscription_expires_at: newExpiry.toISOString()
    })

  } catch (e) {
    console.error('Erreur apply-code:', e)
    return res.status(500).json({ error: e.message })
  }
}
