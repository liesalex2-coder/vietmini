import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Alphabet sans caractères ambigus (pas de 0, O, 1, I, L)
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 12

function generateCode() {
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return code
}

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
      const { data, error } = await supabaseAdmin
        .from('activation_codes')
        .select('id, code, discount_percentage, notes, used, used_at, created_at')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return res.status(200).json({ codes: data })
    }

    // CREATE
    if (action === 'create') {
      const { discount_percentage, notes } = req.body
      const d = parseInt(discount_percentage)
      if (!d || d < 1 || d > 100) {
        return res.status(400).json({ error: 'Pourcentage invalide (1-100)' })
      }

      // Génération avec retry en cas de collision
      let code = null
      let lastError = null
      for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = generateCode()
        const { data, error } = await supabaseAdmin
          .from('activation_codes')
          .insert({
            code: candidate,
            discount_percentage: d,
            notes: notes || null
          })
          .select()
          .single()
        if (!error) {
          code = data
          break
        }
        lastError = error
        // Si c'est une collision sur `code`, on réessaie
        if (error.code !== '23505') break
      }

      if (!code) {
        console.error('Erreur génération code:', lastError)
        return res.status(500).json({ error: 'Erreur lors de la génération' })
      }

      return res.status(200).json({ code })
    }

    return res.status(400).json({ error: 'Action inconnue' })

  } catch (e) {
    console.error('Erreur API admin/codes:', e)
    return res.status(500).json({ error: e.message })
  }
}
