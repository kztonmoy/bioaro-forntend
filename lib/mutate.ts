'use client';

// Client components call this to POST/PATCH/DELETE through
// /api/proxy/<path>, which attaches the signed-in patient's token
// server-side (see app/api/proxy/[...path]/route.ts).
export async function mutate<T = unknown>(
  path: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  body?: unknown,
): Promise<{ ok: boolean; status: number; data: T | { message: string } }> {
  const res = await fetch(`/api/proxy/${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: any = {};
  try {
    data = await res.json();
  } catch {
    // no body
  }

  return { ok: res.ok, status: res.status, data };
}
