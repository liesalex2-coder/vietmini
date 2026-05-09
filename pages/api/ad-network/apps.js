// pages/api/ad-network/apps.js
// GET — Liste les apps média actives (Vận Mệnh, Lịch Âm, Sổ Tay…).
// Utilisé par le dashboard marchand pour afficher le sélecteur d'app.
// Accessible publiquement (CORS ouvert) au cas où les apps média l'utilisent aussi.

import { adminClient, getMediaApps } from '../../../lib/adNetwork';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supa = adminClient();
  const apps = await getMediaApps(supa);

  return res.status(200).json({ apps });
}
