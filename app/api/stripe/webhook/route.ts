import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// TODO: npm install stripe && add STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET to .env.local
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PLAN_CREDITS: Record<string, number> = {
  pro: 100,
  business: 350,
};

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // --- Uncomment when Stripe is ready ---
    // const event = stripe.webhooks.constructEvent(
    //   body,
    //   signature,
    //   process.env.STRIPE_WEBHOOK_SECRET!
    // );
    //
    // switch (event.type) {
    //   case 'checkout.session.completed': {
    //     const session = event.data.object;
    //     const { userId, plan } = session.metadata;
    //     await supabaseAdmin.from('profiles').update({
    //       plan,
    //       credits_remaining: PLAN_CREDITS[plan] || 10,
    //       updated_at: new Date().toISOString(),
    //     }).eq('id', userId);
    //     break;
    //   }
    //   case 'invoice.paid': {
    //     // Monthly renewal — reset credits
    //     const invoice = event.data.object;
    //     const sub = await stripe.subscriptions.retrieve(invoice.subscription);
    //     const userId = sub.metadata.userId;
    //     const plan = sub.metadata.plan;
    //     await supabaseAdmin.from('profiles').update({
    //       credits_remaining: PLAN_CREDITS[plan] || 10,
    //       credits_reset_at: new Date().toISOString(),
    //       updated_at: new Date().toISOString(),
    //     }).eq('id', userId);
    //     break;
    //   }
    //   case 'customer.subscription.deleted': {
    //     // Downgrade to free
    //     const sub = event.data.object;
    //     const userId = sub.metadata.userId;
    //     await supabaseAdmin.from('profiles').update({
    //       plan: 'free',
    //       credits_remaining: 10,
    //       updated_at: new Date().toISOString(),
    //     }).eq('id', userId);
    //     break;
    //   }
    // }

    void body;
    void supabaseAdmin;
    void PLAN_CREDITS;

    return NextResponse.json({ received: true, status: 'webhook_not_configured' });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
