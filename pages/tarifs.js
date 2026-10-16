import Layout from '../components/Layout';
import { useState } from 'react';

const COMMON = [
  'Mã giảm giá có hạn dùng và dòng thông báo trên trang của bạn',
  'Vòng quay may mắn: khách hàng chơi và nhận giảm giá',
  'Ưu đãi chớp nhoáng theo khung giờ bạn chọn',
  'Thẻ tích điểm để khách quen quay lại',
  'Những hình ảnh đẹp nhất được trưng bày nổi bật',
  'Quản lý tất cả từ điện thoại của bạn',
];

const PLANS = [
  {
    name: 'Ứng dụng web',
    price: '2.000.000 ₫',
    monthly: 'chưa VAT, mỗi năm — tức chưa đến 170.000 ₫ mỗi tháng',
    desc: 'Cho khách du lịch, người nước ngoài và khách không dùng Zalo.',
    features: [
      'Ứng dụng web mang đậm dấu ấn thương hiệu của bạn',
      'Đường link và mã QR riêng, mở trên mọi trình duyệt',
      ...COMMON,
    ],
  },
  {
    name: 'Cả hai',
    price: '3.000.000 ₫',
    monthly: 'chưa VAT, mỗi năm — tức 250.000 ₫ mỗi tháng',
    desc: 'Cho khách Việt và khách nước ngoài.',
    badge: 'Tiết kiệm 1.000.000 ₫',
    popular: true,
    features: [
      'Ứng dụng web và ứng dụng Zalo, cùng một nội dung',
      'Đường link và mã QR riêng cho từng kênh',
      ...COMMON,
    ],
  },
  {
    name: 'Ứng dụng Zalo',
    price: '2.000.000 ₫',
    monthly: 'chưa VAT, mỗi năm — tức chưa đến 170.000 ₫ mỗi tháng',
    desc: 'Cho khách hàng Việt Nam, những người dùng Zalo mỗi ngày.',
    features: [
      'Ứng dụng Zalo mang đậm dấu ấn thương hiệu của bạn',
      'Mã QR mở trang của bạn ngay trong Zalo',
      ...COMMON,
    ],
  },
];

export default function Tarifs() {
  const [openFaq, setOpenFaq] = useState(null);
  const FAQS = [
    ["Ứng dụng web và ứng dụng Zalo khác nhau thế nào?", "Nội dung và ưu đãi giống nhau. Chỉ khác cách khách mở: ứng dụng Zalo mở trong Zalo, ứng dụng web mở trên mọi trình duyệt. Nếu khách của bạn có cả người Việt và người nước ngoài, hãy chọn gói Cả hai."],
    ["Khách hàng của tôi có cần tải ứng dụng không?", "Không. Với ứng dụng Zalo, khách mở trang của bạn ngay trong Zalo. Với ứng dụng web, khách mở bằng trình duyệt trên điện thoại. Không cần tải thêm, không cần đăng ký gì thêm."],
    ["Với gói Cả hai, tôi có phải nhập thông tin hai lần không?", "Không. Bạn nhập thông tin một lần trong bảng điều khiển. Ứng dụng web và ứng dụng Zalo dùng chung nội dung đó."],
    ["Mất bao lâu để trang hoạt động?", "Chưa đến 5 phút nếu bạn đã chuẩn bị sẵn thông tin. Tên, logo, danh sách dịch vụ — và bạn đã sẵn sàng."],
    ["Hết hạn thuê bao thì sao?", "Trang của bạn vẫn hoạt động đến ngày hết hạn. Sau đó trang sẽ bị tạm ngưng. Bạn có thể gia hạn bất kỳ lúc nào để kích hoạt lại."],
    ["Nếu tôi đổi loại hình kinh doanh thì sao?", "Chúng tôi sẽ cập nhật trang cho bạn. Hãy liên hệ và chúng tôi lo hết."],
  ];
  return (
    <Layout title="Bảng giá — VietMini">

      <div className="page-hero" style={{background:'var(--cream)'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
            <span style={{display:'block',width:'24px',height:'2px',background:'var(--red)'}}></span>
            <span style={{fontSize:'11px',fontWeight:800,color:'var(--red)',textTransform:'uppercase',letterSpacing:'1.5px'}}>Bảng giá</span>
          </div>
          <h1 style={{fontSize:'clamp(32px,4vw,52px)',fontWeight:900,lineHeight:1.1,letterSpacing:'-1px',marginBottom:'20px',color:'#1A0A00'}}>Chọn kênh của bạn.<br />Đầy đủ tính năng.</h1>
          <p style={{fontSize:'17px',color:'var(--mid)',lineHeight:1.7,maxWidth:'500px',margin:'0 auto'}}>Ứng dụng web, ứng dụng Zalo, hoặc cả hai. Thuê bao hằng năm, không giới hạn, không phát sinh.</p>
        </div>
      </div>

      <section className="page-section-lg" style={{background:'var(--cream-2)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div className="fichier-grid" style={{marginTop:0,alignItems:'stretch'}}>
            {PLANS.map((p) => (
              <div key={p.name} className={`plan${p.popular ? ' plan-popular' : ''}`} style={{textAlign:'center',display:'flex',flexDirection:'column'}}>
                {p.badge && (
                  <div style={{position:'absolute',top:'-14px',left:'50%',transform:'translateX(-50%)',background:'var(--red)',color:'#fff',fontSize:'12px',fontWeight:800,padding:'5px 14px',borderRadius:'20px',whiteSpace:'nowrap'}}>{p.badge}</div>
                )}
                <div className="plan-name">{p.name}</div>
                <div className="plan-price"><span className="num">{p.price}</span></div>
                <div style={{fontSize:'14px',color:'var(--light-txt)',marginTop:'4px',marginBottom:'16px'}}>{p.monthly}</div>
                <p className="plan-desc">{p.desc}</p>
                <ul className="plan-features" style={{textAlign:'left'}}>
                  {p.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <a
                  href="/register"
                  className={`plan-cta${p.popular ? ' plan-cta-solid' : ''}`}
                  style={p.popular ? {marginTop:'auto'} : {marginTop:'auto',background:'transparent',color:'var(--red)',border:'2px solid var(--red)'}}
                >
                  Bắt đầu ngay
                </a>
              </div>
            ))}
          </div>

          <div style={{maxWidth:'520px',margin:'48px auto 0'}}>
            <h2 style={{fontSize:'22px',fontWeight:800,marginBottom:'24px',color:'var(--dark)'}}>Câu hỏi thường gặp</h2>
            {FAQS.map(([q,a],i) => (
              <div key={i} style={{borderBottom:'1px solid var(--border)',paddingBottom:'16px',marginBottom:'16px'}}>
                <button onClick={() => setOpenFaq(openFaq===i?null:i)} style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',background:'none',border:'none',cursor:'pointer',textAlign:'left',padding:'8px 0',fontFamily:'var(--font)'}}>
                  <span style={{fontWeight:700,fontSize:'15px',color:'var(--dark)'}}>{q}</span>
                  <span style={{fontSize:'20px',color:'var(--red)',flexShrink:0,marginLeft:'12px'}}>{openFaq===i?'−':'+'}</span>
                </button>
                {openFaq===i && <p style={{fontSize:'14px',color:'var(--mid)',lineHeight:1.7,marginTop:'8px',margin:0}}>{a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="page-cta-dark">
        <div>
          <h2 style={{color:'white',marginBottom:'16px',fontSize:'clamp(28px,3.5vw,48px)',fontWeight:900,letterSpacing:'-1px',lineHeight:1.1}}>Khách quét một lần. Quay lại nhiều lần.</h2>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.45)',marginBottom:'44px'}}>Trang của bạn sẵn sàng trong chưa đầy 5 phút.</p>
          <a href="/register" className="btn-hero" style={{display:'inline-block'}}>Tạo tài khoản miễn phí &rarr;</a>
        </div>
      </div>

    </Layout>
  );
}
