import { NextRequest, NextResponse } from 'next/server';

// TODO: npm install stripe && add STRIPE_SECRET_KEY + STRIPE_PRICE_PRO + STRIPE_PRICE_BUSINESS to .env.local
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_MAP: Record<string, string> = {
  pro: process.env.STRIPE_PRICE_PRO || 'price_pro_placeholder',
  business: process.env.STRIPE_PRICE_BUSINESS || 'price_business_placeholder',
};

export async function POST(req: NextRequest) {
  try {
    const { plan, userId } = await req.json();

    if (!plan || !userId || !PRICE_MAP[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // --- Uncomment when Stripe is ready ---
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   payment_method_types: ['card'],
    //   customer_email: email,
    //   line_items: [{ price: PRICE_MAP[plan], quantity: 1 }],
    //   success_url: `${req.nextUrl.origin}/dashboard?upgraded=true`,
    //   cancel_url: `${req.nextUrl.origin}/pricing`,
    //   metadata: { userId, plan },
    // });
    // return NextResponse.json({ url: session.url });

    return NextResponse.json({
      message: 'Stripe not configured yet',
      plan,
      price: plan === 'pro' ? '29€/mois' : '49€/mois',
    }, { status: 501 });

  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
