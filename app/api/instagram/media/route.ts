import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAccessToken, getInstagramUserId, fetchRecentMedia, fetchMediaInsights } from '@/lib/instagram';

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
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '25');
    const media = await fetchRecentMedia(igUserId, accessToken, Math.min(limit, 50));

    if (!media.length) {
      return NextResponse.json({ media: [], message: 'Aucun post trouvé' });
    }

    // Fetch insights for each post + save to DB
    const supabase = getSupabaseAdmin();
    const enrichedMedia = await Promise.all(
      media.map(async (post) => {
        const insights = await fetchMediaInsights(post.id, accessToken, post.media_type);
        return { ...post, insights };
      })
    );

    // Upsert to cache table
    const rows = enrichedMedia.map((post) => ({
      user_id: userId,
      ig_media_id: post.id,
      media_type: post.media_type,
      media_url: post.media_url || null,
      thumbnail_url: post.thumbnail_url || null,
      caption: post.caption || null,
      permalink: post.permalink,
      like_count: post.like_count || 0,
      comments_count: post.comments_count || 0,
      timestamp: post.timestamp,
      insights: post.insights,
      fetched_at: new Date().toISOString(),
    }));

    await supabase
      .from('instagram_media')
      .upsert(rows, { onConflict: 'ig_media_id' });

    // Also update followers_count on profile
    const totalEngagement = enrichedMedia.reduce(
      (sum, p) => sum + (p.like_count || 0) + (p.comments_count || 0), 0
    );
    const avgEngagement = enrichedMedia.length > 0 ? totalEngagement / enrichedMedia.length : 0;

    await supabase.from('profiles').update({
      engagement_rate: avgEngagement,
      updated_at: new Date().toISOString(),
    }).eq('id', userId);

    return NextResponse.json({
      media: enrichedMedia,
      total: enrichedMedia.length,
      avg_engagement: Math.round(avgEngagement),
    });
  } catch (err) {
    console.error('Instagram media API error:', err);
    return NextResponse.json({ error: 'Erreur lors de la récupération des posts' }, { status: 500 });
  }
}
