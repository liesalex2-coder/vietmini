import Head from 'next/head'
import Link from 'next/link'

const C = {
  red: '#D0021B', gold: '#F5A623', dark: '#1A0A00',
  mid: '#7A4A2A', bg: '#FDF6EE', white: '#fff',
  border: '#e5d9ce'
}

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

export default function Abonnement() {
  return (
    <>
      <Head>
        <title>Abonnement — VietMini</title>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Be Vietnam Pro', sans-serif" }}>

        {/* Header simple */}
        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: C.red, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: '700', fontSize: '16px' }}>V</div>
            <span style={{ fontWeight: '700', fontSize: '16px', color: C.dark }}>VietMini</span>
          </Link>
          <Link href="/dashboard" style={{ fontSize: '13px', color: C.mid, textDecoration: 'none' }}>← Retour au dashboard</Link>
        </div>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '60px 24px 40px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(208,2,27,0.08)', color: C.red, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', padding: '4px 12px', borderRadius: '20px', marginBottom: '16px' }}>Abonnement annuel</div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: '900', color: C.dark, letterSpacing: '-1px', lineHeight: 1.1, margin: '0 0 12px' }}>Activez votre Mini App Zalo</h1>
          <p style={{ fontSize: '16px', color: C.mid, maxWidth: '480px', margin: '0 auto' }}>Votre app est prête — vos clients n'attendent que vous.</p>
        </div>

        {/* Carte prix */}
        <div style={{ maxWidth: '480px', margin: '0 auto 60px', padding: '0 24px' }}>
          <div style={{ background: C.white, borderRadius: '20px', boxShadow: '0 8px 40px rgba(26,10,0,0.1)', overflow: 'hidden', border: `2px solid ${C.gold}` }}>

            {/* Badge */}
            <div style={{ background: C.gold, padding: '8px 24px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: C.dark, textTransform: 'uppercase', letterSpacing: '1px' }}>Tout inclus — sans surprise</span>
            </div>

            <div style={{ padding: '32px 32px 28px' }}>
              {/* Prix */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontSize: '13px', color: C.mid, marginBottom: '4px' }}>Abonnement annuel</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '48px', fontWeight: '900', color: C.dark, lineHeight: 1 }}>2.000.000</span>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: C.mid, marginBottom: '6px' }}>₫ HT</span>
                </div>
                <div style={{ fontSize: '13px', color: C.mid, marginTop: '4px' }}>soit ~167.000 ₫ / mois</div>
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
                onClick={() => alert('Paiement bientôt disponible — contactez-nous sur Zalo pour activer votre abonnement.')}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: C.red, color: C.white, fontWeight: '700', fontSize: '16px', border: 'none', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}
              >
                Activer mon abonnement →
              </button>

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