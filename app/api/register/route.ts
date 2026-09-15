import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Server-side proxy to POST /auth/register. Same pattern as /api/login:
// runs on the Next.js server so the JWT is set as an httpOnly cookie
// without ever touching client-side JS.
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!API_URL) {
    return NextResponse.json(
      { message: 'NEXT_PUBLIC_API_URL is not configured — cannot register against a live backend.' },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      return NextResponse.json({ message: msg ?? 'Could not create the account' }, { status: res.status });
    }

    const response = NextResponse.json({ user: data.user });
    response.cookies.set(TOKEN_COOKIE, data.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch {
    return NextResponse.json({ message: 'Could not reach the BioAro API.' }, { status: 502 });
  }
}