export const runtime = 'nodejs';
import { getCompanyInfo, ensureConnected } from '@/lib/qbo';

export async function GET() {
  if (!ensureConnected()) return new Response('Not connected', { status: 412 });
  const data = await getCompanyInfo();
  return Response.json(data);
}
