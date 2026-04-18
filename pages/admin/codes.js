import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

const C = {
  red: '#D0021B', gold: '#F5A623', dark: '#1A0A00',
  mid: '#7A4A2A', bg: '#FDF6EE', white: '#fff',
  border: '#e5d9ce', green: '#16a34a'
}

const PRESETS = [25, 50, 75, 100]

export default function AdminCodes() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [accessToken, setAccessToken] = useState(null)

  const [discount, setDiscount] = useState(100)
  const [notes, setNotes] = useState('')
  const [generating, setGenerating] = useState(false)
  const [newCode, setNewCode] = useState(null)
  const [copied, setCopied] = useState(false)

  const [codes, setCodes] = useState([])
  const [codesLoading, setCodesLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }
    const adminId = process.env.NEXT_PUBLIC_ADMIN_USER_ID
    if (!adminId || session.user.id !== adminId) {
      setLoading(false)
      setAuthorized(false)
      return
    }
    setAccessToken(session.access_token)
    setAuthorized(true)
    setLoading(false)
    loadCodes(session.access_token)
  }

  async function loadCodes(token) {
    setCodesLoading(true)
    try {
      const res = await fetch('/api/admin/codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list', access_token: token })
      })
      const data = await res.json()
      if (res.ok) setCodes(data.codes || [])
    } catch (e) {
      console.error(e)
    }
    setCodesLoading(false)
  }

  async function handleGenerate() {
    setError('')
    setNewCode(null)
    setCopied(false)

    const d = parseInt(discount)
    if (!d || d < 1 || d > 100) {
      setError('Pourcentage invalide (1-100)')
      return
    }

    setGenerating(true)
    try {
      const res = await fetch('/api/admin/codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          access_token: accessToken,
          discount_percentage: d,
          notes: notes.trim() || null
        })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erreur lors de la génération')
      } else {
        setNewCode(data.code)
        setNotes('')
        loadCodes(accessToken)
      }
    } catch (e) {
      setError('Erreur de connexion')
    }
    setGenerating(false)
  }

  function handleCopy() {
    if (!newCode) return
    navigator.clipboard.writeText(newCode.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Be Vietnam Pro', sans-serif", color: C.mid }}>
        Chargement...
      </div>
    )
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Be Vietnam Pro', sans-serif", flexDirection: 'column', gap: '16px', padding: '24px' }}>
        <div style={{ fontSize: '48px' }}>🔒</div>
        <div style={{ color: C.dark, fontSize: '18px', fontWeight: '700' }}>Accès refusé</div>
        <div style={{ color: C.mid, fontSize: '14px', textAlign: 'center' }}>Cette page est réservée à l'administrateur.</div>
        <Link href="/" style={{ fontSize: '13px', color: C.red, textDecoration: 'underline', marginTop: '8px' }}>Retour à l'accueil</Link>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Admin — Codes d'activation</title>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Be Vietnam Pro', sans-serif" }}>

        {/* Header */}
        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: C.dark, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontWeight: '700', fontSize: '14px' }}>A</div>
            <span style={{ fontWeight: '700', fontSize: '16px', color: C.dark }}>VietMini Admin</span>
          </div>
          <Link href="/dashboard" style={{ fontSize: '13px', color: C.mid, textDecoration: 'none' }}>← Dashboard</Link>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 80px' }}>

          <h1 style={{ fontSize: '28px', fontWeight: '900', color: C.dark, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Codes d'activation</h1>
          <p style={{ fontSize: '14px', color: C.mid, margin: '0 0 32px' }}>Générez un code pour activer l'abonnement d'un marchand.</p>

          {/* Bloc génération */}
          <div style={{ background: C.white, borderRadius: '16px', boxShadow: '0 4px 20px rgba(26,10,0,0.06)', border: `1px solid ${C.border}`, padding: '28px', marginBottom: '32px' }}>

            {/* Pourcentage */}
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: C.dark, marginBottom: '10px' }}>Pourcentage de réduction</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {PRESETS.map(p => (
                <button
                  key={p}
                  onClick={() => setDiscount(p)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: `2px solid ${discount === p ? C.red : C.border}`,
                    background: discount === p ? C.red : C.white,
                    color: discount === p ? C.white : C.dark,
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: "'Be Vietnam Pro', sans-serif"
                  }}
                >{p}%</button>
              ))}
              <input
                type="number"
                min="1"
                max="100"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                style={{
                  width: '100px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `2px solid ${C.border}`,
                  fontSize: '14px',
                  color: C.dark,
                  outline: 'none',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  textAlign: 'center',
                  fontWeight: '700'
                }}
              />
            </div>
            <p style={{ fontSize: '12px', color: C.mid, margin: '0 0 20px' }}>
              100% = accès gratuit. Pour un %, tu dois déjà avoir encaissé le reste.
            </p>

            {/* Note */}
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: C.dark, marginBottom: '10px' }}>Note (optionnelle)</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Salon Hoa Mai - Minh"
              maxLength="100"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                fontSize: '14px',
                color: C.dark,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                marginBottom: '20px'
              }}
            />

            {/* CTA */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: generating ? C.mid : C.red,
                color: C.white,
                fontWeight: '700',
                fontSize: '15px',
                border: 'none',
                cursor: generating ? 'wait' : 'pointer',
                fontFamily: "'Be Vietnam Pro', sans-serif"
              }}
            >
              {generating ? 'Génération…' : 'Générer un code'}
            </button>

            {error && (
              <p style={{ marginTop: '12px', fontSize: '13px', color: C.red, textAlign: 'center' }}>{error}</p>
            )}

            {/* Code fraîchement généré */}
            {newCode && (
              <div style={{ marginTop: '20px', padding: '20px', background: C.bg, borderRadius: '12px', border: `2px solid ${C.gold}` }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', textAlign: 'center' }}>Nouveau code ({newCode.discount_percentage}%)</div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: C.dark, letterSpacing: '4px', textAlign: 'center', fontFamily: 'monospace', marginBottom: '12px' }}>{newCode.code}</div>
                <button
                  onClick={handleCopy}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    background: copied ? C.green : C.dark,
                    color: C.white,
                    fontWeight: '600',
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Be Vietnam Pro', sans-serif"
                  }}
                >{copied ? '✓ Copié' : 'Copier le code'}</button>
              </div>
            )}

          </div>

          {/* Liste des codes */}
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: C.dark, margin: '0 0 12px' }}>Historique des codes</h2>

          {codesLoading ? (
            <p style={{ fontSize: '13px', color: C.mid }}>Chargement…</p>
          ) : codes.length === 0 ? (
            <p style={{ fontSize: '13px', color: C.mid }}>Aucun code pour le moment.</p>
          ) : (
            <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.6fr 1.5fr 0.8fr 0.9fr', gap: '12px', padding: '12px 16px', background: C.bg, fontSize: '11px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${C.border}` }}>
                <div>Code</div>
                <div style={{ textAlign: 'center' }}>%</div>
                <div>Note</div>
                <div style={{ textAlign: 'center' }}>Statut</div>
                <div style={{ textAlign: 'right' }}>Créé</div>
              </div>
              {codes.map(c => (
                <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.6fr 1.5fr 0.8fr 0.9fr', gap: '12px', padding: '12px 16px', fontSize: '13px', color: c.used ? C.mid : C.dark, borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontWeight: '700', letterSpacing: '1px', textDecoration: c.used ? 'line-through' : 'none' }}>{c.code}</div>
                  <div style={{ textAlign: 'center', fontWeight: '700' }}>{c.discount_percentage}</div>
                  <div style={{ fontSize: '12px', color: C.mid, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.notes || '—'}</div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: c.used ? '#e5e7eb' : '#dcfce7', color: c.used ? '#6b7280' : '#166534' }}>
                      {c.used ? 'Utilisé' : 'Actif'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '12px', color: C.mid }}>
                    {new Date(c.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  )
}
