-- CM de Poche — Le Cerveau de Marque (source unique)
-- 1 ligne par user. Rempli au scan, enrichi à chaque cycle d'apprentissage.
-- Tout le moteur (prod, publication, analyse) lit et réécrit cette table.

create table if not exists brand_brain (
  user_id uuid references profiles(id) primary key,

  -- SECTION "QUI" — ce que l'user vend, à qui, comment, combien
  what_they_sell     text,                    -- offre principale, en clair
  audience           jsonb   default '{}',    -- { who, age, interests, pains, lang }
  price_positioning  text,                    -- entrée de gamme / premium / gratuit...

  -- SECTION "STYLE" — marque + charte graphique + voix
  brand_name         text,
  visual_identity    jsonb   default '{}',    -- { colors:[], fonts:[], aesthetic:[], mood }
  tone_of_voice      text,                    -- comment il parle (phrases, registre)
  content_pillars    jsonb   default '[]',    -- thèmes récurrents [{name, weight}]

  -- SECTION "OBJECTIF" — pilote toute la stratégie
  objective          text,                    -- grow | sell | engage | authority | traffic
  objective_details  text,                    -- précisions user
  target_kpis        jsonb   default '{}',    -- { primary, secondary }

  -- SECTION "APPREND" — réécrit par l'analyse chaque semaine
  what_works         jsonb   default '{}',    -- { formats:[], topics:[], hooks:[], hours:[] }
  what_fails         jsonb   default '{}',    -- { formats:[], topics:[] }
  best_posting_slots jsonb   default '[]',    -- [{ day, time, score }]

  -- SECTION "RYTHME"
  posting_frequency  text    default '3/week',

  -- META — traçabilité + apprentissage
  scan_evidence      jsonb   default '{}',    -- preuves brutes du scan (pour re-déduire)
  confidence         float   default 0,       -- 0..1, sûreté de l'IA sur ce cerveau
  brain_version      int     default 1,       -- +1 à chaque cycle d'apprentissage
  user_confirmed     boolean default false,   -- user a validé/corrigé le scan
  last_scanned_at    timestamptz,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

alter table brand_brain enable row level security;

create policy "Users read own brain"   on brand_brain for select using (auth.uid() = user_id);
create policy "Users update own brain" on brand_brain for update using (auth.uid() = user_id);
create policy "Users insert own brain" on brand_brain for insert with check (auth.uid() = user_id);
-- Les crons (service role) doivent pouvoir réécrire le cerveau lors de l'analyse
create policy "Service manages brain"  on brand_brain for all using (true);
