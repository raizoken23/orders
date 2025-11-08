export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import { createPrice } from '@/lib/stripeServer';

export async function POST(req: NextRequest) {
  const { productId, amountUsd, interval, currency } = await req.json();
  if (!productId || !amountUsd) return new Response('productId and amountUsd required', { status: 400 });
  const price = await createPrice({ productId, amountUsd: Number(amountUsd), interval, currency });
  return Response.json(price);
}
