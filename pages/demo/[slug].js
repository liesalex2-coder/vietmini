import Layout from '../../components/Layout';
import Link from 'next/link';

const DEMOS = {
  bella:   { name:'Bella Beauty Salon',    vertical:'Làm đẹp',        url:'https://bella-demo-rosy.vercel.app' },
  barber:  { name:'Kingsmen Barbershop',   vertical:'Nam giới',       url:'https://barber-demo-five.vercel.app' },
  spa:     { name:'Lotus Spa',             vertical:'Chăm sóc sức khỏe', url:'https://spa-demo-sand.vercel.app' },
  resto:   { name:'Phở Saigon 1975',       vertical:'Ẩm thực',        url:'https://restaurant-demo-ten-dusky.vercel.app' },
  gym:     { name:'PowerFit Gym',          vertical:'Thể thao',       url:'https://gym-demo-lyart.vercel.app' },
  paw:     { name:'Paw & Style',           vertical:'Thú cưng',       url:'https://paw-demo.vercel.app' },
  karaoke: { name:'Star Karaoke',          vertical:'Giải trí',       url:'https://karaoke-demo-gules.vercel.app' },
  fashion: { name:'Luna Fashion',          vertical:'Cửa hàng & Bán lẻ', url:'https://store-demo-ecru.vercel.app' },
};

export async function getStaticPaths() {
  return {
    paths: Object.keys(DEMOS).map(slug => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const demo = DEMOS[params.slug] || null;
  return { props: { slug: params.slug, demo } };
}

export default function DemoPage({ slug, demo }) {
  if (!demo) return null;

  return (
    <Layout title={`${demo.name} — Demo VietMini`}>

      {/* Breadcrumb */}
      <div style={{background:'#fff', borderBottom:'1px solid rgba(122,74,42,0.1)'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto', padding:'14px 48px', display:'flex', alignItems:'center', gap:'10px', fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'13px'}}>
          <Link href="/demos" style={{color:'#7A4A2A', textDecoration:'none', fontWeight:500}}>← Tất cả demo</Link>
          <span style={{color:'rgba(122,74,42,0.3)'}}>/</span>
          <span style={{color:'#1A0A00', fontWeight:600}}>{demo.name}</span>
        </div>
      </div>

      {/* Header demo */}
      <div style={{background:'#fff', padding:'40px 48px 32px', textAlign:'center', borderBottom:'1px solid rgba(122,74,42,0.08)'}}>
        <span style={{display:'inline-block', fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'11px', fontWeight:800, color:'#D0021B', textTransform:'uppercase', letterSpacing:'1.5px', background:'rgba(208,2,27,0.08)', padding:'4px 12px', borderRadius:'20px', marginBottom:'12px'}}>{demo.vertical}</span>
        <h1 style={{fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'clamp(24px,3vw,36px)', fontWeight:900, color:'#1A0A00', letterSpacing:'-0.5px', lineHeight:1.1, margin:'0 0 10px'}}>{demo.name}</h1>
        <p style={{fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'15px', color:'#7A4A2A', margin:0}}>Đây chính là những gì khách hàng thấy khi mở trang Zalo của bạn.</p>
      </div>

      {/* Phone mockup */}
      <div style={{background:'#FDF6EE', padding:'48px 24px', display:'flex', justifyContent:'center'}}>
        <div style={{width:'340px', background:'#1A0A00', borderRadius:'44px', padding:'10px', boxShadow:'0 0 0 1px rgba(255,255,255,0.08), 0 24px 64px rgba(26,10,0,0.2)'}}>
          <div style={{display:'flex', justifyContent:'center', padding:'8px 0 6px'}}>
            <div style={{width:'56px', height:'4px', background:'#333', borderRadius:'3px'}}></div>
          </div>
          <div style={{borderRadius:'32px', overflow:'hidden', height:'580px', background:'#fff'}}>
            <iframe
              src={demo.url}
              title={demo.name}
              style={{width:'100%', height:'100%', border:'none', display:'block'}}
              scrolling="yes"
            />
          </div>
          <div style={{display:'flex', justifyContent:'center', padding:'8px 0 4px'}}>
            <div style={{width:'80px', height:'4px', background:'#444', borderRadius:'2px'}}></div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="page-cta-dark">
        <div>
          <h2 style={{fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'clamp(26px,3vw,40px)', fontWeight:900, color:'#fff', letterSpacing:'-1px', lineHeight:1.1, margin:'0 0 12px'}}>Trang này có thể là của bạn.</h2>
          <p style={{fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'17px', color:'rgba(255,255,255,0.45)', margin:'0 0 36px'}}>Cửa hàng của bạn trên Zalo, sẵn sàng trong chưa đầy 5 phút.</p>
          <div style={{display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap'}}>
            <a href="/register" style={{fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'15px', fontWeight:700, color:'#1A0A00', background:'#F5A623', textDecoration:'none', padding:'14px 28px', borderRadius:'12px'}}>Tạo tài khoản miễn phí →</a>
            <Link href="/demos" style={{fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'15px', fontWeight:600, color:'rgba(255,255,255,0.7)', textDecoration:'none', padding:'14px 28px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.15)'}}>Xem các ví dụ khác</Link>
          </div>
        </div>
      </div>

    </Layout>
  );
}