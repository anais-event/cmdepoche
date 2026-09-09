import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken, getInstagramUserId, fetchProfileInfo } from '@/lib/instagram';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id');
  if (!userId) {
    return NextResponse.json({ error: 'user_id requis' }, { status: 400 });
  }

  const accessToken = await getAccessToken(userId);
  if (!accessToken) {
    return NextResponse.json({ error: 'Instagram non connecté', connected: false }, { status: 401 });
  }

  const igUserId = await getInstagramUserId(userId);
  if (!igUserId) {
    return NextResponse.json({ error: 'Compte Instagram introuvable' }, { status: 404 });
  }

  try {
    const profile = await fetchProfileInfo(igUserId, accessToken);
    if (!profile) {
      return NextResponse.json({ error: 'Profil inaccessible' }, { status: 502 });
    }

    return NextResponse.json({
      connected: true,
      username: profile.username,
      name: profile.name,
      biography: profile.biography,
      followers_count: profile.followers_count,
      follows_count: profile.follows_count,
      media_count: profile.media_count,
      profile_picture_url: profile.profile_picture_url,
    });
  } catch (err) {
    console.error('Instagram profile API error:', err);
    return NextResponse.json({ error: 'Erreur profil Instagram' }, { status: 500 });
  }
}
