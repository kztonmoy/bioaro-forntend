# BioAro Account Dashboard — Web

Next.js (App Router) frontend implementing the 16-screen design review UI.
Built to sit in front of `bioaro-dashboard-api` (the NestJS backend), with
bundled mock data so every screen still renders if the API isn't running.

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Plus Jakarta Sans (display) + Inter (body), 8px radius, cream canvas +
  dark green sidebar — tokens transcribed from the design review, see
  `tailwind.config.ts`
- No client state library — data is fetched server-side per page

## Getting started

```bash
cp .env.example .env.local   # point at your bioaro-dashboard-api, optional
npm install
npm run dev
```

If `NEXT_PUBLIC_API_URL` is unset or the API is unreachable, `lib/api.ts`
falls back to `lib/mock-data.ts` — the same Shayan / BAL-7845123 test panel
used throughout the design review — so the UI is browsable standalone.

> Note: this build needs to reach `fonts.googleapis.com` (via `next/font/google`)
> the first time it compiles. If you're building somewhere without general
> internet access, either allow that domain or swap the two font imports in
> `app/layout.tsx` for local files / system fonts.

## Signing in

The app now requires a session for every dashboard route (`middleware.ts`
redirects to `/login` otherwise). `/login`, `/clinician/[token]` (screen 14
— deliberately no BioAro account), `/email-preview`, and `/api/*` stay public.

1. `POST /api/login` (a Next.js Route Handler, not a page) proxies the
   form to the NestJS backend's `POST /auth/login`, then sets the returned
   JWT as an **httpOnly** cookie (`bioaro_token`) — the token is never
   exposed to client-side JS.
2. Every server-side fetch in `lib/api.ts` reads that cookie
   (`lib/auth.ts#getServerToken`) and sends it as `Authorization: Bearer
   <token>` to the backend.
3. `POST /api/logout` clears the cookie; the Sidebar/TopBar's "Sign out"
   button calls it.

If `NEXT_PUBLIC_API_URL` isn't set, `/api/login` returns a clear error
("cannot sign in against a live backend") instead of silently failing —
but every dashboard page still renders from `lib/mock-data.ts` once
you're past the login redirect, since `middleware.ts` only checks for the
cookie's presence, not that a live API validated it. A banner in the
`TopBar` ("Sample data — API not configured") makes this visible.

Pages wired to the live API (with mock fallback when the API is
unreachable or a field is missing): overview, all results, domain view,
marker detail, trend, profile, consents, and sharing's active-links list.
Orders, kits, and recommendations still render the design review's
illustrative sample data — the backend's shapes there are intentionally
minimal (raw Shopify JSON, no recommendation engine yet), so mapping them
into the rich mock UI needs the backend decisions described in
`bioaro-dashboard-api`'s README first.

## Screen → route map

| Screen | Route |
|---|---|
| 01–02 Overview | `/` |
| 03 Before results arrive | `/before-results` |
| 04 All results | `/results` |
| 05 Domain view | `/results/domains/[slug]` |
| 06–07 Marker detail / worrying result | `/results/markers/[id]` |
| 08 Change over time | `/trends` |
| 09 Orders | `/orders` |
| 10 Tests & kits | `/kits` |
| 11 Consents & intake | `/consents` |
| 12 Profile & settings | `/profile` |
| 13 Share with a clinician | `/sharing` |
| 14 What the clinician opens | `/clinician/[token]` (no sidebar — separate, unauthenticated layout) |
| 15 Recommendations | `/recommendations` |
| 16 Results-ready email | `/email-preview` (static preview, not a real inbox) |

`/before-results` and `/email-preview` aren't in the main sidebar nav
(matching the design review, where they're states/artifacts rather than
destinations) — they're reachable directly by URL for review.

## Design decisions worth knowing about

- **Marker grading drives the UI, not vice versa.** Every status pill,
  progress bar position, and domain tile color reads off a `MarkerStatus`
  (`optimal | needs_attention | out_of_range | not_tested`) already
  computed by the data layer — pages don't re-derive status from raw
  values, so swapping in the real API only requires that API to return
  the same shape (see `bioaro-dashboard-api`'s `MarkerReading`).
- **The clinician view (`/clinician/[token]`) is a genuinely different
  layout**, not a themed copy — dark background, dense table, no sidebar,
  no patient chrome, per the design review's "deliberately not the
  patient interface."
- **The score is a fraction, not an invented index** — `13/28` rendered
  as `46%`, matching "the ring counts what is actually measurable."
- Domain tiles route to `/results/domains/[slug]`, except untested
  domains (e.g. Microbiome & gut), which route to `/kits` — there's
  nothing to show yet, so the CTA is to order the test rather than view
  empty results.

## Fully wired to the live API

Every page now calls the backend (with sample-data fallback when it's
unreachable). Mutations go through a generic authenticated proxy so
client components never touch the httpOnly token directly:

- **`app/api/proxy/[...path]/route.ts`** — forwards any method to
  `NEXT_PUBLIC_API_URL/<path>` with `Authorization: Bearer <token>` read
  server-side from the `bioaro_token` cookie. Client components call
  `mutate('kits/abc/activate', 'PATCH')` (see `lib/mutate.ts`) instead of
  hitting the backend directly.
- **Kits** — `ActivateKitButton` calls `PATCH /kits/:id/activate`, then
  `router.refresh()`.
- **Consents** — `GET /consents/templates` drives the "Needs you" list;
  `SignConsentButton` calls `POST /consents/sign`.
- **Profile** — `NotificationToggle` calls `PATCH /profile/notifications`
  with optimistic UI (reverts if the request fails). Per the backend's
  own note, this is one master switch, not four independent toggles.
- **Sharing** — `CreateShareLinkForm` posts to `POST /sharing/links`;
  `RevokeLinkButton` calls `DELETE /sharing/links/:id`.
- **Orders, Recommendations** — read-only, live-wired with sample-data
  fallback (no mutation actions exist yet on the backend for these, e.g.
  no "reorder" or "pay invoice" endpoint beyond the invoice URL Orders
  already returns).

## Not implemented

Search-within-results, loading/error/skeleton states, sign-in/auth UI
(the app assumes a signed-in session), and live wiring of the intake
questionnaire builder (`forms.form_builder_json`) — these are explicitly
listed as "not yet drawn" in the design review, or are backend-integration
work that depends on decisions noted in `bioaro-dashboard-api`'s README
(structured markers, the parser/feed question).
# bioaro-forntend
