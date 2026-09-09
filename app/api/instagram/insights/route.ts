import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAccessToken, getInstagramUserId, fetchAccountInsights, fetchProfileInfo } from '@/lib/instagram';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id');
  if (!userId) {
    return NextResponse.json({ error: 'user_id requis' }, { status: 400 });
  }

  const accessToken = await getAccessToken(userId);
  if (!accessToken) {
    return NextResponse.json({ error: 'Instagram non connecté' }, { status: 401 });
  }

  const igUserId = await getInstagramUserId(userId);
  if (!igUserId) {
    return NextResponse.json({ error: 'Compte Instagram introuvable' }, { status: 404 });
  }

  try {
    const period = (request.nextUrl.searchParams.get('period') || 'day') as 'day' | 'week' | 'days_28';

    const [insights, profile] = await Promise.all([
      fetchAccountInsights(igUserId, accessToken, period),
      fetchProfileInfo(igUserId, accessToken),
    ]);

    const supabase = getSupabaseAdmin();

    // Save insights snapshot
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

    // Update profile with latest follower count
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
      insights: {
        period,
        ...insights,
      },
      fetched_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Instagram insights API error:', err);
    return NextResponse.json({ error: 'Erreur lors de la récupération des insights' }, { status: 500 });
  }
}
