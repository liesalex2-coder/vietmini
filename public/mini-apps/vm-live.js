/* VietMini — affichage des vraies données du commerçant, commun aux 8 modèles.
   - Note de l'en-tête calculée sur les vrais avis (masquée s'il n'y en a pas)
   - Avis clients réels (les modèles autres que salon affichaient des avis de démonstration)
   - Bandeau d'annonces (Thông báo) dans tous les modèles
   - Bouton « Nhắn Zalo » pointant vers le numéro du commerçant
   Ne fait rien sans ?merchant_id= (pages de démonstration). */
(function () {
  var params = new URLSearchParams(window.location.search);
  if (!params.get('merchant_id')) return;

  var done = false;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var css = document.createElement('style');
  css.textContent = [
    '.vml-banner{background:linear-gradient(90deg,var(--accent,var(--primary,#D0021B)),var(--primary-dark,var(--primary,#D0021B)));color:#fff;padding:10px 0;overflow:hidden;display:flex;align-items:center;margin:10px 16px 0;border-radius:12px;font-size:13px;font-weight:500}',
    '.vml-track{display:flex;gap:48px;animation:vml-scroll 15s linear infinite;white-space:nowrap;padding-left:16px}',
    '.vml-item{flex-shrink:0}',
    '.vml-item+.vml-item::before{content:"•";margin-right:48px;opacity:.6}',
    '@keyframes vml-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}',
    '.vml-verified{display:inline-block;background:#e8f5e9;color:#1a6b3a;font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;margin-left:6px;vertical-align:middle}',
    '.vml-empty{padding:16px;text-align:center;color:var(--muted,#777);font-size:13px}'
  ].join('');
  document.head.appendChild(css);

  function apply(d) {
    if (done || !d || !d.merchant) return;
    done = true;
    var m = d.merchant;

    // 0. Bouton « Nhắn Zalo » : numéro du commerçant (et non celui de la démo)
    var digits = String(m.phone || '').replace(/\D/g, '');
    if (digits.indexOf('84') === 0 && digits.length >= 11) digits = '0' + digits.slice(2);
    Array.prototype.forEach.call(document.querySelectorAll('a[href*="zalo.me"]'), function (a) {
      if (digits) a.href = 'https://zalo.me/' + digits;
      else a.style.display = 'none';
    });

    // 1. Note dans l'en-tête
    var stats = d.review_stats || { count: (d.reviews || []).length, avg: 0 };
    Array.prototype.forEach.call(document.querySelectorAll('.hero-chip'), function (chip) {
      if (chip.textContent.indexOf('đánh giá') === -1) return;
      if (stats.count > 0 && stats.avg > 0) {
        chip.textContent = '⭐ ' + String(stats.avg).replace('.', ',') + ' (' + stats.count + ' đánh giá)';
      } else {
        chip.remove();
      }
    });

    // 2. Avis (le modèle salon les gère déjà lui-même)
    if (!document.getElementById('reviewsList')) {
      var list = document.querySelector('.reviews-list');
      if (list) {
        var label = list.previousElementSibling;
        var hasLabel = label && label.classList && label.classList.contains('section-label');
        if (m.show_reviews === false) {
          list.remove();
          if (hasLabel) label.remove();
        } else if (!d.reviews || d.reviews.length === 0) {
          list.innerHTML = '<div class="vml-empty">Chưa có đánh giá.</div>';
        } else {
          list.innerHTML = d.reviews.map(function (r) {
            var rating = Math.max(1, Math.min(5, parseInt(r.rating, 10) || 5));
            return '<div class="review-card">' +
              '<div class="rv-header">' +
                '<div class="rv-avatar" style="background:var(--secondary,#f5f5f5);color:var(--primary-dark,var(--primary,#333));display:flex;align-items:center;justify-content:center;font-weight:700;">' +
                  esc((r.author || '?').charAt(0).toUpperCase()) +
                '</div>' +
                '<div><div class="rv-name">' + esc(r.author || 'Khách hàng') +
                  (r.verified ? '<span class="vml-verified">✓ Đã xác minh</span>' : '') + '</div>' +
                '<div class="rv-stars">' + '★'.repeat(rating) + '☆'.repeat(5 - rating) + '</div></div>' +
              '</div>' +
              (r.text ? '<p class="rv-text">' + esc(r.text) + '</p>' : '') +
            '</div>';
          }).join('');
        }
      }
    }

    // 3. Bandeau d'annonces (le modèle salon a déjà le sien)
    if (!document.getElementById('announcementsBanner') && d.announcements && d.announcements.length) {
      var anchor = document.querySelector('.cta-bar');
      if (anchor) {
        var items = d.announcements.map(function (a) {
          return '<div class="vml-item">' + esc(a.text || '') + '</div>';
        }).join('');
        var banner = document.createElement('div');
        banner.className = 'vml-banner';
        banner.innerHTML = '<div class="vml-track">' + items + items + '</div>';
        anchor.parentNode.insertBefore(banner, anchor.nextSibling);
      }
    }
  }

  document.addEventListener('vm:data', function (e) { apply(e.detail); });
  if (window.VM_DATA) apply(window.VM_DATA);
})();
