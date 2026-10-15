// Liste de mots interdits (partagée par /api/moderate et les API clients)
export const BANNED = [
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

export function containsBanned(text) {
  if (!text) return false
  const lower = text.toLowerCase()
  return BANNED.find(w => lower.includes(w.toLowerCase())) || null
}

