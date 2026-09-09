import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cmdepoche.vercel.app';

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/settings?error=instagram_denied`);
  }

  try {
    // 1. Exchange code for short-lived token
    const tokenRes = await fetch('https://graph.facebook.com/v21.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID!,
        client_secret: process.env.INSTAGRAM_APP_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: `${appUrl}/api/auth/instagram/callback`,
        code,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error('Token exchange failed:', err);
      return NextResponse.redirect(`${appUrl}/settings?error=token_failed`);
    }

    const tokenData = await tokenRes.json();
    const shortToken = tokenData.access_token;

    // 2. Exchange for long-lived token (60 days)
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.INSTAGRAM_APP_ID}&client_secret=${process.env.INSTAGRAM_APP_SECRET}&fb_exchange_token=${shortToken}`
    );

    const longTokenData = await longTokenRes.json();
    const accessToken = longTokenData.access_token || shortToken;
    const expiresIn = longTokenData.expires_in || 5184000;

    // 3. Get Facebook Pages
    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`
    );
    const pagesData = await pagesRes.json();

    if (!pagesData.data?.length) {
      return NextResponse.redirect(`${appUrl}/settings?error=no_page`);
    }

    const pageToken = pagesData.data[0].access_token;
    const pageId = pagesData.data[0].id;

    // 4. Get Instagram Business Account linked to the page
    const igRes = await fetch(
      `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`
    );
    const igData = await igRes.json();

    if (!igData.instagram_business_account?.id) {
      return NextResponse.redirect(`${appUrl}/settings?error=no_instagram`);
    }

    const igUserId = igData.instagram_business_account.id;

    // 5. Get Instagram profile info
    const profileRes = await fetch(
      `https://graph.facebook.com/v21.0/${igUserId}?fields=username,followers_count,media_count,biography&access_token=${accessToken}`
    );
    const igProfile = await profileRes.json();

    // 6. Find Supabase user from the state/cookie
    // We use the referrer or a cookie to identify the user
    // For now, we'll use a state param approach
    const state = request.nextUrl.searchParams.get('state');
    if (!state) {
      return NextResponse.redirect(`${appUrl}/settings?error=no_state`);
    }

    const supabase = getSupabaseAdmin();

    // 7. Update profile with Instagram data
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        instagram_user_id: igUserId,
        instagram_access_token: accessToken,
        instagram_token_expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
        insta_handle: igProfile.username || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', state);

    if (updateError) {
      console.error('Profile update failed:', updateError);
      return NextResponse.redirect(`${appUrl}/settings?error=save_failed`);
    }

    // Also save detailed analysis
    await supabase.from('profile_analyses').upsert({
      user_id: state,
      insta_handle: igProfile.username,
      avg_engagement_rate: null,
      audience_demographics: {},
      analysis_date: new Date().toISOString(),
    });

    return NextResponse.redirect(`${appUrl}/settings?instagram=connected`);
  } catch (err) {
    console.error('Instagram OAuth error:', err);
    return NextResponse.redirect(`${appUrl}/settings?error=unknown`);
  }
}
