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
    // Vérifier le code (sans le consommer)
    const { data: codeData, error: codeError } = await supabaseAdmin
      .from('activation_codes')
      .select('code, discount_percentage, used')
      .eq('code', normalizedCode)
      .maybeSingle()

    if (codeError) return res.status(500).json({ error: 'Erreur base de données' })
    if (!codeData) return res.status(404).json({ error: 'Code invalide' })
    if (codeData.used) return res.status(409).json({ error: 'Code déjà utilisé' })

    return res.status(200).json({
      success: true,
      code: codeData.code,
      discount_percentage: codeData.discount_percentage
    })

  } catch (e) {
    console.error('Erreur validate-code:', e)
    return res.status(500).json({ error: e.message })
  }
}
