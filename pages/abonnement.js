import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const C = {
  red: '#D0021B', gold: '#F5A623', dark: '#1A0A00',
  mid: '#7A4A2A', bg: '#FDF6EE', white: '#fff',
  border: '#e5d9ce'
}

const BASE_PRICE = 2000000

const FEATURES = [
  'Mini App Zalo mang đậm dấu ấn thương hiệu',
  'Vòng quay may mắn & ưu đãi chớp nhoáng',
  'Thẻ khách hàng thân thiết điện tử',
  'Mã giảm giá & ưu đãi chào mừng',
  'Không giới hạn liên hệ khách hàng',
  'Bảng điều khiển quản lý đầy đủ',
  'Truy cập ngay — app sẵn sàng trong ngày',
  'Đã bao gồm các bản cập nhật',
  'Đã bao gồm hỗ trợ',
]

function formatVND(n) {
  return n.toLocaleString('fr-FR').replace(/\s/g, '.')
}

export default function Abonnement() {
  const [showCode, setShowCode] = useState(false)
  const [code, setCode] = useState('')
  const [codeMsg, setCodeMsg] = useState('')
  const [codeMsgType, setCodeMsgType] = useState('')
  const [validating, setValidating] = useState(false)
  const [appliedCode, setAppliedCode] = useState(null)

  const discount = appliedCode
    ? Math.round(BASE_PRICE * appliedCode.discount_percentage / 100)
    : 0
  const finalPrice = BASE_PRICE - discount

  async function handleValidate() {
    setCodeMsg('')
    setCodeMsgType('')

    if (!code.trim()) {
      setCodeMsg('Vui lòng nhập mã.')
      setCodeMsgType('error')
      return
    }

    setValidating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setCodeMsg('Vui lòng đăng nhập lại.')
        setCodeMsgType('error')
        setValidating(false)
        return
      }

      const res = await fetch('/api/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          access_token: session.access_token
        })
      })
      const data = await res.json()

      if (!res.ok) {
        setCodeMsg(data.error || 'Lỗi không xác định')
        setCodeMsgType('error')
        setValidating(false)
        return
      }

      setAppliedCode({
        code: data.code,
        discount_percentage: data.discount_percentage
      })
      setCodeMsg('')
      setCodeMsgType('')
      setShowCode(false)
      setValidating(false)
    } catch (e) {
      setCodeMsg('Lỗi kết nối.')
      setCodeMsgType('error')
      setValidating(false)
    }
  }

  function handleRemoveCode() {
    setAppliedCode(null)
    setCode('')
    setCodeMsg('')
    setCodeMsgType('')
    setShowCode(false)
  }

  function handlePay() {
    alert('Thanh toán sẽ sớm khả dụng — liên hệ với chúng tôi qua Zalo để kích hoạt thuê bao.')
  }

  return (
    <>
      <Head>
        <title>Gói thuê bao — VietMini</title>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Be Vietnam Pro', sans-serif" }}>

        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: C.red, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: '700', fontSize: '16px' }}>V</div>
            <span style={{ fontWeight: '700', fontSize: '16px', color: C.dark }}>VietMini</span>
          </Link>
          <Link href="/dashboard" style={{ fontSize: '13px', color: C.mid, textDecoration: 'none' }}>← Quay lại bảng điều khiển</Link>
        </div>

        <div style={{ textAlign: 'center', padding: '60px 24px 40px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(208,2,27,0.08)', color: C.red, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', padding: '4px 12px', borderRadius: '20px', marginBottom: '16px' }}>Thuê bao hằng năm</div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: '900', color: C.dark, letterSpacing: '-1px', lineHeight: 1.1, margin: '0 0 12px' }}>Kích hoạt Mini App Zalo của bạn</h1>
          <p style={{ fontSize: '16px', color: C.mid, maxWidth: '480px', margin: '0 auto' }}>App của bạn đã sẵn sàng — khách hàng chỉ chờ bạn thôi.</p>
        </div>

        <div style={{ maxWidth: '480px', margin: '0 auto 60px', padding: '0 24px' }}>
          <div style={{ background: C.white, borderRadius: '20px', boxShadow: '0 8px 40px rgba(26,10,0,0.1)', overflow: 'hidden', border: `2px solid ${C.gold}` }}>

            <div style={{ background: C.gold, padding: '8px 24px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: C.dark, textTransform: 'uppercase', letterSpacing: '1px' }}>Đã bao gồm tất cả — không phát sinh</span>
            </div>

            <div style={{ padding: '32px 32px 28px' }}>

              {/* Features */}
              <div style={{ marginBottom: '24px' }}>
                {FEATURES.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: i < FEATURES.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <span style={{ color: '#16a34a', fontSize: '15px', flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: '14px', color: C.dark }}>{f}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '13px', color: C.mid, fontStyle: 'italic', margin: '0 0 24px', textAlign: 'center' }}>… và nhiều tính năng khác đang phát triển.</p>

              {/* Bloc récap prix */}
              <div style={{ background: C.bg, borderRadius: '12px', padding: '18px 20px', marginBottom: '20px' }}>

                {appliedCode ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '14px', color: C.dark, fontWeight: '500' }}>Thuê bao hằng năm</span>
                      <span style={{ fontSize: '15px', color: C.dark, fontWeight: '700' }}>{formatVND(BASE_PRICE)} ₫</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '14px', color: '#16a34a', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Mã {appliedCode.code}
                        <span
                          onClick={handleRemoveCode}
                          style={{ cursor: 'pointer', color: C.mid, fontSize: '16px', fontWeight: '700', lineHeight: 1 }}
                          title="Xóa mã"
                        >×</span>
                      </span>
                      <span style={{ fontSize: '15px', color: '#16a34a', fontWeight: '700' }}>−{appliedCode.discount_percentage}%</span>
                    </div>

                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '13px', color: C.mid, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tổng thanh toán</span>
                      <span>
                        <span style={{ fontSize: '28px', fontWeight: '900', color: C.red }}>{formatVND(finalPrice)}</span>
                        <span style={{ fontSize: '14px', color: C.mid, fontWeight: '700', marginLeft: '3px' }}>₫ chưa VAT</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '13px', color: C.mid, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tổng thanh toán</span>
                    <span>
                      <span style={{ fontSize: '28px', fontWeight: '900', color: C.dark }}>{formatVND(BASE_PRICE)}</span>
                      <span style={{ fontSize: '14px', color: C.mid, fontWeight: '700', marginLeft: '3px' }}>₫ chưa VAT</span>
                    </span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={handlePay}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: C.red, color: C.white, fontWeight: '700', fontSize: '16px', border: 'none', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}
              >
                {finalPrice === 0
                  ? 'Kích hoạt thuê bao →'
                  : `Thanh toán ${formatVND(finalPrice)} ₫ →`}
              </button>

              {/* Code d'activation discret */}
              {!appliedCode && !showCode && (
                <p style={{ textAlign: 'center', marginTop: '16px' }}>
                  <span onClick={() => setShowCode(true)} style={{ fontSize: '12px', color: C.mid, cursor: 'pointer', textDecoration: 'underline' }}>Mã kích hoạt</span>
                </p>
              )}
              {!appliedCode && showCode && (
                <div style={{ marginTop: '16px' }}>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    onKeyDown={e => { if (e.key === 'Enter') handleValidate() }}
                    placeholder="Nhập mã của bạn"
                    disabled={validating}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark, outline: 'none', boxSizing: 'border-box', fontFamily: "'Be Vietnam Pro', sans-serif", textTransform: 'uppercase', letterSpacing: '2px' }}
                  />
                  <button
                    onClick={handleValidate}
                    disabled={validating}
                    style={{ width: '100%', marginTop: '8px', padding: '10px', borderRadius: '8px', background: validating ? C.mid : C.dark, color: C.white, fontWeight: '600', fontSize: '14px', border: 'none', cursor: validating ? 'wait' : 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}
                  >{validating ? 'Đang kiểm tra…' : 'Áp dụng'}</button>
                  {codeMsg && (
                    <p style={{ fontSize: '12px', color: codeMsgType === 'success' ? '#16a34a' : C.red, textAlign: 'center', marginTop: '8px', fontWeight: codeMsgType === 'success' ? '600' : '400' }}>
                      {codeMsg}
                    </p>
                  )}
                </div>
              )}

              <p style={{ textAlign: 'center', fontSize: '12px', color: C.mid, marginTop: '12px' }}>
                Thanh toán an toàn
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}