import Layout from '../components/Layout';

export default function Demos() {
  const DEMOS = [
    {href:'/demo/bella',   bg:'linear-gradient(135deg,#FFEAE8,#FFD0CB)', img:'/images/img_1.webp', alt:'Salon làm đẹp',   vertical:'Làm đẹp',              name:'Salon làm đẹp',         desc:'Cắt, nhuộm, nail, chăm sóc da. Vòng quay may mắn và ưu đãi chớp nhoáng.',},
    {href:'/demo/barber',  bg:'linear-gradient(135deg,#E8E4F0,#CFC8E8)', img:'/images/img_2.webp', alt:'Barber shop',       vertical:'Nam giới',               name:'Barber shop',             desc:'Cắt tóc nam, cạo râu, chăm sóc. Giao diện hiện đại, phong cách nam tính.'},
    {href:'/demo/spa',     bg:'linear-gradient(135deg,#E0F4F0,#B8E8E0)', img:'/images/img_3.webp', alt:'Spa',               vertical:'Chăm sóc sức khỏe',           name:'Spa & Massage',           desc:'Massage, chăm sóc cơ thể. Tích hợp thẻ thân thiết và vòng quay may mắn.'},
    {href:'/demo/resto',   bg:'linear-gradient(135deg,#FFF5DC,#FFE8A0)', img:'/images/img_4.webp', alt:'Nhà hàng',        vertical:'Ẩm thực',        name:'Nhà hàng & Quán cà phê',       desc:'Thực đơn, ưu đãi đặc biệt, tích điểm cho khách quen.'},
    {href:'/demo/gym',     bg:'linear-gradient(135deg,#E8F5E0,#C8E8B0)', img:'/images/img_5.webp', alt:'Phòng gym',               vertical:'Thể thao',               name:'Phòng gym & Yoga',   desc:'Lớp học, gói tập, khuyến mãi. Gắn kết hội viên lâu dài.'},
    {href:'/demo/paw',     bg:'linear-gradient(135deg,#FFF0DC,#FFE0A8)', img:'/images/img_6.webp', alt:'Chăm sóc thú cưng',          vertical:'Thú cưng',             name:'Grooming & Chăm sóc thú cưng',     desc:'Tắm, cắt tỉa, chăm sóc. Giữ liên lạc với khách hàng.',      imgPos:'50% 15%'},
    {href:'/demo/karaoke', bg:'linear-gradient(135deg,#F0E8FF,#D8C8F0)', img:'/images/img_7.webp', alt:'Karaoke',           vertical:'Giải trí',      name:'Karaoke & Bida',     desc:'Đặt phòng, gắn kết khách quen.'},
    {href:'/demo/fashion', bg:'linear-gradient(135deg,#FAE8EF,#F0C8D8)', img:'/images/img_8.webp', alt:'Cửa hàng',          vertical:'Cửa hàng & Bán lẻ', name:'Cửa hàng của bạn trên Zalo', desc:'Quần áo, phụ kiện, mỹ phẩm. Giới thiệu sản phẩm và giữ liên lạc với khách.'},
  ];
  return (
    <Layout title="Demo — VietMini">

      <div style={{background:'var(--cream)',padding:'80px 48px 48px',textAlign:'center'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
            <span style={{display:'block',width:'24px',height:'2px',background:'var(--red)'}}></span>
            <span style={{fontSize:'11px',fontWeight:800,color:'var(--red)',textTransform:'uppercase',letterSpacing:'1.5px'}}>Demo</span>
          </div>
          <h1 style={{fontSize:'clamp(32px,4vw,52px)',fontWeight:900,lineHeight:1.1,letterSpacing:'-1px',marginBottom:'20px',color:'#1A0A00'}}>Cửa hàng của bạn,<br />trang Zalo của bạn.</h1>
          <p style={{fontSize:'17px',color:'var(--mid)',lineHeight:1.7,maxWidth:'560px',margin:'0 auto'}}>Nhấn vào một ví dụ — đây chính là những gì khách hàng thấy khi mở trang Zalo của bạn.</p>
        </div>
      </div>

      <section style={{padding:'48px',background:'var(--cream-2)'}}>
        <div className="section-inner">
          <div className="demos-grid">
            {DEMOS.map((d,i) => (
              <a key={i} href={d.href} className="demo-card">
                <div className="demo-thumb" style={{background:d.bg,padding:0,overflow:'hidden'}}>
                  <img src={d.img} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:d.imgPos||'center'}} alt={d.alt} />
                </div>
                <div className="demo-body">
                  <div className="demo-vertical">{d.vertical}</div>
                  <div className="demo-name">{d.name}</div>
                  <div className="demo-desc">{d.desc}</div>
                  <div className="demo-footer">
                    <span className="demo-link">Xem ví dụ</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div style={{background:'linear-gradient(135deg,#2D1200 0%,#4A1800 100%)',padding:'100px 48px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle, rgba(245,166,35,0.07) 1.5px, transparent 1.5px)',backgroundSize:'32px 32px',pointerEvents:'none'}}></div>
        <div style={{position:'relative'}}>
          <h2 style={{color:'white',marginBottom:'16px',fontSize:'clamp(28px,3.5vw,48px)',fontWeight:900,letterSpacing:'-1px',lineHeight:1.1}}>Có ví dụ nào phù hợp với bạn không?</h2>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.45)',marginBottom:'44px'}}>Trang Zalo của bạn sẵn sàng trong chưa đầy 5 phút.</p>
          <a href="/register" className="btn-hero" style={{display:'inline-block'}}>Tạo tài khoản miễn phí &rarr;</a>
        </div>
      </div>

    </Layout>
  );
}