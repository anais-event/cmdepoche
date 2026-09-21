import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAccessToken, getInstagramUserId, fetchAccountInsights, fetchProfileInfo } from '@/lib/instagram';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const DEMO_INSIGHTS: Record<string, { impressions: number; reach: number; profile_views: number; website_clicks: number; follower_count: number }> = {
  day: { impressions: 342, reach: 289, profile_views: 18, website_clicks: 4, follower_count: 2847 },
  week: { impressions: 2_180, reach: 1_740, profile_views: 94, website_clicks: 23, follower_count: 2847 },
  days_28: { impressions: 8_920, reach: 6_350, profile_views: 380, website_clicks: 87, follower_count: 2847 },
};

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id');
  if (!userId) {
    return NextResponse.json({ error: 'user_id requis' }, { status: 400 });
  }

  const period = (request.nextUrl.searchParams.get('period') || 'day') as 'day' | 'week' | 'days_28';
  const accessToken = await getAccessToken(userId);

  if (!accessToken) {
    return NextResponse.json({
      demo: true,
      profile: null,
      insights: { period, ...DEMO_INSIGHTS[period] },
      fetched_at: new Date().toISOString(),
    });
  }

  const igUserId = await getInstagramUserId(userId);
  if (!igUserId) {
    return NextResponse.json({ error: 'Compte Instagram introuvable' }, { status: 404 });
  }

  try {
    const [insights, profile] = await Promise.all([
      fetchAccountInsights(igUserId, accessToken, period),
      fetchProfileInfo(igUserId, accessToken),
    ]);

    const supabase = getSupabaseAdmin();

    const today = new Date().toISOString().split('T')[0];
    await supabase.from('instagram_account_insights').upsert({
      user_id: userId,
      period,
      date: today,
      impressions: insights.impressions,
      reach: insights.reach,
      profile_views: insights.profile_views,
      website_clicks: insights.website_clicks,
      follower_count: insights.follower_count,
      fetched_at: new Date().toISOString(),
    }, { onConflict: 'user_id,period,date' });

    if (profile) {
      await supabase.from('profiles').update({
        followers_count: profile.followers_count || insights.follower_count,
        updated_at: new Date().toISOString(),
      }).eq('id', userId);
    }

    return NextResponse.json({
      profile: profile ? {
        username: profile.username,
        name: profile.name,
        biography: profile.biography,
        followers_count: profile.followers_count,
        follows_count: profile.follows_count,
        media_count: profile.media_count,
        profile_picture_url: profile.profile_picture_url,
      } : null,
      insights: { period, ...insights },
      fetched_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Instagram insights API error:', err);
    return NextResponse.json({ error: 'Erreur lors de la récupération des insights' }, { status: 500 });
  }
}
