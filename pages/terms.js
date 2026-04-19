import Head from 'next/head'
import Link from 'next/link'

const C = {
  red: '#D0021B', gold: '#F5A623', dark: '#1A0A00',
  mid: '#7A4A2A', bg: '#FDF6EE', white: '#fff',
  border: '#e5d9ce'
}

export default function Terms() {
  return (
    <>
      <Head>
        <title>Điều khoản sử dụng — VietMini</title>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Be Vietnam Pro', sans-serif" }}>

        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '16px 24px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: C.red, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: '700', fontSize: '16px' }}>V</div>
            <span style={{ fontWeight: '700', fontSize: '16px', color: C.dark }}>VietMini</span>
          </Link>
        </div>

        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px 80px' }}>

          <h1 style={{ fontSize: '32px', fontWeight: '900', color: C.dark, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Điều khoản sử dụng</h1>
          <p style={{ fontSize: '14px', color: C.mid, margin: '0 0 40px' }}>Ngày hiệu lực: 19/04/2026</p>

          <div style={{ background: C.white, borderRadius: '16px', padding: '40px', boxShadow: '0 2px 12px rgba(26,10,0,0.06)', fontSize: '15px', color: C.dark, lineHeight: 1.75 }}>

            <p style={{ margin: '0 0 24px' }}>
              Điều khoản sử dụng này quy định các điều kiện áp dụng cho việc sử dụng nền tảng VietMini do <strong>CÔNG TY TNHH NGÔI SAO DẪN ĐẦU AI</strong> (Mã số doanh nghiệp: 3401278978) vận hành. Khi đăng ký hoặc sử dụng dịch vụ, bạn đồng ý với các điều khoản dưới đây.
            </p>

            <H>1. Định nghĩa</H>
            <Ul items={[
              '"VietMini" / "chúng tôi": Nền tảng do CÔNG TY TNHH NGÔI SAO DẪN ĐẦU AI cung cấp tại địa chỉ vietmini.com',
              '"Khách hàng" / "bạn": Thương nhân, tổ chức hoặc cá nhân đăng ký tài khoản để sử dụng dịch vụ VietMini',
              '"Dịch vụ": Việc cung cấp Mini App Zalo cá nhân hóa, công cụ quản trị và các tính năng marketing đi kèm, theo gói dịch vụ đã mua',
              '"Mini App": Ứng dụng mini trên nền tảng Zalo được tạo và quản lý thông qua VietMini',
            ]} />

            <H>2. Mô tả dịch vụ</H>
            <P>VietMini cung cấp dịch vụ phần mềm dạng SaaS bao gồm:</P>
            <Ul items={[
              'Mini App Zalo được cá nhân hóa theo ngành nghề và thương hiệu của khách hàng',
              'Bảng điều khiển quản trị để quản lý nội dung, dịch vụ, khách hàng và chiến dịch marketing',
              'Các tính năng marketing: vòng quay may mắn, ưu đãi chớp nhoáng, thẻ tích điểm, chương trình giới thiệu, phiếu giảm giá, ưu đãi chào mừng',
              'Cập nhật phần mềm và hỗ trợ kỹ thuật trong suốt thời gian sử dụng dịch vụ',
            ]} />
            <P>
              VietMini <strong>không</strong> là trung gian thanh toán giữa khách hàng của bạn và bạn. Việc thu phí dịch vụ từ khách hàng cuối do bạn tự thực hiện.
            </P>

            <H>3. Đăng ký tài khoản</H>
            <P>
              Để sử dụng dịch vụ, bạn phải đăng ký tài khoản và cung cấp thông tin chính xác, đầy đủ. Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra dưới tài khoản của mình.
            </P>
            <P>
              Bạn phải đủ năng lực hành vi dân sự theo pháp luật Việt Nam để ký kết hợp đồng dịch vụ này. Nếu đăng ký thay mặt một tổ chức, bạn cam kết có thẩm quyền đại diện hợp pháp cho tổ chức đó.
            </P>

            <H>4. Giá dịch vụ và phương thức thanh toán</H>
            <P>
              Gói dịch vụ VietMini có giá <strong>2.000.000 VNĐ/năm (chưa bao gồm thuế)</strong>, thanh toán một lần cho 12 tháng sử dụng.
            </P>
            <P>Các phương thức thanh toán được chấp nhận:</P>
            <Ul items={[
              'Chuyển khoản qua mã QR VietQR (Vietcombank) thông qua cổng thanh toán SePay',
              'Mã kích hoạt do VietMini cấp (áp dụng cho trường hợp đặc biệt)',
            ]} />
            <P>
              Hóa đơn điện tử sẽ được phát hành và gửi đến email đăng ký trong vòng 7 ngày làm việc kể từ khi thanh toán thành công.
            </P>

            <H>5. Thời hạn hợp đồng và gia hạn</H>
            <P>
              Hợp đồng có thời hạn <strong>12 tháng</strong> kể từ ngày kích hoạt dịch vụ. Dịch vụ <strong>không tự động gia hạn</strong>. Bạn sẽ nhận được thông báo trước khi hết hạn và có thể chủ động gia hạn bằng cách thanh toán gói tiếp theo.
            </P>

            <H>6. Chính sách hoàn tiền</H>
            <P style={{ background: '#fff0f0', borderLeft: '3px solid #D0021B', padding: '12px 16px', borderRadius: '4px' }}>
              <strong>Không hoàn tiền trong mọi trường hợp.</strong> Khi dịch vụ đã được kích hoạt, khoản phí đã thanh toán sẽ không được hoàn lại, kể cả khi khách hàng ngừng sử dụng dịch vụ trước khi hết hạn hợp đồng.
            </P>
            <P>
              Trước khi thanh toán, bạn có thể dùng thử các bản demo công khai trên <Link href="/demos" style={{ color: '#D0021B', fontWeight: '600' }}>trang demo</Link> để đánh giá sản phẩm.
            </P>

            <H>7. Nghĩa vụ của khách hàng</H>
            <P>Khi sử dụng VietMini, bạn cam kết:</P>
            <Ul items={[
              'Cung cấp thông tin chính xác, trung thực về doanh nghiệp của mình',
              'Không đăng tải nội dung vi phạm pháp luật Việt Nam (mại dâm, ma túy, hàng cấm, nội dung kích động, v.v.)',
              'Không đăng tải nội dung vi phạm quyền sở hữu trí tuệ của bên thứ ba',
              'Chịu trách nhiệm tuân thủ các quy định của Zalo về Mini App và Official Account',
              'Tự tạo và quản lý Tài khoản chính thức Zalo (Zalo Official Account) của mình',
              'Tuân thủ pháp luật về bảo vệ dữ liệu cá nhân khi thu thập thông tin khách hàng cuối',
            ]} />

            <H>8. Quyền của VietMini</H>
            <P>Chúng tôi có quyền:</P>
            <Ul items={[
              'Tạm ngừng hoặc chấm dứt dịch vụ nếu phát hiện khách hàng vi phạm điều khoản hoặc pháp luật',
              'Kiểm duyệt nội dung do khách hàng đăng tải nếu có dấu hiệu vi phạm',
              'Thay đổi tính năng, cải tiến sản phẩm hoặc cập nhật giá dịch vụ áp dụng cho các hợp đồng mới',
              'Yêu cầu khách hàng cung cấp thông tin bổ sung để xác minh danh tính khi cần thiết',
            ]} />

            <H>9. Quyền sở hữu trí tuệ</H>
            <P>
              Toàn bộ mã nguồn, giao diện, logo, văn bản, hình ảnh và các yếu tố khác của nền tảng VietMini thuộc sở hữu của CÔNG TY TNHH NGÔI SAO DẪN ĐẦU AI. Khách hàng được cấp quyền sử dụng trong phạm vi gói dịch vụ đã mua.
            </P>
            <P>
              Nội dung do khách hàng đăng tải (ảnh, văn bản mô tả dịch vụ, v.v.) vẫn thuộc quyền sở hữu của khách hàng. Khách hàng cấp cho VietMini quyền hiển thị các nội dung đó trên Mini App của mình.
            </P>

            <H>10. Giới hạn trách nhiệm</H>
            <P>
              Dịch vụ được cung cấp "nguyên trạng" (as-is). VietMini nỗ lực duy trì dịch vụ hoạt động ổn định, tuy nhiên không cam kết dịch vụ sẽ không bị gián đoạn hoặc không có lỗi trong mọi trường hợp.
            </P>
            <P>
              Trách nhiệm tối đa của VietMini trong mọi trường hợp không vượt quá số tiền mà khách hàng đã thanh toán cho dịch vụ trong 12 tháng gần nhất.
            </P>
            <P>
              VietMini <strong>không chịu trách nhiệm</strong> về: sự cố của nền tảng Zalo, thay đổi chính sách của Zalo, thiệt hại gián tiếp, mất doanh thu, mất dữ liệu do lỗi người dùng, hoặc các trường hợp bất khả kháng.
            </P>

            <H>11. Chấm dứt hợp đồng</H>
            <P>
              Bạn có thể ngừng sử dụng dịch vụ và xóa tài khoản bất kỳ lúc nào. Việc ngừng sử dụng trước thời hạn không dẫn đến hoàn tiền (xem Mục 6).
            </P>
            <P>
              VietMini có quyền chấm dứt hợp đồng ngay lập tức nếu bạn vi phạm nghiêm trọng điều khoản hoặc pháp luật, không hoàn lại phí đã thu.
            </P>

            <H>12. Giải quyết tranh chấp</H>
            <P>
              Các tranh chấp phát sinh trong quá trình sử dụng dịch vụ sẽ được ưu tiên giải quyết thông qua thương lượng, hòa giải. Trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra Tòa án có thẩm quyền tại Việt Nam để giải quyết theo pháp luật Việt Nam.
            </P>

            <H>13. Luật áp dụng</H>
            <P>
              Điều khoản sử dụng này được điều chỉnh và diễn giải theo pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.
            </P>

            <H>14. Thay đổi điều khoản</H>
            <P>
              VietMini có quyền cập nhật Điều khoản sử dụng theo thời gian. Các thay đổi sẽ được công bố tại trang này và có hiệu lực từ ngày công bố. Việc tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận các thay đổi đó.
            </P>

            <H>15. Liên hệ</H>
            <P><strong>CÔNG TY TNHH NGÔI SAO DẪN ĐẦU AI</strong></P>
            <P>Địa chỉ: 147 Võ Chí Công, Phường Hàm Thắng, Tỉnh Lâm Đồng, Việt Nam</P>
            <P>Email: contact@leadingstarai.com</P>
            <P>Mã số doanh nghiệp: 3401278978</P>

          </div>

        </div>
      </div>
    </>
  )
}

function H({ children }) {
  return <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1A0A00', margin: '28px 0 12px' }}>{children}</h2>
}
function P({ children, style }) {
  return <p style={{ margin: '0 0 12px', color: '#1A0A00', lineHeight: 1.75, ...style }}>{children}</p>
}
function Ul({ items }) {
  return (
    <ul style={{ margin: '0 0 16px', paddingLeft: '22px', color: '#1A0A00', lineHeight: 1.75 }}>
      {items.map((it, i) => <li key={i} style={{ marginBottom: '6px' }}>{it}</li>)}
    </ul>
  )
}
