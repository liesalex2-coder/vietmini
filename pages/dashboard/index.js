import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabaseClient'


async function moderate(fields) {
  try {
    const res = await fetch('/api/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: fields.filter(Boolean) })
    })
    const data = await res.json()
    return data.ok
  } catch { return true }
}

const C = {
  red: '#D0021B', gold: '#F5A623', cream: '#FDF6EE',
  dark: '#1A0A00', mid: '#7A4A2A', white: '#fff',
  border: '#e5d9ce', bg: '#f7f0e8'
}

const TABS = [
  { id: 'apercu',     icon: '📊', label: 'Tổng quan' },
  { id: 'profil',     icon: '🏪', label: 'Trang của tôi' },
  { id: 'marketing',  icon: '🎯', label: 'Marketing' },
  { id: 'avis',       icon: '⭐', label: 'Đánh giá' },
  { id: 'contacts',   icon: '👥', label: 'Khách hàng' },
  { id: 'diffusions', icon: '📢', label: 'Gửi tin' },
]

const MARKETING_TABS = [
  { id: 'roue',       label: '🎡 Vòng quay' },
  { id: 'flash',      label: '⚡ Flash sale' },
  { id: 'fidelite',   label: '⭐ Thân thiết' },
  { id: 'parrainage', label: '🤝 Giới thiệu' },
  { id: 'coupons',    label: '🎟 Mã giảm giá' },
  { id: 'bienvenue',  label: '🎁 Chào mừng' },
  { id: 'thongbao',   label: '📢 Thông báo' },
  { id: 'review',     label: '✍️ Khuyến khích đánh giá' },
]

// ─── Compression WebP qualité 82 ─────────────────────────────
function compressToWebP(file, maxSize = 1200) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width, h = img.height
        if (w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize }
        if (h > maxSize) { w = Math.round(w * maxSize / h); h = maxSize }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/webp', 0.82))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })
}


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
function SaveBtn({ onClick, children = 'Lưu', small, style }) {
  const [state, setState] = React.useState('idle')
  async function handle() {
    setState('saving')
    try { await onClick() } catch(e) {}
    setState('saved')
    setTimeout(() => setState('idle'), 2000)
  }
  const bg = state === 'saved' ? '#16a34a' : C.red
  const label = state === 'saving' ? 'Đang lưu…' : state === 'saved' ? '✓ Đã lưu' : children
  return <button onClick={handle} disabled={state === 'saving'} style={{ padding: small ? '7px 14px' : '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: small ? '13px' : '14px', border: 'none', cursor: state === 'saving' ? 'default' : 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif", background: bg, color: C.white, transition: 'background .3s', ...style }}>{label}</button>
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
      <SectionTitle>Tổng quan</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[{ label: 'Tổng số khách hàng', value: contacts.length, icon: '👥' }, { label: 'Mới trong tháng', value: thisMonth, icon: '✨' }, { label: 'Tin đã gửi', value: broadcasts.length, icon: '📢' }].map(s => (
          <Card key={s.label}><div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div><div style={{ fontSize: '32px', fontWeight: '700', color: C.dark }}>{s.value}</div><div style={{ fontSize: '13px', color: C.mid, marginTop: '4px' }}>{s.label}</div></Card>
        ))}
      </div>
      {merchant && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: merchant.primary_color || C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: '700', fontSize: '22px' }}>{(merchant.name || '?')[0]}</div>
              <div><div style={{ fontWeight: '700', fontSize: '16px', color: C.dark }}>{merchant.name || 'Cửa hàng của tôi'}</div><div style={{ fontSize: '13px', color: C.mid }}>{merchant.vertical || '—'}</div></div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Btn variant="primary" small onClick={() => window.open(`/preview/${merchant.id}`, '_blank')}>👁 Xem app của tôi</Btn>
              <Btn variant="ghost" small onClick={onChangeVertical}>Đổi ngành nghề →</Btn>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── Section Profil ───────────────────────────────────────────
const PROFIL_TABS = [
  { id: 'infos',    label: '📋 Thông tin' },
  { id: 'hero',     label: '🖼 Ảnh trang chính' },
  { id: 'services', label: '✂️ Dịch vụ' },
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
        <FieldGroup label="Tên"><Input value={form.name} onChange={f('name')} placeholder="Bella Beauty Salon" /></FieldGroup>
        <FieldGroup label="Loại"><Input value={form.vertical} onChange={f('vertical')} placeholder="Salon làm đẹp" /></FieldGroup>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FieldGroup label="Số điện thoại"><Input value={form.phone} onChange={f('phone')} placeholder="0901 234 567" /></FieldGroup>
        <FieldGroup label="Địa chỉ"><Input value={form.address} onChange={f('address')} placeholder="123 Đường Lê Lợi" /></FieldGroup>
      </div>
      <FieldGroup label="Giờ mở cửa"><Input value={form.hours} onChange={f('hours')} placeholder="T2–T7: 8h–20h" /></FieldGroup>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <FieldGroup label="Màu chính">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="color" value={form.primary_color || '#D0021B'} onChange={f('primary_color')} style={{ width: '40px', height: '36px', borderRadius: '6px', border: `1px solid ${C.border}`, cursor: 'pointer', padding: '2px' }} />
            <Input value={form.primary_color || '#D0021B'} onChange={f('primary_color')} style={{ flex: 1 }} />
          </div>
        </FieldGroup>
        <FieldGroup label="Màu phụ">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="color" value={form.secondary_color || '#F5A623'} onChange={f('secondary_color')} style={{ width: '40px', height: '36px', borderRadius: '6px', border: `1px solid ${C.border}`, cursor: 'pointer', padding: '2px' }} />
            <Input value={form.secondary_color || '#F5A623'} onChange={f('secondary_color')} style={{ flex: 1 }} />
          </div>
        </FieldGroup>
      </div>
      <SaveBtn onClick={() => onSave(form)}>Lưu thay đổi</SaveBtn>
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
    if (file.size > 5 * 1024 * 1024) { alert('File quá nặng (tối đa 5 MB)'); return }
    setUploading(true)
    const base64 = await compressToWebP(file, 1200)
    setPreview(base64)
    await onSave({ hero_image: base64 })
    setUploading(false)
  }

  return (
    <Card>
      <div style={{ fontWeight: '700', fontSize: '15px', color: C.dark, marginBottom: '6px' }}>Ảnh trang chính</div>
      <div style={{ fontSize: '13px', color: C.mid, marginBottom: '20px' }}>Ảnh này sẽ hiển thị làm banner chính trên app của bạn. Định dạng khuyên dùng: 800×400px.</div>
      {preview ? (
        <div style={{ marginBottom: '16px' }}>
          <img src={preview} alt="Hero" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '10px', border: `1px solid ${C.border}` }} />
        </div>
      ) : (
        <div style={{ width: '100%', height: '160px', borderRadius: '10px', border: `2px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.mid, fontSize: '14px', marginBottom: '16px', cursor: 'pointer', background: C.bg }} onClick={() => fileRef.current.click()}>
          Nhấn để tải ảnh trang chính
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      <Btn onClick={() => fileRef.current.click()} disabled={uploading}>{uploading ? 'Đang gửi…' : preview ? '🔄 Đổi ảnh' : '📷 Tải ảnh'}</Btn>
    </Card>
  )
}

function SectionProfil({ merchant, onSave, merchantId, toast }) {
  const [sub, setSub] = useState('infos')
  return (
    <div>
      <SectionTitle>Trang của tôi</SectionTitle>
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
    if (!form.name) { toast('Yêu cầu tên', false); return }
    if (!await moderate([form.name, form.description])) { toast('Nội dung không được phép', false); return }
    if (editing) { await supabase.from('services').update({ ...form, price: parseInt(form.price) || 0 }).eq('id', editing) }
    else { await supabase.from('services').insert({ ...form, price: parseInt(form.price) || 0, merchant_id: merchantId, display_order: services.length }) }
    setShowForm(false); load(); toast('Đã lưu dịch vụ', true)
  }
  async function remove(id) { if (!confirm('Xóa?')) return; await supabase.from('services').delete().eq('id', id); load(); toast('Đã xóa', true) }
  async function toggleActive(s) { await supabase.from('services').update({ active: !s.active }).eq('id', s.id); load() }

  async function addCategory() {
    if (!newCat.trim()) return
    if (!await moderate([newCat.trim()])) { toast('Nội dung không được phép', false); return }
    await supabase.from('service_categories').insert({ merchant_id: merchantId, name: newCat.trim(), display_order: categories.length })
    setNewCat(''); setShowCatForm(false); load(); toast('Đã thêm danh mục', true)
  }
  async function removeCategory(id) {
    if (!confirm('Xóa danh mục này?')) return
    await supabase.from('service_categories').delete().eq('id', id); load(); toast('Đã xóa danh mục', true)
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
        <div style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: s.active ? '#f0fff4' : '#f5f5f5', color: s.active ? '#1a6b3a' : C.mid, cursor: 'pointer' }} onClick={() => toggleActive(s)}>{s.active ? 'Đang hoạt động' : 'Ẩn'}</div>
        <Btn variant="ghost" small onClick={() => openEdit(s)}>✏️</Btn>
        <Btn variant="danger" small onClick={() => remove(s.id)}>🗑</Btn>
      </Card>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <SectionTitle>Dịch vụ</SectionTitle>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Btn variant="ghost" small onClick={() => setShowCatForm(v => !v)}>+ Danh mục</Btn>
          <Btn onClick={openNew}>+ Service</Btn>
        </div>
      </div>

      {/* Formulaire nouvelle catégorie */}
      {showCatForm && (
        <Card style={{ marginBottom: '16px', border: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: '700', color: C.dark, marginBottom: '12px' }}>Danh mục mới</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Ví dụ: Cắt tóc, Nail, Chăm sóc…" style={{ flex: 1 }} />
            <Btn onClick={addCategory}>Thêm</Btn>
            <Btn variant="ghost" onClick={() => setShowCatForm(false)}>Hủy</Btn>
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
          <div style={{ fontWeight: '700', color: C.dark, marginBottom: '16px' }}>{editing ? 'Chỉnh sửa' : 'Dịch vụ mới'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Tên"><Input value={form.name} onChange={f('name')} placeholder="Cắt tóc nữ" /></FieldGroup>
            <FieldGroup label="Giá (₫)"><Input value={form.price} onChange={f('price')} placeholder="150000" type="number" /></FieldGroup>
            <FieldGroup label="Danh mục">
              {categories.length > 0 ? (
                <select value={form.category} onChange={f('category')} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark, outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  <option value="">Không có danh mục</option>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
              ) : (
                <div style={{ fontSize: '12px', color: C.mid, paddingTop: '10px' }}>Chưa có danh mục — hãy tạo một danh mục trước</div>
              )}
            </FieldGroup>
          </div>
          <FieldGroup label="Mô tả"><Textarea value={form.description} onChange={f('description')} placeholder="Mô tả ngắn…" rows={2} /></FieldGroup>
          <FieldGroup label="Ảnh dịch vụ">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {form.image_base64 && <img src={form.image_base64} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${C.border}` }} />}
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, cursor: 'pointer', fontSize: '13px', color: C.mid, background: C.white }}>
                📷 {form.image_base64 ? 'Đổi' : 'Thêm ảnh'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                  const file = e.target.files[0]; if (!file) return
                  const base64 = await compressToWebP(file, 400)
                  setForm(p => ({ ...p, image_base64: base64 }))
                }} />
              </label>
              {form.image_base64 && <span onClick={() => setForm(p => ({ ...p, image_base64: '' }))} style={{ fontSize: '12px', color: C.red, cursor: 'pointer' }}>Xóa</span>}
            </div>
          </FieldGroup>
          <div style={{ display: 'flex', gap: '8px' }}><SaveBtn onClick={save} /><Btn variant="ghost" onClick={() => setShowForm(false)}>Hủy</Btn></div>
        </Card>
      )}

      {loading ? <div style={{ color: C.mid }}>Đang tải…</div> : services.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✂️</div>
          <div>Chưa có dịch vụ. Hãy bắt đầu bằng cách tạo một danh mục rồi thêm dịch vụ.</div>
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
                  <label style={{ width: '36px', height: '36px', borderRadius: '6px', border: `2px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', flexShrink: 0, background: C.bg }} title="Thêm ảnh danh mục">
                    📷
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                      const file = e.target.files[0]; if (!file) return
                      const base64 = await compressToWebP(file, 400)
                      await supabase.from('service_categories').update({ image_base64: base64 }).eq('id', cat.id)
                      load()
                    }} />
                  </label>
                )}
                <div style={{ fontSize: '13px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.name}</div>
                {cat.image_base64 && (
                  <label style={{ cursor: 'pointer', fontSize: '11px', color: C.mid }} title="Đổi ảnh">
                    ✏️
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                      const file = e.target.files[0]; if (!file) return
                      const base64 = await compressToWebP(file, 400)
                      await supabase.from('service_categories').update({ image_base64: base64 }).eq('id', cat.id)
                      load()
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
                Không có danh mục
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
    setConfig(updated); toast(updated.enabled ? 'Đã bật vòng quay' : 'Đã tắt vòng quay', true)
  }
  async function updatePrize(i, field, value) {
    const prizes = [...(config.prizes || [])]; prizes[i] = { ...prizes[i], [field]: value }
    setConfig({ ...config, prizes })
  }
  async function addPrize() {
    const prizes = [...(config.prizes || []), { label: 'Đợt mới', color: C.red }]
    setConfig({ ...config, prizes })
  }
  async function removePrize(i) {
    const prizes = config.prizes.filter((_, j) => j !== i)
    setConfig({ ...config, prizes })
  }
  async function savePrizes() {
    const labels = (config.prizes || []).map(p => p.label)
    if (!await moderate(labels)) { toast('Nội dung không được phép', false); return }
    await supabase.from('wheel_config').update({ prizes: config.prizes }).eq('id', config.id)
  }

  if (!config) return <div style={{ color: C.mid }}>Đang tải…</div>
  return (
    <div>
      <Card style={{ marginBottom: '16px' }}>
        <FeatureHeader title="Vòng Quay May Mắn" subtitle="Hiển thị trên trang chính của Mini App" enabled={config.enabled} onToggle={toggleEnabled} />
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontWeight: '700', color: C.dark }}>Lots ({(config.prizes || []).length})</div>
          <Btn small onClick={addPrize} disabled={(config.prizes || []).length >= 6}>+ Thêm</Btn>
        </div>
        {(config.prizes || []).map((prize, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>

            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: ['#D0021B','#F5A623','#27AE60','#2980B9','#8E44AD','#E67E22'][i % 6], flexShrink: 0 }} />
            <div style={{ flex: 1, position: 'relative' }}>
              <input type="text" value={prize.label || ''} maxLength={15} onChange={e => updatePrize(i, 'label', e.target.value)} style={{ width: '100%', padding: '7px 10px', borderRadius: '7px', border: `1px solid ${(prize.label || '').length >= 15 ? C.red : C.border}`, fontSize: '14px', color: C.dark, outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif", boxSizing: 'border-box' }} />
              <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: (prize.label || '').length >= 15 ? C.red : C.mid }}>{(prize.label || '').length}/15</span>
            </div>
            <Btn variant="danger" small onClick={() => removePrize(i)}>🗑</Btn>
          </div>
        ))}
        <div style={{ marginTop: '16px' }}>
          <SaveBtn onClick={savePrizes} />
        </div>
      </Card>
    </div>
  )
}

// ─── Marketing : Flash sale ───────────────────────────────────
const DAYS_FR = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
const DAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

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
    setData(updated); setForm(updated); toast(updated.enabled ? 'Đã bật flash sale' : 'Đã tắt flash sale', true)
  }
  async function save() {
    const isRecurring = form.recurring || false
    const update = {
      discount_value: parseInt(form.discount_value) || 0,
      service_name: form.service_name || '',
      recurring: isRecurring,
    }
    if (isRecurring) {
      update.recurring_days = form.recurring_days || []
      update.recurring_start_time = form.recurring_start_time || null
      update.recurring_end_time = form.recurring_end_time || null
      update.start_time = null
      update.end_time = null
    } else {
      update.start_time = form.start_time || null
      update.end_time = form.end_time || null
      update.recurring_days = []
      update.recurring_start_time = null
      update.recurring_end_time = null
    }
    if (!await moderate([update.service_name])) { toast('Nội dung không được phép', false); return }
    await supabase.from('flash_sales').update(update).eq('id', data.id)
    load(); toast('Đã lưu flash sale', true)
  }
  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))
  const toggleDay = (day) => {
    const days = form.recurring_days || []
    const newDays = days.includes(day) ? days.filter(d => d !== day) : [...days, day].sort()
    setForm(p => ({ ...p, recurring_days: newDays }))
  }

  if (!data) return <div style={{ color: C.mid }}>Đang tải…</div>
  return (
    <Card>
      <FeatureHeader title="Flash Sale" subtitle="Khuyến mãi giới hạn thời gian với đồng hồ đếm ngược" enabled={data.enabled} onToggle={toggleEnabled} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <FieldGroup label="Giảm giá (%)"><Input value={form.discount_value} onChange={f('discount_value')} type="number" placeholder="20" /></FieldGroup>
        <FieldGroup label="Dịch vụ áp dụng"><Input value={form.service_name} onChange={f('service_name')} placeholder="Tất cả dịch vụ" /></FieldGroup>
      </div>
      <div style={{ margin: '12px 0 4px', fontSize: '12px', fontWeight: '600', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Loại lịch</div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setForm(p => ({ ...p, recurring: false }))} style={{ flex: 1, padding: '9px', borderRadius: '8px', border: `2px solid ${!form.recurring ? C.red : C.border}`, background: !form.recurring ? '#fff5f5' : '#fff', color: !form.recurring ? C.red : C.mid, fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>📅 Ponctuel</button>
        <button onClick={() => setForm(p => ({ ...p, recurring: true }))} style={{ flex: 1, padding: '9px', borderRadius: '8px', border: `2px solid ${form.recurring ? C.red : C.border}`, background: form.recurring ? '#fff5f5' : '#fff', color: form.recurring ? C.red : C.mid, fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>🔁 Định kỳ</button>
      </div>
      {!form.recurring ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <FieldGroup label="Bắt đầu (ngày và giờ)"><Input value={form.start_time ? form.start_time.slice(0, 16) : ''} onChange={f('start_time')} type="datetime-local" /></FieldGroup>
          <FieldGroup label="Kết thúc (ngày và giờ)"><Input value={form.end_time ? form.end_time.slice(0, 16) : ''} onChange={f('end_time')} type="datetime-local" /></FieldGroup>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Ngày trong tuần</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[0,1,2,3,4,5,6].map(d => {
                const selected = (form.recurring_days || []).includes(d)
                return <button key={d} onClick={() => toggleDay(d)} style={{ padding: '7px 12px', borderRadius: '20px', border: `2px solid ${selected ? C.red : C.border}`, background: selected ? C.red : '#fff', color: selected ? '#fff' : C.mid, fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{DAYS_FR[d]}</button>
              })}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Giờ bắt đầu"><Input value={form.recurring_start_time || ''} onChange={f('recurring_start_time')} type="time" /></FieldGroup>
            <FieldGroup label="Giờ kết thúc"><Input value={form.recurring_end_time || ''} onChange={f('recurring_end_time')} type="time" /></FieldGroup>
          </div>
        </div>
      )}
      <SaveBtn onClick={save} />
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
    if (!await moderate([form.reward_text])) { toast('Nội dung không được phép', false); return }
    await supabase.from('loyalty_config').update({ enabled: updated.enabled }).eq('id', data.id)
    setData(updated); setForm(updated); toast(updated.enabled ? 'Đã bật thẻ thân thiết' : 'Đã tắt thẻ thân thiết', true)
  }
  async function save() {
    const pin = (form.pin_code || '').replace(/\D/g, '').slice(0, 4)
    if (pin.length !== 4) { toast('Mã PIN phải có 4 chữ số', false); return }
    await supabase.from('loyalty_config').update({
      visits_required: parseInt(form.visits_required) || 10,
      reward_text: form.reward_text || '',
      pin_code: pin
    }).eq('id', data.id)
    load(); toast('Đã lưu thẻ thân thiết', true)
  }
  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))

  if (!data) return <div style={{ color: C.mid }}>Đang tải…</div>

  const visitsRequired = parseInt(form.visits_required) || 10

  return (
    <div>
      <Card style={{ marginBottom: '16px' }}>
        <FeatureHeader title="Thẻ khách hàng thân thiết" subtitle="Thưởng cho khách hàng sau X lần ghé" enabled={data.enabled} onToggle={toggleEnabled} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <FieldGroup label="Số lần ghé yêu cầu">
            <Input value={form.visits_required} onChange={f('visits_required')} type="number" placeholder="10" />
          </FieldGroup>
          <FieldGroup label="Phần thưởng">
            <Input value={form.reward_text} onChange={f('reward_text')} placeholder="Tặng 1 lần chăm sóc" />
          </FieldGroup>
          <FieldGroup label="Mã PIN (4 chữ số)">
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
        <SaveBtn onClick={save} />
      </Card>

      {/* Liste clients */}
      <div style={{ fontWeight: '700', color: C.dark, marginBottom: '12px', fontSize: '15px' }}>
        Clients ({cards.length})
      </div>
      {cards.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎫</div>
          <div>Chưa có khách hàng nào sử dụng thẻ.</div>
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
                      {pct >= 100 ? '🎁 Có phần thưởng' : `Còn ${visitsRequired - card.visit_count} lần ghé`}
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
    setData(updated); setForm(updated); toast(updated.enabled ? 'Đã bật giới thiệu' : 'Đã tắt giới thiệu', true)
  }
  async function save() {
    await supabase.from('referral_config').update({ discount_referrer: parseInt(form.discount_referrer) || 0, discount_referred: parseInt(form.discount_referred) || 0, valid_days: parseInt(form.valid_days) || 30 }).eq('id', data.id)
    load(); toast('Đã lưu giới thiệu', true)
  }
  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))

  if (!data) return <div style={{ color: C.mid }}>Đang tải…</div>
  return (
    <Card>
      <FeatureHeader title="Giới thiệu bạn bè" subtitle="Mời bạn qua Zalo — cả hai cùng được thưởng" enabled={data.enabled} onToggle={toggleEnabled} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <FieldGroup label="Giảm cho người giới thiệu (%)"><Input value={form.discount_referrer} onChange={f('discount_referrer')} type="number" placeholder="15" /></FieldGroup>
        <FieldGroup label="Giảm cho người được giới thiệu (%)"><Input value={form.discount_referred} onChange={f('discount_referred')} type="number" placeholder="15" /></FieldGroup>
        <FieldGroup label="Hiệu lực (ngày)"><Input value={form.valid_days} onChange={f('valid_days')} type="number" placeholder="30" /></FieldGroup>
      </div>
      {/* Flow visuel */}
      <div style={{ margin: '16px 0', padding: '16px', background: C.bg, borderRadius: '10px', fontSize: '13px', color: C.mid }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ background: C.white, padding: '6px 12px', borderRadius: '8px', color: C.dark, fontWeight: '600' }}>👩 Người giới thiệu</span>
          <span>chia sẻ link Zalo →</span>
          <span style={{ background: C.white, padding: '6px 12px', borderRadius: '8px', color: C.dark, fontWeight: '600' }}>👩 Người được giới thiệu</span>
          <span>mở Mini App →</span>
          <span style={{ background: '#f0fff4', padding: '6px 12px', borderRadius: '8px', color: '#1a6b3a', fontWeight: '600' }}>Cả hai cùng được −{form.discount_referrer || 15}%</span>
        </div>
      </div>
      <SaveBtn onClick={save} />
    </Card>
  )
}

// ─── Marketing : Coupons ─────────────────────────────────────
function SubCoupons({ merchantId, toast }) {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', discount_type: 'percent', discount_value: 10, valid_until: '', service_name: '', active: true })

  async function load() { const { data } = await supabase.from('coupons').select('*').eq('merchant_id', merchantId).order('created_at', { ascending: false }); setCoupons(data || []); setLoading(false) }
  useEffect(() => { if (merchantId) load() }, [merchantId])

  async function save() {
    if (!form.code) { toast('Yêu cầu mã', false); return }
    if (!await moderate([form.code, form.service_name])) { toast('Nội dung không được phép', false); return }
    await supabase.from('coupons').insert({ ...form, discount_value: parseInt(form.discount_value) || 0, merchant_id: merchantId, valid_until: form.valid_until || null })
    setShowForm(false); setForm({ code: '', discount_type: 'percent', discount_value: 10, valid_until: '', service_name: '', active: true }); load(); toast('Đã tạo mã giảm giá', true)
  }
  async function toggleActive(c) { await supabase.from('coupons').update({ active: !c.active }).eq('id', c.id); load() }
  async function remove(id) { if (!confirm('Xóa?')) return; await supabase.from('coupons').delete().eq('id', id); load(); toast('Đã xóa', true) }
  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontWeight: '700', fontSize: '15px', color: C.dark }}>Mã giảm giá</div>
        <Btn onClick={() => setShowForm(v => !v)}>+ Tạo</Btn>
      </div>
      {showForm && (
        <Card style={{ marginBottom: '16px', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Mã khuyến mãi"><Input value={form.code} onChange={f('code')} placeholder="CHAOMUNG10" /></FieldGroup>
            <FieldGroup label="Loại">
              <select value={form.discount_type} onChange={f('discount_type')} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark, outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                <option value="percent">Phần trăm (%)</option>
                <option value="amount">Số tiền cố định (₫)</option>
              </select>
            </FieldGroup>
            <FieldGroup label="Giảm giá"><Input value={form.discount_value} onChange={f('discount_value')} type="number" /></FieldGroup>
            <FieldGroup label="Có hiệu lực đến"><Input value={form.valid_until} onChange={f('valid_until')} type="date" /></FieldGroup>
            <FieldGroup label="Dịch vụ áp dụng" style={{ gridColumn: '1 / -1' }}><Input value={form.service_name} onChange={f('service_name')} placeholder="Ví dụ: Nail Gel, Cắt tóc… (để trống = tất cả dịch vụ)" /></FieldGroup>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}><Btn onClick={save}>Tạo</Btn><Btn variant="ghost" onClick={() => setShowForm(false)}>Hủy</Btn></div>
        </Card>
      )}
      {loading ? <div style={{ color: C.mid }}>Đang tải…</div> : coupons.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}><div style={{ fontSize: '32px', marginBottom: '8px' }}>🎟</div><div>Chưa có mã giảm giá.</div></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {coupons.map(c => (
            <Card key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '15px', color: C.dark, fontFamily: 'monospace' }}>{c.code}</div>
                <div style={{ fontSize: '12px', color: C.mid, marginTop: '2px' }}>
                  {c.discount_type === 'percent' ? `−${c.discount_value}%` : `−${c.discount_value.toLocaleString('vi-VN')} ₫`}
                  {c.service_name ? ` · ${c.service_name}` : ' · Tất cả dịch vụ'}
                  {c.valid_until ? ` · đến ${new Date(c.valid_until).toLocaleDateString('vi-VN')}` : ''}
                </div>
              </div>
              <div style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: c.active ? '#f0fff4' : '#f5f5f5', color: c.active ? '#1a6b3a' : C.mid, cursor: 'pointer' }} onClick={() => toggleActive(c)}>{c.active ? 'Đang hoạt động' : 'Đã tắt'}</div>
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
  const [form, setForm] = useState({ welcome_enabled: false, welcome_message: '', welcome_discount: 10 })
  useEffect(() => { setForm({ welcome_enabled: merchant?.welcome_enabled || false, welcome_message: merchant?.welcome_message || '', welcome_discount: merchant?.welcome_discount || 10 }) }, [merchant])
  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))
  return (
    <Card>
      <FeatureHeader title="Ưu đãi chào mừng" subtitle="Tự động hiển thị cho lần ghé đầu tiên" enabled={form.welcome_enabled} onToggle={() => setForm(p => ({ ...p, welcome_enabled: !p.welcome_enabled }))} />
      <FieldGroup label="Tin nhắn chào mừng"><Textarea value={form.welcome_message} onChange={f('welcome_message')} placeholder="Chào mừng bạn! Nhận ngay 10% giảm giá cho lần ghé đầu tiên." rows={3} /></FieldGroup>
      <FieldGroup label="Giảm giá tặng (%)"><Input value={form.welcome_discount} onChange={f('welcome_discount')} type="number" style={{ width: '120px' }} /></FieldGroup>
      <SaveBtn onClick={() => onSave(form)} />
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
    if (file.size > 5 * 1024 * 1024) { toast('File quá nặng (tối đa 5 MB)', false); return }
    setUploading(true)
    const base64 = await compressToWebP(file, 800)
    await supabase.from('gallery').insert({ merchant_id: merchantId, image_url: base64, display_order: photos.length, active: true })
    load(); setUploading(false); toast('Đã thêm ảnh', true)
  }

  async function toggleActive(p) { await supabase.from('gallery').update({ active: !p.active }).eq('id', p.id); load() }
  async function remove(id) { if (!confirm('Xóa?')) return; await supabase.from('gallery').delete().eq('id', id); load(); toast('Đã xóa ảnh', true) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontWeight: '700', fontSize: '15px', color: C.dark }}>Thư viện hình ảnh</div>
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          <Btn onClick={() => fileRef.current.click()} disabled={uploading}>{uploading ? 'Đang gửi…' : '+ Thêm ảnh'}</Btn>
        </div>
      </div>
      {loading ? <div style={{ color: C.mid }}>Đang tải…</div> : photos.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}><div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div><div>Chưa có ảnh. Hãy thêm hình ảnh thành quả của bạn.</div></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {photos.map(p => (
            <div key={p.id} style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${C.border}`, background: C.white }}>
              <div style={{ height: '140px', background: C.bg, overflow: 'hidden' }}>
                <img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: p.active ? 1 : 0.4 }} />
              </div>
              <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '600', background: p.active ? '#f0fff4' : '#f5f5f5', color: p.active ? '#1a6b3a' : C.mid, cursor: 'pointer' }} onClick={() => toggleActive(p)}>{p.active ? 'Hiển thị' : 'Ẩn'}</div>
                <Btn variant="danger" small onClick={() => remove(p.id)}>🗑</Btn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Marketing : Thông báo ────────────────────────────────────
function SubThongBao({ merchantId, toast }) {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ text: '', hasEndDate: false, valid_until: '', active: true })

  async function load() {
    const { data } = await supabase.from('announcements').select('*').eq('merchant_id', merchantId).order('created_at', { ascending: false })
    setAnnouncements(data || [])
    setLoading(false)
  }
  useEffect(() => { if (merchantId) load() }, [merchantId])

  function resetForm() {
    setForm({ text: '', hasEndDate: false, valid_until: '', active: true })
    setEditingId(null)
    setShowForm(false)
  }

  async function save() {
    if (!form.text.trim()) { toast('Yêu cầu nội dung thông báo', false); return }
    if (!await moderate([form.text])) { toast('Nội dung không được phép', false); return }
    const payload = {
      text: form.text.trim(),
      active: form.active,
      valid_until: form.hasEndDate && form.valid_until ? form.valid_until : null,
      merchant_id: merchantId,
    }
    if (editingId) {
      await supabase.from('announcements').update(payload).eq('id', editingId)
      toast('Đã cập nhật thông báo', true)
    } else {
      await supabase.from('announcements').insert(payload)
      toast('Đã tạo thông báo', true)
    }
    resetForm(); load()
  }

  function edit(a) {
    setEditingId(a.id)
    setForm({
      text: a.text || '',
      hasEndDate: !!a.valid_until,
      valid_until: a.valid_until ? a.valid_until.split('T')[0] : '',
      active: a.active,
    })
    setShowForm(true)
  }

  async function toggleActive(a) { await supabase.from('announcements').update({ active: !a.active }).eq('id', a.id); load() }
  async function remove(id) { if (!confirm('Xóa thông báo?')) return; await supabase.from('announcements').delete().eq('id', id); load(); toast('Đã xóa', true) }

  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '15px', color: C.dark }}>Thông báo</div>
          <div style={{ fontSize: '12px', color: C.mid, marginTop: '2px' }}>Thông báo đang hoạt động sẽ hiển thị trên Mini App của bạn.</div>
        </div>
        {!showForm && <Btn onClick={() => setShowForm(true)}>+ Thêm</Btn>}
      </div>
      {showForm && (
        <Card style={{ marginBottom: '16px', border: `1px solid ${C.border}` }}>
          <FieldGroup label="Nội dung thông báo">
            <textarea
              value={form.text}
              onChange={f('text')}
              placeholder="Ví dụ: Nhạc sống tối thứ sáu 19:00-22:00"
              rows={3}
              maxLength={200}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark, outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif", resize: 'vertical' }}
            />
            <div style={{ fontSize: '11px', color: C.mid, marginTop: '4px', textAlign: 'right' }}>{form.text.length}/200</div>
          </FieldGroup>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <input
              type="checkbox"
              id="hasEndDate"
              checked={form.hasEndDate}
              onChange={e => setForm(p => ({ ...p, hasEndDate: e.target.checked, valid_until: e.target.checked ? p.valid_until : '' }))}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="hasEndDate" style={{ fontSize: '13px', color: C.dark, cursor: 'pointer' }}>Có ngày kết thúc</label>
          </div>
          {form.hasEndDate && (
            <FieldGroup label="Kết thúc vào">
              <Input value={form.valid_until} onChange={f('valid_until')} type="date" />
            </FieldGroup>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <Btn onClick={save}>{editingId ? 'Lưu' : 'Tạo'}</Btn>
            <Btn variant="ghost" onClick={resetForm}>Hủy</Btn>
          </div>
        </Card>
      )}
      {loading ? <div style={{ color: C.mid }}>Đang tải…</div> : announcements.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📢</div>
          <div>Chưa có thông báo.</div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {announcements.map(a => {
            const expired = a.valid_until && new Date(a.valid_until) < new Date()
            return (
              <Card key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: C.dark, whiteSpace: 'pre-wrap' }}>{a.text}</div>
                  {a.valid_until && (
                    <div style={{ fontSize: '12px', color: expired ? '#c00' : C.mid, marginTop: '4px' }}>
                      {expired ? '⚠ Đã hết hạn' : '📅 Đến'} {new Date(a.valid_until).toLocaleDateString('vi-VN')}
                    </div>
                  )}
                </div>
                <div
                  style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: a.active ? '#f0fff4' : '#f5f5f5', color: a.active ? '#1a6b3a' : C.mid, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onClick={() => toggleActive(a)}
                >
                  {a.active ? 'Đang hoạt động' : 'Đã tắt'}
                </div>
                <Btn variant="ghost" small onClick={() => edit(a)}>✏️</Btn>
                <Btn variant="danger" small onClick={() => remove(a.id)}>🗑</Btn>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Marketing : Khuyến khích đánh giá ───────────────────────
function SubReviewIncentive({ merchantId, toast }) {
  const [config, setConfig] = useState({ enabled: false, reward_percent: 10, cooldown_days: 60 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!merchantId) return
    ;(async () => {
      const { data } = await supabase.from('review_config').select('*').eq('merchant_id', merchantId).maybeSingle()
      if (data) setConfig({ enabled: data.enabled, reward_percent: data.reward_percent, cooldown_days: data.cooldown_days })
      setLoading(false)
    })()
  }, [merchantId])

  async function save() {
    const percent = Math.max(5, Math.min(30, parseInt(config.reward_percent) || 10))
    const cooldown = Math.max(30, Math.min(180, parseInt(config.cooldown_days) || 60))
    const payload = { merchant_id: merchantId, enabled: config.enabled, reward_percent: percent, cooldown_days: cooldown }
    await supabase.from('review_config').upsert(payload, { onConflict: 'merchant_id' })
    setConfig(p => ({ ...p, reward_percent: percent, cooldown_days: cooldown }))
    toast('Đã lưu', true)
  }

  async function toggleEnabled() {
    const newEnabled = !config.enabled
    setConfig(p => ({ ...p, enabled: newEnabled }))
    await supabase.from('review_config').upsert({ merchant_id: merchantId, enabled: newEnabled, reward_percent: config.reward_percent, cooldown_days: config.cooldown_days }, { onConflict: 'merchant_id' })
    toast(newEnabled ? 'Đã bật khuyến khích đánh giá' : 'Đã tắt khuyến khích đánh giá', true)
  }

  const f = field => e => setConfig(p => ({ ...p, [field]: e.target.value }))

  if (loading) return <div style={{ color: C.mid }}>Đang tải…</div>

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '15px', color: C.dark }}>Khuyến khích đánh giá bằng giảm giá</div>
          <div style={{ fontSize: '13px', color: C.mid, marginTop: '4px' }}>Khách hàng đã điểm danh thẻ thân thiết gần đây sẽ nhận mã giảm giá khi viết đánh giá.</div>
        </div>
        <div onClick={toggleEnabled} style={{ cursor: 'pointer', width: '44px', height: '24px', borderRadius: '12px', background: config.enabled ? C.red : '#ccc', position: 'relative', flexShrink: 0, transition: 'background .15s' }}>
          <div style={{ position: 'absolute', top: '2px', left: config.enabled ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: C.white, transition: 'left .15s' }} />
        </div>
      </div>
      {config.enabled && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <FieldGroup label="Giảm giá (%)">
              <input type="number" min="5" max="30" value={config.reward_percent ?? ''} onChange={f('reward_percent')} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark, outline: 'none', boxSizing: 'border-box', background: C.white, fontFamily: "'Be Vietnam Pro', sans-serif" }} />
            </FieldGroup>
            <FieldGroup label="Thời gian giữa 2 đánh giá (ngày)">
              <input type="number" min="30" max="180" value={config.cooldown_days ?? ''} onChange={f('cooldown_days')} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark, outline: 'none', boxSizing: 'border-box', background: C.white, fontFamily: "'Be Vietnam Pro', sans-serif" }} />
            </FieldGroup>
          </div>
          <div style={{ fontSize: '12px', color: C.mid, marginBottom: '16px', padding: '12px', background: C.bg, borderRadius: '8px' }}>
            💡 Giảm giá: 5-30%. Thời gian: 30-180 ngày (mặc định 60). Khách hàng chỉ nhận 1 mã giảm giá mỗi khoảng thời gian này.
          </div>
          <SaveBtn onClick={save} />
        </>
      )}
    </Card>
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
      {sub === 'thongbao'   && <SubThongBao merchantId={merchantId} toast={toast} />}
      {sub === 'review'     && <SubReviewIncentive merchantId={merchantId} toast={toast} />}
    </div>
  )
}

// ─── Section Avis ─────────────────────────────────────────────
function SectionAvis({ merchantId, toast }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ author_name: '', content: '', rating: 5, visible: true })
  const [showReviews, setShowReviews] = useState(true)

  async function load() {
    const [{ data: reviewsData }, { data: merchantData }] = await Promise.all([
      supabase.from('reviews').select('*').eq('merchant_id', merchantId).order('created_at', { ascending: false }),
      supabase.from('merchants').select('show_reviews').eq('id', merchantId).maybeSingle(),
    ])
    setReviews(reviewsData || [])
    if (merchantData) setShowReviews(merchantData.show_reviews !== false)
    setLoading(false)
  }
  useEffect(() => { if (merchantId) load() }, [merchantId])
  async function save() {
    if (!form.author_name) { toast('Yêu cầu tên', false); return }
    if (!await moderate([form.author_name, form.content])) { toast('Nội dung không được phép', false); return }
    await supabase.from('reviews').insert({ ...form, merchant_id: merchantId })
    fetch('/api/reviews/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchantId, review: form })
    }).catch(e => console.warn('[notify] failed:', e))
    setShowForm(false); setForm({ author_name: '', content: '', rating: 5, visible: true }); load(); toast('Đã thêm đánh giá', true)
  }
  async function toggleVisible(r) { await supabase.from('reviews').update({ visible: !r.visible }).eq('id', r.id); load() }
  async function toggleShowReviews() {
    const newVal = !showReviews
    setShowReviews(newVal)
    await supabase.from('merchants').update({ show_reviews: newVal }).eq('id', merchantId)
    toast(newVal ? 'Phần đánh giá được hiển thị' : 'Phần đánh giá đã ẩn', true)
  }
  async function remove(id) { if (!confirm('Xóa?')) return; await supabase.from('reviews').delete().eq('id', id); load(); toast('Đã xóa', true) }
  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}><SectionTitle>Đánh giá của khách</SectionTitle><Btn onClick={() => setShowForm(v => !v)}>+ Thêm</Btn></div>
      <Card style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: '600', fontSize: '14px', color: C.dark }}>Hiện phần đánh giá trên Mini App</div>
          <div style={{ fontSize: '12px', color: C.mid, marginTop: '2px' }}>Tắt nếu bạn không muốn khách hàng thấy và gửi đánh giá.</div>
        </div>
        <div onClick={toggleShowReviews} style={{ cursor: 'pointer', width: '44px', height: '24px', borderRadius: '12px', background: showReviews ? C.red : '#ccc', position: 'relative', flexShrink: 0, transition: 'background .15s' }}>
          <div style={{ position: 'absolute', top: '2px', left: showReviews ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: C.white, transition: 'left .15s' }} />
        </div>
      </Card>
      {showForm && (
        <Card style={{ marginBottom: '16px', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Tên"><Input value={form.author_name} onChange={f('author_name')} placeholder="Nguyễn Thị Lan" /></FieldGroup>
            <FieldGroup label="Đánh giá (1–5)"><Input value={form.rating} onChange={f('rating')} type="number" /></FieldGroup>
          </div>
          <FieldGroup label="Bình luận"><Textarea value={form.content} onChange={f('content')} placeholder="Dịch vụ rất tốt…" /></FieldGroup>
          <div style={{ display: 'flex', gap: '8px' }}><SaveBtn onClick={save} /><Btn variant="ghost" onClick={() => setShowForm(false)}>Hủy</Btn></div>
        </Card>
      )}
      {loading ? <div style={{ color: C.mid }}>Đang tải…</div> : reviews.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}><div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div><div>Chưa có đánh giá.</div></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {reviews.map(r => (
            <Card key={r.id} style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '700', fontSize: '14px', color: C.dark }}>{r.author_name}</span>
                    <span style={{ fontSize: '13px', color: C.gold }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    {r.verified && (
                      <span style={{ fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', background: '#e8f5e9', color: '#1a6b3a' }}>✓ Đã xác minh</span>
                    )}
                  </div>
                  {r.content && <div style={{ fontSize: '13px', color: C.mid }}>{r.content}</div>}
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', background: r.visible ? '#f0fff4' : '#f5f5f5', color: r.visible ? '#1a6b3a' : C.mid }} onClick={() => toggleVisible(r)}>{r.visible ? 'Hiển thị' : 'Ẩn'}</div>
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
      {loading ? <div style={{ color: C.mid }}>Đang tải…</div> : contacts.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}><div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div><div>Chưa có khách hàng.</div><div style={{ fontSize: '12px', marginTop: '6px' }}>Khách hàng sẽ xuất hiện ngay khi có người mở Mini App của bạn.</div></Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead><tr style={{ background: C.bg }}>{['Tên', 'Số điện thoại', 'Zalo ID', 'Đã ghi nhận'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600', color: C.mid }}>{h}</th>)}</tr></thead>
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
    if (!message.trim()) { toast('Tin nhắn trống', false); return }
    setSending(true)
    if (!await moderate([message.trim()])) { toast('Nội dung không được phép', false); return }
    await supabase.from('broadcasts').insert({ merchant_id: merchantId, message: message.trim(), recipient_count: contactCount, status: 'sent' })
    setMessage(''); setSending(false); load(); toast('Đã lưu thông báo', true)
  }

  return (
    <div>
      <SectionTitle>Gửi tin ZNS</SectionTitle>
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ fontWeight: '700', color: C.dark, marginBottom: '12px' }}>Tin mới <span style={{ fontSize: '12px', fontWeight: '400', color: C.mid, marginLeft: '8px' }}>{contactCount} contact{contactCount > 1 ? 's' : ''}</span></div>
        <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Viết tin khuyến mãi của bạn…" rows={4} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <div style={{ fontSize: '12px', color: C.mid }}>{message.length}/500</div>
          <Btn onClick={send} disabled={sending || !message.trim()}>{sending ? 'Đang gửi…' : '📢 Gửi'}</Btn>
        </div>
      </Card>
      <div style={{ fontWeight: '700', color: C.dark, marginBottom: '12px' }}>Lịch sử</div>
      {loading ? <div style={{ color: C.mid }}>Đang tải…</div> : broadcasts.length === 0 ? (
        <Card style={{ textAlign: 'center', color: C.mid }}><div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div><div>Chưa có tin nào.</div></Card>
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
    if (!await moderate([form.name, form.address, form.welcome_message])) { showToast('Nội dung không được phép', false); return }
    const { error } = await supabase.from('merchants').update(form).eq('id', merchant.id)
    if (error) { showToast('Lỗi', false); return }
    setMerchant({ ...merchant, ...form }); showToast('Đã lưu', true)
  }

  async function logout() { await supabase.auth.signOut(); router.push('/login') }

  if (!user || !merchant) {
    return <div style={{ minHeight: '100vh', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Be Vietnam Pro', sans-serif" }}><div style={{ textAlign: 'center', color: C.mid }}><div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div><div>Đang tải…</div></div></div>
  }

  return (
    <>
      <Head>
        <title>Bảng điều khiển — VietMini</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} />}
        <aside className="sidebar" style={{ width: '220px', background: C.dark, display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: sidebarOpen ? 0 : '-220px', height: '100vh', zIndex: 50, transition: 'left .25s ease' }}>
          <div style={{ minHeight: '64px', padding: '12px 20px', background: 'linear-gradient(135deg, #1A0A00, #2D1200)', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{ width: '28px', height: '28px', background: C.red, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>V</div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
              <span style={{ color: C.white, fontWeight: '700', fontSize: '14px', lineHeight: '1.1' }}>VietMini</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.1', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{merchant.name || 'Cửa hàng của tôi'}</span>
            </div>
          </div>
          <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto', display: 'flex', flexDirection: 'column', background: C.dark }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setActiveTab(t.id); setSidebarOpen(false) }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', background: activeTab === t.id ? 'rgba(208,2,27,0.25)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderLeft: activeTab === t.id ? `3px solid ${C.red}` : '3px solid transparent', fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'background .15s' }}>
                <span style={{ fontSize: '16px', width: '22px', textAlign: 'center' }}>{t.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: activeTab === t.id ? '600' : '500', color: activeTab === t.id ? C.white : '#D4D4D4' }}>{t.label}</span>
              </button>
            ))}
          </nav>
          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            <button onClick={logout} style={{ width: '100%', padding: '8px', borderRadius: '7px', background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.85)', fontSize: '13px', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Đăng xuất</button>
          </div>
        </aside>
        <main className="main-content" style={{ flex: 1, marginLeft: '0', minHeight: '100vh' }}>
          <div className="topbar" style={{ position: 'sticky', top: 0, zIndex: 30, background: C.white, borderBottom: `1px solid ${C.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: C.dark, padding: '0' }}>☰</button>
            <div style={{ fontWeight: '700', color: C.dark, fontSize: '15px' }}>{TABS.find(t => t.id === activeTab)?.label}</div>
            <div style={{ width: '24px' }} />
          </div>
          {/* Bandeau abonnement — affiché uniquement si pas encore abonné */}
          {!merchant.subscription_active && (
            <div style={{ minHeight: '64px', background: 'linear-gradient(135deg, #1A0A00, #2D1200)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>⚡</span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>App của bạn đang ở <strong style={{ color: '#F5A623' }}>chế độ xem thử</strong> — khách hàng chưa thể truy cập.</span>
              </div>
              <a href="/abonnement" style={{ flexShrink: 0, background: '#F5A623', color: '#1A0A00', fontWeight: '700', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Kích hoạt thuê bao →</a>
            </div>
          )}
          <div style={{ padding: '28px 24px', maxWidth: '800px' }}>
            {activeTab === 'apercu'     && <SectionApercu merchant={merchant} contacts={contacts} broadcasts={broadcasts} onChangeVertical={async () => { if (window.confirm("Đổi ngành nghề? Tất cả dữ liệu cấu hình sẽ được thiết lập lại.")) { await supabase.from('merchants').update({ vertical: null }).eq('id', merchant.id); router.push('/onboarding') } }} />}
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