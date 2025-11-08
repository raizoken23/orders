export const runtime = 'nodejs';
import { authUrl } from '@/lib/qbo';

export async function GET() {
  return Response.redirect(authUrl('state123'));
}
