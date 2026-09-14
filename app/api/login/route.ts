import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Server-side proxy to POST /auth/login on the NestJS backend. Runs on
// the Next.js server (not in the browser), so it isn't subject to
// browser CORS — and it's the only place that ever sees the JWT before
// it's set as an httpOnly cookie.
export async function POST(req: NextRequest) {
  const { emailOrPhone, password } = await req.json();

  if (!API_URL) {
    return NextResponse.json(
      { message: 'NEXT_PUBLIC_API_URL is not configured — cannot sign in against a live backend.' },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone, password }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return NextResponse.json({ message: body.message ?? 'Invalid credentials' }, { status: res.status });
    }

    const data = await res.json();
    const response = NextResponse.json({ user: data.user });
    response.cookies.set(TOKEN_COOKIE, data.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day — matches the API's default JWT_EXPIRES_IN
    });
    return response;
  } catch {
    return NextResponse.json({ message: 'Could not reach the BioAro API.' }, { status: 502 });
  }
}
