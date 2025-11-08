export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import { putSecret } from '@/lib/secretStore';

export async function POST(req: NextRequest) {
  const { clientId, clientSecret, redirectUrl } = await req.json();
  if (!clientId || !clientSecret) return new Response('clientId and clientSecret required', { status: 400 });
  await putSecret('qbo', { clientId, clientSecret, redirectUrl });
  return Response.json({ ok: true });
}
