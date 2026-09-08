import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);

// --- Types alignés sur le schéma Supabase du brief ---

export type Profile = {
  id: string;
  instagram_handle: string | null;
  instagram_user_id: string | null;
  followers_count: number | null;
  engagement_rate: number | null;
  detected_tone: string | null;
  detected_niche: string | null;
  detected_target: string | null;
  target_details: {
    age?: string;
    sex?: string;
    profession?: string;
    interest?: string;
  } | null;
  website: string | null;
  other_socials: { platform: string; handle: string }[] | null;
  posting_frequency: string | null;
  objective: 'grow' | 'engage' | 'time' | 'monetize' | null;
  objective_details: 'visibility' | 'views' | 'community' | 'sales' | null;
  color_palette: string[] | null;
  optimal_slots: { day: string; time: string }[] | null;
  format_engagement: { photo: number; carousel: number; reel: number } | null;
  expert_advice: ExpertAdvice | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type ExpertAdvice = {
  swot: {
    forces: string[];
    faiblesses: string[];
    opportunites: string[];
    menaces: string[];
  };
  coherence_objectif_niche: {
    score: number;
    diagnostic: string;
    recommandation: string;
  };
  coherence_colorimetrie_niche: {
    score: number;
    diagnostic: string;
    recommandation: string;
  };
  recommandations_prioritaires: {
    titre: string;
    description: string;
    actionnable_semaine: boolean;
  }[];
};

export type Week = {
  id: string;
  user_id: string;
  week_start: string;
  status: 'draft' | 'scheduled' | 'published';
  created_at: string;
};

export type Post = {
  id: string;
  week_id: string;
  user_id: string;
  day_of_week: string;
  scheduled_time: string;
  format: 'photo' | 'carousel' | 'reel';
  caption: string;
  hashtags: string[];
  visual_url: string | null;
  sound_id: string | null;
  performance_score: number;
  score_details: Record<string, number> | null;
  status: 'pending' | 'approved' | 'rejected';
  instagram_post_id: string | null;
  created_at: string;
};

export type Sound = {
  id: string;
  external_id: string | null;
  title: string;
  artist: string | null;
  niche: string;
  trend_score: number;
  instagram_url: string | null;
  fetched_at: string;
};

export type Analytics = {
  id: string;
  user_id: string;
  post_id: string;
  impressions: number;
  reach: number;
  engagement_count: number;
  engagement_rate: number;
  profile_clicks: number;
  fetched_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: 'free' | 'pro';
  status: string;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};
