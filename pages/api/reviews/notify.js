// pages/api/reviews/notify.js
import { sendReviewEmail } from '../../../lib/sendReviewEmail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { merchantId, review } = req.body || {};
  if (!merchantId || !review) {
    return res.status(400).json({ error: 'Missing merchantId or review' });
  }

  // Fire-and-forget côté client : on attend quand même pour logger en cas d'erreur.
  await sendReviewEmail(merchantId, review);

  return res.status(200).json({ ok: true });
}
