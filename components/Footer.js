export default function Footer() {
  const C = {
    gold: '#F5A623',
    mutedLight: 'rgba(255,255,255,0.75)',
    muted: 'rgba(255,255,255,0.5)',
    mutedDark: 'rgba(255,255,255,0.35)',
    dim: 'rgba(255,255,255,0.25)',
    border: 'rgba(255,255,255,0.08)',
  }

  const colTitle = {
    fontSize: '13px', fontWeight: 700, color: '#fff',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    marginBottom: '16px'
  }

  const link = {
    fontSize: '13px', color: C.mutedLight, textDecoration: 'none',
    display: 'block', marginBottom: '10px', lineHeight: 1.5
  }

  const infoLine = {
    fontSize: '13px', color: C.mutedLight, marginBottom: '10px', lineHeight: 1.6
  }

  return (
    <footer className="site-footer" style={{ background: '#1A0A00', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* 4 colonnes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Colonne 1 : Về VietMini */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#fff' }}>
              Viet<span style={{ color: C.gold }}>Mini</span>
            </span>
          </div>
          <p style={{ fontSize: '13px', color: C.mutedLight, lineHeight: 1.7, margin: 0 }}>
            Nền tảng Mini App Zalo cho các doanh nghiệp vừa và nhỏ tại Việt Nam.
          </p>
        </div>

        {/* Colonne 2 : Sản phẩm */}
        <div>
          <div style={colTitle}>Sản phẩm</div>
          <a href="/comment-ca-marche" style={link}>Cách hoạt động</a>
          <a href="/demos" style={link}>Demo</a>
          <a href="/tarifs" style={link}>Bảng giá</a>
        </div>

        {/* Colonne 3 : Hỗ trợ */}
        <div>
          <div style={colTitle}>Hỗ trợ</div>
          <a href="/about" style={link}>Về chúng tôi</a>
          <a href="/privacy" style={link}>Chính sách bảo mật</a>
          <a href="/terms" style={link}>Điều khoản sử dụng</a>
        </div>

        {/* Colonne 4 : Liên hệ */}
        <div>
          <div style={colTitle}>Liên hệ</div>
          <div style={{ ...infoLine, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px' }}>📞</span>
            <a href="tel:+84866125201" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>0866 125 201</a>
          </div>
          <div style={{ ...infoLine, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px' }}>✉️</span>
            <a href="mailto:contact@leadingstarai.com" style={{ color: C.mutedLight, textDecoration: 'none' }}>contact@leadingstarai.com</a>
          </div>
          <div style={{ ...infoLine, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '15px' }}>📍</span>
            <span>147 Võ Chí Công, Phường Hàm Thắng, Tỉnh Lâm Đồng</span>
          </div>
        </div>

      </div>

      {/* Bloc infos légales — Điều 29 Nghị định 52/2013/NĐ-CP */}
      <div style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '24px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: '12px', color: C.muted, lineHeight: 1.8 }}>
          <div style={{ color: C.mutedLight, fontWeight: 700, marginBottom: '4px' }}>
            CÔNG TY TNHH NGÔI SAO DẪN ĐẦU AI
          </div>
          <div>
            MST: <strong style={{ color: C.mutedLight }}>3401278978</strong>
            {' — '}Cấp ngày 05/12/2025 bởi Sở Tài chính tỉnh Lâm Đồng
          </div>
          <div>
            Địa chỉ trụ sở: 147 Võ Chí Công, Phường Hàm Thắng, Tỉnh Lâm Đồng, Việt Nam
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: C.dim }}>
            © 2026 Leading Star AI. Mọi quyền được bảo lưu.
          </div>
          {/* Emplacement futur : logo "Đã thông báo Bộ Công Thương" */}
        </div>
      </div>

    </footer>
  )
}