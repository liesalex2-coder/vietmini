import Layout from '../components/Layout';

export default function CommentCaMarche() {
  return (
    <Layout title="Cách hoạt động — VietMini">

      <div className="page-hero" style={{background:'var(--cream)'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
            <span style={{display:'block',width:'24px',height:'2px',background:'var(--red)'}}></span>
            <span style={{fontSize:'11px',fontWeight:800,color:'var(--red)',textTransform:'uppercase',letterSpacing:'1.5px'}}>Cách hoạt động</span>
          </div>
          <h1 style={{fontSize:'clamp(32px,4vw,52px)',fontWeight:900,lineHeight:1.1,letterSpacing:'-1px',marginBottom:'20px',color:'#1A0A00'}}>Trang Zalo của bạn<br />sẵn sàng ngay trong ngày.</h1>
          <p style={{fontSize:'17px',color:'var(--mid)',lineHeight:1.7,maxWidth:'560px',margin:'0 auto'}}>Không cần biết Zalo hoạt động thế nào. Không cần kỹ năng công nghệ. Chúng tôi lo hết.</p>
        </div>
      </div>

      <section className="how page-section">
        <div className="section-inner">
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h3>Bạn tạo tài khoản</h3>
              <p>Chọn loại hình kinh doanh, thêm tên, logo, dịch vụ của bạn. Chỉ vậy thôi.</p>
              <div className="step-arrow">&rarr;</div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Khách hàng tham gia danh sách chỉ trong một thao tác</h3>
              <p>Ngay khi khách ghé cửa hàng, họ có thể theo dõi bạn trên Zalo chỉ trong vài giây. Danh sách liên hệ của bạn tự động tăng lên, không tốn công sức.</p>
              <div className="step-arrow">&rarr;</div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Bạn quản lý từ điện thoại</h3>
              <p>Gửi khuyến mãi, kích hoạt ưu đãi chớp nhoáng, xem ai đã tham gia — tất cả từ bảng điều khiển, đơn giản như dùng WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section" style={{background:'#1A0A00'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
            <span style={{display:'block',width:'24px',height:'2px',background:'#F5A623'}}></span>
            <span style={{fontSize:'11px',fontWeight:800,color:'#F5A623',textTransform:'uppercase',letterSpacing:'1.5px'}}>Vì sao chọn Zalo</span>
          </div>
          <h2 style={{fontSize:'clamp(28px,3.5vw,46px)',fontWeight:900,color:'#fff',lineHeight:1.1,letterSpacing:'-1px',marginBottom:'20px'}}>Kênh duy nhất giúp bạn<br />thật sự nói chuyện với khách hàng.</h2>
          <p style={{fontSize:'16px',color:'rgba(255,255,255,0.5)',maxWidth:'620px',lineHeight:1.7,marginBottom:'48px'}}>Ở Việt Nam, Zalo là ứng dụng nhắn tin của tất cả mọi người — gia đình, bạn bè, đồng nghiệp. Khi bạn gửi tin nhắn, nó đến ngay trong ứng dụng họ dùng cả ngày.</p>
          <div style={{display:'flex',gap:'48px',marginBottom:'48px',padding:'32px 40px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'20px',flexWrap:'wrap'}}>
            {[['74Tr','người Việt dùng Zalo mỗi ngày'],['#1','Ứng dụng nhắn tin tại Việt Nam'],['~80%','tin nhắn gửi đi được khách hàng đọc']].map(([n,l],i) => (
              <div key={i} style={{flex:1,minWidth:'140px'}}>
                <div style={{fontSize:'38px',fontWeight:900,color:'#F5A623',letterSpacing:'-1.5px',lineHeight:1,marginBottom:'8px'}}>{n}</div>
                <div style={{fontSize:'13px',color:'rgba(255,255,255,0.45)',lineHeight:1.5,fontWeight:500}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{background:'rgba(245,166,35,0.1)',border:'1px solid rgba(245,166,35,0.25)',borderRadius:'16px',padding:'28px 36px',display:'flex',gap:'20px',alignItems:'flex-start'}}>
            <span style={{fontSize:'28px',flexShrink:0}}>💬</span>
            <div>
              <p style={{color:'#fff',fontWeight:700,fontSize:'16px',marginBottom:'8px'}}>Zalo đến thẳng hộp tin nhắn của khách hàng.</p>
              <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',lineHeight:1.7,margin:0}}>Không phải trong bảng tin. Không phải trong thư rác. Ngay trong cùng cuộc trò chuyện với gia đình và bạn bè của họ.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="page-cta-dark">
        <div>
          <h2 style={{color:'white',marginBottom:'16px',fontSize:'clamp(28px,3.5vw,48px)',fontWeight:900,letterSpacing:'-1px',lineHeight:1.1}}>Sẵn sàng bắt đầu?</h2>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.45)',marginBottom:'44px'}}>Trang Zalo của bạn sẵn sàng trong chưa đầy 5 phút.</p>
          <a href="/register" className="btn-hero" style={{display:'inline-block'}}>Tạo tài khoản miễn phí &rarr;</a>
        </div>
      </div>

    </Layout>
  );
}