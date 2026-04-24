import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const TEMPLATE_MAP = {
  salon:    '/mini-apps/salon.html',
  barber:   '/mini-apps/barber.html',
  spa:      '/mini-apps/spa.html',
  resto:    '/mini-apps/resto.html',
  gym:      '/mini-apps/gym.html',
  karaoke:  '/mini-apps/karaoke.html',
  pet:      '/mini-apps/pet.html',
  boutique: '/mini-apps/boutique.html',
}

export async function getServerSideProps({ params, req, query }) {
  const { merchantId } = params

  const { data: merchant } = await supabase
    .from('merchants')
    .select('vertical')
    .eq('id', merchantId)
    .single()

  if (!merchant) {
    return { notFound: true }
  }

  const vertical = merchant.vertical || 'salon'
  const template = TEMPLATE_MAP[vertical] || TEMPLATE_MAP.salon
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const apiBase = `${protocol}://${host}`

  // Propager le flag preview (pour permettre l'aperçu même si abonnement inactif)
  const previewParam = query.preview === '1' ? '&preview=1' : ''

  return {
    redirect: {
      destination: `${template}?merchant_id=${merchantId}&api=${apiBase}${previewParam}`,
      permanent: false,
    }
  }
}

export default function App() {
  return null
}