export default function Footer() {
  return (
    <footer style={{background:'#1A0A00',padding:'44px 48px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px'}}>
      <div>
        <span style={{fontSize:'18px',fontWeight:900,color:'white'}}>Viet<span style={{color:'#F5A623'}}>Mini</span></span>
        <div style={{marginTop:'8px',display:'flex',gap:'24px'}}>
          <a href="/comment-ca-marche" style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>Comment ça marche</a>
          <a href="/demos" style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>Démos</a>
          <a href="/tarifs" style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>Tarifs</a>
        </div>
      </div>
      <span style={{fontSize:'13px',color:'rgba(255,255,255,0.35)'}}>© 2025 Leading Star AI — Phan Thiết, Vietnam</span>
    </footer>
  );
}