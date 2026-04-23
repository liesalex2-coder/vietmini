import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabaseClient'

const VERTICALS = [
  { id:'salon',    label:'Salon làm đẹp',      desc:'Tóc, nail, makeup',               img:'/images/img_1.webp', bg:'linear-gradient(135deg,#FFEAE8,#FFD0CB)', demo:'https://bella-demo-rosy.vercel.app' },
  { id:'barber',   label:'Barbershop',          desc:'Cắt tóc nam, cạo râu',            img:'/images/img_2.webp', bg:'linear-gradient(135deg,#E8E4F0,#CFC8E8)', demo:'https://barber-demo-five.vercel.app' },
  { id:'spa',      label:'Spa & Chăm sóc',      desc:'Massage, chăm sóc cơ thể',        img:'/images/img_3.webp', bg:'linear-gradient(135deg,#E0F4F0,#B8E8E0)', demo:'https://spa-demo-sand.vercel.app' },
  { id:'resto',    label:'Nhà hàng / Quán cà phê', desc:'Thực đơn, ưu đãi, thẻ thân thiết', img:'/images/img_4.webp', bg:'linear-gradient(135deg,#FFF5DC,#FFE8A0)', demo:'https://restaurant-demo-ten-dusky.vercel.app' },
  { id:'gym',      label:'Phòng gym',           desc:'Gói tập, lớp học, PT',            img:'/images/img_5.webp', bg:'linear-gradient(135deg,#E8F5E0,#C8E8B0)', demo:'https://gym-demo-lyart.vercel.app' },
  { id:'pet',      label:'Chăm sóc thú cưng',   desc:'Tắm, cắt lông, chăm sóc',         img:'/images/img_6.webp', bg:'linear-gradient(135deg,#FFF0DC,#FFE0A8)', imgPos:'50% 15%', demo:'https://paw-demo.vercel.app' },
  { id:'karaoke',  label:'Karaoke',             desc:'Phòng hát, đồ uống, ưu đãi',      img:'/images/img_7.webp', bg:'linear-gradient(135deg,#F0E8FF,#D8C8F0)', demo:'https://karaoke-demo-gules.vercel.app' },
  { id:'boutique', label:'Cửa hàng',            desc:'Thời trang, phụ kiện, mỹ phẩm',   img:'/images/img_8.webp', bg:'linear-gradient(135deg,#FAE8EF,#F0C8D8)', demo:'https://store-demo-ecru.vercel.app' },
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
      if (!res.ok) throw new Error(json.error || 'Có lỗi xảy ra')
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
        <title>Chọn ngành nghề — VietMini</title>
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
            Bạn kinh doanh ngành nghề gì?
          </h1>
          <p style={{ color:C.mid, fontSize:'15px', margin:0 }}>
            App của bạn sẽ được cấu hình tự động theo ngành nghề đã chọn.
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
                <div style={{ fontSize:'13px', color:C.mid }}>{v.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {error && <div style={{ textAlign:'center', color:C.red, fontSize:'14px' }}>{error}</div>}
      </div>
    </>
  )
}