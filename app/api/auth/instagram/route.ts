import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.INSTAGRAM_APP_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cmdepoche.vercel.app';
  const redirectUri = `${appUrl}/api/auth/instagram/callback`;

  if (!clientId) {
    return NextResponse.json({ error: 'Instagram App ID not configured' }, { status: 500 });
  }

  const userId = request.nextUrl.searchParams.get('user_id');
  if (!userId) {
    return NextResponse.json({ error: 'user_id required' }, { status: 400 });
  }

  const scopes = [
    'instagram_basic',
    'instagram_manage_insights',
    'pages_show_list',
    'pages_read_engagement',
  ].join(',');

  const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code&state=${userId}`;

  return NextResponse.redirect(authUrl);
}
