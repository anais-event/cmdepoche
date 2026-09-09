-- CM de Poche — Schéma Supabase complet
-- À exécuter dans le SQL Editor de Supabase

-- 1. Profils utilisateurs
create table if not exists profiles (
  id uuid references auth.users primary key,
  email text,
  insta_handle text,
  instagram_user_id text,
  instagram_access_token text,
  instagram_token_expires_at timestamptz,
  followers_count int,
  engagement_rate float,
  detected_tone text,
  detected_niche text,
  detected_target text,
  target_details jsonb,
  website text,
  other_socials jsonb,
  posting_frequency text,
  objective text,
  objective_details text,
  color_palette jsonb,
  optimal_slots jsonb,
  format_engagement jsonb,
  expert_advice jsonb,
  brand_name text,
  brand_desc text,
  tone text,
  niches text[],
  frequency text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Semaines de contenu
create table if not exists weeks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  week_start date,
  status text default 'draft',
  created_at timestamptz default now()
);

-- 3. Posts
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  week_id uuid references weeks(id),
  user_id uuid references profiles(id),
  day_of_week text,
  scheduled_time time,
  format text,
  caption text,
  hashtags text[],
  visual_url text,
  sound_id uuid references sounds(id),
  performance_score int,
  score_details jsonb,
  status text default 'pending',
  instagram_post_id text,
  created_at timestamptz default now()
);

-- 4. Sons tendance
create table if not exists sounds (
  id uuid default gen_random_uuid() primary key,
  external_id text,
  title text,
  artist text,
  niche text,
  trend_score int,
  instagram_url text,
  fetched_at timestamptz default now()
);

-- 5. Analytics
create table if not exists analytics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  post_id uuid references posts(id),
  impressions int,
  reach int,
  engagement_count int,
  engagement_rate float,
  profile_clicks int,
  fetched_at timestamptz default now()
);

-- 6. Abonnements Stripe
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text default 'free',
  status text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS : chaque utilisateur ne voit que ses propres données
alter table profiles enable row level security;
alter table weeks enable row level security;
alter table posts enable row level security;
alter table sounds enable row level security;
alter table analytics enable row level security;
alter table subscriptions enable row level security;

-- Policies profiles
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);

-- Policies weeks
create policy "Users read own weeks" on weeks for select using (auth.uid() = user_id);
create policy "Users insert own weeks" on weeks for insert with check (auth.uid() = user_id);
create policy "Users update own weeks" on weeks for update using (auth.uid() = user_id);

-- Policies posts
create policy "Users read own posts" on posts for select using (auth.uid() = user_id);
create policy "Users insert own posts" on posts for insert with check (auth.uid() = user_id);
create policy "Users update own posts" on posts for update using (auth.uid() = user_id);
create policy "Users delete own posts" on posts for delete using (auth.uid() = user_id);

-- Sounds : lecture publique (sons tendance partagés)
create policy "Anyone can read sounds" on sounds for select using (true);

-- Policies analytics
create policy "Users read own analytics" on analytics for select using (auth.uid() = user_id);
create policy "Users insert own analytics" on analytics for insert with check (auth.uid() = user_id);

-- Policies subscriptions
create policy "Users read own subscription" on subscriptions for select using (auth.uid() = user_id);
create policy "Users insert own subscription" on subscriptions for insert with check (auth.uid() = user_id);
create policy "Users update own subscription" on subscriptions for update using (auth.uid() = user_id);

-- Trigger : crée automatiquement un profil à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. Analyses de profil Instagram
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

create policy "Users read own analyses" on profile_analyses for select using (auth.uid() = user_id);
create policy "Users insert own analyses" on profile_analyses for insert with check (auth.uid() = user_id);
create policy "Users update own analyses" on profile_analyses for update using (auth.uid() = user_id);

-- 8. Cache des posts Instagram (données réelles via API)
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

create policy "Users read own ig media" on instagram_media for select using (auth.uid() = user_id);
create policy "Users insert own ig media" on instagram_media for insert with check (auth.uid() = user_id);
create policy "Service can manage ig media" on instagram_media for all using (true);

-- 9. Snapshots insights compte Instagram
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

create policy "Users read own ig insights" on instagram_account_insights for select using (auth.uid() = user_id);
create policy "Users insert own ig insights" on instagram_account_insights for insert with check (auth.uid() = user_id);

-- Storage bucket pour les visuels
insert into storage.buckets (id, name, public)
values ('visuals', 'visuals', true)
on conflict (id) do nothing;

create policy "Users upload own visuals" on storage.objects
  for insert with check (bucket_id = 'visuals' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone can view visuals" on storage.objects
  for select using (bucket_id = 'visuals');
