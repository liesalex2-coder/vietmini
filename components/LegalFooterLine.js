import Link from 'next/link'

export default function LegalFooterLine() {
  const linkStyle = { color: '#7A4A2A', textDecoration: 'none', fontSize: '11px' }
  const sep = { color: '#b8a594', fontSize: '11px' }

  return (
    <div style={{ textAlign: 'center', marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
      <Link href="/privacy" style={linkStyle}>Chính sách bảo mật</Link>
      <span style={sep}>•</span>
      <Link href="/terms" style={linkStyle}>Điều khoản sử dụng</Link>
      <span style={sep}>•</span>
      <Link href="/about" style={linkStyle}>Về chúng tôi</Link>
    </div>
  )
}
