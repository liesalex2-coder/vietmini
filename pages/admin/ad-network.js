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

const SOURCE_LABELS = {
  welcome:     '🎁 Quà chào mừng',
  monthly:     '🔄 Hàng tháng',
  addon:       '💳 Mua thêm',
  admin_grant: '🎖 Tặng từ Admin'
}

const GRID_COLS = '1.4fr 1fr 1fr 0.7fr 1fr 0.8fr'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default function AdminAdNetwork() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [accessToken, setAccessToken] = useState(null)

  const [campaigns, setCampaigns] = useState([])
  const [inventory, setInventory] = useState([])
  const [settings, setSettings] = useState([])
  const [cities, setCities] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [error, setError] = useState('')

  // Filtres
  const [filterCity, setFilterCity] = useState('all')
  const [filterSource, setFilterSource] = useState('all')
  const [filterStatus, setFilterStatus] = useState('active')

  // Modal grant
  const [grantOpen, setGrantOpen] = useState(false)

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
    loadAll(session.access_token)
  }

  async function api(action, params = {}, token = accessToken) {
    const res = await fetch('/api/admin/ad-network', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, access_token: token, ...params })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erreur API')
    return data
  }

  async function loadAll(token) {
    setListLoading(true)
    setError('')
    try {
      const [c, inv, set, cit] = await Promise.all([
        api('list_campaigns', {}, token),
        api('inventory', {}, token),
        api('get_settings', {}, token),
        api('cities', {}, token)
      ])
      setCampaigns(c.campaigns || [])
      setInventory(inv.inventory || [])
      setSettings(set.settings || [])
      setCities(cit.cities || [])
    } catch (e) {
      setError(e.message || 'Erreur de chargement')
    }
    setListLoading(false)
  }

  // Filtrage côté client (rapide vu la volumétrie attendue)
  const filtered = campaigns.filter(c => {
    if (filterCity !== 'all') {
      const code = c.merchants?.city_code
      if (filterCity === 'none' && code) return false
      if (filterCity !== 'none' && code !== filterCity) return false
    }
    if (filterSource !== 'all' && c.source !== filterSource) return false
    if (filterStatus === 'active' && (!c.active || c.days_remaining <= 0)) return false
    if (filterStatus === 'expired' && c.active && c.days_remaining > 0) return false
    return true
  })

  // Stats
  const totalActive = campaigns.filter(c => c.active && c.days_remaining > 0).length
  const totalDaysRemaining = campaigns.reduce((s, c) => s + (c.active && c.days_remaining > 0 ? c.days_remaining : 0), 0)
  const totalGranted = campaigns.filter(c => c.created_by_admin).length

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
        <title>Admin — Réseau Pub</title>
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
            <Link href="/admin/merchants" style={{ fontSize: '13px', color: C.mid, textDecoration: 'none' }}>Marchands</Link>
            <Link href="/admin/commerciaux" style={{ fontSize: '13px', color: C.mid, textDecoration: 'none' }}>Commerciaux</Link>
            <Link href="/admin/ad-network" style={{ fontSize: '13px', color: C.red, textDecoration: 'none', fontWeight: '700' }}>Réseau Pub</Link>
            <Link href="/dashboard" style={{ fontSize: '13px', color: C.mid, textDecoration: 'none' }}>← Dashboard</Link>
          </div>
        </div>

        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '40px 24px 80px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: C.dark, letterSpacing: '-0.5px', margin: 0 }}>Réseau publicitaire</h1>
            <button
              onClick={() => setGrantOpen(true)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                background: C.red,
                color: C.white,
                fontSize: '13px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Be Vietnam Pro', sans-serif"
              }}
            >+ Offrir des jours</button>
          </div>
          <p style={{ fontSize: '14px', color: C.mid, margin: '0 0 32px' }}>Gestion des campagnes, paramètres globaux et inventaire par ville.</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
            <StatCard label="Campagnes actives" value={totalActive} color={C.green} />
            <StatCard label="Jours restants total" value={totalDaysRemaining} />
            <StatCard label="Gestes commerciaux" value={totalGranted} color={C.gold} />
          </div>

          {error && <p style={{ fontSize: '13px', color: C.red, marginBottom: '16px' }}>{error}</p>}

          {/* Section Paramètres */}
          <SectionTitle>Paramètres globaux</SectionTitle>
          <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px', marginBottom: '32px' }}>
            <SettingsEditor
              settings={settings}
              onUpdate={async (key, value) => {
                try {
                  await api('update_setting', { key, value })
                  await loadAll(accessToken)
                } catch (e) {
                  alert(e.message)
                }
              }}
            />
          </div>

          {/* Section Inventaire */}
          <SectionTitle>Inventaire par ville</SectionTitle>
          <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, marginBottom: '32px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px', padding: '12px 16px', background: C.bg, fontSize: '11px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${C.border}` }}>
              <div>Ville</div>
              <div style={{ textAlign: 'center' }}>Marchands actifs</div>
              <div style={{ textAlign: 'center' }}>Affichés aujourd'hui</div>
              <div style={{ textAlign: 'right' }}>Jours restants</div>
            </div>
            {inventory.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: C.mid }}>
                Aucun marchand n'a encore activé sa pub.
              </div>
            ) : (
              inventory.map(i => (
                <div key={i.city_code} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px', padding: '12px 16px', fontSize: '13px', color: C.dark, borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
                  <div style={{ fontWeight: '600' }}>{i.name_vi}</div>
                  <div style={{ textAlign: 'center' }}>{i.merchants_active_count}</div>
                  <div style={{ textAlign: 'center', color: i.shown_today_count > 0 ? C.green : C.mid }}>
                    {i.shown_today_count}
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: '700', color: C.red }}>{i.total_days_remaining}</div>
                </div>
              ))
            )}
          </div>

          {/* Section Campagnes */}
          <SectionTitle>Campagnes</SectionTitle>

          {/* Filtres */}
          <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '16px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={filterCity}
              onChange={e => setFilterCity(e.target.value)}
              style={selectStyle}
            >
              <option value="all">Toutes villes</option>
              <option value="none">Sans ville définie</option>
              {cities.filter(c => !c.parent).map(parent => (
                <optgroup key={parent.code} label={parent.name_vi}>
                  <option value={parent.code}>{parent.name_vi}</option>
                  {cities.filter(c => c.parent === parent.code).map(child => (
                    <option key={child.code} value={child.code}>{child.name_vi}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <select
              value={filterSource}
              onChange={e => setFilterSource(e.target.value)}
              style={selectStyle}
            >
              <option value="all">Toutes sources</option>
              <option value="welcome">Quà chào mừng</option>
              <option value="addon">Achetée</option>
              <option value="admin_grant">Geste commercial</option>
              <option value="monthly">Hàng tháng</option>
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={selectStyle}
            >
              <option value="all">Tous statuts</option>
              <option value="active">Actives</option>
              <option value="expired">Terminées</option>
            </select>
          </div>

          {/* Liste */}
          {listLoading ? (
            <p style={{ fontSize: '13px', color: C.mid }}>Chargement…</p>
          ) : filtered.length === 0 ? (
            <p style={{ fontSize: '13px', color: C.mid, textAlign: 'center', padding: '40px 0' }}>
              {campaigns.length === 0 ? 'Aucune campagne pour le moment.' : 'Aucun résultat.'}
            </p>
          ) : (
            <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: GRID_COLS, gap: '12px', padding: '12px 16px', background: C.bg, fontSize: '11px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${C.border}` }}>
                <div>Marchand</div>
                <div>Ville</div>
                <div>Source</div>
                <div style={{ textAlign: 'center' }}>Jours</div>
                <div>Démarrée</div>
                <div style={{ textAlign: 'right' }}>Statut</div>
              </div>
              {filtered.map(c => {
                const merchant = c.merchants || {}
                const isActive = c.active && c.days_remaining > 0
                return (
                  <div key={c.id} style={{ display: 'grid', gridTemplateColumns: GRID_COLS, gap: '12px', padding: '12px 16px', fontSize: '13px', color: C.dark, borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '700' }}>{merchant.name || <span style={{ color: C.muted, fontStyle: 'italic' }}>Sans nom</span>}</div>
                      <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{merchant.email || '—'}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: C.mid }}>
                      {merchant.city_code || <span style={{ fontStyle: 'italic' }}>—</span>}
                    </div>
                    <div style={{ fontSize: '12px' }}>
                      {SOURCE_LABELS[c.source] || c.source}
                      {c.created_by_admin && <div style={{ fontSize: '10px', color: C.muted, fontStyle: 'italic', marginTop: '2px' }}>par admin</div>}
                      {c.admin_note && <div style={{ fontSize: '10px', color: C.muted, marginTop: '2px' }}>« {c.admin_note} »</div>}
                    </div>
                    <div style={{ textAlign: 'center', fontWeight: '700', color: isActive ? C.red : C.muted }}>
                      {c.days_remaining}/{c.days_total}
                    </div>
                    <div style={{ fontSize: '12px', color: C.mid }}>
                      {formatDate(c.started_at)}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        background: isActive ? '#dcfce7' : '#e5e7eb',
                        color: isActive ? '#166534' : '#6b7280',
                        whiteSpace: 'nowrap'
                      }}>
                        {isActive ? 'Active' : 'Terminée'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>

      {grantOpen && (
        <GrantModal
          onClose={() => setGrantOpen(false)}
          onGrant={async (payload) => {
            try {
              await api('grant', payload)
              setGrantOpen(false)
              await loadAll(accessToken)
            } catch (e) {
              alert(e.message)
            }
          }}
          api={api}
        />
      )}
    </>
  )
}

// ─── Composants utilitaires ──────────────────────────────────

const selectStyle = {
  padding: '10px 12px',
  borderRadius: '8px',
  border: `1px solid ${C.border}`,
  fontSize: '14px',
  color: C.dark,
  outline: 'none',
  fontFamily: "'Be Vietnam Pro', sans-serif",
  background: C.white,
  cursor: 'pointer'
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: '16px', fontWeight: '700', color: C.dark, margin: '0 0 12px' }}>{children}</h2>
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px' }}>
      <div style={{ fontSize: '11px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: '900', color: color || C.dark }}>{value}</div>
    </div>
  )
}

function SettingsEditor({ settings, onUpdate }) {
  const get = key => settings.find(s => s.key === key)?.value

  const items = [
    {
      key: 'welcome_bonus_enabled',
      label: 'Bonus de bienvenue activé',
      hint: 'Si désactivé, les marchands ne peuvent plus s\'auto-activer.',
      type: 'bool'
    },
    {
      key: 'welcome_bonus_days',
      label: 'Jours offerts de bienvenue',
      hint: 'Nombre de jours offerts à l\'activation manuelle par le marchand.',
      type: 'int'
    },
    {
      key: 'monthly_recurring_enabled',
      label: 'Quota mensuel récurrent activé',
      hint: 'Si activé, chaque marchand reçoit X jours supplémentaires chaque mois (cron requis).',
      type: 'bool'
    },
    {
      key: 'monthly_recurring_days',
      label: 'Jours récurrents par mois',
      hint: 'Nombre de jours offerts chaque mois aux marchands actifs.',
      type: 'int'
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {items.map(item => (
        <SettingRow
          key={item.key}
          item={item}
          value={get(item.key)}
          onSave={value => onUpdate(item.key, value)}
        />
      ))}
    </div>
  )
}

function SettingRow({ item, value, onSave }) {
  const [local, setLocal] = useState(value || '')
  const [saving, setSaving] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  useEffect(() => { setLocal(value || '') }, [value])

  const dirty = String(local) !== String(value || '')

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(local)
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 1500)
    } catch (e) {}
    setSaving(false)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: C.bg, borderRadius: '8px', border: `1px solid ${C.border}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: '700', fontSize: '13px', color: C.dark }}>{item.label}</div>
        <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>{item.hint}</div>
      </div>
      <div style={{ flexShrink: 0 }}>
        {item.type === 'bool' ? (
          <select
            value={local}
            onChange={e => setLocal(e.target.value)}
            style={{ ...selectStyle, padding: '7px 10px', fontSize: '13px' }}
          >
            <option value="true">Activé</option>
            <option value="false">Désactivé</option>
          </select>
        ) : (
          <input
            type="number"
            value={local}
            onChange={e => setLocal(e.target.value)}
            style={{
              width: '90px',
              padding: '7px 10px',
              borderRadius: '8px',
              border: `1px solid ${C.border}`,
              fontSize: '13px',
              color: C.dark,
              outline: 'none',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              background: C.white,
              textAlign: 'center'
            }}
          />
        )}
      </div>
      <button
        onClick={handleSave}
        disabled={!dirty || saving}
        style={{
          padding: '7px 14px',
          borderRadius: '8px',
          background: savedFlash ? C.green : (dirty ? C.red : '#e5e7eb'),
          color: dirty || savedFlash ? C.white : C.muted,
          fontSize: '12px',
          fontWeight: '700',
          border: 'none',
          cursor: dirty && !saving ? 'pointer' : 'default',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          minWidth: '80px',
          transition: 'background .2s'
        }}
      >
        {saving ? '…' : savedFlash ? '✓ Enregistré' : 'Enregistrer'}
      </button>
    </div>
  )
}

// ─── Modal "Offrir des jours" ────────────────────────────────

function GrantModal({ onClose, onGrant, api }) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState(null)
  const [days, setDays] = useState('15')
  const [source, setSource] = useState('admin_grant')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Recherche initiale (les 20 premiers)
  useEffect(() => {
    doSearch('')
  }, [])

  async function doSearch(q) {
    setSearching(true)
    try {
      const r = await api('search_merchants', { q })
      setResults(r.merchants || [])
    } catch (e) {}
    setSearching(false)
  }

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => doSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  async function handleGrant() {
    if (!selected) { alert('Sélectionne un marchand'); return }
    const d = parseInt(days, 10)
    if (!Number.isFinite(d) || d <= 0) { alert('Nombre de jours invalide'); return }
    setSubmitting(true)
    await onGrant({
      merchant_id: selected.id,
      days: d,
      source,
      note: note.trim() || null
    })
    setSubmitting(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
      <div style={{ background: C.white, borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', fontFamily: "'Be Vietnam Pro', sans-serif" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', color: C.dark, margin: 0 }}>Offrir des jours de pub</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: C.mid, padding: 0, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: C.mid, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Marchand</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email…"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: `1px solid ${C.border}`,
              fontSize: '14px',
              color: C.dark,
              outline: 'none',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              boxSizing: 'border-box'
            }}
          />
          {searching && <div style={{ fontSize: '11px', color: C.mid, marginTop: '6px' }}>Recherche…</div>}
        </div>

        <div style={{ maxHeight: '180px', overflowY: 'auto', border: `1px solid ${C.border}`, borderRadius: '8px', marginBottom: '16px' }}>
          {results.length === 0 ? (
            <div style={{ padding: '12px', fontSize: '12px', color: C.mid, textAlign: 'center' }}>Aucun résultat</div>
          ) : results.map(m => (
            <div
              key={m.id}
              onClick={() => setSelected(m)}
              style={{
                padding: '10px 12px',
                borderBottom: `1px solid ${C.border}`,
                cursor: 'pointer',
                background: selected?.id === m.id ? '#fff0f2' : C.white,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '13px', color: C.dark }}>
                  {m.name || <span style={{ fontStyle: 'italic', color: C.muted }}>Sans nom</span>}
                </div>
                <div style={{ fontSize: '11px', color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.email || '—'} · {m.city_code || 'Pas de ville'}
                </div>
              </div>
              {!m.subscription_active && (
                <span style={{ fontSize: '10px', color: '#92400e', background: '#fef3c7', padding: '2px 8px', borderRadius: '20px', fontWeight: '700', flexShrink: 0 }}>Inactif</span>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: C.mid, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jours</label>
            <input
              type="number"
              value={days}
              onChange={e => setDays(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                fontSize: '14px',
                color: C.dark,
                outline: 'none',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: C.mid, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</label>
            <select
              value={source}
              onChange={e => setSource(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                fontSize: '14px',
                color: C.dark,
                outline: 'none',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                background: C.white,
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value="admin_grant">Geste commercial</option>
              <option value="addon">Add-on (offert)</option>
              <option value="welcome">Bonus de bienvenue (forcé)</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: C.mid, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Note (optionnel)</label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Compensation bug, promo Tết 2026, etc."
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: `1px solid ${C.border}`,
              fontSize: '14px',
              color: C.dark,
              outline: 'none',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              background: C.white,
              color: C.dark,
              fontSize: '13px',
              fontWeight: '700',
              border: `1px solid ${C.border}`,
              cursor: submitting ? 'wait' : 'pointer',
              fontFamily: "'Be Vietnam Pro', sans-serif"
            }}
          >Annuler</button>
          <button
            onClick={handleGrant}
            disabled={submitting || !selected}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              background: submitting || !selected ? C.muted : C.red,
              color: C.white,
              fontSize: '13px',
              fontWeight: '700',
              border: 'none',
              cursor: submitting || !selected ? 'wait' : 'pointer',
              fontFamily: "'Be Vietnam Pro', sans-serif"
            }}
          >{submitting ? 'Envoi…' : 'Offrir'}</button>
        </div>
      </div>
    </div>
  )
}
