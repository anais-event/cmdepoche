import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAccessToken, getInstagramUserId, fetchRecentMedia, fetchMediaInsights } from '@/lib/instagram';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function generateDemoMedia() {
  const now = Date.now();
  const day = 86400000;

  const posts = [
    { type: 'CAROUSEL_ALBUM', caption: 'Les 5 erreurs qui plombent ta bio Instagram (swipe →)', likes: 142, comments: 28 },
    { type: 'IMAGE', caption: 'On parle pas assez de ça : la régularité bat la perfection. Toujours.', likes: 98, comments: 15 },
    { type: 'VIDEO', caption: 'Comment je prépare mes contenus pour la semaine en 1h chrono 🎬', likes: 231, comments: 42 },
    { type: 'IMAGE', caption: 'Coulisses du shooting de la semaine. Le naturel, c\'est tout un travail.', likes: 76, comments: 9 },
    { type: 'CAROUSEL_ALBUM', caption: 'Avant / Après : ce que 3 mois de stratégie de contenu peuvent changer', likes: 189, comments: 34 },
    { type: 'VIDEO', caption: 'Ma routine matinale création de contenu ☕️', likes: 167, comments: 22 },
    { type: 'IMAGE', caption: 'Nouveau setup ! Minimaliste mais efficace.', likes: 54, comments: 7 },
    { type: 'CAROUSEL_ALBUM', caption: 'Les 3 formats qui marchent le mieux pour moi en ce moment', likes: 203, comments: 31 },
    { type: 'IMAGE', caption: 'Simplicité. Mon mot d\'ordre cette saison.', likes: 112, comments: 13 },
    { type: 'VIDEO', caption: 'Répondre à vos questions sur la création de contenu 💬', likes: 145, comments: 38 },
    { type: 'IMAGE', caption: 'Palette d\'automne 🍂 Quel est votre combo préféré ?', likes: 87, comments: 19 },
    { type: 'CAROUSEL_ALBUM', caption: 'Guide : comment trouver ta niche sans te limiter', likes: 256, comments: 47 },
  ];

  return posts.map((p, i) => ({
    id: `demo_${i + 1}`,
    media_type: p.type as 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM',
    media_url: '',
    thumbnail_url: '',
    caption: p.caption,
    permalink: '#',
    like_count: p.likes,
    comments_count: p.comments,
    timestamp: new Date(now - (i + 1) * day * 2.5).toISOString(),
    insights: {
      impressions: p.likes * 12 + p.comments * 8,
      reach: p.likes * 8 + p.comments * 5,
      saved: Math.round(p.likes * 0.15),
      shares: Math.round(p.comments * 0.6),
    },
  }));
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id');
  if (!userId) {
    return NextResponse.json({ error: 'user_id requis' }, { status: 400 });
  }

  const accessToken = await getAccessToken(userId);

  if (!accessToken) {
    const media = generateDemoMedia();
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '12');
    return NextResponse.json({
      demo: true,
      media: media.slice(0, limit),
      total: media.length,
      avg_engagement: 127,
    });
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

    const supabase = getSupabaseAdmin();
    const enrichedMedia = await Promise.all(
      media.map(async (post) => {
        const insights = await fetchMediaInsights(post.id, accessToken, post.media_type);
        return { ...post, insights };
      })
    );

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
