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

    // Clear Instagram tokens for the user who deauthorized
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .not('instagram_user_id', 'is', null);

    if (profiles) {
      for (const profile of profiles) {
        await supabase
          .from('profiles')
          .update({
            instagram_access_token: null,
            instagram_token_expires_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.id);
      }
    }

    console.log('Deauthorize callback received for FB user:', fbUserId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Deauthorize callback error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
