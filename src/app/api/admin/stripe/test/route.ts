export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import { getStripeInstance } from '@/lib/stripeServer';

export async function POST(req: NextRequest) {
  const { amount = 500, description = 'Test charge' } = await req.json();
  const stripe = await getStripeInstance();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${process.env.APP_URL}/pay/success`,
    cancel_url: `${process.env.APP_URL}/pay/cancel`,
    line_items: [{ price_data: { currency: 'usd', product_data: { name: description }, unit_amount: amount }, quantity: 1 }],
  });
  return Response.json({ url: session.url });
}
