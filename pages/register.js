import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (password.length < 8) { setError('Mot de passe trop court (8 caractères minimum).'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <Head>
        <title>Créer un compte — VietMini</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{
        minHeight: '100vh', background: '#FDF6EE',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Be Vietnam Pro', sans-serif", padding: '24px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px', height: '40px', background: '#D0021B',
                borderRadius: '10px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '20px'
              }}>V</div>
              <span style={{ fontSize: '22px', fontWeight: '700', color: '#1A0A00' }}>VietMini</span>
            </Link>
          </div>

          {/* Card */}
          <div style={{
            background: '#fff', borderRadius: '16px',
            padding: '40px', boxShadow: '0 4px 24px rgba(26,10,0,0.08)'
          }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1A0A00', margin: '0 0 8px' }}>
              Créer mon compte
            </h1>
            <p style={{ fontSize: '14px', color: '#7A4A2A', margin: '0 0 32px' }}>
              Votre Mini App Zalo est prête le jour même
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A0A00', marginBottom: '6px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #e5d9ce', fontSize: '14px', color: '#1A0A00',
                    outline: 'none', boxSizing: 'border-box',
                    fontFamily: "'Be Vietnam Pro', sans-serif"
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A0A00', marginBottom: '6px' }}>
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="8 caractères minimum"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #e5d9ce', fontSize: '14px', color: '#1A0A00',
                    outline: 'none', boxSizing: 'border-box',
                    fontFamily: "'Be Vietnam Pro', sans-serif"
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1A0A00', marginBottom: '6px' }}>
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #e5d9ce', fontSize: '14px', color: '#1A0A00',
                    outline: 'none', boxSizing: 'border-box',
                    fontFamily: "'Be Vietnam Pro', sans-serif"
                  }}
                />
              </div>

              {error && (
                <div style={{
                  background: '#fff0f0', border: '1px solid #ffcccc',
                  borderRadius: '8px', padding: '10px 14px',
                  fontSize: '13px', color: '#D0021B', marginBottom: '16px'
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px',
                  background: loading ? '#e5d9ce' : '#D0021B',
                  color: '#fff', fontWeight: '700', fontSize: '15px',
                  border: 'none', cursor: loading ? 'default' : 'pointer',
                  fontFamily: "'Be Vietnam Pro', sans-serif"
                }}
              >
                {loading ? 'Création…' : 'Créer mon compte →'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#7A4A2A', marginTop: '24px' }}>
            Déjà un compte ?{' '}
            <Link href="/login" style={{ color: '#D0021B', fontWeight: '600' }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
