import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabaseClient'

// ─── Constantes ───────────────────────────────────────────────
const C = {
  red: '#D0021B', gold: '#F5A623', cream: '#FDF6EE',
  dark: '#1A0A00', mid: '#7A4A2A', white: '#fff',
  border: '#e5d9ce', bg: '#f7f0e8'
}

const TABS = [
  { id: 'apercu',     icon: '📊', label: 'Aperçu' },
  { id: 'profil',     icon: '🏪', label: 'Ma page' },
  { id: 'services',   icon: '✂️',  label: 'Services' },
  { id: 'roue',       icon: '🎡', label: 'Roue' },
  { id: 'avis',       icon: '⭐', label: 'Avis' },
  { id: 'contacts',   icon: '👥', label: 'Contacts' },
  { id: 'diffusions', icon: '📢', label: 'Diffusions' },
]

// ─── Composants UI réutilisables ───────────────────────────────

function Card({ children, style }) {
  return (
    <div style={{ background: C.white, borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(26,10,0,0.06)', ...style }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: '18px', fontWeight: '700', color: C.dark, margin: '0 0 20px' }}>{children}</h2>
}

function Label({ children }) {
  return <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: C.mid, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{children}</label>
}

function Input({ value, onChange, placeholder, type = 'text', style }) {
  return (
    <input
      type={type}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '9px 12px', borderRadius: '8px',
        border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark,
        outline: 'none', boxSizing: 'border-box', background: C.white,
        fontFamily: "'Be Vietnam Pro', sans-serif", ...style
      }}
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', padding: '9px 12px', borderRadius: '8px',
        border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark,
        outline: 'none', boxSizing: 'border-box', resize: 'vertical',
        fontFamily: "'Be Vietnam Pro', sans-serif"
      }}
    />
  )
}

function Btn({ onClick, children, variant = 'primary', small, disabled, style }) {
  const base = {
    padding: small ? '7px 14px' : '10px 20px',
    borderRadius: '8px', fontWeight: '600',
    fontSize: small ? '13px' : '14px',
    border: 'none', cursor: disabled ? 'default' : 'pointer',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    transition: 'opacity .15s', ...style
  }
  const variants = {
    primary:  { background: C.red, color: C.white },
    secondary:{ background: C.bg, color: C.dark },
    danger:   { background: '#fff0f0', color: C.red },
    ghost:    { background: 'transparent', color: C.mid, border: `1px solid ${C.border}` },
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], opacity: disabled ? 0.5 : 1 }}>
      {children}
    </button>
  )
}

function Toast({ msg, ok }) {
  if (!msg) return null
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      background: ok ? '#f0fff4' : '#fff0f0',
      border: `1px solid ${ok ? '#a3d9b3' : '#ffcccc'}`,
      borderRadius: '10px', padding: '12px 18px',
      fontSize: '14px', color: ok ? '#1a6b3a' : C.red,
      fontWeight: '600', boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
      fontFamily: "'Be Vietnam Pro', sans-serif"
    }}>
      {ok ? '✓ ' : '✗ '}{msg}
    </div>
  )
}

function FieldGroup({ label, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

// ─── Section Aperçu ───────────────────────────────────────────
function SectionApercu({ merchant, contacts, broadcasts }) {
  const now = new Date()
  const thisMonth = contacts.filter(c => {
    const d = new Date(c.captured_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const stats = [
    { label: 'Contacts total', value: contacts.length, icon: '👥' },
    { label: 'Nouveaux ce mois', value: thisMonth, icon: '✨' },
    { label: 'Diffusions envoyées', value: broadcasts.length, icon: '📢' },
  ]

  return (
    <div>
      <SectionTitle>Vue d'ensemble</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {stats.map(s => (
          <Card key={s.label}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: C.dark }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: C.mid, marginTop: '4px' }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {merchant && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '12px',
              background: merchant.primary_color || C.red,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.white, fontWeight: '700', fontSize: '22px'
            }}>
              {(merchant.name || '?')[0]}
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', color: C.dark }}>{merchant.name || 'Mon établissement'}</div>
              <div style={{ fontSize: '13px', color: C.mid }}>{merchant.vertical || '—'}</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── Section Profil ───────────────────────────────────────────
function SectionProfil({ merchant, onSave, toast }) {
  const [form, setForm] = useState(merchant || {})
  useEffect(() => { setForm(merchant || {}) }, [merchant])

  const f = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  return (
    <div>
      <SectionTitle>Ma page</SectionTitle>
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FieldGroup label="Nom de l'établissement">
            <Input value={form.name} onChange={f('name')} placeholder="Bella Beauty Salon" />
          </FieldGroup>
          <FieldGroup label="Vertical / Type">
            <Input value={form.vertical} onChange={f('vertical')} placeholder="Salon de beauté" />
          </FieldGroup>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FieldGroup label="Téléphone / Zalo">
            <Input value={form.phone} onChange={f('phone')} placeholder="0901 234 567" />
          </FieldGroup>
          <FieldGroup label="Adresse">
            <Input value={form.address} onChange={f('address')} placeholder="123 Đường Lê Lợi, TP.HCM" />
          </FieldGroup>
        </div>

        <FieldGroup label="Horaires">
          <Input value={form.hours} onChange={f('hours')} placeholder="Lun–Sam : 8h–20h, Dim : 9h–18h" />
        </FieldGroup>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <FieldGroup label="Couleur principale">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="color" value={form.primary_color || '#D0021B'} onChange={f('primary_color')}
                style={{ width: '40px', height: '36px', borderRadius: '6px', border: `1px solid ${C.border}`, cursor: 'pointer', padding: '2px' }} />
              <Input value={form.primary_color || '#D0021B'} onChange={f('primary_color')} placeholder="#D0021B" style={{ flex: 1 }} />
            </div>
          </FieldGroup>
          <FieldGroup label="Couleur secondaire">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="color" value={form.secondary_color || '#F5A623'} onChange={f('secondary_color')}
                style={{ width: '40px', height: '36px', borderRadius: '6px', border: `1px solid ${C.border}`, cursor: 'pointer', padding: '2px' }} />
              <Input value={form.secondary_color || '#F5A623'} onChange={f('secondary_color')} placeholder="#F5A623" style={{ flex: 1 }} />
            </div>
          </FieldGroup>
        </div>

        <Btn onClick={() => onSave(form)}>Enregistrer les modifications</Btn>
      </Card>
    </div>
  )
}

// ─── Section Services ─────────────────────────────────────────
function SectionServices({ merchantId, toast }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', description: '', active: true })

  async function load() {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('display_order')
    setServices(data || [])
    setLoading(false)
  }

  useEffect(() => { if (merchantId) load() }, [merchantId])

  function openNew() { setForm({ name: '', price: '', description: '', active: true }); setEditing(null); setShowForm(true) }
  function openEdit(s) { setForm({ name: s.name, price: s.price, description: s.description, active: s.active }); setEditing(s.id); setShowForm(true) }

  async function save() {
    if (!form.name) { toast('Nom requis', false); return }
    if (editing) {
      await supabase.from('services').update({ ...form, price: parseInt(form.price) || 0 }).eq('id', editing)
    } else {
      await supabase.from('services').insert({ ...form, price: parseInt(form.price) || 0, merchant_id: merchantId, display_order: services.length })
    }
    setShowForm(false); load(); toast('Service enregistré', true)
  }

  async function remove(id) {
    if (!confirm('Supprimer ce service ?')) return
    await supabase.from('services').delete().eq('id', id)
    load(); toast('Service supprimé', true)
  }

  async function toggleActive(s) {
    await supabase.from('services').update({ active: !s.active }).eq('id', s.id)
    load()
  }

  const f = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <SectionTitle>Services</SectionTitle>
        <Btn onClick={openNew}>+ Ajouter</Btn>
      </div>

      {showForm && (
        <Card style={{ marginBottom: '16px', border: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: '700', color: C.dark, marginBottom: '16px' }}>
            {editing ? 'Modifier le service' : 'Nouveau service'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Nom">
              <Input value={form.name} onChange={f('name')} placeholder="Coupe femme" />
            </FieldGroup>
            <FieldGroup label="Prix (₫)">
              <Input value={form.price} onChange={f('price')} placeholder="150000" type="number" />
            </FieldGroup>
          </div>
          <FieldGroup label="Description">
            <Textarea value={form.description} onChange={f('description')} placeholder="Description courte…" rows={2} />
          </FieldGroup>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Btn onClick={save}>Enregistrer</Btn>
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Annuler</Btn>
          </div>
        </Card>
      )}

      {loading ? (
        <div style={{ color: C.mid, fontSize: '14px' }}>Chargement…</div>
      ) : services.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✂️</div>
          <div>Aucun service. Cliquez sur "+ Ajouter" pour commencer.</div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {services.map(s => (
            <Card key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: C.dark, fontSize: '14px' }}>{s.name}</div>
                {s.description && <div style={{ fontSize: '12px', color: C.mid, marginTop: '2px' }}>{s.description}</div>}
              </div>
              <div style={{ fontWeight: '700', color: C.dark, fontSize: '14px', whiteSpace: 'nowrap' }}>
                {s.price ? s.price.toLocaleString('vi-VN') + ' ₫' : '—'}
              </div>
              <div style={{
                padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                background: s.active ? '#f0fff4' : '#f5f5f5',
                color: s.active ? '#1a6b3a' : C.mid,
                cursor: 'pointer', userSelect: 'none'
              }} onClick={() => toggleActive(s)}>
                {s.active ? 'Actif' : 'Masqué'}
              </div>
              <Btn variant="ghost" small onClick={() => openEdit(s)}>✏️</Btn>
              <Btn variant="danger" small onClick={() => remove(s.id)}>🗑</Btn>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Section Roue ─────────────────────────────────────────────
function SectionRoue({ merchantId, toast }) {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('wheel_config').select('*').eq('merchant_id', merchantId).single()
    setConfig(data)
    setLoading(false)
  }

  useEffect(() => { if (merchantId) load() }, [merchantId])

  async function toggleEnabled() {
    const updated = { ...config, enabled: !config.enabled }
    await supabase.from('wheel_config').update({ enabled: updated.enabled }).eq('id', config.id)
    setConfig(updated)
    toast(updated.enabled ? 'Roue activée' : 'Roue désactivée', true)
  }

  async function updatePrize(index, field, value) {
    const prizes = [...(config.prizes || [])]
    prizes[index] = { ...prizes[index], [field]: value }
    const updated = { ...config, prizes }
    setConfig(updated)
    await supabase.from('wheel_config').update({ prizes }).eq('id', config.id)
  }

  async function addPrize() {
    const prizes = [...(config.prizes || []), { label: 'Nouveau lot', color: C.red }]
    const updated = { ...config, prizes }
    setConfig(updated)
    await supabase.from('wheel_config').update({ prizes }).eq('id', config.id)
  }

  async function removePrize(index) {
    const prizes = config.prizes.filter((_, i) => i !== index)
    const updated = { ...config, prizes }
    setConfig(updated)
    await supabase.from('wheel_config').update({ prizes }).eq('id', config.id)
    toast('Lot supprimé', true)
  }

  if (loading) return <div style={{ color: C.mid }}>Chargement…</div>
  if (!config) return <div style={{ color: C.mid }}>Configuration introuvable.</div>

  return (
    <div>
      <SectionTitle>Roue de la chance</SectionTitle>
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: C.dark }}>Vòng Quay May Mắn</div>
            <div style={{ fontSize: '13px', color: C.mid, marginTop: '3px' }}>
              Affichée sur la page d'accueil de votre Mini App
            </div>
          </div>
          <div
            onClick={toggleEnabled}
            style={{
              width: '52px', height: '28px', borderRadius: '14px',
              background: config.enabled ? C.red : '#ccc',
              position: 'relative', cursor: 'pointer', transition: 'background .2s'
            }}
          >
            <div style={{
              position: 'absolute', top: '3px',
              left: config.enabled ? '27px' : '3px',
              width: '22px', height: '22px', borderRadius: '50%',
              background: C.white, transition: 'left .2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontWeight: '700', color: C.dark }}>Lots ({(config.prizes || []).length})</div>
          <Btn small onClick={addPrize}>+ Ajouter un lot</Btn>
        </div>

        {(config.prizes || []).map((prize, i) => (
          <div key={i} style={{
            display: 'flex', gap: '10px', alignItems: 'center',
            padding: '8px 0', borderBottom: `1px solid ${C.border}`
          }}>
            <input
              type="color"
              value={prize.color || C.red}
              onChange={e => updatePrize(i, 'color', e.target.value)}
              style={{ width: '32px', height: '32px', borderRadius: '6px', border: `1px solid ${C.border}`, cursor: 'pointer', padding: '2px', flexShrink: 0 }}
            />
            <input
              type="text"
              value={prize.label || ''}
              onChange={e => updatePrize(i, 'label', e.target.value)}
              style={{
                flex: 1, padding: '7px 10px', borderRadius: '7px',
                border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark,
                outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif"
              }}
            />
            <Btn variant="danger" small onClick={() => removePrize(i)}>🗑</Btn>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Section Avis ─────────────────────────────────────────────
function SectionAvis({ merchantId, toast }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ author_name: '', content: '', rating: 5, visible: true })

  async function load() {
    const { data } = await supabase.from('reviews').select('*').eq('merchant_id', merchantId).order('created_at', { ascending: false })
    setReviews(data || [])
    setLoading(false)
  }

  useEffect(() => { if (merchantId) load() }, [merchantId])

  async function save() {
    if (!form.author_name) { toast('Nom requis', false); return }
    await supabase.from('reviews').insert({ ...form, merchant_id: merchantId })
    setShowForm(false)
    setForm({ author_name: '', content: '', rating: 5, visible: true })
    load(); toast('Avis ajouté', true)
  }

  async function toggleVisible(r) {
    await supabase.from('reviews').update({ visible: !r.visible }).eq('id', r.id)
    load()
  }

  async function remove(id) {
    if (!confirm('Supprimer cet avis ?')) return
    await supabase.from('reviews').delete().eq('id', id)
    load(); toast('Avis supprimé', true)
  }

  const f = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <SectionTitle>Avis clients</SectionTitle>
        <Btn onClick={() => setShowForm(v => !v)}>+ Ajouter</Btn>
      </div>

      {showForm && (
        <Card style={{ marginBottom: '16px', border: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: '700', color: C.dark, marginBottom: '16px' }}>Nouvel avis</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Nom du client">
              <Input value={form.author_name} onChange={f('author_name')} placeholder="Nguyễn Thị Lan" />
            </FieldGroup>
            <FieldGroup label="Note (1–5)">
              <Input value={form.rating} onChange={f('rating')} type="number" placeholder="5" style={{ width: '80px' }} />
            </FieldGroup>
          </div>
          <FieldGroup label="Commentaire">
            <Textarea value={form.content} onChange={f('content')} placeholder="Très bon service…" />
          </FieldGroup>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Btn onClick={save}>Enregistrer</Btn>
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Annuler</Btn>
          </div>
        </Card>
      )}

      {loading ? <div style={{ color: C.mid }}>Chargement…</div> : reviews.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
          <div>Aucun avis. Ajoutez les premiers témoignages clients.</div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {reviews.map(r => (
            <Card key={r.id} style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700', fontSize: '14px', color: C.dark }}>{r.author_name}</span>
                    <span style={{ fontSize: '13px', color: C.gold }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  {r.content && <div style={{ fontSize: '13px', color: C.mid }}>{r.content}</div>}
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                  <div
                    style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                      background: r.visible ? '#f0fff4' : '#f5f5f5',
                      color: r.visible ? '#1a6b3a' : C.mid,
                    }}
                    onClick={() => toggleVisible(r)}
                  >
                    {r.visible ? 'Visible' : 'Masqué'}
                  </div>
                  <Btn variant="danger" small onClick={() => remove(r.id)}>🗑</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Section Contacts ─────────────────────────────────────────
function SectionContacts({ merchantId }) {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!merchantId) return
    supabase.from('contacts').select('*').eq('merchant_id', merchantId).order('captured_at', { ascending: false })
      .then(({ data }) => { setContacts(data || []); setLoading(false) })
  }, [merchantId])

  return (
    <div>
      <SectionTitle>Contacts Zalo ({contacts.length})</SectionTitle>
      {loading ? <div style={{ color: C.mid }}>Chargement…</div> : contacts.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
          <div>Aucun contact pour l'instant.</div>
          <div style={{ fontSize: '12px', marginTop: '6px' }}>Les contacts apparaissent ici dès qu'un client ouvre votre Mini App.</div>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {['Nom', 'Téléphone', 'Zalo ID', 'Capturé le'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600', color: C.mid }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr key={c.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : C.cream }}>
                  <td style={{ padding: '10px 16px', color: C.dark, fontWeight: '500' }}>{c.display_name || '—'}</td>
                  <td style={{ padding: '10px 16px', color: C.mid }}>{c.phone || '—'}</td>
                  <td style={{ padding: '10px 16px', color: C.mid, fontFamily: 'monospace', fontSize: '11px' }}>{c.zalo_id || '—'}</td>
                  <td style={{ padding: '10px 16px', color: C.mid }}>{new Date(c.captured_at).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}

// ─── Section Diffusions ───────────────────────────────────────
function SectionDiffusions({ merchantId, contactCount, toast }) {
  const [broadcasts, setBroadcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  async function load() {
    const { data } = await supabase.from('broadcasts').select('*').eq('merchant_id', merchantId).order('sent_at', { ascending: false })
    setBroadcasts(data || [])
    setLoading(false)
  }

  useEffect(() => { if (merchantId) load() }, [merchantId])

  async function send() {
    if (!message.trim()) { toast('Message vide', false); return }
    setSending(true)
    // Enregistrement de la diffusion (l'envoi réel ZNS se fait côté Zalo)
    await supabase.from('broadcasts').insert({
      merchant_id: merchantId,
      message: message.trim(),
      recipient_count: contactCount,
      status: 'sent'
    })
    setMessage('')
    setSending(false)
    load()
    toast('Diffusion enregistrée', true)
  }

  return (
    <div>
      <SectionTitle>Diffusions ZNS</SectionTitle>

      <Card style={{ marginBottom: '20px' }}>
        <div style={{ fontWeight: '700', color: C.dark, marginBottom: '12px' }}>
          Nouvelle diffusion
          <span style={{ fontSize: '12px', fontWeight: '400', color: C.mid, marginLeft: '8px' }}>
            {contactCount} contact{contactCount > 1 ? 's' : ''} dans votre liste
          </span>
        </div>
        <Textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Écrivez votre message promotionnel ici…"
          rows={4}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <div style={{ fontSize: '12px', color: C.mid }}>
            {message.length}/500 caractères
          </div>
          <Btn onClick={send} disabled={sending || !message.trim()}>
            {sending ? 'Envoi…' : '📢 Envoyer'}
          </Btn>
        </div>
      </Card>

      <div style={{ fontWeight: '700', color: C.dark, marginBottom: '12px' }}>Historique</div>
      {loading ? <div style={{ color: C.mid }}>Chargement…</div> : broadcasts.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
          <div>Aucune diffusion envoyée.</div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {broadcasts.map(b => (
            <Card key={b.id} style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, fontSize: '14px', color: C.dark }}>{b.message}</div>
                <div style={{ flexShrink: 0, textAlign: 'right', marginLeft: '16px' }}>
                  <div style={{ fontSize: '12px', color: C.mid }}>{new Date(b.sent_at).toLocaleDateString('fr-FR')}</div>
                  <div style={{ fontSize: '11px', color: C.mid, marginTop: '2px' }}>{b.recipient_count} destinataire{b.recipient_count > 1 ? 's' : ''}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Dashboard principal ──────────────────────────────────────
export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [merchant, setMerchant] = useState(null)
  const [contacts, setContacts] = useState([])
  const [broadcasts, setBroadcasts] = useState([])
  const [activeTab, setActiveTab] = useState('apercu')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState({ msg: '', ok: true })

  function showToast(msg, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast({ msg: '', ok: true }), 3000)
  }

  // Auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      loadData(session.user.id)
    })
  }, [])

  async function loadData(userId) {
    const { data: m } = await supabase.from('merchants').select('*').eq('user_id', userId).single()
    setMerchant(m)
    if (m) {
      const { data: c } = await supabase.from('contacts').select('*').eq('merchant_id', m.id)
      const { data: b } = await supabase.from('broadcasts').select('*').eq('merchant_id', m.id)
      setContacts(c || [])
      setBroadcasts(b || [])
    }
  }

  async function saveMerchant(form) {
    const { error } = await supabase.from('merchants').update(form).eq('id', merchant.id)
    if (error) { showToast('Erreur lors de la sauvegarde', false); return }
    setMerchant({ ...merchant, ...form })
    showToast('Profil enregistré', true)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user || !merchant) {
    return (
      <div style={{ minHeight: '100vh', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        <div style={{ textAlign: 'center', color: C.mid }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <div>Chargement…</div>
        </div>
      </div>
    )
  }

  function navTo(id) { setActiveTab(id); setSidebarOpen(false) }

  return (
    <>
      <Head>
        <title>Dashboard — VietMini</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: "'Be Vietnam Pro', sans-serif" }}>

        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
          />
        )}

        {/* Sidebar */}
        <aside style={{
          width: '220px', background: C.dark, display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, left: sidebarOpen ? 0 : '-220px',
          height: '100vh', zIndex: 50, transition: 'left .25s ease',
          // desktop
          ...(typeof window !== 'undefined' && window.innerWidth >= 860 ? { left: 0 } : {})
        }}
          className="sidebar"
        >
          {/* Logo */}
          <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px', height: '34px', background: C.red, borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.white, fontWeight: '700', fontSize: '17px'
              }}>V</div>
              <span style={{ color: C.white, fontWeight: '700', fontSize: '16px' }}>VietMini</span>
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', paddingLeft: '44px' }}>
              {merchant.name || 'Mon établissement'}
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => navTo(t.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 20px', background: activeTab === t.id ? 'rgba(208,2,27,0.25)' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  borderLeft: activeTab === t.id ? `3px solid ${C.red}` : '3px solid transparent',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  transition: 'background .15s'
                }}
              >
                <span style={{ fontSize: '16px', width: '22px', textAlign: 'center' }}>{t.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: activeTab === t.id ? '600' : '400', color: activeTab === t.id ? C.white : 'rgba(255,255,255,0.6)' }}>
                  {t.label}
                </span>
              </button>
            ))}
          </nav>

          {/* User + logout */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
            <button
              onClick={logout}
              style={{
                width: '100%', padding: '8px', borderRadius: '7px',
                background: 'rgba(255,255,255,0.08)', border: 'none',
                color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: 'pointer',
                fontFamily: "'Be Vietnam Pro', sans-serif"
              }}
            >
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, marginLeft: '0', minHeight: '100vh' }} className="main-content">
          {/* Top bar mobile */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 30,
            background: C.white, borderBottom: `1px solid ${C.border}`,
            padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }} className="topbar">
            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '20px', color: C.dark, padding: '0'
              }}
              className="hamburger"
            >
              ☰
            </button>
            <div style={{ fontWeight: '700', color: C.dark, fontSize: '15px' }}>
              {TABS.find(t => t.id === activeTab)?.label}
            </div>
            <div style={{ width: '24px' }} />
          </div>

          {/* Content */}
          <div style={{ padding: '28px 24px', maxWidth: '800px' }}>
            {activeTab === 'apercu' && <SectionApercu merchant={merchant} contacts={contacts} broadcasts={broadcasts} />}
            {activeTab === 'profil' && <SectionProfil merchant={merchant} onSave={saveMerchant} toast={showToast} />}
            {activeTab === 'services' && <SectionServices merchantId={merchant.id} toast={showToast} />}
            {activeTab === 'roue' && <SectionRoue merchantId={merchant.id} toast={showToast} />}
            {activeTab === 'avis' && <SectionAvis merchantId={merchant.id} toast={showToast} />}
            {activeTab === 'contacts' && <SectionContacts merchantId={merchant.id} />}
            {activeTab === 'diffusions' && <SectionDiffusions merchantId={merchant.id} contactCount={contacts.length} toast={showToast} />}
          </div>
        </main>
      </div>

      <Toast msg={toast.msg} ok={toast.ok} />

      <style>{`
        @media (min-width: 860px) {
          .sidebar { left: 0 !important; }
          .main-content { margin-left: 220px !important; }
          .topbar { display: none !important; }
        }
      `}</style>
    </>
  )
}
