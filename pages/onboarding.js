import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabaseClient'

const VERTICALS = [
  {
    id: 'salon',
    label: 'Salon de beauté',
    vi: 'Salon làm đẹp',
    emoji: '💅',
    demo: 'https://bella-demo-rosy.vercel.app',
    desc: 'Coiffure, nail, makeup'
  },
  {
    id: 'barber',
    label: 'Barbier',
    vi: 'Tiệm cắt tóc nam',
    emoji: '✂️',
    demo: 'https://barber-demo-five.vercel.app',
    desc: 'Coupe homme, rasage'
  },
  {
    id: 'spa',
    label: 'Spa & Bien-être',
    vi: 'Spa & Thư giãn',
    emoji: '🧖',
    demo: 'https://spa-demo-sand.vercel.app',
    desc: 'Massage, soins du corps'
  },
  {
    id: 'resto',
    label: 'Restaurant / Café',
    vi: 'Nhà hàng / Quán ăn',
    emoji: '🍜',
    demo: 'https://restaurant-demo-ten-dusky.vercel.app',
    desc: 'Menu, commandes, fidélité'
  },
  {
    id: 'gym',
    label: 'Salle de sport',
    vi: 'Phòng tập gym',
    emoji: '🏋️',
    demo: 'https://gym-demo-lyart.vercel.app',
    desc: 'Abonnements, cours, PT'
  },
  {
    id: 'karaoke',
    label: 'Karaoké',
    vi: 'Quán karaoke',
    emoji: '🎤',
    demo: 'https://karaoke-demo-gules.vercel.app',
    desc: 'Salles, boissons, promos'
  },
  {
    id: 'pet',
    label: 'Pet grooming',
    vi: 'Tiệm thú cưng',
    emoji: '🐾',
    demo: 'https://paw-demo.vercel.app',
    desc: 'Bain, coupe, soins'
  },
  {
    id: 'boutique',
    label: 'Boutique',
    vi: 'Cửa hàng',
    emoji: '🛍️',
    demo: 'https://store-demo-ecru.vercel.app',
    desc: 'Mode, accessoires, cosmétiques'
  }
]

const C = {
  red: '#D0021B',
  gold: '#F5A623',
  cream: '#FDF6EE',
  dark: '#1A0A00',
  mid: '#7A4A2A',
  border: '#e5d9ce',
  bg: '#f7f0e8'
}

export default function Onboarding() {
  const router = useRouter()
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm() {
    if (!selected) return
    setLoading(true)
    setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const res = await fetch('/api/setup-merchant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical: selected,
          access_token: session.access_token
        })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erreur')
      router.push('/dashboard')
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Choisissez votre activité — VietMini</title>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: C.cream,
        fontFamily: "'Be Vietnam Pro', sans-serif",
        padding: '40px 20px 80px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '36px', height: '36px',
              background: C.red,
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: '800', fontSize: '16px'
            }}>V</div>
            <span style={{ fontWeight: '800', fontSize: '20px', color: C.dark }}>VietMini</span>
          </div>
          <h1 style={{
            fontSize: '28px', fontWeight: '800',
            color: C.dark, margin: '0 0 12px'
          }}>Quel est votre type de commerce ?</h1>
          <p style={{ color: C.mid, fontSize: '15px', margin: 0 }}>
            Votre app sera pré-configurée automatiquement selon votre activité.
          </p>
        </div>

        {/* Grid verticals */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
          maxWidth: '900px',
          margin: '0 auto 40px'
        }}>
          {VERTICALS.map(v => (
            <div
              key={v.id}
              onClick={() => setSelected(v.id)}
              style={{
                background: selected === v.id ? '#fff' : '#fff',
                border: selected === v.id
                  ? `2px solid ${C.red}`
                  : `2px solid ${C.border}`,
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: selected === v.id
                  ? '0 4px 20px rgba(208,2,27,0.12)'
                  : '0 2px 8px rgba(0,0,0,0.04)',
                position: 'relative'
              }}
            >
              {/* Checkmark */}
              {selected === v.id && (
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  width: '22px', height: '22px',
                  background: C.red, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '12px', fontWeight: '700'
                }}>✓</div>
              )}

              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{v.emoji}</div>
              <div style={{
                fontWeight: '700', fontSize: '16px',
                color: C.dark, marginBottom: '2px'
              }}>{v.label}</div>
              <div style={{
                fontSize: '12px', color: C.mid,
                marginBottom: '12px'
              }}>{v.desc}</div>

              {/* Voir la démo */}
              <a
                href={v.demo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: C.red,
                  textDecoration: 'none',
                  background: 'rgba(208,2,27,0.06)',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}
              >
                Voir la démo →
              </a>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          {error && (
            <div style={{
              color: C.red, fontSize: '14px',
              marginBottom: '12px'
            }}>{error}</div>
          )}
          <button
            onClick={handleConfirm}
            disabled={!selected || loading}
            style={{
              background: selected ? C.red : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 48px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: selected ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s'
            }}
          >
            {loading ? 'Configuration en cours…' : 'Configurer mon app →'}
          </button>
          {selected && (
            <div style={{
              marginTop: '10px',
              fontSize: '13px',
              color: C.mid
            }}>
              Vous pourrez modifier votre configuration à tout moment depuis le dashboard.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
