export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { getStripeInstance, getStripeWebhookSecret } from '@/lib/stripeServer';

export async function POST(req: NextRequest) {
  const stripe = await getStripeInstance();
  const sig = req.headers.get('stripe-signature') || '';
  const buf = Buffer.from(await req.arrayBuffer());
  let evt: Stripe.Event;
  try {
    evt = stripe.webhooks.constructEvent(buf, sig, await getStripeWebhookSecret());
  } catch (e: any) {
    return new Response('Webhook error: ' + e.message, { status: 400 });
  }
  if (evt.type === 'checkout.session.completed') {
    // TODO: mark order paid
  }
  return new Response('ok');
}
