-- Migration: ajouter colonnes Instagram manquantes + tables de données IG
-- À exécuter dans le SQL Editor de Supabase

-- 1. Colonnes manquantes sur profiles
alter table profiles add column if not exists email text;
alter table profiles add column if not exists insta_handle text;
alter table profiles add column if not exists instagram_access_token text;
alter table profiles add column if not exists instagram_token_expires_at timestamptz;
alter table profiles add column if not exists brand_name text;
alter table profiles add column if not exists brand_desc text;
alter table profiles add column if not exists tone text;
alter table profiles add column if not exists niches text[];
alter table profiles add column if not exists frequency text;

-- Renommer instagram_handle → insta_handle si l'ancienne colonne existe
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'profiles' and column_name = 'instagram_handle'
  ) then
    alter table profiles rename column instagram_handle to insta_handle;
  end if;
end $$;

-- 2. Table profile_analyses
create table if not exists profile_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) unique,
  insta_handle text,
  avg_engagement_rate float,
  audience_demographics jsonb default '{}',
  best_format text,
  top_post_types jsonb default '[]',
  best_hours jsonb default '[]',
  color_palette jsonb default '[]',
  tone_detected text,
  analysis_date timestamptz default now()
);

alter table profile_analyses enable row level security;

create policy "Users read own analyses" on profile_analyses
  for select using (auth.uid() = user_id);
create policy "Users insert own analyses" on profile_analyses
  for insert with check (auth.uid() = user_id);
create policy "Users update own analyses" on profile_analyses
  for update using (auth.uid() = user_id);

-- 3. Cache posts Instagram
create table if not exists instagram_media (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  ig_media_id text unique,
  media_type text,
  media_url text,
  thumbnail_url text,
  caption text,
  permalink text,
  like_count int default 0,
  comments_count int default 0,
  timestamp timestamptz,
  insights jsonb default '{}',
  fetched_at timestamptz default now()
);

alter table instagram_media enable row level security;

create policy "Users read own ig media" on instagram_media
  for select using (auth.uid() = user_id);
create policy "Users insert own ig media" on instagram_media
  for insert with check (auth.uid() = user_id);

-- 4. Insights compte Instagram
create table if not exists instagram_account_insights (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  period text default 'day',
  date date,
  impressions int default 0,
  reach int default 0,
  profile_views int default 0,
  website_clicks int default 0,
  follower_count int default 0,
  fetched_at timestamptz default now(),
  unique (user_id, period, date)
);

alter table instagram_account_insights enable row level security;

create policy "Users read own ig insights" on instagram_account_insights
  for select using (auth.uid() = user_id);
create policy "Users insert own ig insights" on instagram_account_insights
  for insert with check (auth.uid() = user_id);
