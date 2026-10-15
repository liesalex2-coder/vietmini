/* VietMini — identification du client et carte de fidélité (page « Tôi »)
   Commun aux 8 modèles. Actif uniquement avec ?merchant_id= dans l'URL.
   Les tampons sont enregistrés côté serveur, le PIN est vérifié par le serveur. */
(function () {
  var params = new URLSearchParams(window.location.search);
  var merchantId = params.get('merchant_id');
  if (!merchantId) return;

  var apiBase = params.get('api') || window.location.origin;
  var preview = params.get('preview') === '1';
  var STORE_KEY = 'vm_card_' + merchantId;

  var state = { card: null, loyalty: null, busy: false };

  function storeGet() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } }
  function storeSet(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) {} }
  function storeDel() { try { localStorage.removeItem(STORE_KEY); } catch (e) {} }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function api(path, opts) {
    return fetch(apiBase + path, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (body) {
        return { ok: r.ok, status: r.status, body: body };
      });
    });
  }

  // ── STYLES ──────────────────────────────────────────────────
  var css = document.createElement('style');
  css.textContent = [
    '.vmm{padding:16px;font-family:"Be Vietnam Pro",sans-serif;color:var(--text,#1a1a1a)}',
    '.vmm-card{background:#fff;border-radius:16px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.06);margin-bottom:16px}',
    '.vmm-title{font-size:17px;font-weight:800;margin-bottom:6px}',
    '.vmm-sub{font-size:13px;color:var(--muted,#777);line-height:1.5;margin-bottom:16px}',
    '.vmm-label{display:block;font-size:12px;font-weight:700;color:var(--muted,#777);margin:0 0 6px}',
    '.vmm-input{display:block;width:100%;box-sizing:border-box;border:1.5px solid #e5e5e5;border-radius:12px;padding:12px 14px;font-size:15px;font-family:inherit;margin-bottom:14px;outline:none}',
    '.vmm-input:focus{border-color:var(--primary,#D0021B)}',
    '.vmm-btn{display:block;width:100%;border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;background:var(--primary,#D0021B);color:#fff}',
    '.vmm-btn[disabled]{opacity:.5;cursor:default}',
    '.vmm-link{background:none;border:none;padding:0;margin-top:10px;font-size:12px;color:var(--muted,#777);text-decoration:underline;cursor:pointer;font-family:inherit}',
    '.vmm-error{color:#e74c3c;font-size:13px;min-height:18px;margin-bottom:8px}',
    '.vmm-id{display:flex;align-items:center;gap:14px}',
    '.vmm-av{width:52px;height:52px;border-radius:50%;background:var(--primary,#D0021B);color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;flex-shrink:0}',
    '.vmm-name{font-size:17px;font-weight:800}',
    '.vmm-phone{font-size:13px;color:var(--muted,#777);margin-top:2px}',
    '.vmm-stamps{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:14px 0}',
    '.vmm-stamp{aspect-ratio:1;border-radius:50%;border:2px dashed #ddd;display:flex;align-items:center;justify-content:center;font-size:18px}',
    '.vmm-stamp.on{border:2px solid var(--primary,#D0021B);background:var(--primary,#D0021B);color:#fff}',
    '.vmm-reward{font-size:13px;background:#fafafa;border-radius:10px;padding:10px 12px;margin-bottom:14px}',
    '.vmm-done{font-size:14px;font-weight:700;text-align:center;background:#eaf7ee;color:#1a6b3a;border-radius:10px;padding:12px;margin-bottom:14px}',
    '.vmm-ok{font-size:13px;font-weight:700;text-align:center;color:#1a6b3a;margin-top:10px;min-height:18px}',
    '.vmm-pin-bd{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:800;align-items:flex-end;justify-content:center;max-width:430px;margin:0 auto}',
    '.vmm-pin-bd.open{display:flex}',
    '.vmm-pin{background:#fff;border-radius:24px 24px 0 0;width:100%;padding:24px 20px 32px;font-family:"Be Vietnam Pro",sans-serif}',
    '.vmm-dots{display:flex;gap:12px;justify-content:center;margin:16px 0}',
    '.vmm-dot{width:18px;height:18px;border-radius:50%;border:2px solid var(--primary,#D0021B)}',
    '.vmm-dot.on{background:var(--primary,#D0021B)}',
    '.vmm-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}',
    '.vmm-key{background:#f5f5f5;border:none;border-radius:12px;padding:16px;font-size:20px;font-weight:700;font-family:inherit;cursor:pointer;color:var(--text,#1a1a1a)}',
    '.vmm-key.ok{background:var(--primary,#D0021B);color:#fff}',
    '.vmm-cancel{display:block;width:100%;margin-top:12px;background:#f5f5f5;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;color:var(--muted,#777)}'
  ].join('');
  document.head.appendChild(css);

  // ── PAGE « TÔI » : on remplace le contenu de démonstration ──
  var page = document.getElementById('page-profile');
  if (!page) return;
  Array.prototype.slice.call(page.children).forEach(function (el) {
    if (!el.classList.contains('page-header')) el.remove();
  });
  var root = document.createElement('div');
  root.className = 'vmm';
  page.appendChild(root);

  // ── FORMULAIRE D'IDENTIFICATION ─────────────────────────────
  function renderForm(prefill) {
    prefill = prefill || {};
    root.innerHTML =
      '<div class="vmm-card">' +
        '<div class="vmm-title">Thẻ thành viên</div>' +
        '<div class="vmm-sub">Nhập tên và số điện thoại để lưu điểm tích lũy của bạn.</div>' +
        '<label class="vmm-label" for="vmmName">Tên</label>' +
        '<input class="vmm-input" id="vmmName" autocomplete="name" maxlength="60" value="' + esc(prefill.name) + '">' +
        '<label class="vmm-label" for="vmmPhone">Số điện thoại</label>' +
        '<input class="vmm-input" id="vmmPhone" type="tel" autocomplete="tel" placeholder="0909 123 456 / +33 6 12 34 56 78" value="' + esc(prefill.phone) + '">' +
        '<div class="vmm-error" id="vmmFormError"></div>' +
        '<button class="vmm-btn" id="vmmSubmit">Tiếp tục</button>' +
      '</div>';
    document.getElementById('vmmSubmit').onclick = submitForm;
  }

  function submitForm() {
    if (state.busy) return;
    var name = document.getElementById('vmmName').value.trim();
    var phone = document.getElementById('vmmPhone').value.trim();
    var err = document.getElementById('vmmFormError');
    err.textContent = '';
    if (!name) { err.textContent = 'Vui lòng nhập tên.'; return; }
    if (phone.replace(/\D/g, '').length < 8) { err.textContent = 'Số điện thoại không hợp lệ.'; return; }

    state.busy = true;
    var btn = document.getElementById('vmmSubmit');
    btn.disabled = true;
    api('/api/customer/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchant_id: merchantId, name: name, phone: phone, preview: preview })
    }).then(function (r) {
      state.busy = false;
      btn.disabled = false;
      if (r.ok && r.body.card) {
        state.card = r.body.card;
        state.loyalty = r.body.loyalty;
        storeSet(state.card.id);
        renderMember();
      } else if (r.body.error === 'invalid_phone') {
        err.textContent = 'Số điện thoại không hợp lệ.';
      } else {
        err.textContent = 'Có lỗi xảy ra, vui lòng thử lại.';
      }
    }).catch(function () {
      state.busy = false;
      btn.disabled = false;
      err.textContent = 'Có lỗi xảy ra, vui lòng thử lại.';
    });
  }

  // ── CLIENT IDENTIFIÉ ────────────────────────────────────────
  function renderMember() {
    var c = state.card;
    var l = state.loyalty || { enabled: false };
    var initial = (c.name || '?').charAt(0).toUpperCase();

    var html =
      '<div class="vmm-card">' +
        '<div class="vmm-id">' +
          '<div class="vmm-av">' + esc(initial) + '</div>' +
          '<div><div class="vmm-name">' + esc(c.name) + '</div><div class="vmm-phone">' + esc(c.phone) + '</div></div>' +
        '</div>' +
        '<button class="vmm-link" id="vmmLogout">Không phải bạn?</button>' +
      '</div>';

    if (l.enabled) {
      var total = l.visits_required || 10;
      var current = Math.min(c.visit_count || 0, total);
      var full = current >= total;
      var stamps = '';
      for (var i = 0; i < total; i++) {
        stamps += '<div class="vmm-stamp' + (i < current ? ' on' : '') + '">' + (i < current ? '★' : '') + '</div>';
      }
      html +=
        '<div class="vmm-card">' +
          '<div class="vmm-title">Thẻ tích điểm</div>' +
          '<div class="vmm-sub">' + current + ' / ' + total + ' lần ghé</div>' +
          '<div class="vmm-stamps">' + stamps + '</div>' +
          (full
            ? '<div class="vmm-done">Bạn đã đủ tem! Xuất trình cho nhân viên để nhận phần thưởng.</div>'
            : '') +
          (l.reward_text ? '<div class="vmm-reward">Phần thưởng: <strong>' + esc(l.reward_text) + '</strong></div>' : '') +
          '<button class="vmm-btn" id="vmmAction">' + (full ? 'Dùng phần thưởng' : 'Nhận tem') + '</button>' +
          '<div class="vmm-ok" id="vmmOk"></div>' +
        '</div>';
    }

    root.innerHTML = html;
    document.getElementById('vmmLogout').onclick = function () {
      storeDel();
      state.card = null;
      renderForm();
    };
    var action = document.getElementById('vmmAction');
    if (action) {
      action.onclick = function () {
        openPin((c.visit_count || 0) >= (l.visits_required || 10) ? 'redeem' : 'stamp');
      };
    }
  }

  // ── CLAVIER PIN (saisi par le personnel) ────────────────────
  var pinBd = document.createElement('div');
  pinBd.className = 'vmm-pin-bd';
  pinBd.innerHTML =
    '<div class="vmm-pin">' +
      '<div class="vmm-title" style="text-align:center">Mã PIN</div>' +
      '<div class="vmm-sub" style="text-align:center;margin-bottom:0">Nhân viên nhập mã PIN để xác nhận.</div>' +
      '<div class="vmm-dots"><div class="vmm-dot"></div><div class="vmm-dot"></div><div class="vmm-dot"></div><div class="vmm-dot"></div></div>' +
      '<div class="vmm-error" id="vmmPinError" style="text-align:center"></div>' +
      '<div class="vmm-keys">' +
        ['1','2','3','4','5','6','7','8','9','del','0','ok'].map(function (k) {
          var label = k === 'del' ? '⌫' : (k === 'ok' ? 'OK' : k);
          return '<button class="vmm-key' + (k === 'ok' ? ' ok' : '') + '" data-k="' + k + '">' + label + '</button>';
        }).join('') +
      '</div>' +
      '<button class="vmm-cancel" id="vmmPinCancel">Hủy</button>' +
    '</div>';
  document.body.appendChild(pinBd);

  var pinBuf = '';
  var pinAction = 'stamp';

  function drawDots() {
    var dots = pinBd.querySelectorAll('.vmm-dot');
    for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('on', i < pinBuf.length);
  }
  function openPin(action) {
    pinAction = action;
    pinBuf = '';
    drawDots();
    document.getElementById('vmmPinError').textContent = '';
    pinBd.classList.add('open');
  }
  function closePin() { pinBd.classList.remove('open'); pinBuf = ''; }

  document.getElementById('vmmPinCancel').onclick = closePin;
  pinBd.addEventListener('click', function (e) {
    if (e.target === pinBd) { closePin(); return; }
    var k = e.target.getAttribute && e.target.getAttribute('data-k');
    if (!k || state.busy) return;
    var err = document.getElementById('vmmPinError');
    err.textContent = '';
    if (k === 'del') { pinBuf = pinBuf.slice(0, -1); drawDots(); return; }
    if (k !== 'ok') { if (pinBuf.length < 4) pinBuf += k; drawDots(); return; }
    if (pinBuf.length < 4) { err.textContent = 'Nhập đủ 4 chữ số.'; return; }

    state.busy = true;
    api('/api/customer/stamp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchant_id: merchantId, card_id: state.card.id, pin: pinBuf, action: pinAction, preview: preview })
    }).then(function (r) {
      state.busy = false;
      if (r.ok && r.body.card) {
        var redeemed = pinAction === 'redeem';
        state.card = r.body.card;
        state.loyalty = r.body.loyalty;
        closePin();
        renderMember();
        var ok = document.getElementById('vmmOk');
        if (ok) ok.textContent = redeemed ? 'Đã dùng phần thưởng.' : 'Đã nhận tem.';
        return;
      }
      pinBuf = '';
      drawDots();
      var e2 = r.body.error;
      if (e2 === 'wrong_pin') err.textContent = 'Mã PIN không đúng.';
      else if (e2 === 'locked') err.textContent = 'Sai quá nhiều lần. Thử lại sau 15 phút.';
      else err.textContent = 'Có lỗi xảy ra, vui lòng thử lại.';
    }).catch(function () {
      state.busy = false;
      pinBuf = '';
      drawDots();
      err.textContent = 'Có lỗi xảy ra, vui lòng thử lại.';
    });
  });

  // ── DÉMARRAGE ───────────────────────────────────────────────
  var savedId = storeGet();
  if (!savedId) { renderForm(); return; }

  root.innerHTML = '<div class="vmm-card"><div class="vmm-sub" style="margin:0">Đang tải…</div></div>';
  api('/api/customer/card?merchant_id=' + encodeURIComponent(merchantId) +
      '&card_id=' + encodeURIComponent(savedId) + (preview ? '&preview=1' : ''))
    .then(function (r) {
      if (r.ok && r.body.card) {
        state.card = r.body.card;
        state.loyalty = r.body.loyalty;
        renderMember();
      } else {
        if (r.body && r.body.error === 'card_not_found') storeDel();
        renderForm();
      }
    })
    .catch(function () { renderForm(); });
})();
