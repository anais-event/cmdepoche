import { NextRequest, NextResponse } from 'next/server';

// TODO: npm install stripe && add STRIPE_SECRET_KEY to .env.local
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json({ error: 'Missing customer ID' }, { status: 400 });
    }

    // --- Uncomment when Stripe is ready ---
    // const session = await stripe.billingPortal.sessions.create({
    //   customer: customerId,
    //   return_url: `${req.nextUrl.origin}/dashboard`,
    // });
    // return NextResponse.json({ url: session.url });

    return NextResponse.json({
      message: 'Stripe portal not configured yet',
    }, { status: 501 });

  } catch (err) {
    console.error('Portal error:', err);
    return NextResponse.json({ error: 'Portal failed' }, { status: 500 });
  }
}
