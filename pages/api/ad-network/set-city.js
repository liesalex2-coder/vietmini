// pages/api/ad-network/set-city.js
// POST — Le marchand choisit ou modifie sa ville pour le ciblage publicitaire.
// Body : { merchant_id, city_code }

import { adminClient } from '../../../lib/adNetwork';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { merchant_id, city_code } = req.body || {};

  if (!merchant_id) {
    return res.status(400).json({ error: 'merchant_id required' });
  }
  if (!city_code) {
    return res.status(400).json({ error: 'city_code required' });
  }

  const supa = adminClient();

  // Vérifie que la ville existe et est active
  const { data: city, error: cErr } = await supa
    .from('cities')
    .select('code, name_vi, active')
    .eq('code', city_code)
    .maybeSingle();

  if (cErr || !city) {
    return res.status(400).json({ error: 'invalid_city' });
  }
  if (!city.active) {
    return res.status(400).json({ error: 'city_inactive' });
  }

  // Met à jour le marchand
  const { error: uErr } = await supa
    .from('merchants')
    .update({ city_code })
    .eq('id', merchant_id);

  if (uErr) {
    return res.status(500).json({ error: 'Update failed', detail: uErr.message });
  }

  return res.status(200).json({
    success: true,
    city
  });
}
