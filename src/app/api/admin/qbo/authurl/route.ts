export const runtime = 'nodejs';
import { authUrl } from '@/lib/qbo';
export async function GET() { return Response.json({ url: await authUrl('admin') }); }
