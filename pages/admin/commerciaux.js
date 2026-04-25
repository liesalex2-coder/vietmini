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

export default function AdminCommerciaux() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [accessToken, setAccessToken] = useState(null)

  const [commerciaux, setCommerciaux] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')

  // Form inline (création + édition)
  const [formOpen, setFormOpen] = useState(false)
  const [formEditId, setFormEditId] = useState(null)
  const [formNom, setFormNom] = useState('')
  const [formTel, setFormTel] = useState('')
  const [formSaving, setFormSaving] = useState(false)

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
    loadCommerciaux(session.access_token)
  }

  async function loadCommerciaux(token) {
    setListLoading(true)
    try {
      const res = await fetch('/api/admin/commerciaux', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list', access_token: token })
      })
      const data = await res.json()
      if (res.ok) setCommerciaux(data.commerciaux || [])
      else setError(data.error || 'Erreur chargement')
    } catch (e) {
      setError('Erreur de connexion')
    }
    setListLoading(false)
  }

  function openCreate() {
    setFormEditId(null)
    setFormNom('')
    setFormTel('')
    setFormOpen(true)
  }

  function openEdit(c) {
    setFormEditId(c.id)
    setFormNom(c.nom)
    setFormTel(c.telephone || '')
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setFormEditId(null)
    setFormNom('')
    setFormTel('')
  }

  async function handleSave() {
    if (!formNom.trim()) { alert('Le nom est requis'); return }
    setFormSaving(true)
    try {
      const body = formEditId
        ? { action: 'update', access_token: accessToken, commercial_id: formEditId, nom: formNom, telephone: formTel }
        : { action: 'create', access_token: accessToken, nom: formNom, telephone: formTel }

      const res = await fetch('/api/admin/commerciaux', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Erreur'); setFormSaving(false); return }
      closeForm()
      await loadCommerciaux(accessToken)
    } catch (e) {
      alert('Erreur de connexion')
    }
    setFormSaving(false)
  }

  async function handleToggleActif(c) {
    const newState = !c.actif
    if (!window.confirm(`${newState ? 'Réactiver' : 'Désactiver'} "${c.nom}" ?`)) return

    setBusyId(c.id)
    try {
      const res = await fetch('/api/admin/commerciaux', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_active',
          access_token: accessToken,
          commercial_id: c.id,
          actif: newState
        })
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Erreur'); setBusyId(null); return }
      await loadCommerciaux(accessToken)
    } catch (e) {
      alert('Erreur de connexion')
    }
    setBusyId(null)
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
        <title>Admin — Commerciaux</title>
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
            <Link href="/admin/commerciaux" style={{ fontSize: '13px', color: C.red, textDecoration: 'none', fontWeight: '700' }}>Commerciaux</Link>
            <Link href="/dashboard" style={{ fontSize: '13px', color: C.mid, textDecoration: 'none' }}>← Dashboard</Link>
          </div>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px 80px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '900', color: C.dark, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Commerciaux</h1>
              <p style={{ fontSize: '14px', color: C.mid, margin: 0 }}>Équipe terrain qui signe les marchands.</p>
            </div>
            {!formOpen && (
              <button
                onClick={openCreate}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: C.red,
                  color: C.white,
                  fontSize: '13px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  whiteSpace: 'nowrap'
                }}
              >+ Ajouter</button>
            )}
          </div>

          {/* Formulaire inline */}
          {formOpen && (
            <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: C.dark, marginBottom: '14px' }}>
                {formEditId ? 'Modifier le commercial' : 'Nouveau commercial'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Nom *</label>
                  <input
                    type="text"
                    value={formNom}
                    onChange={e => setFormNom(e.target.value)}
                    placeholder="Nguyễn Văn A"
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
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Téléphone</label>
                  <input
                    type="text"
                    value={formTel}
                    onChange={e => setFormTel(e.target.value)}
                    placeholder="0901234567"
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
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  onClick={closeForm}
                  disabled={formSaving}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: C.white,
                    color: C.dark,
                    fontSize: '13px',
                    fontWeight: '700',
                    border: `1px solid ${C.border}`,
                    cursor: formSaving ? 'wait' : 'pointer',
                    fontFamily: "'Be Vietnam Pro', sans-serif"
                  }}
                >Annuler</button>
                <button
                  onClick={handleSave}
                  disabled={formSaving}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: formSaving ? C.muted : C.red,
                    color: C.white,
                    fontSize: '13px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: formSaving ? 'wait' : 'pointer',
                    fontFamily: "'Be Vietnam Pro', sans-serif"
                  }}
                >{formSaving ? 'Enregistrement…' : 'Enregistrer'}</button>
              </div>
            </div>
          )}

          {error && <p style={{ fontSize: '13px', color: C.red, marginBottom: '16px' }}>{error}</p>}

          {/* Liste */}
          {listLoading ? (
            <p style={{ fontSize: '13px', color: C.mid }}>Chargement…</p>
          ) : commerciaux.length === 0 ? (
            <p style={{ fontSize: '13px', color: C.mid, textAlign: 'center', padding: '40px 0' }}>
              Aucun commercial enregistré.
            </p>
          ) : (
            <div style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 1.4fr 0.8fr 1.4fr', gap: '12px', padding: '12px 16px', background: C.bg, fontSize: '11px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${C.border}` }}>
                <div>Nom</div>
                <div>Téléphone</div>
                <div style={{ textAlign: 'center' }}>Marchands signés</div>
                <div style={{ textAlign: 'center' }}>Statut</div>
                <div style={{ textAlign: 'right' }}>Actions</div>
              </div>
              {commerciaux.map(c => {
                const isBusy = busyId === c.id
                return (
                  <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 1.4fr 0.8fr 1.4fr', gap: '12px', padding: '12px 16px', fontSize: '13px', color: C.dark, borderBottom: `1px solid ${C.border}`, alignItems: 'center', opacity: c.actif ? 1 : 0.55 }}>
                    <div style={{ fontWeight: '700' }}>{c.nom}</div>
                    <div style={{ fontSize: '12px', color: C.mid }}>{c.telephone || '—'}</div>
                    <div style={{ textAlign: 'center' }}>
                      {c.nb_marchands > 0 ? (
                        <Link
                          href={`/admin/merchants?commercial=${c.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            background: C.bg,
                            color: C.dark,
                            fontSize: '13px',
                            fontWeight: '700',
                            textDecoration: 'none',
                            border: `1px solid ${C.border}`
                          }}
                        >
                          {c.nb_marchands} marchand{c.nb_marchands > 1 ? 's' : ''} →
                        </Link>
                      ) : (
                        <span style={{ fontSize: '13px', color: C.muted }}>0 marchand</span>
                      )}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        background: c.actif ? '#dcfce7' : '#e5e7eb',
                        color: c.actif ? '#166534' : '#6b7280',
                        whiteSpace: 'nowrap'
                      }}>
                        {c.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => openEdit(c)}
                        disabled={isBusy || formOpen}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: `1px solid ${C.border}`,
                          background: C.white,
                          color: C.dark,
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: (isBusy || formOpen) ? 'not-allowed' : 'pointer',
                          fontFamily: "'Be Vietnam Pro', sans-serif",
                          whiteSpace: 'nowrap',
                          opacity: (isBusy || formOpen) ? 0.5 : 1
                        }}
                      >Modifier</button>
                      <button
                        onClick={() => handleToggleActif(c)}
                        disabled={isBusy}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: `1px solid ${C.border}`,
                          background: C.white,
                          color: c.actif ? C.red : C.green,
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: isBusy ? 'wait' : 'pointer',
                          fontFamily: "'Be Vietnam Pro', sans-serif",
                          whiteSpace: 'nowrap'
                        }}
                      >{c.actif ? 'Désactiver' : 'Réactiver'}</button>
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