// pages/api/moderate.js
import { containsBanned } from '../../lib/moderation'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { fields } = req.body
  if (!fields || !Array.isArray(fields)) {
    return res.status(400).json({ ok: false })
  }
  for (const text of fields) {
    const match = containsBanned(text)
    if (match) return res.status(200).json({ ok: false, matched: match })
  }
  return res.status(200).json({ ok: true })
}
