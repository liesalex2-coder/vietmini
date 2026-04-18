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
  'Mini App Zalo personnalisée à votre image',
  'Roue de la chance & offres flash',
  'Carte de fidélité numérique',
  'Coupons & offre de bienvenue',
  'Contacts clients illimités',
  'Tableau de bord marchand complet',
  'Accès immédiat — app disponible le jour même',
  'Mises à jour incluses',
  'Support inclus',
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

  const finalPrice = appliedCode
    ? Math.round(BASE_PRICE * (1 - appliedCode.discount_percentage / 100))
    : BASE_PRICE

  async function handleValidate() {
    setCodeMsg('')
    setCodeMsgType('')

    if (!code.trim()) {
      setCodeMsg('Veuillez saisir un code.')
      setCodeMsgType('error')
      return
    }

    setValidating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setCodeMsg('Veuillez vous reconnecter.')
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
        setCodeMsg(data.error || 'Erreur inconnue')
        setCodeMsgType('error')
        setValidating(false)
        return
      }

      setAppliedCode({
        code: data.code,
        discount_percentage: data.discount_percentage
      })
      setCodeMsg(`Code appliqué — réduction de ${data.discount_percentage}%`)
      setCodeMsgType('success')
      setValidating(false)
    } catch (e) {
      setCodeMsg('Erreur de connexion.')
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
    alert('Paiement bientôt disponible — contactez-nous sur Zalo pour activer votre abonnement.')
  }

  return (
    <>
      <Head>
        <title>Abonnement — VietMini</title>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Be Vietnam Pro', sans-serif" }}>

        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: C.red, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: '700', fontSize: '16px' }}>V</div>
            <span style={{ fontWeight: '700', fontSize: '16px', color: C.dark }}>VietMini</span>
          </Link>
          <Link href="/dashboard" style={{ fontSize: '13px', color: C.mid, textDecoration: 'none' }}>← Retour au dashboard</Link>
        </div>

        <div style={{ textAlign: 'center', padding: '60px 24px 40px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(208,2,27,0.08)', color: C.red, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', padding: '4px 12px', borderRadius: '20px', marginBottom: '16px' }}>Abonnement annuel</div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: '900', color: C.dark, letterSpacing: '-1px', lineHeight: 1.1, margin: '0 0 12px' }}>Activez votre Mini App Zalo</h1>
          <p style={{ fontSize: '16px', color: C.mid, maxWidth: '480px', margin: '0 auto' }}>Votre app est prête — vos clients n'attendent que vous.</p>
        </div>

        <div style={{ maxWidth: '480px', margin: '0 auto 60px', padding: '0 24px' }}>
          <div style={{ background: C.white, borderRadius: '20px', boxShadow: '0 8px 40px rgba(26,10,0,0.1)', overflow: 'hidden', border: `2px solid ${C.gold}` }}>

            <div style={{ background: C.gold, padding: '8px 24px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: C.dark, textTransform: 'uppercase', letterSpacing: '1px' }}>Tout inclus — sans surprise</span>
            </div>

            <div style={{ padding: '32px 32px 28px' }}>
              {/* Prix */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontSize: '13px', color: C.mid, marginBottom: '4px' }}>Abonnement annuel</div>

                {appliedCode && appliedCode.discount_percentage < 100 && (
                  <div style={{ fontSize: '18px', color: C.mid, textDecoration: 'line-through', marginBottom: '2px', fontWeight: '600' }}>
                    {formatVND(BASE_PRICE)} ₫
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '48px', fontWeight: '900', color: appliedCode ? C.red : C.dark, lineHeight: 1 }}>
                    {formatVND(finalPrice)}
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: C.mid, marginBottom: '6px' }}>₫ HT</span>
                </div>

                {appliedCode ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(22,163,74,0.1)', color: '#16a34a', fontSize: '12px', fontWeight: '700', padding: '6px 12px', borderRadius: '20px', marginTop: '10px' }}>
                    <span>Code {appliedCode.code} appliqué (−{appliedCode.discount_percentage}%)</span>
                    <span onClick={handleRemoveCode} style={{ cursor: 'pointer', color: C.mid, fontWeight: '900' }}>×</span>
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: C.mid, marginTop: '4px' }}>soit ~167.000 ₫ / mois</div>
                )}
              </div>

              {/* Features */}
              <div style={{ marginBottom: '28px' }}>
                {FEATURES.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: i < FEATURES.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <span style={{ color: '#16a34a', fontSize: '15px', flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: '14px', color: C.dark }}>{f}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '13px', color: C.mid, fontStyle: 'italic', margin: '0 0 20px', textAlign: 'center' }}>… et bien d'autres fonctionnalités à venir.</p>

              {/* CTA */}
              <button
                onClick={handlePay}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: C.red, color: C.white, fontWeight: '700', fontSize: '16px', border: 'none', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}
              >
                {appliedCode && finalPrice === 0
                  ? 'Activer mon abonnement →'
                  : `Payer ${formatVND(finalPrice)} ₫ →`}
              </button>

              {/* Code d'activation discret */}
              {!appliedCode && !showCode && (
                <p style={{ textAlign: 'center', marginTop: '16px' }}>
                  <span onClick={() => setShowCode(true)} style={{ fontSize: '12px', color: C.mid, cursor: 'pointer', textDecoration: 'underline' }}>Code d'activation</span>
                </p>
              )}
              {!appliedCode && showCode && (
                <div style={{ marginTop: '16px' }}>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    onKeyDown={e => { if (e.key === 'Enter') handleValidate() }}
                    placeholder="Entrez votre code"
                    disabled={validating}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '14px', color: C.dark, outline: 'none', boxSizing: 'border-box', fontFamily: "'Be Vietnam Pro', sans-serif", textTransform: 'uppercase', letterSpacing: '2px' }}
                  />
                  <button
                    onClick={handleValidate}
                    disabled={validating}
                    style={{ width: '100%', marginTop: '8px', padding: '10px', borderRadius: '8px', background: validating ? C.mid : C.dark, color: C.white, fontWeight: '600', fontSize: '14px', border: 'none', cursor: validating ? 'wait' : 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}
                  >{validating ? 'Vérification…' : 'Appliquer'}</button>
                  {codeMsg && (
                    <p style={{ fontSize: '12px', color: codeMsgType === 'success' ? '#16a34a' : C.red, textAlign: 'center', marginTop: '8px', fontWeight: codeMsgType === 'success' ? '600' : '400' }}>
                      {codeMsg}
                    </p>
                  )}
                </div>
              )}

              <p style={{ textAlign: 'center', fontSize: '12px', color: C.mid, marginTop: '12px' }}>
                Paiement sécurisé
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}