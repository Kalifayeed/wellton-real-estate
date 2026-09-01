import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'wellton_session';

async function getSessionRole(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) return null;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return (payload.role as string) ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = await getSessionRole(req);

  const isAdminArea = pathname.startsWith('/admin');
  const isAgentArea = pathname.startsWith('/agent');

  // Only guard internal dashboards; everything else is public.
  if (!isAdminArea && !isAgentArea) return NextResponse.next();

  // Must be authenticated.
  if (!role) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // /admin requires ADMIN or MANAGER.
  if (isAdminArea && role !== 'ADMIN' && role !== 'MANAGER') {
    const url = req.nextUrl.clone();
    url.pathname = '/agent';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/agent/:path*'],
};
