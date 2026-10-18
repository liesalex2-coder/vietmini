/* VietMini — langues de l'app web (vietnamien, anglais, russe), commun aux 8 modèles.
   - Langue : ?lang= > choix enregistré > langue du téléphone (vi → VI, ru → RU, sinon EN)
   - Sélecteur VI / EN / RU en haut à droite
   - Traduit l'interface ; le contenu saisi par le commerçant (services, annonces…) reste tel quel
   - window.vmT(texteVietnamien, variables) pour les textes construits par les scripts */
(function () {
  var LANGS = ['vi', 'en', 'ru'];
  var STORE = 'vm_lang';

  // Clé = texte vietnamien exact. {x} = variable.
  var D = {
    // ── Navigation, page d'accueil ──
    'Trang chủ': ['Home', 'Главная'],
    '🏠 Trang chủ': ['🏠 Home', '🏠 Главная'],
    '🏠 Về trang chủ': ['🏠 Back to home', '🏠 На главную'],
    'Tôi': ['Me', 'Профиль'],
    'Trang cá nhân': ['My profile', 'Мой профиль'],
    'Thông tin': ['Information', 'Информация'],
    'Địa chỉ': ['Address', 'Адрес'],
    'Giờ mở cửa': ['Opening hours', 'Часы работы'],
    'Zalo / Điện thoại': ['Zalo / Phone', 'Zalo / Телефон'],
    'Nhắn Zalo': ['Zalo chat', 'Написать в Zalo'],
    '📞 Gọi': ['📞 Call', '📞 Позвонить'],
    'Đánh giá khách hàng': ['Customer reviews', 'Отзывы клиентов'],
    'Dịch vụ': ['Services', 'Услуги'],
    'Lớp học': ['Classes', 'Занятия'],
    'Thực đơn': ['Menu', 'Меню'],
    'Sản phẩm': ['Products', 'Товары'],
    'Các phòng': ['Rooms', 'Комнаты'],
    'Tất cả': ['All', 'Все'],
    'Khác': ['Other', 'Другое'],
    'Chi tiết dịch vụ': ['Service details', 'Об услуге'],
    'Chi tiết sản phẩm': ['Product details', 'О товаре'],
    'Giá': ['Price', 'Цена'],
    'Danh mục': ['Category', 'Категория'],
    'Mô tả dịch vụ': ['Description', 'Описание'],
    'Tình trạng': ['Availability', 'Наличие'],
    'Còn hàng': ['In stock', 'В наличии'],
    '🎟 Ưu đãi': ['🎟 Offers', '🎟 Акции'],
    'Tất cả dịch vụ': ['All services', 'Все услуги'],
    'Chào đón chuyên viên nail mới tại salon.': ['Welcome to our new nail artist.', 'Встречайте нашего нового мастера маникюра.'],
    'Chủ nhật này mở cửa đến 20h.': ['Open until 8 pm this Sunday.', 'В это воскресенье работаем до 20:00.'],
    'Mở cửa thêm sáng Chủ nhật, từ 8h.': ['Now open Sunday mornings, from 8 am.', 'Теперь открыты по воскресеньям с 8:00.'],
    'Đã có sáp vuốt tóc mới tại quầy.': ['New hair wax available at the counter.', 'Новый воск для волос уже на стойке.'],
    'Phòng xông hơi thảo dược đã mở cửa.': ['Our herbal steam room is now open.', 'Открыта травяная паровая комната.'],
    'Vui lòng đến trước 10 phút để thư giãn.': ['Please arrive 10 minutes early to relax.', 'Приходите за 10 минут, чтобы расслабиться.'],
    'Món mới: phở bò Wagyu.': ['New dish: Wagyu beef pho.', 'Новое блюдо: фо с говядиной вагю.'],
    'Có chỗ đậu xe máy miễn phí trước quán.': ['Free motorbike parking in front.', 'Бесплатная парковка для мотобайков у входа.'],
    'Lớp yoga buổi sáng mới: thứ Hai, Tư, Sáu lúc 6h.': ['New morning yoga class: Mon, Wed, Fri at 6 am.', 'Новый утренний класс йоги: пн, ср, пт в 6:00.'],
    'Phòng tập mở cửa đến 22h mỗi ngày.': ['The gym is open until 10 pm every day.', 'Зал открыт каждый день до 22:00.'],
    'Đã có dịch vụ đón và trả thú cưng tận nhà.': ['Pet pick-up and drop-off at home now available.', 'Теперь забираем и привозим питомцев на дом.'],
    'Nhớ mang sổ tiêm phòng khi đến lần đầu.': ['Please bring the vaccination record on your first visit.', 'При первом визите возьмите паспорт прививок.'],
    'Phòng VIP mới với hệ thống âm thanh mới.': ['New VIP room with a brand-new sound system.', 'Новая VIP-комната с новой акустикой.'],
    'Cập nhật bài hát mới mỗi tuần.': ['New songs added every week.', 'Новые песни каждую неделю.'],
    'Bộ sưu tập thu đông đã về.': ['The autumn-winter collection has arrived.', 'Поступила осенне-зимняя коллекция.'],
    'Mở cửa đến 22h vào cuối tuần.': ['Open until 10 pm on weekends.', 'По выходным работаем до 22:00.'],
    'Chưa có đánh giá.': ['No reviews yet.', 'Отзывов пока нет.'],
    '✓ Đã xác minh': ['✓ Verified', '✓ Проверено'],
    'Khách hàng': ['Customer', 'Клиент'],
    'Ứng dụng này hiện chưa được kích hoạt.': ['This page is not active yet.', 'Эта страница пока не активна.'],
    'Vui lòng liên hệ chủ cửa hàng.': ['Please contact the business.', 'Пожалуйста, свяжитесь с заведением.'],

    // ── Bandeaux de l'en-tête (modèles) ──
    '✦ Nail · Tóc · Makeup · Da mặt': ['✦ Nails · Hair · Makeup · Skin', '✦ Ногти · Волосы · Макияж · Кожа'],
    '✦ Massage & Chăm Sóc Da': ['✦ Massage & Skin care', '✦ Массаж и уход за кожей'],
    '✦ Thời Trang · Phụ Kiện · Hàng Mới': ['✦ Fashion · Accessories · New arrivals', '✦ Одежда · Аксессуары · Новинки'],
    '✦ Ẩm thực Việt Nam': ['✦ Vietnamese cuisine', '✦ Вьетнамская кухня'],

    // ── Vòng quay ──
    'Vòng Quay May Mắn!': ['Lucky Wheel!', 'Колесо удачи!'],
    'Vòng Quay May Mắn': ['Lucky Wheel', 'Колесо удачи'],
    'Quay miễn phí — nhận ngay ưu đãi hôm nay': ['Free spin — win an offer today', 'Крутите бесплатно — выиграйте скидку'],
    'Quay ngay': ['Spin now', 'Крутить'],
    'QUAY': ['SPIN', 'КРУТИТЬ'],
    'NGAY': ['', ''],
    'Quay một lần mỗi ngày — hoàn toàn miễn phí!': ['One free spin every day!', 'Одна бесплатная попытка в день!'],
    'Có hiệu lực trong 30 ngày': ['Valid for 30 days', 'Действует 30 дней'],
    'Quay lại vào ngày mai 🌸': ['Come back tomorrow 🌸', 'Возвращайтесь завтра 🌸'],
    'Chụp màn hình này và xuất trình cho nhân viên khi đến để nhận thưởng.': ['Take a screenshot and show it to the staff when you visit to claim your prize.', 'Сделайте скриншот и покажите его сотруднику при визите, чтобы получить приз.'],
    'Mở trang Tôi và xuất trình cho nhân viên khi đến để nhận thưởng.': ['Open your profile and show it to the staff when you visit to claim your prize.', 'Откройте профиль и покажите его сотруднику при визите, чтобы получить приз.'],
    'Phần thưởng đã được lưu trong trang Tôi.': ['Your prize is saved in your profile.', 'Приз сохранён в вашем профиле.'],
    'Hẹn gặp lại bạn ngày mai!': ['See you tomorrow!', 'До завтра!'],
    'Bạn đã quay hôm nay. Quay lại vào ngày mai.': ['You already spun today. Come back tomorrow.', 'Вы уже крутили сегодня. Возвращайтесь завтра.'],
    'Hẹn gặp lại bạn ngày mai! Thử lại vận may nhé 🌸': ['See you tomorrow! Try your luck again 🌸', 'До завтра! Попробуйте снова 🌸'],

    // ── Bienvenue / offre nouveau client ──
    'Chào mừng khách mới!': ['Welcome, new customer!', 'Добро пожаловать!'],
    'Bạn nhận được ưu đãi đặc biệt': ['You get a special offer', 'Для вас специальное предложение'],
    'Ưu đãi đặc biệt dành cho bạn': ['A special offer for you', 'Специальное предложение для вас'],
    'Dành riêng cho lần đầu tiên ghé tiệm': ['For your first visit', 'На первый визит'],
    'Xuất trình màn hình này cho nhân viên khi đến để nhận giảm giá.': ['Show this screen to the staff when you visit to get the discount.', 'Покажите этот экран сотруднику при визите, чтобы получить скидку.'],
    'Bắt đầu khám phá →': ['Start exploring →', 'Начать →'],
    '🎁 Ưu đãi khách mới': ['🎁 New customer offer', '🎁 Скидка для новых клиентов'],
    'Cách nhận ưu đãi': ['How to get it', 'Как получить'],
    'Mở app này khi đến tiệm': ['Open this page when you visit', 'Откройте эту страницу при визите'],
    'Mở app này khi đến cửa hàng': ['Open this page when you visit', 'Откройте эту страницу при визите'],
    'Xuất trình màn hình này cho nhân viên': ['Show this screen to the staff', 'Покажите этот экран сотруднику'],
    'Nhận giảm giá ngay — không cần in phiếu': ['Get the discount — nothing to print', 'Скидка сразу — ничего не нужно печатать'],
    '⏳ Có hiệu lực trong 30 ngày kể từ lần mở app đầu tiên': ['⏳ Valid for 30 days from your first visit to this page', '⏳ Действует 30 дней с первого открытия страницы'],
    'Đã hiểu — Tôi sẽ xuất trình khi đến': ['Got it — I will show it when I visit', 'Понятно — покажу при визите'],

    // ── Flash sale ──
    '📅 Bắt đầu:': ['📅 Starts:', '📅 Начало:'],
    '⏰ Kết thúc:': ['⏰ Ends:', '⏰ Окончание:'],
    'Xuất trình màn hình này khi thanh toán để được áp dụng ưu đãi.': ['Show this screen when paying to get the offer.', 'Покажите этот экран при оплате, чтобы получить скидку.'],
    'Xem ngay': ['View', 'Смотреть'],

    // ── Membre (page Tôi) ──
    'Thẻ thành viên': ['Membership card', 'Карта клиента'],
    'Nhập tên và số điện thoại để lưu điểm tích lũy của bạn.': ['Enter your name and phone number to save your points.', 'Введите имя и номер телефона, чтобы сохранять баллы.'],
    'Nhập tên và số điện thoại để quay vòng quay may mắn.': ['Enter your name and phone number to spin the lucky wheel.', 'Введите имя и номер телефона, чтобы крутить колесо удачи.'],
    'Tên': ['Name', 'Имя'],
    'Số điện thoại': ['Phone number (with country code)', 'Номер телефона (с кодом страны)'],
    'Tiếp tục': ['Continue', 'Продолжить'],
    'Vui lòng nhập tên.': ['Please enter your name.', 'Введите имя.'],
    'Số điện thoại không hợp lệ.': ['Invalid phone number. Include your country code, e.g. +44.', 'Неверный номер. Укажите код страны, например +7.'],
    'Có lỗi xảy ra, vui lòng thử lại.': ['Something went wrong, please try again.', 'Произошла ошибка, попробуйте ещё раз.'],
    'Không phải bạn?': ['Not you?', 'Это не вы?'],
    'Đang tải…': ['Loading…', 'Загрузка…'],
    'Thẻ tích điểm': ['Stamp card', 'Карта визитов'],
    '{n} / {total} lần ghé': ['{n} / {total} visits', 'Визиты: {n} из {total}'],
    'Bạn đã đủ tem! Xuất trình cho nhân viên để nhận phần thưởng.': ['Your card is full! Show it to the staff to get your reward.', 'Карта заполнена! Покажите её сотруднику, чтобы получить награду.'],
    'Phần thưởng: {r}': ['Reward: {r}', 'Награда: {r}'],
    'Dùng phần thưởng': ['Use reward', 'Получить награду'],
    'Nhận tem': ['Get a stamp', 'Получить отметку'],
    'Giới thiệu bạn bè': ['Refer a friend', 'Пригласите друга'],
    'Gửi đường link cho bạn bè. Bạn bè được {a}. Bạn được {b} khi bạn bè đến lần đầu.': ['Send the link to a friend. Your friend gets {a}. You get {b} after their first visit.', 'Отправьте ссылку другу. Друг получит {a}. Вы получите {b} после его первого визита.'],
    'giảm {n}%': ['{n}% off', 'скидку {n}%'],
    '{s} · hiệu lực {d} ngày': ['{s} · valid {d} days', '{s} · действует {d} дн.'],
    'Chia sẻ': ['Share', 'Поделиться'],
    'Đã sao chép đường link.': ['Link copied.', 'Ссылка скопирована.'],
    'Giảm {n}% cho lần đầu đến.': ['{n}% off your first visit.', 'Скидка {n}% на первый визит.'],
    'Đánh giá': ['Review', 'Отзыв'],
    'Bạn có thể đánh giá sau lần ghé đầu tiên.': ['You can leave a review after your first visit.', 'Оставить отзыв можно после первого визита.'],
    'Chia sẻ trải nghiệm của bạn (không bắt buộc)': ['Share your experience (optional)', 'Расскажите о впечатлениях (необязательно)'],
    'Nhận {x} khi gửi đánh giá.': ['Get {x} for leaving a review.', 'Получите {x} за отзыв.'],
    'Gửi đánh giá': ['Send review', 'Отправить отзыв'],
    'Cảm ơn bạn đã đánh giá!': ['Thank you for your review!', 'Спасибо за отзыв!'],
    'Bạn có thể đánh giá lại từ {d}.': ['You can review again from {d}.', 'Новый отзыв можно оставить с {d}.'],
    'Đánh giá của bạn đã được đăng.': ['Your review has been published.', 'Ваш отзыв опубликован.'],
    'Vui lòng chọn số sao.': ['Please choose a star rating.', 'Выберите оценку.'],
    'Nội dung không được phép.': ['This content is not allowed.', 'Недопустимое содержание.'],
    'Bạn đã đánh giá gần đây.': ['You reviewed recently.', 'Вы недавно оставляли отзыв.'],
    'Phần thưởng của bạn': ['Your rewards', 'Ваши награды'],
    'Xuất trình cho nhân viên khi đến để nhận thưởng.': ['Show it to the staff when you visit.', 'Покажите сотруднику при визите.'],
    'Vòng quay may mắn': ['Lucky wheel', 'Колесо удачи'],
    'Quà giới thiệu': ['Referral gift', 'Подарок за приглашение'],
    'Cảm ơn bạn đã giới thiệu': ['Thanks for referring a friend', 'Спасибо за приглашение'],
    'Cảm ơn bạn đã đánh giá': ['Thanks for your review', 'Спасибо за отзыв'],
    '{o} · Hết hạn: {d}': ['{o} · Expires {d}', '{o} · до {d}'],
    'Dùng': ['Use', 'Использовать'],
    'Mã PIN': ['PIN code', 'PIN-код'],
    'Nhân viên nhập mã PIN để xác nhận.': ['Staff enters the PIN to confirm.', 'Сотрудник вводит PIN для подтверждения.'],
    'Hủy': ['Cancel', 'Отмена'],
    'Nhập đủ 4 chữ số.': ['Enter 4 digits.', 'Введите 4 цифры.'],
    'Mã PIN không đúng.': ['Wrong PIN.', 'Неверный PIN.'],
    'Sai quá nhiều lần. Thử lại sau 15 phút.': ['Too many attempts. Try again in 15 minutes.', 'Слишком много попыток. Повторите через 15 минут.'],
    'Đã nhận tem.': ['Stamp added.', 'Отметка добавлена.'],
    'Đã dùng phần thưởng.': ['Reward used.', 'Награда использована.']
  };

  var DAYS = { CN: ['Sun', 'Вс'], T2: ['Mon', 'Пн'], T3: ['Tue', 'Вт'], T4: ['Wed', 'Ср'], T5: ['Thu', 'Чт'], T6: ['Fri', 'Пт'], T7: ['Sat', 'Сб'] };

  function ruPlural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  var lang = 'vi';
  function idx() { return lang === 'en' ? 0 : 1; }

  function fill(s, vars) {
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
  }

  // Textes construits par les scripts
  function vmT(vi, vars) {
    if (lang === 'vi' || !D[vi]) return fill(vi, vars);
    return fill(D[vi][idx()], vars);
  }
  window.vmT = vmT;

  // Textes produits par les modèles avec une valeur dedans
  var PATTERNS = [
    [/^(🎁 )?Giảm (\d+)% · (.+)$/, function (m) { return (m[1] || '') + (lang === 'en' ? m[2] + '% off' : 'Скидка ' + m[2] + '%') + ' · ' + tr(m[3]); }],
    [/^GIẢM (\d+)%$/, function (m) { return lang === 'en' ? m[1] + '% OFF' : 'СКИДКА ' + m[1] + '%'; }],
    [/^Giảm (\d+)%$/, function (m) { return lang === 'en' ? m[1] + '% off' : 'Скидка ' + m[1] + '%'; }],
    [/^Giảm ([\d.,]+)đ$/, function (m) { return lang === 'en' ? m[1] + 'đ off' : 'Скидка ' + m[1] + 'đ'; }],
    [/^(\S+ )?Flash Sale — Giảm (\d+)%$/, function (m) { return (m[1] || '') + 'Flash Sale — ' + (lang === 'en' ? m[2] + '% off' : 'скидка ' + m[2] + '%'); }],
    [/^(.+) · Kết thúc (.+)$/, function (m) { return tr(m[1]) + (lang === 'en' ? ' · ends ' : ' · до ') + m[2]; }],
    [/^Hết hạn: (.+)$/, function (m) { return (lang === 'en' ? 'Expires: ' : 'Действует до: ') + m[1]; }],
    [/^⭐ ([\d,.]+) \((\d+) đánh giá\)$/, function (m) {
      var n = parseInt(m[2], 10);
      var avg = lang === 'en' ? m[1].replace(',', '.') : m[1];
      return '⭐ ' + avg + ' (' + n + ' ' + (lang === 'en' ? (n === 1 ? 'review' : 'reviews') : ruPlural(n, 'отзыв', 'отзыва', 'отзывов')) + ')';
    }],
    [/^⏱ (\d+) phút$/, function (m) { return '⏱ ' + m[1] + (lang === 'en' ? ' min' : ' мин'); }],
    [/^((CN|T[2-7])(, )?)+$/, function (m) {
      return m[0].split(', ').map(function (d) { return DAYS[d] ? DAYS[d][idx()] : d; }).join(', ');
    }]
  ];

  function tr(text) {
    if (lang === 'vi') return text;
    var key = text.replace(/\s+/g, ' ').trim();
    if (!key) return text;
    var out = null;
    if (D[key] && key.indexOf('{') === -1) out = D[key][idx()];
    else {
      for (var i = 0; i < PATTERNS.length; i++) {
        var m = key.match(PATTERNS[i][0]);
        if (m) { out = PATTERNS[i][1](m); break; }
      }
    }
    if (out === null) return text;
    var lead = text.match(/^\s*/)[0], trail = text.match(/\s*$/)[0];
    return lead + out + trail;
  }

  // ── Traduction du DOM (garde le texte d'origine pour revenir au vietnamien) ──
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1 };
  function doText(n) {
    var p = n.parentNode;
    if (!p || SKIP[p.nodeName] || (p.closest && p.closest('.vm-lang-switch'))) return;
    if (n.__vmLast === undefined || n.nodeValue !== n.__vmLast) n.__vmOrig = n.nodeValue;
    var v = tr(n.__vmOrig);
    if (v !== n.nodeValue) n.nodeValue = v;
    n.__vmLast = n.nodeValue;
  }
  function doAttrs(el) {
    if (!el.getAttribute) return;
    var ph = el.getAttribute('placeholder');
    if (ph == null) return;
    if (el.__vmPhLast === undefined || ph !== el.__vmPhLast) el.__vmPhOrig = ph;
    var v = tr(el.__vmPhOrig);
    if (v !== ph) el.setAttribute('placeholder', v);
    el.__vmPhLast = el.getAttribute('placeholder');
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1 || SKIP[root.nodeName]) return;
    doAttrs(root);
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    var n;
    while ((n = tw.nextNode())) {
      if (n.nodeType === 3) doText(n); else doAttrs(n);
    }
  }

  var busy = false;
  var obs = new MutationObserver(function (list) {
    if (busy) return;
    busy = true;
    for (var i = 0; i < list.length; i++) {
      var r = list[i];
      if (r.type === 'characterData') doText(r.target);
      else if (r.type === 'attributes') doAttrs(r.target);
      else for (var j = 0; j < r.addedNodes.length; j++) walk(r.addedNodes[j]);
    }
    busy = false;
  });

  // ── Sélecteur de langue ──
  var sw;
  function drawSwitch() {
    if (!sw) return;
    Array.prototype.forEach.call(sw.querySelectorAll('button'), function (b) {
      var on = b.getAttribute('data-l') === lang;
      b.style.background = on ? '#fff' : 'transparent';
      b.style.color = on ? '#1A0A00' : '#fff';
    });
  }
  function setLang(l, save) {
    if (LANGS.indexOf(l) === -1) l = 'en';
    lang = l;
    window.VM_LANG = l;
    document.documentElement.lang = l;
    if (save) { try { localStorage.setItem(STORE, l); } catch (e) {} }
    busy = true; walk(document.body); busy = false;
    drawSwitch();
    try { document.dispatchEvent(new CustomEvent('vm:lang', { detail: l })); } catch (e) {}
  }
  window.vmSetLang = function (l) { setLang(l, true); };

  function initial() {
    var q = new URLSearchParams(window.location.search).get('lang');
    if (LANGS.indexOf(q) !== -1) return q;
    try { var s = localStorage.getItem(STORE); if (LANGS.indexOf(s) !== -1) return s; } catch (e) {}
    var nav = String(navigator.language || '').toLowerCase();
    if (nav.indexOf('vi') === 0) return 'vi';
    if (nav.indexOf('ru') === 0) return 'ru';
    return 'en';
  }

  function mountSwitch() {
    sw = document.createElement('div');
    sw.className = 'vm-lang-switch';
    sw.setAttribute('translate', 'no');
    sw.style.cssText = 'position:fixed;top:10px;z-index:950;display:flex;gap:2px;padding:3px;border-radius:20px;background:rgba(0,0,0,.45);font-family:"Be Vietnam Pro",sans-serif;';
    var frameRight = function () {
      var w = window.innerWidth, max = 430;
      sw.style.right = (w > max ? (w - max) / 2 + 10 : 10) + 'px';
    };
    frameRight();
    window.addEventListener('resize', frameRight);
    sw.innerHTML = LANGS.map(function (l) {
      return '<button data-l="' + l + '" style="border:none;border-radius:16px;padding:4px 9px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">' + l.toUpperCase() + '</button>';
    }).join('');
    sw.addEventListener('click', function (e) {
      var l = e.target.getAttribute && e.target.getAttribute('data-l');
      if (l) setLang(l, true);
    });
    document.body.appendChild(sw);
  }

  lang = initial();
  window.VM_LANG = lang;
  function start() {
    mountSwitch();
    setLang(lang, false);
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder'] });
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
