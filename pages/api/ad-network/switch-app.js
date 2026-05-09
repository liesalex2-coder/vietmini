// pages/api/ad-network/switch-app.js
// POST — Le marchand change l'app média sur laquelle apparaît sa campagne active.
// Les jours restants sont conservés (juste transférés sur la nouvelle app).
// Body : { merchant_id, media_app_code }
// Pré-conditions :
//   - le marchand a au moins une campagne active
//   - l'app média choisie existe et est active

import {
  adminClient,
  getActiveCampaigns,
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
      message: 'Vui lòng chọn ứng dụng.'
    });
  }

  const supa = adminClient();

  // Vérifie l'app média
  const mediaApp = await getMediaAppByCode(supa, media_app_code);
  if (!mediaApp) {
    return res.status(400).json({ error: 'invalid_media_app' });
  }

  // Récupère les campagnes actives du marchand
  const campaigns = await getActiveCampaigns(supa, merchant_id);
  if (campaigns.length === 0) {
    return res.status(404).json({
      error: 'no_active_campaign',
      message: 'Bạn không có chiến dịch quảng cáo nào đang hoạt động.'
    });
  }

  // Met à jour toutes les campagnes actives sur la nouvelle app
  // (en pratique il n'y en a qu'une, mais on supporte le cas où il y en aurait plusieurs)
  const ids = campaigns.map(c => c.id);
  const { error: uErr } = await supa
    .from('ad_campaigns')
    .update({ media_app_id: mediaApp.id })
    .in('id', ids);

  if (uErr) {
    return res.status(500).json({ error: 'Update failed', detail: uErr.message });
  }

  return res.status(200).json({
    success: true,
    media_app: mediaApp,
    campaigns_updated: ids.length,
    message: `Quảng cáo đã chuyển sang ${mediaApp.name_vi}.`
  });
}
