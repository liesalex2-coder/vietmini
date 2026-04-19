import Head from 'next/head'
import Link from 'next/link'

const C = {
  red: '#D0021B', gold: '#F5A623', dark: '#1A0A00',
  mid: '#7A4A2A', bg: '#FDF6EE', white: '#fff',
  border: '#e5d9ce'
}

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Chính sách bảo mật — VietMini</title>
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

          <h1 style={{ fontSize: '32px', fontWeight: '900', color: C.dark, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Chính sách bảo mật</h1>
          <p style={{ fontSize: '14px', color: C.mid, margin: '0 0 40px' }}>Ngày hiệu lực: 19/04/2026</p>

          <div style={{ background: C.white, borderRadius: '16px', padding: '40px', boxShadow: '0 2px 12px rgba(26,10,0,0.06)', fontSize: '15px', color: C.dark, lineHeight: 1.75 }}>

            <p style={{ margin: '0 0 24px' }}>
              Chính sách bảo mật này mô tả cách <strong>CÔNG TY TNHH NGÔI SAO DẪN ĐẦU AI</strong> (sau đây gọi là "VietMini", "chúng tôi") thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của người dùng khi truy cập và sử dụng nền tảng VietMini tại địa chỉ vietmini.com.
            </p>

            <H>1. Đơn vị chịu trách nhiệm thu thập và quản lý thông tin</H>
            <P>CÔNG TY TNHH NGÔI SAO DẪN ĐẦU AI</P>
            <P>Địa chỉ: 147 Võ Chí Công, Phường Hàm Thắng, Tỉnh Lâm Đồng, Việt Nam</P>
            <P>Mã số doanh nghiệp: 3401278978</P>
            <P>Email liên hệ: contact@leadingstarai.com</P>

            <H>2. Mục đích thu thập thông tin cá nhân</H>
            <P>Chúng tôi thu thập thông tin cá nhân của bạn nhằm các mục đích sau:</P>
            <Ul items={[
              'Tạo và quản lý tài khoản người dùng trên nền tảng VietMini',
              'Cung cấp, vận hành và cải thiện dịch vụ Mini App Zalo',
              'Xử lý thanh toán và quản lý đơn đăng ký sử dụng dịch vụ',
              'Hỗ trợ khách hàng và giải đáp thắc mắc',
              'Gửi thông báo liên quan đến tài khoản và dịch vụ',
              'Tuân thủ các nghĩa vụ pháp lý tại Việt Nam',
            ]} />

            <H>3. Phạm vi thông tin được thu thập</H>
            <P>Khi bạn đăng ký và sử dụng VietMini, chúng tôi có thể thu thập các thông tin sau:</P>
            <Ul items={[
              'Địa chỉ email',
              'Họ tên (nếu bạn cung cấp)',
              'Ảnh đại diện công khai (khi đăng nhập qua Google hoặc Facebook)',
              'Thông tin doanh nghiệp: tên cửa hàng, địa chỉ, số điện thoại, giờ mở cửa',
              'Nội dung bạn đăng tải lên Mini App của mình (dịch vụ, ảnh, khuyến mãi, v.v.)',
              'Dữ liệu khách hàng mà bạn thu thập qua Mini App của bạn',
              'Dữ liệu kỹ thuật: địa chỉ IP, loại trình duyệt, thiết bị, nhật ký truy cập',
            ]} />

            <H>4. Đăng nhập qua bên thứ ba (Google, Facebook)</H>
            <P>
              Nếu bạn chọn đăng nhập qua Google hoặc Facebook, chúng tôi chỉ nhận các thông tin cơ bản mà bạn cho phép chia sẻ: địa chỉ email và tên hiển thị công khai. Chúng tôi <strong>không</strong> truy cập danh sách bạn bè, tin nhắn, ảnh cá nhân hoặc bất kỳ dữ liệu riêng tư nào khác từ tài khoản mạng xã hội của bạn.
            </P>

            <H>5. Thời gian lưu trữ thông tin</H>
            <P>
              Thông tin cá nhân của bạn được lưu trữ trong suốt thời gian bạn sử dụng dịch vụ VietMini. Khi bạn yêu cầu xóa tài khoản, chúng tôi sẽ xóa hoặc ẩn danh hóa dữ liệu của bạn trong vòng 30 ngày, trừ trường hợp pháp luật yêu cầu lưu trữ lâu hơn.
            </P>

            <H>6. Đối tượng được tiếp cận thông tin</H>
            <P>Thông tin cá nhân của bạn chỉ có thể được chia sẻ với:</P>
            <Ul items={[
              'Các nhà cung cấp dịch vụ kỹ thuật (ví dụ: nhà cung cấp hạ tầng máy chủ, dịch vụ thanh toán) trong phạm vi cần thiết để vận hành VietMini',
              'Cơ quan nhà nước có thẩm quyền khi có yêu cầu hợp pháp theo quy định của pháp luật Việt Nam',
            ]} />
            <P>Chúng tôi <strong>không bán, trao đổi hoặc cho thuê</strong> thông tin cá nhân của bạn cho bên thứ ba vì mục đích thương mại.</P>

            <H>7. Phương tiện và công cụ bảo mật</H>
            <P>
              Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ thông tin cá nhân: mã hóa kết nối HTTPS, kiểm soát truy cập vào cơ sở dữ liệu, phân quyền người dùng và sao lưu định kỳ. Tuy nhiên, không có phương thức truyền tải qua Internet nào là an toàn tuyệt đối.
            </P>

            <H>8. Quyền của người dùng</H>
            <P>Bạn có các quyền sau đối với thông tin cá nhân của mình:</P>
            <Ul items={[
              'Truy cập và xem lại thông tin cá nhân đã cung cấp',
              'Yêu cầu chỉnh sửa, cập nhật thông tin không chính xác',
              'Yêu cầu xóa tài khoản và dữ liệu cá nhân',
              'Rút lại sự đồng ý xử lý dữ liệu bất kỳ lúc nào',
              'Khiếu nại với cơ quan nhà nước có thẩm quyền nếu quyền lợi của bạn bị xâm phạm',
            ]} />
            <P>Để thực hiện các quyền trên, vui lòng liên hệ qua email: <strong>contact@leadingstarai.com</strong></P>

            <H>9. Sử dụng cookie</H>
            <P>
              VietMini sử dụng cookie và các công nghệ tương tự để duy trì phiên đăng nhập, ghi nhớ tùy chọn của người dùng và phân tích lưu lượng truy cập nhằm cải thiện dịch vụ. Bạn có thể vô hiệu hóa cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng có thể không hoạt động đầy đủ.
            </P>

            <H>10. Cam kết bảo mật thông tin cá nhân của khách hàng</H>
            <P>
              Chúng tôi cam kết tuân thủ các quy định của pháp luật Việt Nam về bảo vệ thông tin cá nhân, bao gồm Nghị định 52/2013/NĐ-CP về thương mại điện tử, Luật An ninh mạng và Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
            </P>

            <H>11. Thay đổi chính sách</H>
            <P>
              Chúng tôi có quyền cập nhật Chính sách bảo mật này theo thời gian. Mọi thay đổi sẽ được công bố trên trang này và có hiệu lực kể từ ngày công bố. Việc bạn tiếp tục sử dụng dịch vụ sau khi chính sách được cập nhật đồng nghĩa với việc bạn chấp nhận các thay đổi đó.
            </P>

            <H>12. Liên hệ</H>
            <P>Mọi thắc mắc liên quan đến Chính sách bảo mật này, vui lòng liên hệ:</P>
            <P><strong>CÔNG TY TNHH NGÔI SAO DẪN ĐẦU AI</strong></P>
            <P>Email: contact@leadingstarai.com</P>
            <P>Địa chỉ: 147 Võ Chí Công, Phường Hàm Thắng, Tỉnh Lâm Đồng, Việt Nam</P>

          </div>

        </div>
      </div>
    </>
  )
}

function H({ children }) {
  return <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1A0A00', margin: '28px 0 12px' }}>{children}</h2>
}
function P({ children }) {
  return <p style={{ margin: '0 0 12px', color: '#1A0A00', lineHeight: 1.75 }}>{children}</p>
}
function Ul({ items }) {
  return (
    <ul style={{ margin: '0 0 16px', paddingLeft: '22px', color: '#1A0A00', lineHeight: 1.75 }}>
      {items.map((it, i) => <li key={i} style={{ marginBottom: '6px' }}>{it}</li>)}
    </ul>
  )
}
