import Head from 'next/head'
import Link from 'next/link'

const C = {
  red: '#D0021B', gold: '#F5A623', dark: '#1A0A00',
  mid: '#7A4A2A', bg: '#FDF6EE', white: '#fff',
  border: '#e5d9ce'
}

export default function About() {
  return (
    <>
      <Head>
        <title>Về chúng tôi — VietMini</title>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Be Vietnam Pro', sans-serif" }}>

        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '16px 24px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: C.red, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: '700', fontSize: '16px' }}>V</div>
            <span style={{ fontWeight: '700', fontSize: '16px', color: C.dark }}>VietMini</span>
          </Link>
        </div>

        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px 80px' }}>

          <h1 style={{ fontSize: '32px', fontWeight: '900', color: C.dark, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Về chúng tôi</h1>
          <p style={{ fontSize: '15px', color: C.mid, margin: '0 0 40px' }}>Thông tin chính thức về chủ sở hữu website VietMini</p>

          <div style={{ background: C.white, borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(26,10,0,0.06)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: C.dark, margin: '0 0 20px' }}>Thông tin doanh nghiệp</h2>

            <Row label="Tên công ty (tiếng Việt)" value="CÔNG TY TNHH NGÔI SAO DẪN ĐẦU AI" />
            <Row label="Tên công ty (tiếng Anh)" value="LEADING STAR AI COMPANY LIMITED" />
            <Row label="Tên viết tắt" value="LEADING STAR AI CO.LTD." />
            <Row label="Loại hình doanh nghiệp" value="Công ty TNHH hai thành viên trở lên" />
            <Row label="Mã số doanh nghiệp" value="3401278978" />
            <Row label="Ngày cấp giấy chứng nhận" value="05/12/2025" />
            <Row label="Nơi cấp" value="Sở Tài chính tỉnh Lâm Đồng — Phòng Đăng ký kinh doanh" />
            <Row label="Vốn điều lệ" value="150.000.000 VNĐ (Một trăm năm mươi triệu đồng)" last />
          </div>

          <div style={{ background: C.white, borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(26,10,0,0.06)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: C.dark, margin: '0 0 20px' }}>Trụ sở chính</h2>
            <p style={{ fontSize: '15px', color: C.dark, margin: 0, lineHeight: 1.7 }}>
              147 Võ Chí Công<br />
              Phường Hàm Thắng<br />
              Tỉnh Lâm Đồng, Việt Nam
            </p>
          </div>

          <div style={{ background: C.white, borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(26,10,0,0.06)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: C.dark, margin: '0 0 20px' }}>Liên hệ</h2>
            <Row label="Email" value="contact@leadingstarai.com" last />
          </div>

          <div style={{ background: C.white, borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(26,10,0,0.06)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: C.dark, margin: '0 0 16px' }}>Về sản phẩm VietMini</h2>
            <p style={{ fontSize: '14px', color: C.dark, margin: '0 0 12px', lineHeight: 1.7 }}>
              VietMini là nền tảng SaaS giúp các doanh nghiệp vừa và nhỏ tại Việt Nam có ngay một Mini App Zalo riêng — để thu hút khách hàng, gửi ưu đãi và xây dựng lòng trung thành.
            </p>
            <p style={{ fontSize: '14px', color: C.dark, margin: 0, lineHeight: 1.7 }}>
              Sản phẩm được phát triển và vận hành bởi CÔNG TY TNHH NGÔI SAO DẪN ĐẦU AI.
            </p>
          </div>

          <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(245,166,35,0.08)', borderRadius: '12px', border: `1px solid ${C.gold}`, fontSize: '12px', color: C.mid, textAlign: 'center' }}>
            Thông tin công bố theo Điều 29 Nghị định 52/2013/NĐ-CP về thương mại điện tử.
          </div>

        </div>
      </div>
    </>
  )
}

function Row({ label, value, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', padding: '10px 0', borderBottom: last ? 'none' : '1px solid #e5d9ce', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '13px', color: '#7A4A2A', fontWeight: '500', flex: '0 0 auto' }}>{label}</span>
      <span style={{ fontSize: '14px', color: '#1A0A00', fontWeight: '600', textAlign: 'right' }}>{value}</span>
    </div>
  )
}
