import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

const VERTICALS = [
  { id: 'salon',      label: 'Salon de beauté',  icon: '💅' },
  { id: 'barber',     label: 'Barbier',           icon: '✂️' },
  { id: 'spa',        label: 'Spa & Bien-être',   icon: '🧖' },
  { id: 'restaurant', label: 'Restaurant',        icon: '🍜' },
  { id: 'gym',        label: 'Salle de sport',    icon: '🏋️' },
  { id: 'karaoke',    label: 'Karaoké',           icon: '🎤' },
  { id: 'pet',        label: 'Pet grooming',      icon: '🐾' },
  { id: 'fashion',    label: 'Boutique',          icon: '🛍️' },
]

const inp = {
  width: '100%', padding: '10px 14px', borderRadius: '8px',
  border: '1px solid #e5d9ce', fontSize: '14px', color: '#1A0A00',
  outline: 'none', boxSizing: 'border-box', fontFamily: "'Be Vietnam Pro', sans-serif"
}
const lbl = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A0A00', marginBottom: '6px' }

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function Login() {
  const router = useRouter()
  // mode: 'login' | 'register' | 'vertical'
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [vertical, setVertical] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } })
  }
  async function signInWithFacebook() {
    await supabase.auth.signInWithOAuth({ provider: 'facebook', options: { redirectTo: `${window.location.origin}/dashboard` } })
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email ou mot de passe incorrect.'); setLoading(false) }
    else router.push('/dashboard')
  }

  function handleRegisterStep1(e) {
    e.preventDefault()
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (password.length < 8) { setError('8 caractères minimum.'); return }
    setError(''); setMode('vertical')
  }

  async function handleRegisterFinal() {
    if (!vertical) return
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { vertical } } })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  const isRegister = mode === 'register' || mode === 'vertical'

  return (
    <>
      <Head>
        <title>{isRegister ? 'Créer un compte' : 'Connexion'} — VietMini</title>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#FDF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Be Vietnam Pro', sans-serif", padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: mode === 'vertical' ? '560px' : '400px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', background: '#D0021B', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '20px' }}>V</div>
              <span style={{ fontSize: '22px', fontWeight: '700', color: '#1A0A00' }}>VietMini</span>
            </Link>
          </div>

          {/* Étapes inscription */}
          {isRegister && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
              {[1, 2].map(n => {
                const active = n === 1 ? mode === 'register' : mode === 'vertical'
                const done = n === 1 && mode === 'vertical'
                return (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: active || done ? '#D0021B' : '#e5d9ce', color: active || done ? '#fff' : '#7A4A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>{n}</div>
                    {n < 2 && <div style={{ width: '40px', height: '2px', background: mode === 'vertical' ? '#D0021B' : '#e5d9ce' }} />}
                  </div>
                )
              })}
            </div>
          )}

          <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 24px rgba(26,10,0,0.08)' }}>

            {/* ── CONNEXION ── */}
            {mode === 'login' && (
              <>
                <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1A0A00', margin: '0 0 8px' }}>Connexion</h1>
                <p style={{ fontSize: '14px', color: '#7A4A2A', margin: '0 0 24px' }}>Accédez à votre tableau de bord</p>
                <button onClick={signInWithGoogle} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #e5d9ce', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#1A0A00', cursor: 'pointer', marginBottom: '10px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  <GoogleIcon /> Continuer avec Google
                </button>
                <button onClick={signInWithFacebook} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: 'none', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#fff', cursor: 'pointer', marginBottom: '16px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                  Continuer avec Facebook
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}><div style={{ flex: 1, height: '1px', background: '#e5d9ce' }} /><span style={{ fontSize: '12px', color: '#7A4A2A' }}>ou</span><div style={{ flex: 1, height: '1px', background: '#e5d9ce' }} /></div>
                <form onSubmit={handleLogin}>
                  <div style={{ marginBottom: '16px' }}><label style={lbl}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="votre@email.com" style={inp} /></div>
                  <div style={{ marginBottom: '24px' }}><label style={lbl}>Mot de passe</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={inp} /></div>
                  {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#D0021B', marginBottom: '16px' }}>{error}</div>}
                  <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: loading ? '#e5d9ce' : '#D0021B', color: '#fff', fontWeight: '700', fontSize: '15px', border: 'none', cursor: loading ? 'default' : 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    {loading ? 'Connexion…' : 'Se connecter'}
                  </button>
                </form>
              </>
            )}

            {/* ── INSCRIPTION étape 1 ── */}
            {mode === 'register' && (
              <>
                <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1A0A00', margin: '0 0 8px' }}>Créer mon compte</h1>
                <p style={{ fontSize: '14px', color: '#7A4A2A', margin: '0 0 28px' }}>Votre Mini App Zalo est prête le jour même</p>
                <button onClick={signInWithGoogle} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #e5d9ce', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#1A0A00', cursor: 'pointer', marginBottom: '10px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  <GoogleIcon /> Continuer avec Google
                </button>
                <button onClick={signInWithFacebook} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: 'none', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#fff', cursor: 'pointer', marginBottom: '16px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                  Continuer avec Facebook
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}><div style={{ flex: 1, height: '1px', background: '#e5d9ce' }} /><span style={{ fontSize: '12px', color: '#7A4A2A' }}>ou</span><div style={{ flex: 1, height: '1px', background: '#e5d9ce' }} /></div>
                <form onSubmit={handleRegisterStep1}>
                  <div style={{ marginBottom: '16px' }}><label style={lbl}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="votre@email.com" style={inp} /></div>
                  <div style={{ marginBottom: '16px' }}><label style={lbl}>Mot de passe</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="8 caractères minimum" style={inp} /></div>
                  <div style={{ marginBottom: '24px' }}><label style={lbl}>Confirmer le mot de passe</label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="••••••••" style={inp} /></div>
                  {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#D0021B', marginBottom: '16px' }}>{error}</div>}
                  <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#D0021B', color: '#fff', fontWeight: '700', fontSize: '15px', border: 'none', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Continuer →</button>
                </form>
              </>
            )}

            {/* ── INSCRIPTION étape 2 : vertical ── */}
            {mode === 'vertical' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <button onClick={() => setMode('register')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A4A2A', fontSize: '20px', padding: 0 }}>←</button>
                  <div>
                    <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1A0A00', margin: 0 }}>Quel est votre commerce ?</h1>
                    <p style={{ fontSize: '13px', color: '#7A4A2A', margin: '2px 0 0' }}>Nous préparerons vos services automatiquement.</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px' }}>
                  {VERTICALS.map(v => (
                    <button key={v.id} onClick={() => setVertical(v.id)} style={{ padding: '14px 16px', borderRadius: '10px', textAlign: 'left', border: `2px solid ${vertical === v.id ? '#D0021B' : '#e5d9ce'}`, background: vertical === v.id ? '#fff0f2' : '#fff', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                      <div style={{ fontSize: '22px', marginBottom: '6px' }}>{v.icon}</div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A0A00' }}>{v.label}</div>
                    </button>
                  ))}
                </div>
                {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#D0021B', marginBottom: '16px' }}>{error}</div>}
                <button onClick={handleRegisterFinal} disabled={!vertical || loading} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: vertical && !loading ? '#D0021B' : '#e5d9ce', color: '#fff', fontWeight: '700', fontSize: '15px', border: 'none', cursor: vertical ? 'pointer' : 'default', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  {loading ? 'Création…' : 'Créer mon compte →'}
                </button>
              </>
            )}
          </div>

          {/* Lien bas de page */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#7A4A2A', marginTop: '24px' }}>
            {mode === 'login' ? (
              <>Pas encore de compte ?{' '}<button onClick={() => { setMode('register'); setError('') }} style={{ background: 'none', border: 'none', color: '#D0021B', fontWeight: '600', cursor: 'pointer', fontSize: '14px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Créer mon compte</button></>
            ) : (
              <>Déjà un compte ?{' '}<button onClick={() => { setMode('login'); setError('') }} style={{ background: 'none', border: 'none', color: '#D0021B', fontWeight: '600', cursor: 'pointer', fontSize: '14px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Se connecter</button></>
            )}
          </p>
        </div>
      </div>
    </>
  )
}