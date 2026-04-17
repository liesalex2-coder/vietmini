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
        gap: '16px'
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
        }}>
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

        {/* Bandeau mode aperçu */}
        <div style={{
          width: '375px',
          background: 'rgba(245,166,35,0.1)',
          border: '1px solid rgba(245,166,35,0.25)',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
            ⚡ Chế độ xem trước — Kích hoạt để khách hàng có thể truy cập ứng dụng này.
          </span>
          <a href="/abonnement" style={{
            flexShrink: 0,
            fontSize: '12px', fontWeight: '700', color: '#F5A623',
            textDecoration: 'none', whiteSpace: 'nowrap'
          }}>Kích hoạt →</a>
        </div>

      </div>
    </>
  )
}