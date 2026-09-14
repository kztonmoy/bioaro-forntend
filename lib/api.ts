// Thin data-access layer. Attaches the signed-in patient's JWT (from the
// bioaro_token cookie) to every request. If the backend is unreachable —
// e.g. running the frontend standalone — falls back to the bundled mock
// panel so screens still render; if the backend responds with 401, the
// caller should treat that as "not signed in" (middleware handles this
// for page loads).
import { OVERVIEW, MARKERS, DOMAINS, TRENDS, TREND_SUMMARY, getDomain, getDomainMarkers, getMarker } from './mock-data';
import { getServerToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiUnauthorizedError extends Error {}

async function tryFetch<T>(path: string, opts: { requireAuth?: boolean } = {}): Promise<T | null> {
  if (!API_URL) return null;
  const token = getServerToken();
  if (opts.requireAuth !== false && !token) return null;

  try {
    const res = await fetch(`${API_URL}${path}`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (res.status === 401) throw new ApiUnauthorizedError('Session expired');
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof ApiUnauthorizedError) throw err;
    return null;
  }
}

// ---------- Overview / Results (screens 01-08) ----------

export async function getOverview() {
  const live = await tryFetch<typeof OVERVIEW>('/overview');
  return live ?? OVERVIEW;
}

export async function getAllMarkers() {
  // A panel realistically has a few dozen markers at most — request a
  // high limit so "All results" isn't silently truncated by the
  // default page size.
  const live = await tryFetch<{ markers: typeof MARKERS; meta: PaginationMeta }>('/results?limit=100');
  return live?.markers ?? MARKERS;
}

export async function getDomainView(slug: string) {
  const live = await tryFetch<{ markers: typeof MARKERS }>(`/results/domains/${slug}`);
  return {
    domain: getDomain(slug),
    markers: live?.markers ?? getDomainMarkers(slug),
  };
}

export async function getMarkerDetail(id: string) {
  const live = await tryFetch<(typeof MARKERS)[number]>(`/results/markers/${id}`);
  return live ?? getMarker(id) ?? null;
}

export async function getMarkerTrend(id: string) {
  const live = await tryFetch<{ markerId: string; points: { date: string; value: number }[] }>(
    `/results/markers/${id}/trend`,
  );
  return live?.points ?? TRENDS[id] ?? [];
}

export async function getTrendSummary() {
  return TREND_SUMMARY;
}

export async function getDomains() {
  const live = await tryFetch<{ domains: typeof DOMAINS }>('/overview');
  return live?.domains ?? DOMAINS;
}

// ---------- Kits (screens 03, 10) ----------

export interface KitStage {
  status: number;
  label: string;
  done: boolean;
  current: boolean;
}

export interface KitView {
  itemId: string;
  serviceId: string | null;
  serviceSlug: string | null;
  name: string;
  description: string | null;
  price: number;
  statusCode: number;
  statusLabel: string;
  isException: boolean;
  trackingNumber: string | null;
  bloodDraw: { date: string; time: string | null } | null;
  stages: KitStage[];
  reportId: string | null;
  reportRead: boolean;
  resultsReady: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function getKits() {
  const live = await tryFetch<{ data: KitView[]; meta: PaginationMeta }>('/kits');
  return live?.data ?? null;
}

// ---------- Orders (screen 09) ----------

export interface OrderLineItem {
  itemId: string | null;
  name: string;
  price: number;
  status: number;
  slug: string | null;
}

export interface OrderView {
  id: string;
  invoiceNumber: string | null;
  placedAt: string | null;
  total: number | null;
  paymentStatus: string;
  shopifyOrderId: string | null;
  invoiceUrl: string | null;
  lineItems: OrderLineItem[];
}

export async function getOrders() {
  return tryFetch<{
    orders: OrderView[];
    consultations: { id: string; date: string | null; start: string | null; status: number }[];
  }>('/orders');
}

// ---------- Consents (screen 11) ----------

export interface ConsentTemplateView {
  templateId: string;
  subject: string;
  message: string;
  alreadySigned: boolean;
  signedAt: string | null;
}

export async function getConsents() {
  return tryFetch<{
    needsYou: { intakeInProgress: unknown; drawNotScheduled: boolean };
    onFile: { id: string; subject: string; signedAt: string | null; isLatest: boolean; status: string }[];
  }>('/consents');
}

export async function getConsentTemplates() {
  return tryFetch<ConsentTemplateView[]>('/consents/templates');
}

// ---------- Profile (screen 12) ----------

export interface ProfileView {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  shippingAddress: { line: string; city: string; state: string; postCode: string; country: string } | null;
  clinicalDetails: { date_of_birth: string | null; sex_assigned_at_birth: string | null; gender: string | null };
  affectsGrading: boolean;
  notificationsEnabled: boolean;
}

export async function getProfile() {
  return tryFetch<ProfileView>('/profile');
}

export async function getActivity() {
  return tryFetch<{ id: number; event: string; description: string; createdAt: string }[]>('/profile/activity');
}

// ---------- Sharing (screens 13, 14) ----------

export interface ShareLinkView {
  id: string;
  recipientName: string;
  status: 'active' | 'revoked';
  scope: string[];
  expiresAt: string | null;
  openCount: number;
  lastOpenedAt: string | null;
}

export async function getShareLinks() {
  const live = await tryFetch<{ data: ShareLinkView[]; meta: PaginationMeta }>('/sharing/links');
  return live?.data ?? null;
}

// ---------- Recommendations (screen 15) ----------

export interface RecommendationsView {
  reportId: string | null;
  takeToClinician: { title: string; body: string; markers: string[] }[];
  worthDoingMeanwhile: { title: string; body: string; markers: string[] }[];
  gapsInWhatYouveMeasured: string[];
  disclaimer: string;
}

export async function getRecommendations() {
  return tryFetch<RecommendationsView>('/recommendations');
}

// ---------- Notifications (in-app badge) ----------

export async function getNotifications() {
  const live = await tryFetch<{
    data: { id: string; type: string; data: string; readAt: string | null }[];
    meta: PaginationMeta;
  }>('/notifications');
  return live?.data ?? null;
}

export function isLiveApiConfigured() {
  return !!API_URL;
}
