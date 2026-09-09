import { createClient } from '@supabase/supabase-js';

const GRAPH_API = 'https://graph.facebook.com/v21.0';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getAccessToken(userId: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('profiles')
    .select('instagram_access_token, instagram_token_expires_at, instagram_user_id')
    .eq('id', userId)
    .single();

  if (!data?.instagram_access_token) return null;

  const expiresAt = new Date(data.instagram_token_expires_at);
  const now = new Date();

  // Token expires in less than 7 days — refresh it
  if (expiresAt.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
    const refreshed = await refreshToken(data.instagram_access_token);
    if (refreshed) {
      await supabase.from('profiles').update({
        instagram_access_token: refreshed.token,
        instagram_token_expires_at: new Date(Date.now() + refreshed.expiresIn * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', userId);
      return refreshed.token;
    }
  }

  return data.instagram_access_token;
}

async function refreshToken(token: string): Promise<{ token: string; expiresIn: number } | null> {
  try {
    const res = await fetch(
      `${GRAPH_API}/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.INSTAGRAM_APP_ID}&client_secret=${process.env.INSTAGRAM_APP_SECRET}&fb_exchange_token=${token}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token ? { token: data.access_token, expiresIn: data.expires_in || 5184000 } : null;
  } catch {
    return null;
  }
}

export async function getInstagramUserId(userId: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('profiles')
    .select('instagram_user_id')
    .eq('id', userId)
    .single();
  return data?.instagram_user_id || null;
}

export type IGMedia = {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  caption?: string;
  permalink: string;
  like_count: number;
  comments_count: number;
  timestamp: string;
};

export async function fetchRecentMedia(igUserId: string, accessToken: string, limit = 25): Promise<IGMedia[]> {
  const fields = 'id,media_type,media_url,thumbnail_url,caption,permalink,like_count,comments_count,timestamp';
  const res = await fetch(
    `${GRAPH_API}/${igUserId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
  );
  if (!res.ok) {
    console.error('Instagram media fetch failed:', await res.text());
    return [];
  }
  const data = await res.json();
  return data.data || [];
}

export async function fetchMediaInsights(mediaId: string, accessToken: string, mediaType: string) {
  const metrics = mediaType === 'VIDEO' || mediaType === 'REEL'
    ? 'plays,reach,saved,shares,total_interactions'
    : 'impressions,reach,saved,shares,total_interactions';

  try {
    const res = await fetch(
      `${GRAPH_API}/${mediaId}/insights?metric=${metrics}&access_token=${accessToken}`
    );
    if (!res.ok) return {};
    const data = await res.json();
    const insights: Record<string, number> = {};
    for (const metric of data.data || []) {
      insights[metric.name] = metric.values?.[0]?.value ?? 0;
    }
    return insights;
  } catch {
    return {};
  }
}

export type IGAccountInsights = {
  impressions: number;
  reach: number;
  profile_views: number;
  website_clicks: number;
  follower_count: number;
};

export async function fetchAccountInsights(
  igUserId: string,
  accessToken: string,
  period: 'day' | 'week' | 'days_28' = 'day'
): Promise<IGAccountInsights> {
  const metrics = 'impressions,reach,profile_views,website_clicks';
  const result: IGAccountInsights = {
    impressions: 0,
    reach: 0,
    profile_views: 0,
    website_clicks: 0,
    follower_count: 0,
  };

  try {
    const res = await fetch(
      `${GRAPH_API}/${igUserId}/insights?metric=${metrics}&period=${period}&access_token=${accessToken}`
    );
    if (res.ok) {
      const data = await res.json();
      for (const metric of data.data || []) {
        const value = metric.values?.[metric.values.length - 1]?.value ?? 0;
        if (metric.name in result) {
          (result as Record<string, number>)[metric.name] = value;
        }
      }
    }

    // Follower count is a separate endpoint
    const profileRes = await fetch(
      `${GRAPH_API}/${igUserId}?fields=followers_count&access_token=${accessToken}`
    );
    if (profileRes.ok) {
      const profileData = await profileRes.json();
      result.follower_count = profileData.followers_count || 0;
    }
  } catch (err) {
    console.error('Account insights fetch failed:', err);
  }

  return result;
}

export async function fetchProfileInfo(igUserId: string, accessToken: string) {
  const fields = 'username,name,biography,followers_count,follows_count,media_count,profile_picture_url';
  const res = await fetch(
    `${GRAPH_API}/${igUserId}?fields=${fields}&access_token=${accessToken}`
  );
  if (!res.ok) return null;
  return res.json();
}
