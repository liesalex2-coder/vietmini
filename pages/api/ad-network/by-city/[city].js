// pages/api/ad-network/by-city/[city].js
// GET — Endpoint public consommé par Vận Mệnh (et futures mini apps grand public).
// Renvoie la liste des marchands à afficher dans le bandeau pour la ville donnée.
// IMPORTANT : décrémente automatiquement le crédit de chaque marchand affiché
// (1 fois par jour grâce au garde-fou last_shown_date).
//
// Le paramètre [city] peut être :
//   - un code de ville simple : 'phan-thiet'
//   - un code de Quận : 'hcm-q1' (ne remonte que les marchands de Quận 1)
//   - un code de ville-mère : 'hcm' (remonte tous les marchands de tous les Quận de Saigon)

import { adminClient, consumeOneDayIfNeeded } from '../../../../lib/adNetwork';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: 'city required' });
  }

  const supa = adminClient();

  // Vérifie que la ville existe
  const { data: cityRow } = await supa
    .from('cities')
    .select('code, name_vi, parent')
    .eq('code', city)
    .maybeSingle();

  if (!cityRow) {
    return res.status(404).json({ error: 'city_not_found' });
  }

  // Détermine la liste des city_code à inclure :
  // - si on demande une ville-mère (parent=null), on inclut elle-même + tous ses enfants
  // - sinon, on inclut juste le code demandé
  let cityCodes = [city];
  if (cityRow.parent === null) {
    const { data: children } = await supa
      .from('cities')
      .select('code')
      .eq('parent', city)
      .eq('active', true);
    if (children && children.length > 0) {
      cityCodes = [city, ...children.map(c => c.code)];
    }
  }

  // Récupère les marchands de ces villes qui ont au moins une campagne active
  // Étape 1 : trouver les merchant_id avec campagne active
  const { data: activeCampaigns } = await supa
    .from('ad_campaigns')
    .select('merchant_id')
    .eq('active', true)
    .gt('days_remaining', 0);

  const merchantIdsWithBudget = [...new Set((activeCampaigns || []).map(c => c.merchant_id))];

  if (merchantIdsWithBudget.length === 0) {
    return res.status(200).json({ city: cityRow, merchants: [] });
  }

  // Étape 2 : filtrer ceux qui sont dans les bonnes villes ET abonnement actif
  const { data: merchants } = await supa
    .from('merchants')
    .select('id, name, city_code, vertical, hero_image, primary_color, secondary_color, subscription_active')
    .in('id', merchantIdsWithBudget)
    .in('city_code', cityCodes)
    .eq('subscription_active', true);

  if (!merchants || merchants.length === 0) {
    return res.status(200).json({ city: cityRow, merchants: [] });
  }

  // Décrémente le crédit de chacun (anti-double-décrément via last_shown_date)
  // En parallèle pour la perf, mais on attend tout avant de répondre.
  await Promise.all(
    merchants.map(m => consumeOneDayIfNeeded(supa, m.id))
  );

  // Mélange aléatoire pour rotation équitable
  const shuffled = [...merchants].sort(() => Math.random() - 0.5);

  // Renvoie une payload minimale (juste ce qu'il faut au bandeau)
  return res.status(200).json({
    city: cityRow,
    merchants: shuffled.map(m => ({
      id: m.id,
      name: m.name,
      vertical: m.vertical,
      hero_image: m.hero_image,
      primary_color: m.primary_color,
      secondary_color: m.secondary_color,
      // URL de la Mini App marchand vers laquelle redirige le clic
      app_url: `https://vietmini.com/app/${m.id}`
    }))
  });
}
