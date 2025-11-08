export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import { createPaymentLink } from '@/lib/stripeServer';

export async function POST(req: NextRequest) {
  const { priceId } = await req.json();
  if (!priceId) return new Response('priceId required', { status: 400 });
  const url = await createPaymentLink(priceId);
  return Response.json({ url });
}
