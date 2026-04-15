import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/dashboard')
    })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email ou mot de passe incorrect.'); setLoading(false) }
    else { router.push('/dashboard') }
  }

  async function signInWithFacebook() {
    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    })
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    })
  }

  return (
    <>
      <Head>
        <title>Connexion — VietMini</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#FDF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Be Vietnam Pro', sans-serif", padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', background: '#D0021B', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '20px' }}>V</div>
              <span style={{ fontSize: '22px', fontWeight: '700', color: '#1A0A00' }}>VietMini</span>
            </Link>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 24px rgba(26,10,0,0.08)' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1A0A00', margin: '0 0 8px' }}>Connexion</h1>
            <p style={{ fontSize: '14px', color: '#7A4A2A', margin: '0 0 24px' }}>Accédez à votre tableau de bord</p>

            {/* Google */}
            <button onClick={signInWithGoogle} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #e5d9ce', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#1A0A00', cursor: 'pointer', marginBottom: '10px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              <GoogleIcon /> Continuer avec Google
            </button>
            <button onClick={signInWithFacebook} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: 'none', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#fff', cursor: 'pointer', marginBottom: '16px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
              Continuer avec Facebook
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', background: '#e5d9ce' }} />
              <span style={{ fontSize: '12px', color: '#7A4A2A' }}>ou</span>
              <div style={{ flex: 1, height: '1px', background: '#e5d9ce' }} />
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}><label style={lbl}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="votre@email.com" style={inp} /></div>
              <div style={{ marginBottom: '24px' }}><label style={lbl}>Mot de passe</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={inp} /></div>
              {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#D0021B', marginBottom: '16px' }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: loading ? '#e5d9ce' : '#D0021B', color: '#fff', fontWeight: '700', fontSize: '15px', border: 'none', cursor: loading ? 'default' : 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#7A4A2A', marginTop: '24px' }}>
            Pas encore de compte ?{' '}
            <Link href="/register" style={{ color: '#D0021B', fontWeight: '600' }}>Créer mon compte</Link>
          </p>
        </div>
      </div>
    </>
  )
}