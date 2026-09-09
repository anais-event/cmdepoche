import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function parseSignedRequest(signedRequest: string, secret: string) {
  const [encodedSig, payload] = signedRequest.split('.');
  const sig = Buffer.from(encodedSig.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  const data = JSON.parse(
    Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
  );
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest();

  if (!crypto.timingSafeEqual(sig, expectedSig)) {
    throw new Error('Invalid signature');
  }
  return data;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const signedRequest = formData.get('signed_request') as string;

    if (!signedRequest) {
      return NextResponse.json({ error: 'Missing signed_request' }, { status: 400 });
    }

    const data = parseSignedRequest(signedRequest, process.env.INSTAGRAM_APP_SECRET!);
    const fbUserId = data.user_id;

    const supabase = getSupabaseAdmin();
    const confirmationCode = crypto.randomBytes(16).toString('hex');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cmdepoche.vercel.app';

    // Delete all Instagram data for this user
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .not('instagram_user_id', 'is', null);

    if (profiles) {
      for (const profile of profiles) {
        await supabase.from('instagram_media').delete().eq('user_id', profile.id);
        await supabase.from('instagram_account_insights').delete().eq('user_id', profile.id);

        await supabase
          .from('profiles')
          .update({
            instagram_user_id: null,
            instagram_access_token: null,
            instagram_token_expires_at: null,
            insta_handle: null,
            followers_count: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);
      }
    }

    console.log('Data deletion request for FB user:', fbUserId, 'code:', confirmationCode);

    // Meta expects this exact response format
    return NextResponse.json({
      url: `${appUrl}/privacy?deletion=${confirmationCode}`,
      confirmation_code: confirmationCode,
    });
  } catch (err) {
    console.error('Data deletion callback error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
