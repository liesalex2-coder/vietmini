import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'

export default function Preview() {
  const router = useRouter()
  const { merchantId } = router.query
  const [merchant, setMerchant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!merchantId) return
    supabase.from('merchants').select('name, vertical, primary_color').eq('id', merchantId).single()
      .then(({ data }) => { setMerchant(data); setLoading(false) })
  }, [merchantId])

  const appUrl = merchantId ? `/app/${merchantId}` : null

  return (
    <>
      <Head>
        <title>Aperçu — VietMini</title>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{
        minHeight: '100vh',
        background: '#1A0A00',
        fontFamily: "'Be Vietnam Pro', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>
            ← Retour au dashboard
          </Link>
          {merchant && (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
              · {merchant.name || 'Votre app'}
            </div>
          )}
        </div>

        {/* Phone mockup */}
        <div style={{
          width: '375px', height: '760px',
          background: '#000', borderRadius: '44px', padding: '12px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(255,255,255,0.1)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute', top: '14px', left: '50%', transform: 'translateX(-50%)',
            width: '120px', height: '30px', background: '#000', borderRadius: '20px', zIndex: 10
          }} />
          <div style={{ width: '100%', height: '100%', borderRadius: '36px', overflow: 'hidden', background: '#fff' }}>
            {loading || !appUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#7A4A2A', fontSize: '14px' }}>
                Chargement…
              </div>
            ) : (
              <iframe
                src={appUrl}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                title="Aperçu Mini App"
              />
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px', maxWidth: '320px' }}>
          Ceci est un aperçu de votre app telle que vos clients la verront.
        </div>
      </div>
    </>
  )
}
