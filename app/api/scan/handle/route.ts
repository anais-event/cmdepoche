import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { handle } = await request.json();

    if (!handle || typeof handle !== 'string') {
      return NextResponse.json({ error: 'Handle manquant' }, { status: 400 });
    }

    const cleanHandle = handle.replace('@', '').trim();

    // Option 1 : RapidAPI Instagram Scraper (si clé configurée)
    if (process.env.RAPIDAPI_KEY) {
      const res = await fetch(
        `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${cleanHandle}`,
        {
          headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com',
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const userData = data.data;

        return NextResponse.json({
          handle: cleanHandle,
          followers_count: userData?.follower_count || 0,
          following_count: userData?.following_count || 0,
          posts_count: userData?.media_count || 0,
          bio: userData?.biography || '',
          detected_niche: null,
          detected_tone: null,
          detected_target: null,
          color_palette: null,
          format_engagement_estimate: null,
          engagement_rate: null,
          optimal_slots: [
            { day: 'Lundi', time: '18:30' },
            { day: 'Mercredi', time: '12:00' },
            { day: 'Vendredi', time: '19:00' },
            { day: 'Dimanche', time: '10:00' },
          ],
        });
      }
    }

    // Fallback : données simulées pour le développement
    return NextResponse.json({
      handle: cleanHandle,
      followers_count: 2800,
      following_count: 450,
      posts_count: 187,
      bio: `Créateur·rice @${cleanHandle}`,
      detected_niche: 'Lifestyle',
      detected_tone: 'Authentique',
      detected_target: 'Femmes 25-35, urbaines, sensibles à l\'authenticité',
      color_palette: ['#B87356', '#8FA37A', '#F5E6D3', '#2D2A26', '#D4A574'],
      format_engagement_estimate: { photo: 35, carousel: 42, reel: 23 },
      engagement_rate: 4.2,
      optimal_slots: [
        { day: 'Lundi', time: '18:30' },
        { day: 'Mercredi', time: '12:00' },
        { day: 'Vendredi', time: '19:00' },
        { day: 'Dimanche', time: '10:00' },
      ],
    });
  } catch (err) {
    console.error('Erreur scan handle:', err);
    return NextResponse.json(
      { error: 'Erreur lors du scan du profil' },
      { status: 500 }
    );
  }
}
