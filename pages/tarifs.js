import Layout from '../components/Layout';
import { useState } from 'react';

export default function Tarifs() {
  const [openFaq, setOpenFaq] = useState(null);
  const FAQS = [
    ["Khách hàng của tôi có cần tải ứng dụng không?", "Không. Khách hàng truy cập trang của bạn trực tiếp từ Zalo — ứng dụng họ đã dùng hằng ngày. Không cần tải thêm, không cần đăng ký gì thêm."],
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
          <h1 style={{fontSize:'clamp(32px,4vw,52px)',fontWeight:900,lineHeight:1.1,letterSpacing:'-1px',marginBottom:'20px',color:'#1A0A00'}}>Một mức giá.<br />Đã bao gồm tất cả.</h1>
          <p style={{fontSize:'17px',color:'var(--mid)',lineHeight:1.7,maxWidth:'500px',margin:'0 auto'}}>Thuê bao hằng năm duy nhất. Đầy đủ tính năng, không giới hạn, không phát sinh.</p>
        </div>
      </div>

      <section className="page-section-lg" style={{background:'var(--cream-2)'}}>
        <div style={{maxWidth:'520px',margin:'0 auto'}}>
          <div className="plan plan-popular" style={{textAlign:'center'}}>
            <div className="plan-name">Thuê bao hằng năm</div>
            <div className="plan-price"><span className="num">2.000.000 ₫ chưa VAT</span></div>
            <div style={{fontSize:'14px',color:'var(--light-txt)',marginTop:'4px',marginBottom:'16px'}}>mỗi năm — tức chưa đến 170.000 ₫ chưa VAT mỗi tháng</div>
            <p className="plan-desc">Hiện diện trọn vẹn trên Zalo, suốt cả năm.</p>
            <ul className="plan-features" style={{textAlign:'left'}}>
              <li>Trang Zalo mang đậm dấu ấn thương hiệu của bạn</li>
              <li>Gửi khuyến mãi bất cứ khi nào bạn muốn</li>
              <li>Vòng quay may mắn: khách hàng chơi và nhận giảm giá</li>
              <li>Ưu đãi chớp nhoáng với đồng hồ đếm ngược</li>
              <li>Thẻ tích điểm để khách quen quay lại</li>
              <li>Những hình ảnh đẹp nhất được trưng bày nổi bật</li>
              <li>Quản lý tất cả từ điện thoại của bạn</li>
            </ul>
            <a href="/register" className="plan-cta plan-cta-solid">Bắt đầu ngay</a>
          </div>

          <div style={{marginTop:'48px'}}>
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
          <h2 style={{color:'white',marginBottom:'16px',fontSize:'clamp(28px,3.5vw,48px)',fontWeight:900,letterSpacing:'-1px',lineHeight:1.1}}>Khách hàng của bạn đang trên Zalo. Hãy đến với họ.</h2>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.45)',marginBottom:'44px'}}>Trang Zalo của bạn sẵn sàng trong chưa đầy 5 phút.</p>
          <a href="/register" className="btn-hero" style={{display:'inline-block'}}>Tạo tài khoản miễn phí &rarr;</a>
        </div>
      </div>

    </Layout>
  );
}