import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return

    async function handleCallback() {
      const { code, error } = router.query

      if (error) {
        router.replace('/login')
        return
      }

      if (code) {
        // PKCE flow — échange le code contre une session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(String(code))
        if (exchangeError) {
          router.replace('/login')
          return
        }
        router.replace('/dashboard')
        return
      }

      // Implicit flow — le token est dans le hash, Supabase le parse automatiquement
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/dashboard')
      } else {
        // Attendre l'event SIGNED_IN
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            subscription.unsubscribe()
            router.replace('/dashboard')
          }
        })
        // Timeout de sécurité
        setTimeout(() => router.replace('/login'), 5000)
      }
    }

    handleCallback()
  }, [router.isReady, router.query])

  return (
    <>
      <Head>
        <title>Connexion — VietMini</title>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600&display=swap" rel="stylesheet" />
      </Head>
      <div style={{
        minHeight: '100vh', background: '#FDF6EE',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Be Vietnam Pro', sans-serif", flexDirection: 'column', gap: '16px'
      }}>
        <div style={{
          width: '40px', height: '40px', background: '#D0021B', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: '700', fontSize: '20px'
        }}>V</div>
        <p style={{ color: '#7A4A2A', fontSize: '14px', margin: 0 }}>Connexion en cours…</p>
      </div>
    </>
  )
}