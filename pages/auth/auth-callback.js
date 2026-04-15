import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // Avec flowType: 'implicit', le token est dans le hash.
    // Supabase le parse automatiquement au premier getSession().
    // On attend l'event SIGNED_IN avant de rediriger.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.replace('/dashboard')
      }
    })

    // Fallback : si la session est déjà établie
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard')
    })

    return () => subscription.unsubscribe()
  }, [])

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
