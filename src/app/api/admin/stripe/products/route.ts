export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import { listProductsWithPrices, upsertProduct, setDefaultPrice } from '@/lib/stripeServer';

export async function GET() {
  const data = await listProductsWithPrices();
  return Response.json(data);
}

export async function POST(req: NextRequest) {
  const { id, name, description = '', features = [] } = await req.json();
  if (!name) return new Response('name required', { status: 400 });
  const p = await upsertProduct({ id, name, description, features });
  return Response.json(p);
}

export async function PUT(req: NextRequest) {
  const { productId, defaultPriceId } = await req.json();
  if (!productId || !defaultPriceId) return new Response('productId and defaultPriceId required', { status: 400 });
  const p = await setDefaultPrice(productId, defaultPriceId);
  return Response.json(p);
}
