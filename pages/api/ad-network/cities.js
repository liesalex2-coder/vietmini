// pages/api/ad-network/cities.js
// GET — Liste des villes actives, accessible au dashboard marchand
// (utilisé pour le select de ville quand le marchand configure sa pub).

import { adminClient } from '../../../lib/adNetwork';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supa = adminClient();

  const { data, error } = await supa
    .from('cities')
    .select('code, name_vi, parent')
    .eq('active', true)
    .order('parent', { nullsFirst: true })
    .order('name_vi');

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ cities: data || [] });
}
