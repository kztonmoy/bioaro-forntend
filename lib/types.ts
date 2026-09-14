export type MarkerStatus = 'optimal' | 'needs_attention' | 'out_of_range' | 'not_tested';

export interface Marker {
  id: string;
  name: string;
  abbreviation?: string;
  domainSlug: string;
  domainName: string;
  value: number | null;
  unit: string | null;
  referenceLow: number | null;
  referenceHigh: number | null;
  referenceText: string;
  status: MarkerStatus;
  positionInRange?: number; // 0..1
  interpretation?: string;
  bands?: { label: string; range: string; meaning: string }[];
  companionNote?: string;
}

export interface Domain {
  slug: string;
  name: string;
  markersInRange: number;
  markersTotal: number;
  status: 'optimal' | 'watch' | 'elevated' | 'not_tested';
  description?: string;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface Overview {
  patientName: string;
  testId: string;
  reportDate: string;
  collectedDate: string;
  scorePercent: number;
  inRange: number;
  total: number;
  statusCounts: { optimal: number; needsAttention: number; outOfRange: number; notTested: number };
  domains: Domain[];
  furthestFromOptimal: Marker[];
}
