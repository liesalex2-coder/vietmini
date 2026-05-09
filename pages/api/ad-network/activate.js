// pages/api/ad-network/activate.js
// POST — Le marchand active son bonus de bienvenue depuis son dashboard.
// Body : { merchant_id, media_app_code }
// Pré-conditions :
//   - le bonus de bienvenue est activé globalement (ad_settings.welcome_bonus_enabled)
//   - le marchand a un abonnement actif
//   - le marchand a une ville définie
//   - le marchand n'a pas déjà activé son bonus
//   - l'app média choisie existe et est active

import {
  adminClient,
  getSettingBool,
  getSettingInt,
  getMediaAppByCode
} from '../../../lib/adNetwork';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { merchant_id, media_app_code } = req.body || {};
  if (!merchant_id) {
    return res.status(400).json({ error: 'merchant_id required' });
  }
  if (!media_app_code) {
    return res.status(400).json({
      error: 'media_app_required',
      message: 'Vui lòng chọn ứng dụng để hiển thị quảng cáo.'
    });
  }

  const supa = adminClient();

  // Vérifie l'app média
  const mediaApp = await getMediaAppByCode(supa, media_app_code);
  if (!mediaApp) {
    return res.status(400).json({ error: 'invalid_media_app' });
  }

  // Vérifie l'état du marchand
  const { data: merchant, error: mErr } = await supa
    .from('merchants')
    .select('id, city_code, subscription_active')
    .eq('id', merchant_id)
    .maybeSingle();

  if (mErr || !merchant) {
    return res.status(404).json({ error: 'Merchant not found' });
  }

  if (!merchant.subscription_active) {
    return res.status(403).json({
      error: 'subscription_inactive',
      message: 'Cần kích hoạt thuê bao trước khi sử dụng quảng cáo.'
    });
  }

  if (!merchant.city_code) {
    return res.status(400).json({
      error: 'city_required',
      message: 'Vui lòng chọn thành phố trước khi kích hoạt quảng cáo.'
    });
  }

  // Bonus de bienvenue activé globalement ?
  const enabled = await getSettingBool(supa, 'welcome_bonus_enabled', true);
  if (!enabled) {
    return res.status(403).json({
      error: 'welcome_bonus_disabled',
      message: 'Chương trình tặng quà chào mừng hiện không khả dụng.'
    });
  }

  // Déjà utilisé ?
  const { data: existing } = await supa
    .from('ad_campaigns')
    .select('id')
    .eq('merchant_id', merchant_id)
    .eq('source', 'welcome')
    .eq('created_by_admin', false)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({
      error: 'welcome_already_used',
      message: 'Bạn đã sử dụng quà chào mừng.'
    });
  }

  // Crée la campagne welcome sur l'app choisie
  const days = await getSettingInt(supa, 'welcome_bonus_days', 15);

  const { data: campaign, error: cErr } = await supa
    .from('ad_campaigns')
    .insert({
      merchant_id,
      source: 'welcome',
      days_total: days,
      days_remaining: days,
      created_by_admin: false,
      active: true,
      media_app_id: mediaApp.id
    })
    .select()
    .single();

  if (cErr) {
    return res.status(500).json({ error: 'Insert failed', detail: cErr.message });
  }

  return res.status(200).json({
    success: true,
    campaign,
    media_app: mediaApp,
    message: `Đã kích hoạt ${days} ngày quảng cáo miễn phí trên ${mediaApp.name_vi}.`
  });
}
