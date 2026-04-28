// pages/api/ad-network/status.js
// GET — Le marchand lit son état pub depuis son dashboard.
// Renvoie : ville, jours restants total, liste des campagnes, statut bonus de bienvenue.

import {
  adminClient,
  getActiveCampaigns,
  getTotalDaysRemaining,
  getSettingBool,
  getSettingInt
} from '../../../lib/adNetwork';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { merchant_id } = req.query;
  if (!merchant_id) {
    return res.status(400).json({ error: 'merchant_id required' });
  }

  const supa = adminClient();

  // Infos marchand
  const { data: merchant, error: mErr } = await supa
    .from('merchants')
    .select('id, name, city_code, subscription_active, subscription_expires_at')
    .eq('id', merchant_id)
    .maybeSingle();

  if (mErr || !merchant) {
    return res.status(404).json({ error: 'Merchant not found' });
  }

  // Ville (avec nom lisible)
  let city = null;
  if (merchant.city_code) {
    const { data: c } = await supa
      .from('cities')
      .select('code, name_vi, parent')
      .eq('code', merchant.city_code)
      .maybeSingle();
    city = c || null;
  }

  // Campagnes actives
  const campaigns = await getActiveCampaigns(supa, merchant_id);
  const totalDays = await getTotalDaysRemaining(supa, merchant_id);

  // Le marchand a-t-il déjà activé son bonus de bienvenue ?
  const { data: existingWelcome } = await supa
    .from('ad_campaigns')
    .select('id')
    .eq('merchant_id', merchant_id)
    .eq('source', 'welcome')
    .eq('created_by_admin', false)
    .maybeSingle();

  const welcomeUsed = !!existingWelcome;

  // Paramètres pour informer le dashboard
  const welcomeEnabled = await getSettingBool(supa, 'welcome_bonus_enabled', true);
  const welcomeDays = await getSettingInt(supa, 'welcome_bonus_days', 15);

  return res.status(200).json({
    merchant: {
      id: merchant.id,
      name: merchant.name,
      subscription_active: merchant.subscription_active
    },
    city,
    total_days_remaining: totalDays,
    campaigns: campaigns.map(c => ({
      id: c.id,
      source: c.source,
      days_total: c.days_total,
      days_remaining: c.days_remaining,
      started_at: c.started_at,
      last_shown_date: c.last_shown_date,
      created_by_admin: c.created_by_admin,
      admin_note: c.admin_note
    })),
    welcome: {
      already_used: welcomeUsed,
      enabled: welcomeEnabled,
      days: welcomeDays,
      can_activate: welcomeEnabled && !welcomeUsed && merchant.subscription_active
    }
  });
}
