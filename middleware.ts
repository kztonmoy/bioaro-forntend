import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE } from './lib/auth';

// Gates every dashboard screen behind a session. /login, the standalone
// clinician view (screen 14 — deliberately no BioAro account needed),
// the email preview, and Next's own API routes stay open.
const PUBLIC_PATHS = ['/login', '/clinician', '/email-preview', '/api'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (isPublic) return NextResponse.next();

  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
