import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

const C = {
  red: '#D0021B', gold: '#F5A623', dark: '#1A0A00',
  mid: '#7A4A2A', bg: '#FDF6EE', white: '#fff',
  border: '#e5d9ce', green: '#16a34a', muted: '#9a7a75'
}

const VERTICAL_LABELS = {
  salon: 'Salon',
  barber: 'Barbier',
  spa: 'Spa',
  restaurant: 'Nhà hàng',
  gym: 'Gym',
  karaoke: 'Karaoke',
  pet: 'Pet',
  boutique: 'Boutique',
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const now = new Date()
  const target = new Date(dateStr)
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
  return diff
}

function subscriptionStatus(m) {
  if (!m.subscription_active) return { label: 'Inactif', color: '#6b7280', bg: '#e5e7eb' }
  const days = daysUntil(m.subscription_expires_at)
  if (days === null) return { label: 'Actif', color: '#166534', bg: '#dcfce7' }
  if (days < 0) return { label: 'Expiré', color: '#991b1b', bg: '#fee2e2' }
  if (days <= 30) return { label: `Expire ${days}j`, color: '#92400e', bg: '#fef3c7' }
  return { label: 'Actif', color: '#166534', bg: '#dcfce7' }
}

export default function AdminMerchants() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [accessToken, setAccessToken] = useState(null)

  const [merchants, setMerchants] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { checkAuth() }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    const adminId = process.env.NEXT_PUBLIC_ADMIN_USER_ID
    if (!adminId || session.user.id !== adminId) {
      setLoading(false); setAuthorized(false); return
    }
    setAccessToken(session.access_token)
    setAuthorized(true)
    setLoading(false)
    loadMerchants(session.access_token)
  }

  async function loadMerchants(token) {
    setListLoading(true)
    try {
      const res = await fetch('/api/admin/merchants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list', access_token: token })
      })
      const data = await res.json()
      if (res.ok) setMerchants(data.merchants || [])
      else setError(data.error || 'Erreur chargement')
    } catch (e) {
      setError('Erreur de connexion')
    }
    setListLoading(false)
  }

  async function handleExtend(m) {
    const input = window.prompt(`Prolonger l'abonnement de "${m.name || 'ce marchand'}" de combien de jours ?\n(365 = 1 an, 30 = 1 mois)`, '365')
    if (!input) return
    const days = parseInt(input)
    if (!days || days < 1) { alert('Nombre de jours invalide'); return }

    setBusyId(m.id)
    try {
      const res = await fetch('/api/admin/merchants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'extend',
          access_token: accessToken,
          merchant_id: m.id,
          days
        })
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Erreur'); setBusyId(null); return }
      await loadMerchants(accessToken)
    } catch (e) {
      alert('Erreur de connexion')
    }
    setBusyId(null)
  }

  async function handleToggleActive(m) {
    const newState = !m.subscription_active
    if (!window.confirm(`${newState ? 'Activer' : 'Désactiver'} l'abonnement de "${m.name || 'ce marchand'}" ?`)) return

    setBusyId(m.id)
    try {
      const res = await fetch('/api/admin/merchants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_active',
          access_token: accessToken,
          merchant_id: m.id,
          active: newState
        })
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Erreur'); setBusyId(null); return }
      await loadMerchants(accessToken)
    } catch (e) {
      alert('Erreur de connexion')
    }
    setBusyId(null)
  }

  // Filtres
  const filtered = merchants.filter(m => {
    if (search) {
      const q = search.toLowerCase()
      const hay = `${m.name || ''} ${m.email || ''} ${m.phone || ''} ${m.vertical || ''}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (filterStatus === 'active' && !m.subscription_active) return false
    if (filterStatus === 'inactive' && m.subscription_active) return false
    if (filterStatus === 'expiring') {
      const d = daysUntil(m.subscription_expires_at)
      if (!m.subscription_active || d === null || d > 30 || d < 0) return false
    }
    if (filterStatus === 'expired') {
      const d = daysUntil(m.subscription_expires_at)
      if (!m.subscription_active || d === null || d >= 0) return false
    }
    return true
  })

  // Stats
  const totalCount = merchants.length
  const activeCount = merchants.filter(m => m.subscription_active).length
  const expiringCount = merchants.filter(m => {
    const d = daysUntil(m.subscription_expires_at)
    return m.subscription_active && d !== null && d >= 0 && d <= 30
  }).length

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
        <title>Admin — Marchands</title>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Be Vietnam Pro', sans-serif" }}>

        {/* Header */}
        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: C.dark, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontWeight: '700', fontSize: '14px' }}>A</div>
            <span style={{ fontWeight: '700', fontSize: '16px', color: C.dark }}>VietMini Admin</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/admin/codes" style={{ fontSize: '13px', color: C.mid, textDecoration: 'none' }}>Codes</Link>
            <Link href="/admin/merchants" style={{ fontSize: '13px', color: C.red, textDecoration: 'none', fontWeight: '700' }}>Marchands</Link>
            <Link href="/dashboard" style={{ fontSize: '13px', color: C.mid, textDecoration: 'none' }}>← Dashboard</Link>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>

          <h1 style={{ fontSize: '28px', fontWeight: '900', color: C.dark, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Marchands</h1>
          <p style={{ fontSize: '14px', color: C.mid, margin: '0 0 32px' }}>Liste complète des marchands inscrits.</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
            <StatCard label="Total" value={totalCount} />
            <StatCard label="Actifs" value={activeCount} color={C.green} />
            <StatCard label="Expire ≤30j" value={expiringCount} color="#d97706" />
          </div>

          {/* Filtres */}
          <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '16px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher (nom, email, tél, vertical)…"
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                fontSize: '14px',
                color: C.dark,
                outline: 'none',
                fontFamily: "'Be Vietnam Pro', sans-serif"
              }}
            />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                fontSize: '14px',
                color: C.dark,
                outline: 'none',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                background: C.white,
                cursor: 'pointer'
              }}
            >
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="expiring">Expirant ≤30j</option>
              <option value="expired">Expirés</option>
              <option value="inactive">Inactifs</option>
            </select>
            <button
              onClick={() => loadMerchants(accessToken)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                background: C.dark,
                color: C.white,
                fontSize: '13px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Be Vietnam Pro', sans-serif"
              }}
            >↻ Recharger</button>
          </div>

          {error && <p style={{ fontSize: '13px', color: C.red, marginBottom: '16px' }}>{error}</p>}

          {/* Liste */}
          {listLoading ? (
            <p style={{ fontSize: '13px', color: C.mid }}>Chargement…</p>
          ) : filtered.length === 0 ? (
            <p style={{ fontSize: '13px', color: C.mid, textAlign: 'center', padding: '40px 0' }}>
              {merchants.length === 0 ? 'Aucun marchand inscrit.' : 'Aucun résultat.'}
            </p>
          ) : (
            <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.9fr 1.4fr 0.9fr 1fr 1.4fr', gap: '12px', padding: '12px 16px', background: C.bg, fontSize: '11px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${C.border}` }}>
                <div>Marchand</div>
                <div>Vertical</div>
                <div>Email / Tél</div>
                <div style={{ textAlign: 'center' }}>Statut</div>
                <div style={{ textAlign: 'center' }}>Expire</div>
                <div style={{ textAlign: 'right' }}>Actions</div>
              </div>
              {filtered.map(m => {
                const status = subscriptionStatus(m)
                const isBusy = busyId === m.id
                return (
                  <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.9fr 1.4fr 0.9fr 1fr 1.4fr', gap: '12px', padding: '12px 16px', fontSize: '13px', color: C.dark, borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '700' }}>{m.name || <span style={{ color: C.muted, fontStyle: 'italic' }}>Sans nom</span>}</div>
                      <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>Inscrit {formatDate(m.created_at)}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: C.mid }}>
                      {m.vertical ? (VERTICAL_LABELS[m.vertical] || m.vertical) : '—'}
                    </div>
                    <div style={{ fontSize: '12px', overflow: 'hidden' }}>
                      <div style={{ color: C.dark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email || '—'}</div>
                      <div style={{ color: C.muted, fontSize: '11px', marginTop: '2px' }}>{m.phone || '—'}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: status.bg, color: status.color, whiteSpace: 'nowrap' }}>
                        {status.label}
                      </span>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '12px', color: C.mid }}>
                      {formatDate(m.subscription_expires_at)}
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <Link
                        href={`/preview/${m.id}`}
                        target="_blank"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: `1px solid ${C.border}`,
                          background: C.white,
                          color: C.dark,
                          fontSize: '11px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap'
                        }}
                      >Mini App</Link>
                      <button
                        onClick={() => handleExtend(m)}
                        disabled={isBusy}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          background: isBusy ? C.muted : C.red,
                          color: C.white,
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: isBusy ? 'wait' : 'pointer',
                          fontFamily: "'Be Vietnam Pro', sans-serif",
                          whiteSpace: 'nowrap'
                        }}
                      >+ Jours</button>
                      <button
                        onClick={() => handleToggleActive(m)}
                        disabled={isBusy}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: `1px solid ${C.border}`,
                          background: C.white,
                          color: m.subscription_active ? C.red : C.green,
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: isBusy ? 'wait' : 'pointer',
                          fontFamily: "'Be Vietnam Pro', sans-serif",
                          whiteSpace: 'nowrap'
                        }}
                      >{m.subscription_active ? 'Désactiver' : 'Activer'}</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px' }}>
      <div style={{ fontSize: '11px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: '900', color: color || C.dark }}>{value}</div>
    </div>
  )
}
