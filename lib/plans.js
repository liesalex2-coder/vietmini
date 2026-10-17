// Formules d'abonnement (utilisable côté serveur et côté navigateur)
export const PLANS = {
  web:  { id: 'web',  name: 'Ứng dụng web',     price: 2000000, desc: 'Cho khách hàng không dùng Zalo.' },
  zalo: { id: 'zalo', name: 'Ứng dụng Zalo', price: 2000000, desc: 'Cho khách hàng dùng Zalo.' },
  both: { id: 'both', name: 'Cả hai',        price: 3000000, desc: 'Ứng dụng web và ứng dụng Zalo, cùng một nội dung.' },
}

export const PLAN_IDS = ['web', 'zalo', 'both']

// Commerçants inscrits avant les formules (plan vide) = les deux
export function normalizePlan(plan) {
  return PLAN_IDS.includes(plan) ? plan : 'both'
}

export function planIncludes(plan, channel) {
  const p = normalizePlan(plan)
  return p === 'both' || p === channel
}
