import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import LegalFooterLine from '../components/LegalFooterLine'

const VERTICALS = [
  { id: 'salon',      label: 'Salon làm đẹp',     icon: '💅' },
  { id: 'barber',     label: 'Barber shop',        icon: '✂️' },
  { id: 'spa',        label: 'Spa & Massage',      icon: '🧖' },
  { id: 'restaurant', label: 'Nhà hàng',           icon: '🍜' },
  { id: 'gym',        label: 'Phòng gym',          icon: '🏋️' },
  { id: 'karaoke',    label: 'Karaoke',            icon: '🎤' },
  { id: 'pet',        label: 'Grooming thú cưng',  icon: '🐾' },
  { id: 'fashion',    label: 'Cửa hàng',           icon: '🛍️' },
]

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '8px',
  border: '1px solid #e5d9ce', fontSize: '14px', color: '#1A0A00',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Be Vietnam Pro', sans-serif"
}
const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: '600',
  color: '#1A0A00', marginBottom: '6px'
}

export default function Register() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [vertical, setVertical] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard')
    })
  }, [])

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { vertical } }
    })
    if (error) { setError(error.message); setLoading(false) }
    else { router.push('/dashboard') }
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback` }
    })
  }

  return (
    <>
      <Head>
        <title>Tạo tài khoản — VietMini</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#FDF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Be Vietnam Pro', sans-serif", padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: step === 2 ? '560px' : '400px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', background: '#D0021B', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '20px' }}>V</div>
              <span style={{ fontSize: '22px', fontWeight: '700', color: '#1A0A00' }}>VietMini</span>
            </Link>
          </div>

          {/* Étapes */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
            {[1, 2].map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= n ? '#D0021B' : '#e5d9ce', color: step >= n ? '#fff' : '#7A4A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>{n}</div>
                {n < 2 && <div style={{ width: '40px', height: '2px', background: step > n ? '#D0021B' : '#e5d9ce' }} />}
              </div>
            ))}
          </div>

          {/* Étape 1 : compte */}
          {step === 1 && (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 24px rgba(26,10,0,0.08)' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1A0A00', margin: '0 0 8px' }}>Tạo tài khoản</h1>
              <p style={{ fontSize: '14px', color: '#7A4A2A', margin: '0 0 28px' }}>Mini App Zalo của bạn sẵn sàng ngay trong ngày</p>

              {/* Google */}
              <button onClick={signInWithGoogle} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #e5d9ce', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#1A0A00', cursor: 'pointer', marginBottom: '16px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/><path d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
                Tiếp tục với Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}><div style={{ flex: 1, height: '1px', background: '#e5d9ce' }} /><span style={{ fontSize: '12px', color: '#7A4A2A' }}>hoặc</span><div style={{ flex: 1, height: '1px', background: '#e5d9ce' }} /></div>

              <form onSubmit={e => { e.preventDefault(); if (password !== confirm) { setError('Mật khẩu không khớp.'); return } if (password.length < 8) { setError('Mật khẩu quá ngắn (tối thiểu 8 ký tự).'); return } setError(''); setStep(2) }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ban@email.com" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Mật khẩu</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="tối thiểu 8 ký tự" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Xác nhận mật khẩu</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="••••••••" style={inputStyle} />
                </div>

                {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#D0021B', marginBottom: '16px' }}>{error}</div>}

                <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#D0021B', color: '#fff', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  Tiếp tục →
                </button>
              </form>
            </div>
          )}

          {/* Étape 2 : vertical */}
          {step === 2 && (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 24px rgba(26,10,0,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A4A2A', fontSize: '20px', padding: 0, lineHeight: 1 }}>←</button>
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1A0A00', margin: 0 }}>Bạn kinh doanh ngành nghề gì?</h1>
                  <p style={{ fontSize: '13px', color: '#7A4A2A', margin: '2px 0 0' }}>Chúng tôi sẽ tự động chuẩn bị danh mục và dịch vụ cho bạn.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px' }}>
                {VERTICALS.map(v => (
                  <button key={v.id} onClick={() => setVertical(v.id)} style={{ padding: '14px 16px', borderRadius: '10px', textAlign: 'left', border: `2px solid ${vertical === v.id ? '#D0021B' : '#e5d9ce'}`, background: vertical === v.id ? '#fff0f2' : '#fff', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'all .15s' }}>
                    <div style={{ fontSize: '22px', marginBottom: '6px' }}>{v.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A0A00' }}>{v.label}</div>
                  </button>
                ))}
              </div>

              <button onClick={handleSubmit} disabled={!vertical || loading} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: vertical && !loading ? '#D0021B' : '#e5d9ce', color: '#fff', fontWeight: '700', fontSize: '15px', border: 'none', cursor: vertical ? 'pointer' : 'default', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                {loading ? 'Đang tạo…' : 'Tạo tài khoản →'}
              </button>
            </div>
          )}

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#7A4A2A', marginTop: '24px' }}>
            Đã có tài khoản?{' '}
            <Link href="/login" style={{ color: '#D0021B', fontWeight: '600' }}>Đăng nhập</Link>
          </p>

          <LegalFooterLine />
        </div>
      </div>
    </>
  )
}