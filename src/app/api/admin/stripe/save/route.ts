
export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import { putSecret } from '@/lib/secretStore';

export async function POST(req: NextRequest) {
  const { secretKey, publishableKey, webhookSecret } = await req.json();
  if (!secretKey) return new Response('secretKey required', { status: 400 });
  await putSecret('stripe', { secretKey, publishableKey, webhookSecret });
  return Response.json({ ok: true });
}
