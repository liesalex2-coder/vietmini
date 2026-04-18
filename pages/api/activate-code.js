import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { code, access_token } = req.body
  if (!code || !access_token) return res.status(400).json({ error: 'Paramètres manquants' })

  // Vérifier le token
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(access_token)
  if (authError || !user) return res.status(401).json({ error: 'Session invalide' })

  const normalizedCode = String(code).trim().toUpperCase()

  try {
    // 1. Récupérer le marchand (via user_id, comme dans setup-merchant.js)
    const { data: merchant, error: merchantError } = await supabaseAdmin
      .from('merchants')
      .select('id, subscription_active, subscription_expires_at')
      .eq('user_id', user.id)
      .single()

    if (merchantError || !merchant) {
      return res.status(404).json({ error: 'Profil marchand introuvable' })
    }

    // 2. Vérifier le code
    const { data: codeData, error: codeError } = await supabaseAdmin
      .from('activation_codes')
      .select('*')
      .eq('code', normalizedCode)
      .maybeSingle()

    if (codeError) return res.status(500).json({ error: 'Erreur base de données' })
    if (!codeData) return res.status(404).json({ error: 'Code invalide' })
    if (codeData.used) return res.status(409).json({ error: 'Code déjà utilisé' })

    const now = new Date()

    // 3. Calcul nouvelle date d'expiration (extension si déjà abonné)
    let newExpiresAt
    if (merchant.subscription_active && merchant.subscription_expires_at) {
      const currentExpiry = new Date(merchant.subscription_expires_at)
      const baseDate = currentExpiry > now ? currentExpiry : now
      newExpiresAt = new Date(baseDate)
      newExpiresAt.setFullYear(newExpiresAt.getFullYear() + 1)
    } else {
      newExpiresAt = new Date(now)
      newExpiresAt.setFullYear(newExpiresAt.getFullYear() + 1)
    }

    // 4. Marquer le code comme utilisé (garde-fou anti race condition)
    const { data: updatedCode, error: updateCodeError } = await supabaseAdmin
      .from('activation_codes')
      .update({
        used: true,
        used_by: merchant.id,
        used_at: now.toISOString()
      })
      .eq('id', codeData.id)
      .eq('used', false)
      .select()
      .maybeSingle()

    if (updateCodeError || !updatedCode) {
      return res.status(409).json({ error: 'Code déjà utilisé' })
    }

    // 5. Activer l'abonnement
    const { error: updateMerchantError } = await supabaseAdmin
      .from('merchants')
      .update({
        subscription_active: true,
        subscription_activated_at: merchant.subscription_active ? undefined : now.toISOString(),
        subscription_expires_at: newExpiresAt.toISOString(),
        activation_code_used: codeData.code,
        activation_discount: codeData.discount_percentage
      })
      .eq('id', merchant.id)

    if (updateMerchantError) {
      // Rollback du code
      await supabaseAdmin
        .from('activation_codes')
        .update({ used: false, used_by: null, used_at: null })
        .eq('id', codeData.id)
      console.error('Erreur activation:', updateMerchantError)
      return res.status(500).json({ error: "Erreur lors de l'activation" })
    }

    return res.status(200).json({
      success: true,
      expires_at: newExpiresAt.toISOString(),
      discount_percentage: codeData.discount_percentage
    })

  } catch (e) {
    console.error('Erreur activate-code:', e)
    return res.status(500).json({ error: e.message })
  }
}
