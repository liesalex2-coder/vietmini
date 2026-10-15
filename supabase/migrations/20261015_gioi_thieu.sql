-- Giới thiệu (parrainage) — 15/10/2026
-- À exécuter une fois dans Supabase > SQL Editor (relançable sans risque).

-- 1. Service concerné par la réduction (vide = tous les services)
alter table public.referral_config add column if not exists service_name text;

-- 2. Code de parrainage de chaque carte (dans le lien partagé)
alter table public.loyalty_cards add column if not exists ref_code text;
create unique index if not exists loyalty_cards_merchant_ref_key
  on public.loyalty_cards (merchant_id, ref_code)
  where ref_code is not null;

-- 3. Parrainages : qui a invité qui
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  merchant_id text not null,
  referrer_card_id text not null,
  referred_card_id text not null,
  created_at timestamptz not null default now(),
  rewarded_at timestamptz                  -- récompense du parrain débloquée (1er tampon du filleul)
);
create unique index if not exists referrals_referred_key on public.referrals (referred_card_id);
create index if not exists referrals_merchant_idx on public.referrals (merchant_id, created_at desc);

-- 4. Récompenses des clients (parrainage ; d'autres sources plus tard)
create table if not exists public.customer_rewards (
  id uuid primary key default gen_random_uuid(),
  merchant_id text not null,
  card_id text not null,
  source text not null,                    -- 'referral_referred' | 'referral_referrer'
  label text not null,
  service_name text,
  expires_at timestamptz,
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists customer_rewards_card_idx on public.customer_rewards (card_id, created_at desc);

-- Lecture réservée au commerçant propriétaire (le serveur passe par la clé service)
alter table public.referrals enable row level security;
drop policy if exists referrals_owner_read on public.referrals;
create policy referrals_owner_read on public.referrals
  for select using (
    exists (select 1 from public.merchants m where m.id::text = referrals.merchant_id and m.user_id = auth.uid())
  );

alter table public.customer_rewards enable row level security;
drop policy if exists customer_rewards_owner_read on public.customer_rewards;
create policy customer_rewards_owner_read on public.customer_rewards
  for select using (
    exists (select 1 from public.merchants m where m.id::text = customer_rewards.merchant_id and m.user_id = auth.uid())
  );
