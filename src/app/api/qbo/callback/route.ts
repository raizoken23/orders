export const runtime = 'nodejs';
import { exchangeCodeForToken } from '@/lib/qbo';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const code = u.searchParams.get('code');
  const realmId = u.searchParams.get('realmId');
  if (!code || !realmId) {
    return new Response('Missing code or realmId', { status: 400 });
  }
  try {
    await exchangeCodeForToken(code, realmId);
    
    // Construct a redirect URL back to the app's domain
    const redirectUrl = new URL('/qbo/connected', req.nextUrl.origin);
    
    return Response.redirect(redirectUrl);
  } catch (e: any) {
    return new Response('OAuth error: ' + String(e), { status: 500 });
  }
}
