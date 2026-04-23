// lib/sendReviewEmail.js
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'VietMini <onboarding@resend.dev>';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Envoie un email au marchand pour chaque nouvel avis.
 * Tolérant aux 2 schémas : dashboard ({author_name, content}) et Mini App ({author, text}).
 * Ne lève jamais d'exception — erreurs loguées pour ne pas casser le flow d'insertion.
 */
export async function sendReviewEmail(merchantId, review) {
  try {
    // 1. Récupérer le marchand
    const { data: merchant, error: mErr } = await supabaseAdmin
      .from('merchants')
      .select('name, user_id')
      .eq('id', merchantId)
      .single();
    if (mErr || !merchant) {
      console.warn('[sendReviewEmail] merchant not found:', merchantId, mErr);
      return;
    }

    // 2. Récupérer l'email depuis auth.users
    const { data: authRes, error: aErr } = await supabaseAdmin.auth.admin.getUserById(merchant.user_id);
    const email = authRes?.user?.email;
    if (aErr || !email) {
      console.warn('[sendReviewEmail] no email for merchant:', merchantId, aErr);
      return;
    }

    // 3. Normaliser les champs (dashboard vs Mini App)
    const author = review.author || review.author_name || 'Khách hàng';
    const textRaw = review.text || review.content || '';
    const rating = Math.max(1, Math.min(5, parseInt(review.rating) || 5));
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const verified = review.verified ? ' <span style="color:#1a6b3a;font-size:12px;">✓ Đã xác minh</span>' : '';
    const textBlock = textRaw
      ? `<p style="margin:0;font-size:14px;line-height:1.6;color:#333;">"${escapeHtml(textRaw)}"</p>`
      : '';
    const dashboardUrl = 'https://vietmini.vercel.app/dashboard';

    const html = `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1A0A00;background:#FDF6EE;">
  <div style="background:#fff;border-radius:12px;padding:28px;">
    <h2 style="color:#D0021B;margin:0 0 8px;font-size:20px;">🌟 Đánh giá mới</h2>
    <p style="color:#666;font-size:14px;margin:0 0 20px;"><strong>${escapeHtml(merchant.name)}</strong> vừa nhận được một đánh giá mới từ khách hàng.</p>
    <div style="background:#FDF6EE;border-left:4px solid #F5A623;padding:16px 20px;border-radius:8px;margin-bottom:24px;">
      <div style="font-size:20px;color:#F5A623;margin-bottom:8px;letter-spacing:2px;">${stars}</div>
      <div style="font-size:14px;font-weight:600;margin-bottom:8px;">${escapeHtml(author)}${verified}</div>
      ${textBlock}
    </div>
    <a href="${dashboardUrl}" style="display:inline-block;background:#D0021B;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Xem trên dashboard →</a>
  </div>
  <p style="color:#999;font-size:11px;text-align:center;margin-top:20px;">Được gửi bởi VietMini · Powered by Leading Star AI</p>
</body>
</html>`;

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `⭐ Đánh giá mới (${rating}/5) - ${merchant.name}`,
      html,
    });
  } catch (e) {
    console.error('[sendReviewEmail] unexpected error:', e);
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
