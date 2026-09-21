import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken, getInstagramUserId, fetchProfileInfo } from '@/lib/instagram';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
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
    const supabase = getSupabase();
    const { data: profile } = await supabase
      .from('profiles')
      .select('insta_handle, detected_niche')
      .eq('id', userId)
      .single();

    const handle = profile?.insta_handle || 'mon.compte';

    return NextResponse.json({
      connected: false,
      demo: true,
      username: handle,
      name: handle.replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      biography: `Créateur·rice passionné·e ✨ ${profile?.detected_niche || 'Lifestyle'} · Contenus authentiques`,
      followers_count: 2847,
      follows_count: 463,
      media_count: 187,
      profile_picture_url: '',
    });
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
