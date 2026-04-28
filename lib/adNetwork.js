// lib/adNetwork.js
// Helpers partagés pour la logique du réseau publicitaire.
// Importé par les API routes /api/ad-network/* et /api/admin/ad-network/*.

import { createClient } from '@supabase/supabase-js';

// Client service role à utiliser côté serveur uniquement
export function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Récupère la valeur d'un paramètre depuis ad_settings.
// Renvoie la valeur par défaut si la clé n'existe pas.
export async function getSetting(supa, key, defaultValue = null) {
  const { data } = await supa
    .from('ad_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  return data ? data.value : defaultValue;
}

export async function getSettingInt(supa, key, defaultValue = 0) {
  const v = await getSetting(supa, key, String(defaultValue));
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : defaultValue;
}

export async function getSettingBool(supa, key, defaultValue = false) {
  const v = await getSetting(supa, key, defaultValue ? 'true' : 'false');
  return v === 'true';
}

// Récupère toutes les campagnes actives d'un marchand
// (active=true ET days_remaining>0)
export async function getActiveCampaigns(supa, merchantId) {
  const { data } = await supa
    .from('ad_campaigns')
    .select('*')
    .eq('merchant_id', merchantId)
    .eq('active', true)
    .gt('days_remaining', 0)
    .order('created_at', { ascending: true }); // FIFO : la plus ancienne consommée en premier
  return data || [];
}

// Total de jours restants pour un marchand (somme de toutes ses campagnes actives)
export async function getTotalDaysRemaining(supa, merchantId) {
  const campaigns = await getActiveCampaigns(supa, merchantId);
  return campaigns.reduce((sum, c) => sum + c.days_remaining, 0);
}

// Date du jour au format YYYY-MM-DD (timezone serveur)
export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Pour un marchand affiché aujourd'hui dans le bandeau,
// décrémente la campagne FIFO active s'il n'a pas déjà été décrémenté aujourd'hui.
// Renvoie true si décrément effectué, false sinon.
export async function consumeOneDayIfNeeded(supa, merchantId) {
  const campaigns = await getActiveCampaigns(supa, merchantId);
  if (campaigns.length === 0) return false;

  const today = todayStr();

  // Si une campagne quelconque du marchand a déjà été décrémentée aujourd'hui,
  // on ne re-décrémente pas (le marchand a déjà "consommé" son jour).
  const alreadyShownToday = campaigns.some(c => c.last_shown_date === today);
  if (alreadyShownToday) return false;

  // Sinon, on décrémente la plus ancienne (FIFO)
  const target = campaigns[0];
  const newRemaining = target.days_remaining - 1;
  await supa
    .from('ad_campaigns')
    .update({
      days_remaining: newRemaining,
      last_shown_date: today,
      active: newRemaining > 0
    })
    .eq('id', target.id);

  return true;
}
