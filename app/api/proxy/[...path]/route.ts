import { NextRequest, NextResponse } from 'next/server';
import { getServerToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Generic authenticated proxy: client components call
// `/api/proxy/<backend-path>` (e.g. `/api/proxy/kits/abc/activate`)
// instead of hitting the NestJS backend directly. This lets client-side
// code trigger mutations (activate a kit, sign a consent, create a share
// link, ...) without ever touching the httpOnly bioaro_token cookie —
// this route reads it server-side and attaches it as a Bearer header.
async function forward(req: NextRequest, params: { path: string[] }) {
  if (!API_URL) {
    return NextResponse.json({ message: 'NEXT_PUBLIC_API_URL is not configured' }, { status: 503 });
  }

  const token = getServerToken();
  if (!token) {
    return NextResponse.json({ message: 'Not signed in' }, { status: 401 });
  }

  const path = params.path.join('/');
  const search = req.nextUrl.search;
  const url = `${API_URL}/${path}${search}`;

  const hasBody = !['GET', 'HEAD', 'DELETE'].includes(req.method);
  const body = hasBody ? await req.text() : undefined;

  const res = await fetch(url, {
    method: req.method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body || undefined,
    cache: 'no-store',
  });

  const text = await res.text();
  const contentType = res.headers.get('content-type') ?? 'application/json';

  return new NextResponse(text, { status: res.status, headers: { 'content-type': contentType } });
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params);
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params);
}
export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params);
}
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params);
}
