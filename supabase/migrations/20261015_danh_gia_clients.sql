-- Avis des clients identifiés + réduction pour avis — 15/10/2026
-- À exécuter une fois dans Supabase > SQL Editor (relançable sans risque).

-- Service concerné par la réduction pour avis (vide = tous les services)
alter table public.review_config add column if not exists service_name text;

-- Avis rattaché à la carte du client (avis laissé depuis l'app)
alter table public.reviews add column if not exists card_id text;
create index if not exists reviews_card_idx on public.reviews (card_id, created_at desc);
