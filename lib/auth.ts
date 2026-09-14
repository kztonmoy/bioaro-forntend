import { cookies } from 'next/headers';

export const TOKEN_COOKIE = 'bioaro_token';

// Server-only helper — reads the JWT set by app/api/login/route.ts.
// Used by lib/api.ts to attach Authorization headers on every request to
// the NestJS backend, and by middleware.ts to gate the dashboard routes.
export function getServerToken(): string | null {
  return cookies().get(TOKEN_COOKIE)?.value ?? null;
}
