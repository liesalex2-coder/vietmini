import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabaseClient'

const C = {
  red: '#D0021B', gold: '#F5A623', cream: '#FDF6EE',
  dark: '#1A0A00', mid: '#7A4A2A', white: '#fff',
  border: '#e5d9ce', bg: '#f7f0e8'
}

const TABS = [
  { id: 'apercu',     icon: '📊', label: 'Aperçu' },
  { id: 'profil',     icon: '🏪', label: 'Ma page' },
  { id: 'marketing',  icon: '🎯', label: 'Marketing' },
  { id: 'avis',       icon: '⭐', label: 'Avis' },
  { id: 'contacts',   icon: '👥', label: 'Contacts' },
  { id: 'diffusions', icon: '📢', label: 'Diffusions' },
]

const MARKETING_TABS = [
  { id: 'roue',       label: '🎡 Roue' },
  { id: 'flash',      label: '⚡ Flash sale' },
  { id: 'fidelite',   label: '⭐ Fidélité' },
  { id: 'parrainage', label: '🤝 Parrainage' },
  { id: 'coupons',    label: '🎟 Coupons' },
  { id: 'bienvenue',  label: '🎁 Bienvenue' },
]

// ─── UI primitives ────────────────────────────────────────────
function Card({ children, style }) {
  return <div style={{ background: C.white, borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(26,10,0,0.06)', ...style }}>{children}</div>
}
function SectionTitle({ children }) {
  return <h2 style={{ fontSize: '18px', fontWeight: '700', color: C.dark, margin: '0 0 20px' }}>{children}</h2>
}
function Label({ children }) {
  return <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: C.mid, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{children}</label>
}
function Input({ value, onChange, placeholder, type = 'text', style }) {
  return <input type={type} value={value ?? ''} onChange={onChange} placeholder={placeholder} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark, outline: 'none', boxSizing: 'border-box', background: C.white, fontFamily: "'Be Vietnam Pro', sans-serif", ...style }} />
}
function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return <textarea value={value ?? ''} onChange={onChange} placeholder={placeholder} rows={rows} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark, outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
}
function Btn({ onClick, children, variant = 'primary', small, disabled, style }) {
  const base = { padding: small ? '7px 14px' : '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: small ? '13px' : '14px', border: 'none', cursor: disabled ? 'default' : 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif", ...style }
  const variants = { primary: { background: C.red, color: C.white }, secondary: { background: C.bg, color: C.dark }, danger: { background: '#fff0f0', color: C.red }, ghost: { background: 'transparent', color: C.mid, border: `1px solid ${C.border}` } }
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], opacity: disabled ? 0.5 : 1 }}>{children}</button>
}
function Toggle({ enabled, onToggle }) {
  return <div onClick={onToggle} style={{ width: '52px', height: '28px', borderRadius: '14px', background: enabled ? C.red : '#ccc', position: 'relative', cursor: 'pointer', transition: 'background .2s', flexShrink: 0 }}><div style={{ position: 'absolute', top: '3px', left: enabled ? '27px' : '3px', width: '22px', height: '22px', borderRadius: '50%', background: C.white, transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} /></div>
}
function Toast({ msg, ok }) {
  if (!msg) return null
  return <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, background: ok ? '#f0fff4' : '#fff0f0', border: `1px solid ${ok ? '#a3d9b3' : '#ffcccc'}`, borderRadius: '10px', padding: '12px 18px', fontSize: '14px', color: ok ? '#1a6b3a' : C.red, fontWeight: '600', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{ok ? '✓ ' : '✗ '}{msg}</div>
}
function FieldGroup({ label, children }) {
  return <div style={{ marginBottom: '16px' }}><Label>{label}</Label>{children}</div>
}
function FeatureHeader({ title, subtitle, enabled, onToggle }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div><div style={{ fontWeight: '700', fontSize: '15px', color: C.dark }}>{title}</div>{subtitle && <div style={{ fontSize: '13px', color: C.mid, marginTop: '3px' }}>{subtitle}</div>}</div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  )
}

// ─── Marketing sub-tabs nav ───────────────────────────────────
function MarketingNav({ active, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
      {MARKETING_TABS.map(t => (
        <button key={t.id} onClick={() => onSelect(t.id)} style={{ padding: '7px 14px', borderRadius: '20px', border: `1px solid ${active === t.id ? C.red : C.border}`, background: active === t.id ? '#fff0f2' : C.white, color: active === t.id ? C.red : C.mid, fontWeight: active === t.id ? '700' : '400', fontSize: '12px', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ─── Section Aperçu ───────────────────────────────────────────
function SectionApercu({ merchant, contacts, broadcasts, onChangeVertical }) {
  const now = new Date()
  const thisMonth = contacts.filter(c => { const d = new Date(c.captured_at); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() }).length
  return (
    <div>
      <SectionTitle>Vue d'ensemble</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[{ label: 'Contacts total', value: contacts.length, icon: '👥' }, { label: 'Nouveaux ce mois', value: thisMonth, icon: '✨' }, { label: 'Diffusions envoyées', value: broadcasts.length, icon: '📢' }].map(s => (
          <Card key={s.label}><div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div><div style={{ fontSize: '32px', fontWeight: '700', color: C.dark }}>{s.value}</div><div style={{ fontSize: '13px', color: C.mid, marginTop: '4px' }}>{s.label}</div></Card>
        ))}
      </div>
      {merchant && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: merchant.primary_color || C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: '700', fontSize: '22px' }}>{(merchant.name || '?')[0]}</div>
              <div><div style={{ fontWeight: '700', fontSize: '16px', color: C.dark }}>{merchant.name || 'Mon établissement'}</div><div style={{ fontSize: '13px', color: C.mid }}>{merchant.vertical || '—'}</div></div>
            </div>
            <Btn variant="ghost" small onClick={onChangeVertical}>Changer d'activité →</Btn>
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── Section Profil ───────────────────────────────────────────
const PROFIL_TABS = [
  { id: 'infos',    label: '📋 Infos' },
  { id: 'hero',     label: '🖼 Photo d\'accueil' },
  { id: 'services', label: '✂️ Services' },
]

function ProfilNav({ active, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
      {PROFIL_TABS.map(t => (
        <button key={t.id} onClick={() => onSelect(t.id)} style={{ padding: '7px 16px', borderRadius: '20px', border: `1px solid ${active === t.id ? C.red : C.border}`, background: active === t.id ? '#fff0f2' : C.white, color: active === t.id ? C.red : C.mid, fontWeight: active === t.id ? '700' : '400', fontSize: '13px', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

function SubInfos({ merchant, onSave }) {
  const [form, setForm] = useState(merchant || {})
  useEffect(() => { setForm(merchant || {}) }, [merchant])
  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))
  return (
    <Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FieldGroup label="Nom"><Input value={form.name} onChange={f('name')} placeholder="Bella Beauty Salon" /></FieldGroup>
        <FieldGroup label="Type"><Input value={form.vertical} onChange={f('vertical')} placeholder="Salon de beauté" /></FieldGroup>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FieldGroup label="Téléphone"><Input value={form.phone} onChange={f('phone')} placeholder="0901 234 567" /></FieldGroup>
        <FieldGroup label="Adresse"><Input value={form.address} onChange={f('address')} placeholder="123 Đường Lê Lợi" /></FieldGroup>
      </div>
      <FieldGroup label="Horaires"><Input value={form.hours} onChange={f('hours')} placeholder="Lun–Sam : 8h–20h" /></FieldGroup>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <FieldGroup label="Couleur principale">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="color" value={form.primary_color || '#D0021B'} onChange={f('primary_color')} style={{ width: '40px', height: '36px', borderRadius: '6px', border: `1px solid ${C.border}`, cursor: 'pointer', padding: '2px' }} />
            <Input value={form.primary_color || '#D0021B'} onChange={f('primary_color')} style={{ flex: 1 }} />
          </div>
        </FieldGroup>
        <FieldGroup label="Couleur secondaire">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="color" value={form.secondary_color || '#F5A623'} onChange={f('secondary_color')} style={{ width: '40px', height: '36px', borderRadius: '6px', border: `1px solid ${C.border}`, cursor: 'pointer', padding: '2px' }} />
            <Input value={form.secondary_color || '#F5A623'} onChange={f('secondary_color')} style={{ flex: 1 }} />
          </div>
        </FieldGroup>
      </div>
      <Btn onClick={() => onSave(form)}>Enregistrer les modifications</Btn>
    </Card>
  )
}

function SubHero({ merchant, onSave }) {
  const fileRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(merchant?.hero_image || null)

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { alert('Fichier trop lourd (max 3 Mo)'); return }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const base64 = ev.target.result
      setPreview(base64)
      await onSave({ hero_image: base64 })
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Card>
      <div style={{ fontWeight: '700', fontSize: '15px', color: C.dark, marginBottom: '6px' }}>Photo d'accueil</div>
      <div style={{ fontSize: '13px', color: C.mid, marginBottom: '20px' }}>Cette photo s'affiche en bannière principale dans votre app. Format recommandé : 800×400px.</div>
      {preview ? (
        <div style={{ marginBottom: '16px' }}>
          <img src={preview} alt="Hero" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '10px', border: `1px solid ${C.border}` }} />
        </div>
      ) : (
        <div style={{ width: '100%', height: '160px', borderRadius: '10px', border: `2px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.mid, fontSize: '14px', marginBottom: '16px', cursor: 'pointer', background: C.bg }} onClick={() => fileRef.current.click()}>
          Cliquez pour uploader votre photo d'accueil
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      <Btn onClick={() => fileRef.current.click()} disabled={uploading}>{uploading ? 'Envoi…' : preview ? '🔄 Changer la photo' : '📷 Uploader une photo'}</Btn>
    </Card>
  )
}

function SectionProfil({ merchant, onSave, merchantId, toast }) {
  const [sub, setSub] = useState('infos')
  return (
    <div>
      <SectionTitle>Ma page</SectionTitle>
      <ProfilNav active={sub} onSelect={setSub} />
      {sub === 'infos'    && <SubInfos merchant={merchant} onSave={onSave} />}
      {sub === 'hero'     && <SubHero merchant={merchant} onSave={onSave} />}
      {sub === 'services' && <SectionServices merchantId={merchantId} toast={toast} />}
    </div>
  )
}

// ─── Section Services ─────────────────────────────────────────
function SectionServices({ merchantId, toast }) {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showCatForm, setShowCatForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '', image_base64: '', active: true })
  const [newCat, setNewCat] = useState('')

  async function load() {
    const { data: svcs } = await supabase.from('services').select('*').eq('merchant_id', merchantId).order('display_order')
    const { data: cats } = await supabase.from('service_categories').select('*').eq('merchant_id', merchantId).order('display_order')
    setServices(svcs || []); setCategories(cats || []); setLoading(false)
  }
  useEffect(() => { if (merchantId) load() }, [merchantId])

  function openNew() { setForm({ name: '', price: '', description: '', category: categories[0]?.name || '', image_base64: '', active: true }); setEditing(null); setShowForm(true) }
  function openEdit(s) { setForm({ name: s.name, price: s.price, description: s.description, category: s.category || '', image_base64: s.image_base64 || '', active: s.active }); setEditing(s.id); setShowForm(true) }

  async function save() {
    if (!form.name) { toast('Nom requis', false); return }
    if (editing) { await supabase.from('services').update({ ...form, price: parseInt(form.price) || 0 }).eq('id', editing) }
    else { await supabase.from('services').insert({ ...form, price: parseInt(form.price) || 0, merchant_id: merchantId, display_order: services.length }) }
    setShowForm(false); load(); toast('Service enregistré', true)
  }
  async function remove(id) { if (!confirm('Supprimer ?')) return; await supabase.from('services').delete().eq('id', id); load(); toast('Supprimé', true) }
  async function toggleActive(s) { await supabase.from('services').update({ active: !s.active }).eq('id', s.id); load() }

  async function addCategory() {
    if (!newCat.trim()) return
    await supabase.from('service_categories').insert({ merchant_id: merchantId, name: newCat.trim(), display_order: categories.length })
    setNewCat(''); setShowCatForm(false); load(); toast('Catégorie ajoutée', true)
  }
  async function removeCategory(id) {
    if (!confirm('Supprimer cette catégorie ?')) return
    await supabase.from('service_categories').delete().eq('id', id); load(); toast('Catégorie supprimée', true)
  }

  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))

  // Grouper les services par catégorie
  const uncategorized = services.filter(s => !s.category || s.category === '')
  const grouped = categories.map(cat => ({ cat, items: services.filter(s => s.category === cat.name) }))

  function ServiceRow({ s }) {
    return (
      <Card style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px' }}>
        {s.image_base64 ? (
          <img src={s.image_base64} alt={s.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
        ) : (
          <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>📷</div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', color: C.dark, fontSize: '14px' }}>{s.name}</div>
          {s.description && <div style={{ fontSize: '12px', color: C.mid, marginTop: '2px' }}>{s.description}</div>}
        </div>
        <div style={{ fontWeight: '700', color: C.dark, fontSize: '14px', whiteSpace: 'nowrap' }}>{s.price ? s.price.toLocaleString('vi-VN') + ' ₫' : '—'}</div>
        <div style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: s.active ? '#f0fff4' : '#f5f5f5', color: s.active ? '#1a6b3a' : C.mid, cursor: 'pointer' }} onClick={() => toggleActive(s)}>{s.active ? 'Actif' : 'Masqué'}</div>
        <Btn variant="ghost" small onClick={() => openEdit(s)}>✏️</Btn>
        <Btn variant="danger" small onClick={() => remove(s.id)}>🗑</Btn>
      </Card>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <SectionTitle>Services</SectionTitle>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Btn variant="ghost" small onClick={() => setShowCatForm(v => !v)}>+ Catégorie</Btn>
          <Btn onClick={openNew}>+ Service</Btn>
        </div>
      </div>

      {/* Formulaire nouvelle catégorie */}
      {showCatForm && (
        <Card style={{ marginBottom: '16px', border: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: '700', color: C.dark, marginBottom: '12px' }}>Nouvelle catégorie</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Ex : Coiffure, Ongles, Soins…" style={{ flex: 1 }} />
            <Btn onClick={addCategory}>Ajouter</Btn>
            <Btn variant="ghost" onClick={() => setShowCatForm(false)}>Annuler</Btn>
          </div>
          {/* Liste des catégories existantes */}
          {categories.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', background: C.bg, fontSize: '13px', color: C.dark }}>
                  {cat.name}
                  <span onClick={() => removeCategory(cat.id)} style={{ cursor: 'pointer', color: C.mid, fontSize: '12px' }}>✕</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Formulaire nouveau/modifier service */}
      {showForm && (
        <Card style={{ marginBottom: '16px', border: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: '700', color: C.dark, marginBottom: '16px' }}>{editing ? 'Modifier' : 'Nouveau service'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Nom"><Input value={form.name} onChange={f('name')} placeholder="Coupe femme" /></FieldGroup>
            <FieldGroup label="Prix (₫)"><Input value={form.price} onChange={f('price')} placeholder="150000" type="number" /></FieldGroup>
            <FieldGroup label="Catégorie">
              {categories.length > 0 ? (
                <select value={form.category} onChange={f('category')} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark, outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  <option value="">Sans catégorie</option>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              ) : (
                <div style={{ fontSize: '12px', color: C.mid, paddingTop: '10px' }}>Aucune catégorie — créez-en une d'abord</div>
              )}
            </FieldGroup>
          </div>
          <FieldGroup label="Description"><Textarea value={form.description} onChange={f('description')} placeholder="Description courte…" rows={2} /></FieldGroup>
          <FieldGroup label="Photo du service">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {form.image_base64 && <img src={form.image_base64} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${C.border}` }} />}
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, cursor: 'pointer', fontSize: '13px', color: C.mid, background: C.white }}>
                📷 {form.image_base64 ? 'Changer' : 'Ajouter une photo'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                  const file = e.target.files[0]; if (!file) return
                  const reader = new FileReader()
                  reader.onload = ev => setForm(p => ({ ...p, image_base64: ev.target.result }))
                  reader.readAsDataURL(file)
                }} />
              </label>
              {form.image_base64 && <span onClick={() => setForm(p => ({ ...p, image_base64: '' }))} style={{ fontSize: '12px', color: C.red, cursor: 'pointer' }}>Supprimer</span>}
            </div>
          </FieldGroup>
          <div style={{ display: 'flex', gap: '8px' }}><Btn onClick={save}>Enregistrer</Btn><Btn variant="ghost" onClick={() => setShowForm(false)}>Annuler</Btn></div>
        </Card>
      )}

      {loading ? <div style={{ color: C.mid }}>Chargement…</div> : services.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✂️</div>
          <div>Aucun service. Commencez par créer une catégorie puis ajoutez vos services.</div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Services par catégorie */}
          {grouped.map(({ cat, items }) => items.length > 0 && (
            <div key={cat.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', paddingLeft: '4px' }}>
                {cat.image_base64 ? (
                  <img src={cat.image_base64} alt={cat.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: `1px solid ${C.border}` }} />
                ) : (
                  <label style={{ width: '36px', height: '36px', borderRadius: '6px', border: `2px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', flexShrink: 0, background: C.bg }} title="Ajouter une photo de catégorie">
                    📷
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                      const file = e.target.files[0]; if (!file) return
                      const reader = new FileReader()
                      reader.onload = async ev => {
                        await supabase.from('service_categories').update({ image_base64: ev.target.result }).eq('id', cat.id)
                        load()
                      }
                      reader.readAsDataURL(file)
                    }} />
                  </label>
                )}
                <div style={{ fontSize: '13px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.name}</div>
                {cat.image_base64 && (
                  <label style={{ cursor: 'pointer', fontSize: '11px', color: C.mid }} title="Changer la photo">
                    ✏️
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                      const file = e.target.files[0]; if (!file) return
                      const reader = new FileReader()
                      reader.onload = async ev => {
                        await supabase.from('service_categories').update({ image_base64: ev.target.result }).eq('id', cat.id)
                        load()
                      }
                      reader.readAsDataURL(file)
                    }} />
                  </label>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {items.map(s => <ServiceRow key={s.id} s={s} />)}
              </div>
            </div>
          ))}
          {/* Services sans catégorie */}
          {uncategorized.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '4px' }}>
                Sans catégorie
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {uncategorized.map(s => <ServiceRow key={s.id} s={s} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Marketing : Roue ─────────────────────────────────────────
function SubRoue({ merchantId, toast }) {
  const [config, setConfig] = useState(null)
  async function load() { const { data } = await supabase.from('wheel_config').select('*').eq('merchant_id', merchantId).single(); setConfig(data) }
  useEffect(() => { if (merchantId) load() }, [merchantId])

  async function toggleEnabled() {
    const updated = { ...config, enabled: !config.enabled }
    await supabase.from('wheel_config').update({ enabled: updated.enabled }).eq('id', config.id)
    setConfig(updated); toast(updated.enabled ? 'Roue activée' : 'Roue désactivée', true)
  }
  async function updatePrize(i, field, value) {
    const prizes = [...(config.prizes || [])]; prizes[i] = { ...prizes[i], [field]: value }
    const updated = { ...config, prizes }; setConfig(updated)
    await supabase.from('wheel_config').update({ prizes }).eq('id', config.id)
  }
  async function addPrize() {
    const prizes = [...(config.prizes || []), { label: 'Nouveau lot', color: C.red }]
    setConfig({ ...config, prizes }); await supabase.from('wheel_config').update({ prizes }).eq('id', config.id)
  }
  async function removePrize(i) {
    const prizes = config.prizes.filter((_, j) => j !== i)
    setConfig({ ...config, prizes }); await supabase.from('wheel_config').update({ prizes }).eq('id', config.id); toast('Lot supprimé', true)
  }

  if (!config) return <div style={{ color: C.mid }}>Chargement…</div>
  return (
    <div>
      <Card style={{ marginBottom: '16px' }}>
        <FeatureHeader title="Vòng Quay May Mắn" subtitle="Affichée sur la page d'accueil de votre Mini App" enabled={config.enabled} onToggle={toggleEnabled} />
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontWeight: '700', color: C.dark }}>Lots ({(config.prizes || []).length})</div>
          <Btn small onClick={addPrize}>+ Ajouter</Btn>
        </div>
        {(config.prizes || []).map((prize, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
            <input type="color" value={prize.color || C.red} onChange={e => updatePrize(i, 'color', e.target.value)} style={{ width: '32px', height: '32px', borderRadius: '6px', border: `1px solid ${C.border}`, cursor: 'pointer', padding: '2px', flexShrink: 0 }} />
            <input type="text" value={prize.label || ''} onChange={e => updatePrize(i, 'label', e.target.value)} style={{ flex: 1, padding: '7px 10px', borderRadius: '7px', border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark, outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }} />
            <Btn variant="danger" small onClick={() => removePrize(i)}>🗑</Btn>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Marketing : Flash sale ───────────────────────────────────
function SubFlash({ merchantId, toast }) {
  const [data, setData] = useState(null)
  const [form, setForm] = useState({})
  async function load() {
    const { data: d } = await supabase.from('flash_sales').select('*').eq('merchant_id', merchantId).single()
    setData(d); setForm(d || {})
  }
  useEffect(() => { if (merchantId) load() }, [merchantId])

  async function toggleEnabled() {
    const updated = { ...data, enabled: !data.enabled }
    await supabase.from('flash_sales').update({ enabled: updated.enabled }).eq('id', data.id)
    setData(updated); setForm(updated); toast(updated.enabled ? 'Flash sale activée' : 'Flash sale désactivée', true)
  }
  async function save() {
    await supabase.from('flash_sales').update({ discount_value: parseInt(form.discount_value) || 0, service_name: form.service_name || '', start_time: form.start_time || null, end_time: form.end_time || null }).eq('id', data.id)
    load(); toast('Flash sale enregistrée', true)
  }
  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))

  if (!data) return <div style={{ color: C.mid }}>Chargement…</div>
  return (
    <Card>
      <FeatureHeader title="Flash Sale" subtitle="Promotion limitée dans le temps avec compte à rebours" enabled={data.enabled} onToggle={toggleEnabled} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <FieldGroup label="Réduction (%)"><Input value={form.discount_value} onChange={f('discount_value')} type="number" placeholder="20" /></FieldGroup>
        <FieldGroup label="Service concerné"><Input value={form.service_name} onChange={f('service_name')} placeholder="Tous les services" /></FieldGroup>
        <FieldGroup label="Début (date et heure)"><Input value={form.start_time ? form.start_time.slice(0, 16) : ''} onChange={f('start_time')} type="datetime-local" /></FieldGroup>
        <FieldGroup label="Fin (date et heure)"><Input value={form.end_time ? form.end_time.slice(0, 16) : ''} onChange={f('end_time')} type="datetime-local" /></FieldGroup>
      </div>
      <Btn onClick={save}>Enregistrer</Btn>
    </Card>
  )
}

// ─── Marketing : Fidélité ─────────────────────────────────────
function SubFidelite({ merchantId, toast }) {
  const [data, setData] = useState(null)
  const [form, setForm] = useState({})
  const [cards, setCards] = useState([])
  const [showPin, setShowPin] = useState(false)

  async function load() {
    const { data: d } = await supabase.from('loyalty_config').select('*').eq('merchant_id', merchantId).single()
    setData(d); setForm(d || {})
    const { data: c } = await supabase.from('loyalty_cards').select('*').eq('merchant_id', merchantId).order('visit_count', { ascending: false })
    setCards(c || [])
  }
  useEffect(() => { if (merchantId) load() }, [merchantId])

  async function toggleEnabled() {
    const updated = { ...data, enabled: !data.enabled }
    await supabase.from('loyalty_config').update({ enabled: updated.enabled }).eq('id', data.id)
    setData(updated); setForm(updated); toast(updated.enabled ? 'Carte fidélité activée' : 'Carte fidélité désactivée', true)
  }
  async function save() {
    const pin = (form.pin_code || '').replace(/\D/g, '').slice(0, 4)
    if (pin.length !== 4) { toast('Le code PIN doit faire 4 chiffres', false); return }
    await supabase.from('loyalty_config').update({
      visits_required: parseInt(form.visits_required) || 10,
      reward_text: form.reward_text || '',
      pin_code: pin
    }).eq('id', data.id)
    load(); toast('Carte fidélité enregistrée', true)
  }
  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))

  if (!data) return <div style={{ color: C.mid }}>Chargement…</div>

  const visitsRequired = parseInt(form.visits_required) || 10

  return (
    <div>
      <Card style={{ marginBottom: '16px' }}>
        <FeatureHeader title="Carte de fidélité" subtitle="Récompensez les clients après X visites" enabled={data.enabled} onToggle={toggleEnabled} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <FieldGroup label="Visites requises">
            <Input value={form.visits_required} onChange={f('visits_required')} type="number" placeholder="10" />
          </FieldGroup>
          <FieldGroup label="Récompense">
            <Input value={form.reward_text} onChange={f('reward_text')} placeholder="1 soin offert" />
          </FieldGroup>
          <FieldGroup label="Code PIN (4 chiffres)">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type={showPin ? 'text' : 'password'}
                value={form.pin_code || ''}
                onChange={f('pin_code')}
                maxLength={4}
                placeholder="0000"
                style={{ width: '80px', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '16px', color: C.dark, outline: 'none', fontFamily: 'monospace', letterSpacing: '0.2em', textAlign: 'center' }}
              />
              <button onClick={() => setShowPin(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: C.mid }}>
                {showPin ? '🙈' : '👁'}
              </button>
            </div>
          </FieldGroup>
        </div>
        {/* Aperçu carte */}
        <div style={{ margin: '16px 0', padding: '16px', background: C.bg, borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', color: C.mid, marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Aperçu</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {Array.from({ length: Math.min(10, visitsRequired) }).map((_, i) => (
              <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', border: `2px solid ${C.gold}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: C.gold }}>
                {i + 1}
              </div>
            ))}
          </div>
          {form.reward_text && <div style={{ fontSize: '12px', color: C.mid, marginTop: '8px' }}>Récompense : {form.reward_text}</div>}
        </div>
        <Btn onClick={save}>Enregistrer</Btn>
      </Card>

      {/* Liste clients */}
      <div style={{ fontWeight: '700', color: C.dark, marginBottom: '12px', fontSize: '15px' }}>
        Clients ({cards.length})
      </div>
      {cards.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎫</div>
          <div>Aucun client n'a encore utilisé sa carte.</div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {cards.map(card => {
            const pct = Math.min(100, Math.round((card.visit_count / visitsRequired) * 100))
            return (
              <Card key={card.id} style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: C.dark, fontSize: '14px' }}>{card.display_name || card.zalo_id}</div>
                    <div style={{ marginTop: '6px', height: '6px', borderRadius: '3px', background: C.bg, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? '#1a6b3a' : C.gold, borderRadius: '3px', transition: 'width .3s' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: pct >= 100 ? '#1a6b3a' : C.dark }}>
                      {card.visit_count} / {visitsRequired}
                    </div>
                    <div style={{ fontSize: '11px', color: C.mid, marginTop: '2px' }}>
                      {pct >= 100 ? '🎁 Récompense disponible' : `${visitsRequired - card.visit_count} visite${visitsRequired - card.visit_count > 1 ? 's' : ''} restante${visitsRequired - card.visit_count > 1 ? 's' : ''}`}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Marketing : Parrainage ───────────────────────────────────
function SubParrainage({ merchantId, toast }) {
  const [data, setData] = useState(null)
  const [form, setForm] = useState({})
  async function load() {
    const { data: d } = await supabase.from('referral_config').select('*').eq('merchant_id', merchantId).single()
    setData(d); setForm(d || {})
  }
  useEffect(() => { if (merchantId) load() }, [merchantId])

  async function toggleEnabled() {
    const updated = { ...data, enabled: !data.enabled }
    await supabase.from('referral_config').update({ enabled: updated.enabled }).eq('id', data.id)
    setData(updated); setForm(updated); toast(updated.enabled ? 'Parrainage activé' : 'Parrainage désactivé', true)
  }
  async function save() {
    await supabase.from('referral_config').update({ discount_referrer: parseInt(form.discount_referrer) || 0, discount_referred: parseInt(form.discount_referred) || 0, valid_days: parseInt(form.valid_days) || 30 }).eq('id', data.id)
    load(); toast('Parrainage enregistré', true)
  }
  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))

  if (!data) return <div style={{ color: C.mid }}>Chargement…</div>
  return (
    <Card>
      <FeatureHeader title="Parrainage" subtitle="Invite une amie via Zalo — vous gagnez toutes les deux" enabled={data.enabled} onToggle={toggleEnabled} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <FieldGroup label="Réduction marraine (%)"><Input value={form.discount_referrer} onChange={f('discount_referrer')} type="number" placeholder="15" /></FieldGroup>
        <FieldGroup label="Réduction filleule (%)"><Input value={form.discount_referred} onChange={f('discount_referred')} type="number" placeholder="15" /></FieldGroup>
        <FieldGroup label="Valide (jours)"><Input value={form.valid_days} onChange={f('valid_days')} type="number" placeholder="30" /></FieldGroup>
      </div>
      {/* Flow visuel */}
      <div style={{ margin: '16px 0', padding: '16px', background: C.bg, borderRadius: '10px', fontSize: '13px', color: C.mid }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ background: C.white, padding: '6px 12px', borderRadius: '8px', color: C.dark, fontWeight: '600' }}>👩 Marraine</span>
          <span>partage un lien Zalo →</span>
          <span style={{ background: C.white, padding: '6px 12px', borderRadius: '8px', color: C.dark, fontWeight: '600' }}>👩 Filleule</span>
          <span>ouvre la Mini App →</span>
          <span style={{ background: '#f0fff4', padding: '6px 12px', borderRadius: '8px', color: '#1a6b3a', fontWeight: '600' }}>Toutes les deux reçoivent −{form.discount_referrer || 15}%</span>
        </div>
      </div>
      <Btn onClick={save}>Enregistrer</Btn>
    </Card>
  )
}

// ─── Marketing : Coupons ─────────────────────────────────────
function SubCoupons({ merchantId, toast }) {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', discount_type: 'percent', discount_value: 10, valid_until: '', active: true })

  async function load() { const { data } = await supabase.from('coupons').select('*').eq('merchant_id', merchantId).order('created_at', { ascending: false }); setCoupons(data || []); setLoading(false) }
  useEffect(() => { if (merchantId) load() }, [merchantId])

  async function save() {
    if (!form.code) { toast('Code requis', false); return }
    await supabase.from('coupons').insert({ ...form, discount_value: parseInt(form.discount_value) || 0, merchant_id: merchantId, valid_until: form.valid_until || null })
    setShowForm(false); setForm({ code: '', discount_type: 'percent', discount_value: 10, valid_until: '', active: true }); load(); toast('Coupon créé', true)
  }
  async function toggleActive(c) { await supabase.from('coupons').update({ active: !c.active }).eq('id', c.id); load() }
  async function remove(id) { if (!confirm('Supprimer ?')) return; await supabase.from('coupons').delete().eq('id', id); load(); toast('Supprimé', true) }
  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontWeight: '700', fontSize: '15px', color: C.dark }}>Coupons de réduction</div>
        <Btn onClick={() => setShowForm(v => !v)}>+ Créer</Btn>
      </div>
      {showForm && (
        <Card style={{ marginBottom: '16px', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Code promo"><Input value={form.code} onChange={f('code')} placeholder="BIENVENUE10" /></FieldGroup>
            <FieldGroup label="Type">
              <select value={form.discount_type} onChange={f('discount_type')} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark, outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                <option value="percent">Pourcentage (%)</option>
                <option value="amount">Montant fixe (₫)</option>
              </select>
            </FieldGroup>
            <FieldGroup label="Réduction"><Input value={form.discount_value} onChange={f('discount_value')} type="number" /></FieldGroup>
            <FieldGroup label="Valide jusqu'au"><Input value={form.valid_until} onChange={f('valid_until')} type="date" /></FieldGroup>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}><Btn onClick={save}>Créer</Btn><Btn variant="ghost" onClick={() => setShowForm(false)}>Annuler</Btn></div>
        </Card>
      )}
      {loading ? <div style={{ color: C.mid }}>Chargement…</div> : coupons.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}><div style={{ fontSize: '32px', marginBottom: '8px' }}>🎟</div><div>Aucun coupon.</div></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {coupons.map(c => (
            <Card key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '15px', color: C.dark, fontFamily: 'monospace' }}>{c.code}</div>
                <div style={{ fontSize: '12px', color: C.mid, marginTop: '2px' }}>
                  {c.discount_type === 'percent' ? `−${c.discount_value}%` : `−${c.discount_value.toLocaleString('vi-VN')} ₫`}
                  {c.valid_until ? ` · jusqu'au ${new Date(c.valid_until).toLocaleDateString('fr-FR')}` : ''}
                </div>
              </div>
              <div style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: c.active ? '#f0fff4' : '#f5f5f5', color: c.active ? '#1a6b3a' : C.mid, cursor: 'pointer' }} onClick={() => toggleActive(c)}>{c.active ? 'Actif' : 'Désactivé'}</div>
              <Btn variant="danger" small onClick={() => remove(c.id)}>🗑</Btn>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Marketing : Offre de bienvenue ──────────────────────────
function SubBienvenue({ merchant, onSave }) {
  const [form, setForm] = useState({ welcome_offer_enabled: false, welcome_offer_text: '', welcome_offer_discount: 10 })
  useEffect(() => { setForm({ welcome_offer_enabled: merchant?.welcome_offer_enabled || false, welcome_offer_text: merchant?.welcome_offer_text || '', welcome_offer_discount: merchant?.welcome_offer_discount || 10 }) }, [merchant])
  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))
  return (
    <Card>
      <FeatureHeader title="Offre de bienvenue" subtitle="Affichée automatiquement à la première visite" enabled={form.welcome_offer_enabled} onToggle={() => setForm(p => ({ ...p, welcome_offer_enabled: !p.welcome_offer_enabled }))} />
      <FieldGroup label="Message d'accueil"><Textarea value={form.welcome_offer_text} onChange={f('welcome_offer_text')} placeholder="Bienvenue ! Profitez de 10% de réduction sur votre première visite." rows={3} /></FieldGroup>
      <FieldGroup label="Réduction offerte (%)"><Input value={form.welcome_offer_discount} onChange={f('welcome_offer_discount')} type="number" style={{ width: '120px' }} /></FieldGroup>
      <Btn onClick={() => onSave(form)}>Enregistrer</Btn>
    </Card>
  )
}

// ─── Marketing : Galerie ──────────────────────────────────────
function SubGalerie({ merchantId, toast }) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  async function load() { const { data } = await supabase.from('gallery').select('*').eq('merchant_id', merchantId).order('display_order'); setPhotos(data || []); setLoading(false) }
  useEffect(() => { if (merchantId) load() }, [merchantId])

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast('Fichier trop lourd (max 2 Mo)', false); return }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const base64 = ev.target.result
      await supabase.from('gallery').insert({ merchant_id: merchantId, image_url: base64, display_order: photos.length, active: true })
      load(); setUploading(false); toast('Photo ajoutée', true)
    }
    reader.readAsDataURL(file)
  }

  async function toggleActive(p) { await supabase.from('gallery').update({ active: !p.active }).eq('id', p.id); load() }
  async function remove(id) { if (!confirm('Supprimer ?')) return; await supabase.from('gallery').delete().eq('id', id); load(); toast('Photo supprimée', true) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontWeight: '700', fontSize: '15px', color: C.dark }}>Galerie réalisations</div>
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          <Btn onClick={() => fileRef.current.click()} disabled={uploading}>{uploading ? 'Envoi…' : '+ Ajouter une photo'}</Btn>
        </div>
      </div>
      {loading ? <div style={{ color: C.mid }}>Chargement…</div> : photos.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}><div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div><div>Aucune photo. Ajoutez vos réalisations.</div></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {photos.map(p => (
            <div key={p.id} style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${C.border}`, background: C.white }}>
              <div style={{ height: '140px', background: C.bg, overflow: 'hidden' }}>
                <img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: p.active ? 1 : 0.4 }} />
              </div>
              <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '600', background: p.active ? '#f0fff4' : '#f5f5f5', color: p.active ? '#1a6b3a' : C.mid, cursor: 'pointer' }} onClick={() => toggleActive(p)}>{p.active ? 'Visible' : 'Masqué'}</div>
                <Btn variant="danger" small onClick={() => remove(p.id)}>🗑</Btn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Section Marketing ────────────────────────────────────────
function SectionMarketing({ merchantId, merchant, onSaveMerchant, toast }) {
  const [sub, setSub] = useState('roue')
  return (
    <div>
      <SectionTitle>Marketing</SectionTitle>
      <MarketingNav active={sub} onSelect={setSub} />
      {sub === 'roue'       && <SubRoue merchantId={merchantId} toast={toast} />}
      {sub === 'flash'      && <SubFlash merchantId={merchantId} toast={toast} />}
      {sub === 'fidelite'   && <SubFidelite merchantId={merchantId} toast={toast} />}
      {sub === 'parrainage' && <SubParrainage merchantId={merchantId} toast={toast} />}
      {sub === 'coupons'    && <SubCoupons merchantId={merchantId} toast={toast} />}
      {sub === 'bienvenue'  && <SubBienvenue merchant={merchant} onSave={onSaveMerchant} />}
      {sub === 'galerie'    && <SubGalerie merchantId={merchantId} toast={toast} />}
    </div>
  )
}

// ─── Section Avis ─────────────────────────────────────────────
function SectionAvis({ merchantId, toast }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ author_name: '', content: '', rating: 5, visible: true })

  async function load() { const { data } = await supabase.from('reviews').select('*').eq('merchant_id', merchantId).order('created_at', { ascending: false }); setReviews(data || []); setLoading(false) }
  useEffect(() => { if (merchantId) load() }, [merchantId])
  async function save() {
    if (!form.author_name) { toast('Nom requis', false); return }
    await supabase.from('reviews').insert({ ...form, merchant_id: merchantId })
    setShowForm(false); setForm({ author_name: '', content: '', rating: 5, visible: true }); load(); toast('Avis ajouté', true)
  }
  async function toggleVisible(r) { await supabase.from('reviews').update({ visible: !r.visible }).eq('id', r.id); load() }
  async function remove(id) { if (!confirm('Supprimer ?')) return; await supabase.from('reviews').delete().eq('id', id); load(); toast('Supprimé', true) }
  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}><SectionTitle>Avis clients</SectionTitle><Btn onClick={() => setShowForm(v => !v)}>+ Ajouter</Btn></div>
      {showForm && (
        <Card style={{ marginBottom: '16px', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Nom"><Input value={form.author_name} onChange={f('author_name')} placeholder="Nguyễn Thị Lan" /></FieldGroup>
            <FieldGroup label="Note (1–5)"><Input value={form.rating} onChange={f('rating')} type="number" /></FieldGroup>
          </div>
          <FieldGroup label="Commentaire"><Textarea value={form.content} onChange={f('content')} placeholder="Très bon service…" /></FieldGroup>
          <div style={{ display: 'flex', gap: '8px' }}><Btn onClick={save}>Enregistrer</Btn><Btn variant="ghost" onClick={() => setShowForm(false)}>Annuler</Btn></div>
        </Card>
      )}
      {loading ? <div style={{ color: C.mid }}>Chargement…</div> : reviews.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}><div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div><div>Aucun avis.</div></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {reviews.map(r => (
            <Card key={r.id} style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}><span style={{ fontWeight: '700', fontSize: '14px', color: C.dark }}>{r.author_name}</span><span style={{ fontSize: '13px', color: C.gold }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span></div>
                  {r.content && <div style={{ fontSize: '13px', color: C.mid }}>{r.content}</div>}
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', background: r.visible ? '#f0fff4' : '#f5f5f5', color: r.visible ? '#1a6b3a' : C.mid }} onClick={() => toggleVisible(r)}>{r.visible ? 'Visible' : 'Masqué'}</div>
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
    supabase.from('contacts').select('*').eq('merchant_id', merchantId).order('captured_at', { ascending: false }).then(({ data }) => { setContacts(data || []); setLoading(false) })
  }, [merchantId])
  return (
    <div>
      <SectionTitle>Contacts Zalo ({contacts.length})</SectionTitle>
      {loading ? <div style={{ color: C.mid }}>Chargement…</div> : contacts.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}><div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div><div>Aucun contact.</div><div style={{ fontSize: '12px', marginTop: '6px' }}>Les contacts apparaissent dès qu'un client ouvre votre Mini App.</div></Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead><tr style={{ background: C.bg }}>{['Nom', 'Téléphone', 'Zalo ID', 'Capturé le'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600', color: C.mid }}>{h}</th>)}</tr></thead>
            <tbody>{contacts.map((c, i) => (<tr key={c.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : C.cream }}><td style={{ padding: '10px 16px', color: C.dark }}>{c.display_name || '—'}</td><td style={{ padding: '10px 16px', color: C.mid }}>{c.phone || '—'}</td><td style={{ padding: '10px 16px', color: C.mid, fontFamily: 'monospace', fontSize: '11px' }}>{c.zalo_id || '—'}</td><td style={{ padding: '10px 16px', color: C.mid }}>{new Date(c.captured_at).toLocaleDateString('fr-FR')}</td></tr>))}</tbody>
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

  async function load() { const { data } = await supabase.from('broadcasts').select('*').eq('merchant_id', merchantId).order('sent_at', { ascending: false }); setBroadcasts(data || []); setLoading(false) }
  useEffect(() => { if (merchantId) load() }, [merchantId])

  async function send() {
    if (!message.trim()) { toast('Message vide', false); return }
    setSending(true)
    await supabase.from('broadcasts').insert({ merchant_id: merchantId, message: message.trim(), recipient_count: contactCount, status: 'sent' })
    setMessage(''); setSending(false); load(); toast('Diffusion enregistrée', true)
  }

  return (
    <div>
      <SectionTitle>Diffusions ZNS</SectionTitle>
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ fontWeight: '700', color: C.dark, marginBottom: '12px' }}>Nouvelle diffusion <span style={{ fontSize: '12px', fontWeight: '400', color: C.mid, marginLeft: '8px' }}>{contactCount} contact{contactCount > 1 ? 's' : ''}</span></div>
        <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Écrivez votre message promotionnel…" rows={4} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <div style={{ fontSize: '12px', color: C.mid }}>{message.length}/500</div>
          <Btn onClick={send} disabled={sending || !message.trim()}>{sending ? 'Envoi…' : '📢 Envoyer'}</Btn>
        </div>
      </Card>
      <div style={{ fontWeight: '700', color: C.dark, marginBottom: '12px' }}>Historique</div>
      {loading ? <div style={{ color: C.mid }}>Chargement…</div> : broadcasts.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}><div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div><div>Aucune diffusion.</div></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {broadcasts.map(b => (
            <Card key={b.id} style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, fontSize: '14px', color: C.dark }}>{b.message}</div>
                <div style={{ flexShrink: 0, textAlign: 'right', marginLeft: '16px' }}><div style={{ fontSize: '12px', color: C.mid }}>{new Date(b.sent_at).toLocaleDateString('fr-FR')}</div><div style={{ fontSize: '11px', color: C.mid, marginTop: '2px' }}>{b.recipient_count} dest.</div></div>
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

  function showToast(msg, ok = true) { setToast({ msg, ok }); setTimeout(() => setToast({ msg: '', ok: true }), 3000) }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user); loadData(session.user.id)
    })
  }, [])

  async function loadData(userId) {
    const { data: m } = await supabase.from('merchants').select('*').eq('user_id', userId).single()
    setMerchant(m)
    if (m && !m.vertical) { router.push('/onboarding'); return }
    if (m) {
      const { data: c } = await supabase.from('contacts').select('*').eq('merchant_id', m.id)
      const { data: b } = await supabase.from('broadcasts').select('*').eq('merchant_id', m.id)
      setContacts(c || []); setBroadcasts(b || [])
    }
  }

  async function saveMerchant(form) {
    const { error } = await supabase.from('merchants').update(form).eq('id', merchant.id)
    if (error) { showToast('Erreur', false); return }
    setMerchant({ ...merchant, ...form }); showToast('Enregistré', true)
  }

  async function logout() { await supabase.auth.signOut(); router.push('/login') }

  if (!user || !merchant) {
    return <div style={{ minHeight: '100vh', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Be Vietnam Pro', sans-serif" }}><div style={{ textAlign: 'center', color: C.mid }}><div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div><div>Chargement…</div></div></div>
  }

  return (
    <>
      <Head>
        <title>Dashboard — VietMini</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} />}
        <aside className="sidebar" style={{ width: '220px', background: C.dark, display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: sidebarOpen ? 0 : '-220px', height: '100vh', zIndex: 50, transition: 'left .25s ease' }}>
          <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', background: C.red, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: '700', fontSize: '17px' }}>V</div>
              <span style={{ color: C.white, fontWeight: '700', fontSize: '16px' }}>VietMini</span>
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', paddingLeft: '44px' }}>{merchant.name || 'Mon établissement'}</div>
          </div>
          <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setActiveTab(t.id); setSidebarOpen(false) }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', background: activeTab === t.id ? 'rgba(208,2,27,0.25)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderLeft: activeTab === t.id ? `3px solid ${C.red}` : '3px solid transparent', fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'background .15s' }}>
                <span style={{ fontSize: '16px', width: '22px', textAlign: 'center' }}>{t.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: activeTab === t.id ? '600' : '400', color: activeTab === t.id ? C.white : 'rgba(255,255,255,0.6)' }}>{t.label}</span>
              </button>
            ))}
          </nav>
          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            <button onClick={logout} style={{ width: '100%', padding: '8px', borderRadius: '7px', background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Déconnexion</button>
          </div>
        </aside>
        <main className="main-content" style={{ flex: 1, marginLeft: '0', minHeight: '100vh' }}>
          <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 30, background: C.white, borderBottom: `1px solid ${C.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: C.dark, padding: '0' }}>☰</button>
            <div style={{ fontWeight: '700', color: C.dark, fontSize: '15px' }}>{TABS.find(t => t.id === activeTab)?.label}</div>
            <div style={{ width: '24px' }} />
          </div>
          <div style={{ padding: '28px 24px', maxWidth: '800px' }}>
            {activeTab === 'apercu'     && <SectionApercu merchant={merchant} contacts={contacts} broadcasts={broadcasts} onChangeVertical={async () => { if (window.confirm("Changer d'activité ? Toutes vos données de configuration seront réinitialisées.")) { await supabase.from('merchants').update({ vertical: null }).eq('id', merchant.id); router.push('/onboarding') } }} />}
            {activeTab === 'profil'     && <SectionProfil merchant={merchant} onSave={saveMerchant} merchantId={merchant.id} toast={showToast} />}
            {activeTab === 'marketing'  && <SectionMarketing merchantId={merchant.id} merchant={merchant} onSaveMerchant={saveMerchant} toast={showToast} />}
            {activeTab === 'avis'       && <SectionAvis merchantId={merchant.id} toast={showToast} />}
            {activeTab === 'contacts'   && <SectionContacts merchantId={merchant.id} />}
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