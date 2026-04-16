import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()
  const handled = useRef(false)

  useEffect(() => {
    if (!router.isReady) return
    if (handled.current) return
    handled.current = true

    async function handleCallback() {
      const { code, error } = router.query

      if (error) {
        router.replace('/login')
        return
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(String(code))
        if (exchangeError) {
          console.error('Exchange error:', exchangeError)
          router.replace('/login')
          return
        }
        window.location.href = "/dashboard"
        return
      }

      // Pas de code — vérifier session existante
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        window.location.href = "/dashboard"
      } else {
        router.replace('/login')
      }
    }

    handleCallback()
  }, [router.isReady])

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