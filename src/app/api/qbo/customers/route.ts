export const runtime = 'nodejs';
import { createTestCustomer, ensureConnected } from '@/lib/qbo';

export async function POST() {
  if (!ensureConnected()) return new Response('Not connected', { status: 412 });
  const c = await createTestCustomer();
  return Response.json(c);
}
