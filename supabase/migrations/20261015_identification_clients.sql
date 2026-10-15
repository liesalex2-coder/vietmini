-- Identification des clients (version web) — 15/10/2026
-- À exécuter une fois dans Supabase > SQL Editor.
-- Toutes les instructions peuvent être relancées sans risque.

-- 1. Carte de fidélité rattachée au numéro de téléphone
alter table public.loyalty_cards add column if not exists phone text;
alter table public.loyalty_cards add column if not exists display_name text;
alter table public.loyalty_cards add column if not exists visit_count integer not null default 0;
alter table public.loyalty_cards add column if not exists rewards_redeemed integer not null default 0;
alter table public.loyalty_cards add column if not exists last_visit_at timestamptz;
alter table public.loyalty_cards add column if not exists pin_failures integer not null default 0;
alter table public.loyalty_cards add column if not exists pin_locked_until timestamptz;
alter table public.loyalty_cards add column if not exists created_at timestamptz not null default now();

-- Un client web n'a pas d'identifiant Zalo
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'loyalty_cards' and column_name = 'zalo_id'
  ) then
    execute 'alter table public.loyalty_cards alter column zalo_id drop not null';
  end if;
end $$;

-- Une seule carte par client et par commerçant
create unique index if not exists loyalty_cards_merchant_phone_key
  on public.loyalty_cards (merchant_id, phone)
  where phone is not null;

-- 2. Liste clients : origine du contact (web, coupon, zalo…)
alter table public.contacts add column if not exists display_name text;
alter table public.contacts add column if not exists source text;

create index if not exists contacts_merchant_phone_idx
  on public.contacts (merchant_id, phone);
