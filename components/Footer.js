export default function Footer() {
  const linkStyle = { fontSize: '13px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }
  const legalStyle = { fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }
  const sep = { fontSize: '12px', color: 'rgba(255,255,255,0.2)' }

  return (
    <footer style={{ background: '#1A0A00', padding: '36px 48px 28px', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Ligne principale */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '18px', fontWeight: 900, color: 'white' }}>Viet<span style={{ color: '#F5A623' }}>Mini</span></span>
          <div style={{ marginTop: '10px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <a href="/comment-ca-marche" style={linkStyle}>Comment ça marche</a>
            <a href="/demos" style={linkStyle}>Démos</a>
            <a href="/tarifs" style={linkStyle}>Tarifs</a>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a href="/about" style={legalStyle}>Về chúng tôi</a>
          <span style={sep}>•</span>
          <a href="/privacy" style={legalStyle}>Chính sách bảo mật</a>
          <span style={sep}>•</span>
          <a href="/terms" style={legalStyle}>Điều khoản sử dụng</a>
        </div>
      </div>

      {/* Infos légales obligatoires — Điều 29 Nghị định 52/2013/NĐ-CP */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
        <div><strong style={{ color: 'rgba(255,255,255,0.55)' }}>CÔNG TY TNHH NGÔI SAO DẪN ĐẦU AI</strong> (LEADING STAR AI CO.LTD.)</div>
        <div>Địa chỉ: 147 Võ Chí Công, Phường Hàm Thắng, Tỉnh Lâm Đồng, Việt Nam</div>
        <div>Mã số doanh nghiệp: 3401278978 — cấp ngày 05/12/2025 bởi Sở Tài chính tỉnh Lâm Đồng</div>
        <div>Email: contact@leadingstarai.com</div>
        <div style={{ marginTop: '12px', color: 'rgba(255,255,255,0.3)' }}>© 2026 Leading Star AI. Tous droits réservés.</div>
      </div>
    </footer>
  )
}