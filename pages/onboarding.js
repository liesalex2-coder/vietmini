import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabaseClient'

const VERTICALS = [
  { id:'salon',    label:'Salon de beauté',   desc:'Coiffure, nail, makeup',          img:'/images/img_1.webp', bg:'linear-gradient(135deg,#FFEAE8,#FFD0CB)', demo:'https://bella-demo-rosy.vercel.app' },
  { id:'barber',   label:'Barbier',            desc:'Coupe homme, rasage',             img:'/images/img_2.webp', bg:'linear-gradient(135deg,#E8E4F0,#CFC8E8)', demo:'https://barber-demo-five.vercel.app' },
  { id:'spa',      label:'Spa & Bien-être',    desc:'Massage, soins du corps',         img:'/images/img_3.webp', bg:'linear-gradient(135deg,#E0F4F0,#B8E8E0)', demo:'https://spa-demo-sand.vercel.app' },
  { id:'resto',    label:'Restaurant / Café',  desc:'Menu, offres spéciales, fidélité',img:'/images/img_4.webp', bg:'linear-gradient(135deg,#FFF5DC,#FFE8A0)', demo:'https://restaurant-demo-ten-dusky.vercel.app' },
  { id:'gym',      label:'Salle de sport',     desc:'Abonnements, cours, PT',          img:'/images/img_5.webp', bg:'linear-gradient(135deg,#E8F5E0,#C8E8B0)', demo:'https://gym-demo-lyart.vercel.app' },
  { id:'pet',      label:'Pet grooming',       desc:'Bain, coupe, soins',              img:'/images/img_6.webp', bg:'linear-gradient(135deg,#FFF0DC,#FFE0A8)', imgPos:'50% 15%', demo:'https://paw-demo.vercel.app' },
  { id:'karaoke',  label:'Karaoké',            desc:'Salles, boissons, promos',        img:'/images/img_7.webp', bg:'linear-gradient(135deg,#F0E8FF,#D8C8F0)', demo:'https://karaoke-demo-gules.vercel.app' },
  { id:'boutique', label:'Boutique',           desc:'Mode, accessoires, cosmétiques',  img:'/images/img_8.webp', bg:'linear-gradient(135deg,#FAE8EF,#F0C8D8)', demo:'https://store-demo-ecru.vercel.app' },
]

const C = { red:'#D0021B', cream:'#FDF6EE', dark:'#1A0A00', mid:'#7A4A2A', border:'#e5d9ce' }

export default function Onboarding() {
  const router = useRouter()
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function selectVertical(id) {
    if (loading) return
    setSelected(id)
    setLoading(true)
    setError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      const res = await fetch('/api/setup-merchant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vertical: id, access_token: session.access_token })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erreur')
      router.push('/dashboard')
    } catch (e) {
      setError(e.message)
      setSelected(null)
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Choisissez votre activité — VietMini</title>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight:'100vh', background:C.cream, fontFamily:"'Be Vietnam Pro', sans-serif", padding:'48px 24px 80px' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'48px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'24px' }}>
            <div style={{ width:'36px', height:'36px', background:C.red, borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:'800', fontSize:'16px' }}>V</div>
            <span style={{ fontWeight:'800', fontSize:'20px', color:C.dark }}>VietMini</span>
          </div>
          <h1 style={{ fontSize:'clamp(24px,3vw,36px)', fontWeight:'900', color:C.dark, margin:'0 0 12px', letterSpacing:'-0.5px' }}>
            Quel est votre type de commerce ?
          </h1>
          <p style={{ color:C.mid, fontSize:'15px', margin:0 }}>
            Votre app sera pré-configurée automatiquement selon votre activité.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'20px', maxWidth:'960px', margin:'0 auto 48px' }}>
          {VERTICALS.map(v => (
            <div
              key={v.id}
              onClick={() => selectVertical(v.id)}
              style={{
                background:'#fff',
                border:`2px solid ${selected === v.id ? C.red : C.border}`,
                borderRadius:'16px',
                overflow:'hidden',
                cursor: loading ? 'wait' : 'pointer',
                boxShadow: selected === v.id ? '0 4px 24px rgba(208,2,27,0.13)' : '0 2px 8px rgba(0,0,0,0.05)',
                transition:'all 0.15s',
                position:'relative',
                opacity: loading && selected !== v.id ? 0.5 : 1
              }}
            >
              {selected === v.id && (
                <div style={{ position:'absolute', top:'10px', right:'10px', zIndex:2, width:'24px', height:'24px', background:C.red, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'13px', fontWeight:'700' }}>
                  {loading ? '…' : '✓'}
                </div>
              )}
              <div style={{ height:'160px', background:v.bg, overflow:'hidden' }}>
                <img src={v.img} alt={v.label} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:v.imgPos||'center' }} />
              </div>
              <div style={{ padding:'16px' }}>
                <div style={{ fontWeight:'700', fontSize:'15px', color:C.dark, marginBottom:'4px' }}>{v.label}</div>
                <div style={{ fontSize:'13px', color:C.mid, marginBottom:'12px' }}>{v.desc}</div>
                <a
                  href={v.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'12px', fontWeight:'600', color:C.red, textDecoration:'none', background:'rgba(208,2,27,0.06)', padding:'4px 10px', borderRadius:'20px' }}
                >
                  Voir la démo →
                </a>
              </div>
            </div>
          ))}
        </div>

        {error && <div style={{ textAlign:'center', color:C.red, fontSize:'14px' }}>{error}</div>}
      </div>
    </>
  )
}