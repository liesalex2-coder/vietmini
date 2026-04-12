import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const COLORS = {
  salon:    { primary: '#D0021B', secondary: '#F5A623' },
  barber:   { primary: '#1A0A00', secondary: '#F5A623' },
  spa:      { primary: '#5B8A6E', secondary: '#A8D5B5' },
  resto:    { primary: '#C0392B', secondary: '#F5A623' },
  gym:      { primary: '#E67E22', secondary: '#F5A623' },
  karaoke:  { primary: '#8E44AD', secondary: '#F5A623' },
  pet:      { primary: '#2980B9', secondary: '#F5A623' },
  boutique: { primary: '#C0392B', secondary: '#F5A623' },
}

const WHEEL_PRIZES = {
  salon: [
    { label: 'Giảm 10%',       color: '#D0021B' },
    { label: 'Tặng dưỡng tóc', color: '#F5A623' },
    { label: 'Giảm 20%',       color: '#7A4A2A' },
    { label: 'Thử lần sau',    color: '#cccccc' },
    { label: 'Tặng hấp dầu',   color: '#D0021B' },
    { label: 'Giảm 15%',       color: '#F5A623' },
  ],
  barber: [
    { label: 'Giảm 10%',      color: '#1A0A00' },
    { label: 'Tặng gội đầu',  color: '#F5A623' },
    { label: 'Giảm 20%',      color: '#7A4A2A' },
    { label: 'Thử lần sau',   color: '#cccccc' },
    { label: 'Tặng cạo mặt',  color: '#1A0A00' },
    { label: 'Giảm 15%',      color: '#F5A623' },
  ],
  spa: [
    { label: 'Giảm 10%',      color: '#5B8A6E' },
    { label: 'Tặng đắp mặt',  color: '#A8D5B5' },
    { label: 'Giảm 20%',      color: '#5B8A6E' },
    { label: 'Thử lần sau',   color: '#cccccc' },
    { label: 'Tặng xông hơi', color: '#A8D5B5' },
    { label: 'Giảm 15%',      color: '#5B8A6E' },
  ],
  resto: [
    { label: 'Giảm 10%',           color: '#C0392B' },
    { label: 'Tặng nước uống',     color: '#F5A623' },
    { label: 'Giảm 20%',           color: '#C0392B' },
    { label: 'Thử lần sau',        color: '#cccccc' },
    { label: 'Tặng món tráng miệng', color: '#F5A623' },
    { label: 'Giảm 15%',           color: '#C0392B' },
  ],
  gym: [
    { label: 'Giảm 10%',    color: '#E67E22' },
    { label: 'Tặng 1 buổi PT', color: '#F5A623' },
    { label: 'Giảm 20%',    color: '#E67E22' },
    { label: 'Thử lần sau', color: '#cccccc' },
    { label: 'Tặng áo gym', color: '#F5A623' },
    { label: 'Giảm 15%',    color: '#E67E22' },
  ],
  karaoke: [
    { label: 'Giảm 10%',      color: '#8E44AD' },
    { label: 'Tặng 30 phút',  color: '#F5A623' },
    { label: 'Giảm 20%',      color: '#8E44AD' },
    { label: 'Thử lần sau',   color: '#cccccc' },
    { label: 'Tặng đồ uống',  color: '#F5A623' },
    { label: 'Giảm 15%',      color: '#8E44AD' },
  ],
  pet: [
    { label: 'Giảm 10%',       color: '#2980B9' },
    { label: 'Tặng thơm lông', color: '#F5A623' },
    { label: 'Giảm 20%',       color: '#2980B9' },
    { label: 'Thử lần sau',    color: '#cccccc' },
    { label: 'Tặng cắt móng',  color: '#F5A623' },
    { label: 'Giảm 15%',       color: '#2980B9' },
  ],
  boutique: [
    { label: 'Giảm 10%',          color: '#C0392B' },
    { label: 'Tặng quà',          color: '#F5A623' },
    { label: 'Giảm 20%',          color: '#C0392B' },
    { label: 'Thử lần sau',       color: '#cccccc' },
    { label: 'Miễn phí giao hàng', color: '#F5A623' },
    { label: 'Giảm 15%',          color: '#C0392B' },
  ],
}

const WELCOME = {
  salon:    { discount: 15, message: 'Chào mừng bạn đến với salon! Nhận ngay ưu đãi dành cho khách hàng mới.' },
  barber:   { discount: 15, message: 'Chào mừng bạn! Lần đầu cắt tóc tại đây — nhận ưu đãi đặc biệt.' },
  spa:      { discount: 20, message: 'Chào mừng bạn đến với spa! Thư giãn và nhận ưu đãi dành riêng cho bạn.' },
  resto:    { discount: 10, message: 'Chào mừng bạn! Thưởng thức bữa ăn đầu tiên với ưu đãi hấp dẫn.' },
  gym:      { discount: 25, message: 'Chào mừng bạn đến với gym! Bắt đầu hành trình của bạn với ưu đãi đặc biệt.' },
  karaoke:  { discount: 15, message: 'Chào mừng bạn! Hát thỏa thích và nhận ngay ưu đãi cho lần đầu.' },
  pet:      { discount: 15, message: 'Chào mừng bạn và thú cưng! Nhận ưu đãi đặc biệt cho lần đầu ghé thăm.' },
  boutique: { discount: 10, message: 'Chào mừng bạn đến với cửa hàng! Nhận ưu đãi dành cho khách hàng mới.' },
}

const LOYALTY = {
  salon:    { visits: 10, reward: 'Tặng 1 lần gội đầu + dưỡng tóc miễn phí' },
  barber:   { visits: 10, reward: 'Tặng 1 lần cắt tóc miễn phí' },
  spa:      { visits: 10, reward: 'Tặng 1 buổi massage 60 phút miễn phí' },
  resto:    { visits: 8,  reward: 'Tặng 1 món ăn chính miễn phí' },
  gym:      { visits: 12, reward: 'Tặng 1 tháng tập miễn phí' },
  karaoke:  { visits: 6,  reward: 'Tặng 2 giờ hát miễn phí' },
  pet:      { visits: 10, reward: 'Tặng 1 lần tắm + cắt lông miễn phí' },
  boutique: { visits: 10, reward: 'Tặng voucher mua sắm 200.000₫' },
}

const FLASH = {
  salon:    { discount: 20, service: 'Nhuộm tóc' },
  barber:   { discount: 20, service: 'Cắt + gội' },
  spa:      { discount: 25, service: 'Massage body' },
  resto:    { discount: 20, service: 'Combo cơm trưa' },
  gym:      { discount: 30, service: 'Đăng ký tháng' },
  karaoke:  { discount: 20, service: 'Phòng VIP 3 giờ' },
  pet:      { discount: 20, service: 'Tắm + cắt tỉa' },
  boutique: { discount: 20, service: 'Bộ sưu tập mới' },
}

const SERVICES = {
  salon: {
    categories: ['Tóc', 'Nail', 'Makeup'],
    items: [
      { cat: 'Tóc',   name: 'Cắt tóc nữ',       price: 120000 },
      { cat: 'Tóc',   name: 'Uốn tóc',           price: 350000 },
      { cat: 'Tóc',   name: 'Nhuộm tóc',         price: 450000 },
      { cat: 'Tóc',   name: 'Hấp dầu + dưỡng',   price: 180000 },
      { cat: 'Nail',  name: 'Sơn gel tay',        price: 150000 },
      { cat: 'Nail',  name: 'Sơn gel chân',       price: 120000 },
      { cat: 'Nail',  name: 'Đắp bột',            price: 220000 },
      { cat: 'Makeup', name: 'Makeup cô dâu',     price: 800000 },
      { cat: 'Makeup', name: 'Makeup dự tiệc',    price: 400000 },
    ]
  },
  barber: {
    categories: ['Tóc', 'Da mặt'],
    items: [
      { cat: 'Tóc',     name: 'Cắt tóc nam',          price: 80000 },
      { cat: 'Tóc',     name: 'Cắt + gội',             price: 110000 },
      { cat: 'Tóc',     name: 'Nhuộm tóc nam',         price: 250000 },
      { cat: 'Tóc',     name: 'Uốn / duỗi',            price: 300000 },
      { cat: 'Da mặt',  name: 'Cạo mặt + đắp mặt nạ', price: 120000 },
      { cat: 'Da mặt',  name: 'Chăm sóc da mặt',       price: 180000 },
    ]
  },
  spa: {
    categories: ['Massage', 'Chăm sóc da', 'Liệu trình'],
    items: [
      { cat: 'Massage',       name: 'Massage body 60 phút',        price: 350000 },
      { cat: 'Massage',       name: 'Massage body 90 phút',        price: 480000 },
      { cat: 'Massage',       name: 'Massage đá nóng',             price: 520000 },
      { cat: 'Chăm sóc da',   name: 'Đắp mặt nạ dưỡng da',        price: 220000 },
      { cat: 'Chăm sóc da',   name: 'Tẩy tế bào chết toàn thân',  price: 380000 },
      { cat: 'Liệu trình',    name: 'Liệu trình 5 buổi',           price: 1500000 },
      { cat: 'Liệu trình',    name: 'Liệu trình 10 buổi',          price: 2800000 },
    ]
  },
  resto: {
    categories: ['Phở & Bún', 'Cơm', 'Đồ uống'],
    items: [
      { cat: 'Phở & Bún', name: 'Phở bò tái',       price: 65000 },
      { cat: 'Phở & Bún', name: 'Phở bò chín',       price: 65000 },
      { cat: 'Phở & Bún', name: 'Bún bò Huế',        price: 60000 },
      { cat: 'Cơm',       name: 'Cơm sườn nướng',    price: 70000 },
      { cat: 'Cơm',       name: 'Cơm gà xối mỡ',     price: 70000 },
      { cat: 'Cơm',       name: 'Cơm tấm đặc biệt',  price: 75000 },
      { cat: 'Đồ uống',   name: 'Trà đá',            price: 10000 },
      { cat: 'Đồ uống',   name: 'Sinh tố bơ',        price: 45000 },
      { cat: 'Đồ uống',   name: 'Nước ép cam',       price: 40000 },
    ]
  },
  gym: {
    categories: ['Thẻ tập', 'PT cá nhân', 'Lớp học nhóm'],
    items: [
      { cat: 'Thẻ tập',      name: 'Thẻ tháng',        price: 500000 },
      { cat: 'Thẻ tập',      name: 'Thẻ 3 tháng',      price: 1300000 },
      { cat: 'Thẻ tập',      name: 'Thẻ 6 tháng',      price: 2400000 },
      { cat: 'Thẻ tập',      name: 'Thẻ năm',          price: 4000000 },
      { cat: 'PT cá nhân',   name: 'PT 1 buổi',        price: 300000 },
      { cat: 'PT cá nhân',   name: 'PT 10 buổi',       price: 2500000 },
      { cat: 'Lớp học nhóm', name: 'Yoga (1 tháng)',   price: 600000 },
      { cat: 'Lớp học nhóm', name: 'Zumba (1 tháng)',  price: 550000 },
    ]
  },
  karaoke: {
    categories: ['Phòng hát', 'Đồ uống', 'Đồ ăn nhẹ'],
    items: [
      { cat: 'Phòng hát',  name: 'Phòng thường (1h)',    price: 80000 },
      { cat: 'Phòng hát',  name: 'Phòng VIP (1h)',       price: 150000 },
      { cat: 'Phòng hát',  name: 'Phòng VIP (3h)',       price: 400000 },
      { cat: 'Phòng hát',  name: 'Phòng đại sảnh (1h)',  price: 300000 },
      { cat: 'Đồ uống',    name: 'Bia Tiger (lon)',      price: 30000 },
      { cat: 'Đồ uống',    name: 'Nước ngọt',           price: 20000 },
      { cat: 'Đồ uống',    name: 'Rượu vang (chai)',    price: 350000 },
      { cat: 'Đồ ăn nhẹ', name: 'Đĩa trái cây',        price: 120000 },
      { cat: 'Đồ ăn nhẹ', name: 'Lẩu mini',            price: 200000 },
    ]
  },
  pet: {
    categories: ['Vệ sinh', 'Tạo kiểu', 'Chăm sóc sức khỏe'],
    items: [
      { cat: 'Vệ sinh',              name: 'Tắm + sấy (chó nhỏ)',    price: 120000 },
      { cat: 'Vệ sinh',              name: 'Tắm + sấy (chó lớn)',    price: 180000 },
      { cat: 'Vệ sinh',              name: 'Vệ sinh tai + cắt móng', price: 80000 },
      { cat: 'Tạo kiểu',             name: 'Cắt tỉa lông (chó nhỏ)', price: 200000 },
      { cat: 'Tạo kiểu',             name: 'Cắt tỉa lông (chó lớn)', price: 300000 },
      { cat: 'Tạo kiểu',             name: 'Thơm lông + nơ',         price: 100000 },
      { cat: 'Chăm sóc sức khỏe',   name: 'Tắm trị ve',             price: 150000 },
      { cat: 'Chăm sóc sức khỏe',   name: 'Chăm sóc răng miệng',    price: 120000 },
    ]
  },
  boutique: {
    categories: ['Thời trang', 'Phụ kiện', 'Mỹ phẩm'],
    items: [
      { cat: 'Thời trang', name: 'Áo nữ',          price: 250000 },
      { cat: 'Thời trang', name: 'Quần nữ',         price: 280000 },
      { cat: 'Thời trang', name: 'Đầm dự tiệc',     price: 650000 },
      { cat: 'Thời trang', name: 'Set đồ casual',   price: 420000 },
      { cat: 'Phụ kiện',   name: 'Túi xách',        price: 380000 },
      { cat: 'Phụ kiện',   name: 'Ví da',           price: 220000 },
      { cat: 'Phụ kiện',   name: 'Khăn lụa',        price: 180000 },
      { cat: 'Mỹ phẩm',    name: 'Son môi',         price: 120000 },
      { cat: 'Mỹ phẩm',    name: 'Kem dưỡng da',    price: 280000 },
    ]
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { vertical, access_token } = req.body
  if (!vertical || !access_token) return res.status(400).json({ error: 'Paramètres manquants' })

  // Vérifier le token et récupérer l'utilisateur
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(access_token)
  if (authError || !user) return res.status(401).json({ error: 'Non authentifié' })

  try {
    // Vérifier si le marchand a déjà un vertical
    const { data: existing } = await supabaseAdmin
      .from('merchants')
      .select('id, vertical')
      .eq('user_id', user.id)
      .single()

    if (existing?.vertical) {
      return res.status(400).json({ error: 'Vertical déjà configuré' })
    }

    const merchantId = existing?.id
    if (!merchantId) return res.status(404).json({ error: 'Profil marchand introuvable' })

    const colors = COLORS[vertical] || COLORS.salon
    const welcome = WELCOME[vertical] || WELCOME.salon
    const loyalty = LOYALTY[vertical] || LOYALTY.salon
    const flash = FLASH[vertical] || FLASH.salon
    const svcData = SERVICES[vertical] || SERVICES.salon

    // 1. Mettre à jour le profil marchand
    await supabaseAdmin.from('merchants').update({
      vertical,
      primary_color:    colors.primary,
      secondary_color:  colors.secondary,
      welcome_enabled:  true,
      welcome_discount: welcome.discount,
      welcome_message:  welcome.message,
    }).eq('id', merchantId)

    // 2. Roue
    const existingWheel = await supabaseAdmin
      .from('wheel_config')
      .select('id')
      .eq('merchant_id', merchantId)
      .single()

    if (existingWheel.data) {
      await supabaseAdmin.from('wheel_config').update({
        enabled: true,
        prizes: WHEEL_PRIZES[vertical] || WHEEL_PRIZES.salon
      }).eq('merchant_id', merchantId)
    } else {
      await supabaseAdmin.from('wheel_config').insert({
        merchant_id: merchantId,
        enabled: true,
        prizes: WHEEL_PRIZES[vertical] || WHEEL_PRIZES.salon
      })
    }

    // 3. Fidélité
    const existingLoyalty = await supabaseAdmin
      .from('loyalty_config')
      .select('id')
      .eq('merchant_id', merchantId)
      .single()

    if (existingLoyalty.data) {
      await supabaseAdmin.from('loyalty_config').update({
        enabled: true,
        visits_required: loyalty.visits,
        reward_text: loyalty.reward,
        pin: '0000'
      }).eq('merchant_id', merchantId)
    } else {
      await supabaseAdmin.from('loyalty_config').insert({
        merchant_id: merchantId,
        enabled: true,
        visits_required: loyalty.visits,
        reward_text: loyalty.reward,
        pin: '0000'
      })
    }

    // 4. Flash sale
    const existingFlash = await supabaseAdmin
      .from('flash_sales')
      .select('id')
      .eq('merchant_id', merchantId)
      .single()

    if (existingFlash.data) {
      await supabaseAdmin.from('flash_sales').update({
        enabled: false,
        discount_value: flash.discount,
        service_name: flash.service
      }).eq('merchant_id', merchantId)
    } else {
      await supabaseAdmin.from('flash_sales').insert({
        merchant_id: merchantId,
        enabled: false,
        discount_value: flash.discount,
        service_name: flash.service
      })
    }

    // 5. Parrainage
    const existingReferral = await supabaseAdmin
      .from('referral_config')
      .select('id')
      .eq('merchant_id', merchantId)
      .single()

    if (!existingReferral.data) {
      await supabaseAdmin.from('referral_config').insert({
        merchant_id: merchantId,
        enabled: false,
        referrer_discount: 15,
        referee_discount: 10,
        validity_days: 30
      })
    }

    // 6. Catégories
    await supabaseAdmin.from('service_categories')
      .delete()
      .eq('merchant_id', merchantId)

    await supabaseAdmin.from('service_categories').insert(
      svcData.categories.map((name, i) => ({
        merchant_id: merchantId,
        name,
        display_order: i + 1
      }))
    )

    // 7. Services
    await supabaseAdmin.from('services')
      .delete()
      .eq('merchant_id', merchantId)

    await supabaseAdmin.from('services').insert(
      svcData.items.map((s, i) => ({
        merchant_id: merchantId,
        category: s.cat,
        name: s.name,
        price: s.price,
        display_order: i + 1
      }))
    )

    return res.status(200).json({ ok: true })

  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}