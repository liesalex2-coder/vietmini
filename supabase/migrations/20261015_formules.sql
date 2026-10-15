-- Formule d'abonnement du commerçant — 15/10/2026
-- À exécuter une fois dans Supabase > SQL Editor (relançable sans risque).
-- 'web' = Trang web · 'zalo' = Ứng dụng Zalo · 'both' = Cả hai
-- Les commerçants existants (valeur vide) sont traités comme 'both'.

alter table public.merchants add column if not exists plan text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'merchants_plan_check') then
    alter table public.merchants
      add constraint merchants_plan_check check (plan is null or plan in ('web', 'zalo', 'both'));
  end if;
end $$;
