// pages/api/moderate.js
const BANNED = [
  // Prostitution (VI)
  'gái gọi', 'mại dâm', 'cave', 'gái bán hoa', 'tắm tiên',
  'massage kích dục', 'dịch vụ vui vẻ', 'dịch vụ đặc biệt',
  'làm tình', 'địt', 'cặc', 'lồn', 'buôn dâm', 'bán dâm',
  'gái mại dâm', 'nhà thổ', 'chạy sô',

  // Drogue (VI)
  'ma túy', 'cần sa', 'thuốc lắc', 'bạch phiến', 'heroin',
  'buôn ma túy', 'cỏ mỹ', 'xì ke', 'chất kích thích',
  'cocain', 'ketamin', 'hút chích',
]

function containsBanned(text) {
  if (!text) return false
  const lower = text.toLowerCase()
  return BANNED.find(w => lower.includes(w.toLowerCase())) || null
}

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
