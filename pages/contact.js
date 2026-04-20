import Layout from '../components/Layout';
import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: brancher un service d'envoi (Formspree, EmailJS, etc.)
    setSent(true);
  };

  return (
    <Layout title="Liên hệ — VietMini">

      {/* Header */}
      <div className="page-hero" style={{background:'#fff', borderBottom:'1px solid rgba(122,74,42,0.08)'}}>
        <div style={{maxWidth:'700px', margin:'0 auto'}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'20px'}}>
            <span style={{display:'block', width:'24px', height:'2px', background:'#D0021B'}}></span>
            <span style={{fontSize:'11px', fontWeight:800, color:'#D0021B', textTransform:'uppercase', letterSpacing:'1.5px', fontFamily:"'Be Vietnam Pro', sans-serif"}}>Liên hệ</span>
          </div>
          <h1 style={{fontSize:'clamp(32px,4vw,52px)', fontWeight:900, lineHeight:1.1, letterSpacing:'-1px', marginBottom:'20px', color:'#1A0A00', fontFamily:"'Be Vietnam Pro', sans-serif"}}>Có câu hỏi?<br />Chúng tôi trả lời ngay.</h1>
          <p style={{fontSize:'17px', color:'#7A4A2A', lineHeight:1.7, maxWidth:'500px', margin:'0 auto', fontFamily:"'Be Vietnam Pro', sans-serif"}}>Điền vào mẫu bên dưới hoặc nhắn trực tiếp cho chúng tôi. Chúng tôi phản hồi trong vòng 24 giờ.</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="page-section-lg" style={{background:'#FDF6EE'}}>
        <div style={{maxWidth:'560px', margin:'0 auto'}}>
          {sent ? (
            <div style={{background:'#fff', borderRadius:'20px', padding:'48px', textAlign:'center', boxShadow:'0 2px 24px rgba(26,10,0,0.06)'}}>
              <div style={{fontSize:'48px', marginBottom:'16px'}}>✅</div>
              <h2 style={{fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'22px', fontWeight:800, color:'#1A0A00', marginBottom:'12px'}}>Đã gửi tin nhắn!</h2>
              <p style={{fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'15px', color:'#7A4A2A', lineHeight:1.7}}>Cảm ơn bạn, chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
            </div>
          ) : (
            <div style={{background:'#fff', borderRadius:'20px', padding:'40px', boxShadow:'0 2px 24px rgba(26,10,0,0.06)'}}>
              <div style={{marginBottom:'20px'}}>
                <label style={{display:'block', fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'13px', fontWeight:700, color:'#1A0A00', marginBottom:'8px'}}>Họ tên</label>
                <input
                  type="text"
                  placeholder="Tên của bạn"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'1px solid rgba(122,74,42,0.2)', fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'15px', color:'#1A0A00', background:'#FDFAF7', outline:'none', boxSizing:'border-box'}}
                />
              </div>
              <div style={{marginBottom:'20px'}}>
                <label style={{display:'block', fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'13px', fontWeight:700, color:'#1A0A00', marginBottom:'8px'}}>Điện thoại / Zalo</label>
                <input
                  type="text"
                  placeholder="0901 234 567"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'1px solid rgba(122,74,42,0.2)', fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'15px', color:'#1A0A00', background:'#FDFAF7', outline:'none', boxSizing:'border-box'}}
                />
              </div>
              <div style={{marginBottom:'28px'}}>
                <label style={{display:'block', fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'13px', fontWeight:700, color:'#1A0A00', marginBottom:'8px'}}>Tin nhắn</label>
                <textarea
                  placeholder="Giới thiệu về cửa hàng của bạn, đặt câu hỏi..."
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  rows={5}
                  style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'1px solid rgba(122,74,42,0.2)', fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'15px', color:'#1A0A00', background:'#FDFAF7', outline:'none', resize:'vertical', boxSizing:'border-box'}}
                />
              </div>
              <button
                onClick={handleSubmit}
                style={{width:'100%', padding:'14px', borderRadius:'12px', border:'none', background:'#D0021B', color:'#fff', fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'15px', fontWeight:700, cursor:'pointer'}}
              >
                Gửi →
              </button>
              <p style={{fontFamily:"'Be Vietnam Pro', sans-serif", fontSize:'13px', color:'#7A4A2A', textAlign:'center', marginTop:'16px', marginBottom:0}}>
                Hoặc liên hệ trực tiếp qua Zalo: <strong>0866 125 201</strong>
              </p>
            </div>
          )}
        </div>
      </div>

    </Layout>
  );
}