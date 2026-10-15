-- Vòng quay rattachée au client — 15/10/2026
-- À exécuter une fois dans Supabase > SQL Editor (relançable sans risque).

create table if not exists public.wheel_spins (
  id uuid primary key default gen_random_uuid(),
  merchant_id text not null,
  card_id text not null,
  spin_date date not null,                 -- jour au Vietnam (UTC+7)
  prize_label text not null,
  is_win boolean not null default false,
  expires_at timestamptz,
  redeemed_at timestamptz,
  is_preview boolean not null default false,
  created_at timestamptz not null default now()
);

-- Une seule partie par client et par jour (hors aperçu du commerçant)
create unique index if not exists wheel_spins_card_day_key
  on public.wheel_spins (card_id, spin_date)
  where is_preview = false;

create index if not exists wheel_spins_merchant_idx
  on public.wheel_spins (merchant_id, created_at desc);

-- Accès uniquement par le serveur (clé service) et par le commerçant propriétaire
alter table public.wheel_spins enable row level security;

drop policy if exists wheel_spins_owner_read on public.wheel_spins;
create policy wheel_spins_owner_read on public.wheel_spins
  for select using (
    exists (select 1 from public.merchants m where m.id::text = wheel_spins.merchant_id and m.user_id = auth.uid())
  );
