import { Marker, Domain, Overview, MarkerStatus } from './types';

// This mirrors the sample panel used throughout the design review
// (Shayan, BAL-7845123) — a test record, not a real patient.

export const DOMAINS: Domain[] = [
  { slug: 'inflammation', name: 'Inflammation & immunity', markersInRange: 4, markersTotal: 9, status: 'elevated',
    description: "Nine markers describing how actively your immune system is signalling, and how your body regulates that signal once it starts. Chronic low-grade elevation is the pattern most associated with accelerated biological ageing." },
  { slug: 'organ', name: 'Organ & renal stress', markersInRange: 1, markersTotal: 2, status: 'watch' },
  { slug: 'hormones', name: 'Hormones & steroids', markersInRange: 2, markersTotal: 9, status: 'elevated' },
  { slug: 'vitamins', name: 'Vitamins & nutrition', markersInRange: 1, markersTotal: 5, status: 'watch' },
  { slug: 'brain', name: 'Brain & cognition', markersInRange: 1, markersTotal: 2, status: 'elevated' },
  { slug: 'microbiome', name: 'Microbiome & gut', markersInRange: 0, markersTotal: 0, status: 'not_tested' },
];

function m(partial: Partial<Marker> & Pick<Marker, 'id' | 'name' | 'domainSlug' | 'domainName' | 'value' | 'unit' | 'referenceText' | 'status'>): Marker {
  return { referenceLow: null, referenceHigh: null, ...partial };
}

export const MARKERS: Marker[] = [
  // Inflammation & immunity
  m({ id: 'hs-crp', name: 'hs-CRP', abbreviation: 'hs-CRP', domainSlug: 'inflammation', domainName: 'Inflammation & immunity',
    value: 0.85, unit: 'mg/L', referenceHigh: 3.0, referenceText: '< 3.0 mg/L', status: 'optimal', positionInRange: 0.15,
    interpretation: 'Made by the liver and rises with inflammation. Yours sits in the lowest-risk band.',
    bands: [
      { label: 'Lower relative risk', range: '< 1.0', meaning: 'Usually linked with lower body inflammation and lower heart or metabolic risk.' },
      { label: 'Average relative risk', range: '1.0 – 3.0', meaning: 'Usually linked with average heart or metabolic risk.' },
      { label: 'Higher relative risk', range: '3.1 – 10', meaning: 'May suggest higher body inflammation and higher heart or metabolic risk.' },
    ] }),
  m({ id: 'il-6', name: 'Interleukin-6 (IL-6)', abbreviation: 'IL-6', domainSlug: 'inflammation', domainName: 'Inflammation & immunity',
    value: 5.0, unit: 'pg/mL', referenceHigh: 3.0, referenceText: '\u2264 3.0 pg/mL \u00b7 above the upper limit', status: 'out_of_range', positionInRange: 0.95,
    interpretation: 'A signalling protein that rises with immune activation. Sustained elevation is worth discussing with your physician.' }),
  m({ id: 'il-10', name: 'Interleukin-10 (IL-10)', abbreviation: 'IL-10', domainSlug: 'inflammation', domainName: 'Inflammation & immunity',
    value: 2.0, unit: 'pg/mL', referenceHigh: 2.8, referenceText: '\u2264 2.8 pg/mL \u00b7 within range', status: 'optimal', positionInRange: 0.6,
    interpretation: 'The counter-signal that limits excessive inflammatory activity.' }),
  m({ id: 'tnf-a', name: 'TNF-\u03b1', abbreviation: 'TNF-\u03b1', domainSlug: 'inflammation', domainName: 'Inflammation & immunity',
    value: 2.0, unit: 'pg/mL', referenceHigh: 10.0, referenceText: '\u2264 10.0 pg/mL \u00b7 within range', status: 'optimal', positionInRange: 0.2,
    interpretation: 'A core inflammatory messenger involved in immune activation.' }),
  m({ id: 'stnfr1', name: 'sTNFR1', abbreviation: 'sTNFR1', domainSlug: 'inflammation', domainName: 'Inflammation & immunity',
    value: 2.0, unit: 'pg/mL', referenceLow: 800, referenceHigh: 1500, referenceText: '800 \u2013 1,500 pg/mL \u00b7 well below the interval', status: 'out_of_range', positionInRange: 0.02,
    interpretation: 'Reflects long-term inflammatory burden. A value this far below the interval usually warrants a repeat draw.' }),
  m({ id: 'mcp-1', name: 'MCP-1 / CCL2', abbreviation: 'MCP-1', domainSlug: 'inflammation', domainName: 'Inflammation & immunity',
    value: 2.0, unit: 'pg/mL', referenceLow: 150, referenceHigh: 300, referenceText: '150 \u2013 300 pg/mL \u00b7 below the interval', status: 'out_of_range', positionInRange: 0.03,
    interpretation: 'Recruits immune cells to tissue. Interpreted alongside IL-6 and TNF-\u03b1 rather than on its own.' }),
  m({ id: 'gdf-15', name: 'GDF-15', abbreviation: 'GDF-15', domainSlug: 'inflammation', domainName: 'Inflammation & immunity',
    value: 22.0, unit: 'pg/mL', referenceHigh: 750, referenceText: '\u2264 750 pg/mL \u00b7 within range', status: 'optimal', positionInRange: 0.1,
    interpretation: 'A stress-response marker that tends to climb gradually with age.' }),
  m({ id: 'pai-1', name: 'PAI-1', abbreviation: 'PAI-1', domainSlug: 'inflammation', domainName: 'Inflammation & immunity',
    value: 2.0, unit: 'ng/mL', referenceLow: 4, referenceHigh: 43, referenceText: '4 \u2013 43 ng/mL \u00b7 just below the lower bound', status: 'needs_attention', positionInRange: 0.04,
    interpretation: 'Slows the breakdown of blood clots; influenced by metabolic and inflammatory signals.' }),
  m({ id: 'timp-1', name: 'TIMP-1', abbreviation: 'TIMP-1', domainSlug: 'inflammation', domainName: 'Inflammation & immunity',
    value: 2.0, unit: 'ng/mL', referenceLow: 60, referenceHigh: 150, referenceText: '60 \u2013 150 ng/mL \u00b7 below the interval', status: 'out_of_range', positionInRange: 0.02,
    interpretation: 'Reflects the balance between tissue repair and remodelling.' }),

  // Organ & renal stress
  m({ id: 'cystatin-c', name: 'Cystatin C', domainSlug: 'organ', domainName: 'Organ & renal stress',
    value: 2.0, unit: 'mg/L', referenceLow: 0.67, referenceHigh: 1.21, referenceText: '0.67 \u2013 1.21 mg/L', status: 'out_of_range', positionInRange: 0.98,
    interpretation: 'Raised. Relevant to plasma protein clearance elsewhere in this panel.' }),
  m({ id: 'b2-microglobulin', name: '\u03b22-Microglobulin', domainSlug: 'organ', domainName: 'Organ & renal stress',
    value: 2.0, unit: 'mg/L', referenceHigh: 2.4, referenceText: '\u2264 2.4 mg/L', status: 'optimal', positionInRange: 0.7 }),

  // Hormones & steroids
  m({ id: 'cortisol', name: 'Cortisol', domainSlug: 'hormones', domainName: 'Hormones & steroids',
    value: 2.0, unit: '\u00b5g/dL', referenceLow: 5, referenceHigh: 25, referenceText: '5 \u2013 25 \u00b5g/dL', status: 'out_of_range', positionInRange: 0.0 }),
  m({ id: 'total-testosterone', name: 'Total testosterone', domainSlug: 'hormones', domainName: 'Hormones & steroids',
    value: 500, unit: 'ng/dL', referenceLow: 300, referenceHigh: 1000, referenceText: '300 \u2013 1,000 ng/dL', status: 'optimal', positionInRange: 0.28 }),
  m({ id: 'free-testosterone', name: 'Free testosterone', domainSlug: 'hormones', domainName: 'Hormones & steroids',
    value: 704.6, unit: 'pmol/L', referenceLow: 175, referenceHigh: 700, referenceText: '175 \u2013 700 pmol/L \u00b7 0.7% above bound', status: 'needs_attention', positionInRange: 1.0 }),
  m({ id: 'shbg', name: 'SHBG', domainSlug: 'hormones', domainName: 'Hormones & steroids',
    value: 2.0, unit: 'nmol/L', referenceLow: 19.3, referenceHigh: 76.4, referenceText: '19.3 \u2013 76.4 nmol/L \u00b7 markedly low', status: 'out_of_range', positionInRange: 0.0 }),
  m({ id: 'dhea-s', name: 'DHEA-S', domainSlug: 'hormones', domainName: 'Hormones & steroids',
    value: 50, unit: '\u00b5g/dL', referenceLow: 28, referenceHigh: 175, referenceText: '28 \u2013 175 \u00b5g/dL', status: 'optimal', positionInRange: 0.15 }),
  m({ id: 'estradiol', name: 'Estradiol (E2)', domainSlug: 'hormones', domainName: 'Hormones & steroids',
    value: 200.0, unit: 'pg/mL', referenceHigh: 35, referenceText: '\u2264 35 pg/mL for males \u00b7 markedly above', status: 'out_of_range', positionInRange: 1.0,
    companionNote: 'SHBG is low, which can raise how much of this reads as biologically active.' }),
  m({ id: 'androstenedione', name: 'Androstenedione', domainSlug: 'hormones', domainName: 'Hormones & steroids',
    value: 200, unit: 'ng/dL', referenceLow: 27, referenceHigh: 152, referenceText: '27 \u2013 152 ng/dL', status: 'out_of_range', positionInRange: 1.0 }),
  m({ id: 'dht', name: 'DHT', domainSlug: 'hormones', domainName: 'Hormones & steroids',
    value: 2000, unit: 'pg/mL', referenceLow: 120, referenceHigh: 650, referenceText: '120 \u2013 650 pg/mL \u00b7 \u2248 3.1\u00d7 upper bound', status: 'out_of_range', positionInRange: 1.0 }),
  m({ id: 'progesterone', name: 'Progesterone', domainSlug: 'hormones', domainName: 'Hormones & steroids',
    value: 2.0, unit: 'ng/mL', referenceHigh: 1.0, referenceText: '< 1.0 ng/mL', status: 'out_of_range', positionInRange: 1.0 }),

  // Vitamins & nutritional status
  m({ id: 'vitamin-d', name: 'Vitamin D, 25-OH', abbreviation: 'Vit D', domainSlug: 'vitamins', domainName: 'Vitamins & nutrition',
    value: 20.0, unit: 'ng/mL', referenceLow: 20, referenceHigh: 50, referenceText: '20 \u2013 50 ng/mL \u00b7 sitting on the lower bound', status: 'needs_attention', positionInRange: 0.0,
    interpretation: 'You sit exactly on the lower bound, up from 12 ng/mL a year ago.' }),
  m({ id: 'retinol', name: 'Retinol (Vitamin A)', domainSlug: 'vitamins', domainName: 'Vitamins & nutrition',
    value: 0.2, unit: '\u00b5g/dL', referenceLow: 32.5, referenceHigh: 78, referenceText: '32.5 \u2013 78 \u00b5g/dL \u00b7 profoundly low', status: 'out_of_range', positionInRange: 0.0 }),
  m({ id: 'alpha-tocopherol', name: 'Alpha-tocopherol (Vitamin E)', domainSlug: 'vitamins', domainName: 'Vitamins & nutrition',
    value: 2.0, unit: 'mg/L', referenceLow: 5.5, referenceHigh: 17.0, referenceText: '5.5 \u2013 17.0 mg/L', status: 'out_of_range', positionInRange: 0.0 }),
  m({ id: 'gamma-tocopherol', name: 'Gamma-tocopherol (Vitamin E)', domainSlug: 'vitamins', domainName: 'Vitamins & nutrition',
    value: 0.5, unit: 'mg/L', referenceLow: 0.5, referenceHigh: 5.5, referenceText: '0.5 \u2013 5.5 mg/L \u00b7 at bound', status: 'needs_attention', positionInRange: 0.0 }),
  m({ id: 'vitamin-k1', name: 'Vitamin K1 (phylloquinone)', domainSlug: 'vitamins', domainName: 'Vitamins & nutrition',
    value: 2.0, unit: 'ng/mL', referenceLow: 0.1, referenceHigh: 2.2, referenceText: '0.1 \u2013 2.2 ng/mL', status: 'optimal', positionInRange: 0.9 }),

  // Brain & cognition
  m({ id: 'p-tau217', name: 'p-Tau217', domainSlug: 'brain', domainName: 'Brain & cognition',
    value: 2.000, unit: 'pg/mL', referenceHigh: 0.185, referenceText: '\u2264 0.185 pg/mL \u00b7 \u2248 10.8\u00d7 upper bound', status: 'out_of_range', positionInRange: 1.0,
    interpretation: 'Phosphorylated tau 217 is a protein fragment that can be measured in blood. Research associates higher levels with the biological changes seen in Alzheimer\u2019s disease, which is why it is used as a screening signal rather than a conclusion. A raised value indicates that further assessment is reasonable. It does not establish that those changes are present, and it says nothing about whether or when symptoms would appear.',
    companionNote: 'Kidney function affects the clearance of several plasma proteins. Your Cystatin C is also outside its interval, which your clinician will want to weigh. Your A\u03b242/A\u03b240 ratio, the companion marker in this domain, is within its interval. The two are read together.' }),
  m({ id: 'abeta-ratio', name: 'A\u03b242/A\u03b240 ratio', domainSlug: 'brain', domainName: 'Brain & cognition',
    value: 0.06, unit: '', referenceLow: 0.04, referenceHigh: 0.08, referenceText: 'within its interval', status: 'optimal', positionInRange: 0.5,
    interpretation: 'The companion marker to p-Tau217 in this domain \u2014 the two are read together.' }),
];

export const OVERVIEW: Overview = {
  patientName: 'Shayan',
  testId: 'BAL-7845123',
  reportDate: '31 Mar 2026',
  collectedDate: '9 Feb 2026',
  scorePercent: 46,
  inRange: 13,
  total: 28,
  statusCounts: { optimal: 9, needsAttention: 4, outOfRange: 14, notTested: 1 },
  domains: DOMAINS,
  furthestFromOptimal: [
    MARKERS.find((m) => m.id === 'il-6')!,
    MARKERS.find((m) => m.id === 'estradiol')!,
    MARKERS.find((m) => m.id === 'vitamin-d')!,
  ],
};

export function getDomain(slug: string) {
  return DOMAINS.find((d) => d.slug === slug);
}

export function getDomainMarkers(slug: string) {
  return MARKERS.filter((m) => m.domainSlug === slug);
}

export function getMarker(id: string) {
  return MARKERS.find((m) => m.id === id);
}

export const TRENDS: Record<string, { date: string; value: number }[]> = {
  'vitamin-d': [
    { date: 'Feb 2025', value: 12.0 },
    { date: 'Aug 2025', value: 16.5 },
    { date: 'Feb 2026', value: 20.0 },
  ],
  'hs-crp': [
    { date: 'Feb 2025', value: 1.9 },
    { date: 'Aug 2025', value: 1.3 },
    { date: 'Feb 2026', value: 0.85 },
  ],
  'il-6': [
    { date: 'Feb 2025', value: 2.8 },
    { date: 'Aug 2025', value: 3.9 },
    { date: 'Feb 2026', value: 5.0 },
  ],
};

export const TREND_SUMMARY = {
  improved: 6,
  worsened: 3,
  inRangeNow: 13,
  inRangePrevious: 9,
  improving: [
    { name: 'Vitamin D, 25-OH', from: 16.5, to: 20.0, change: '+21%' },
    { name: 'hs-CRP', from: 1.9, to: 0.85, change: '\u221255%' },
    { name: 'GDF-15', from: 64.0, to: 22.0, change: '\u221266%' },
    { name: 'TNF-\u03b1', from: 3.4, to: 2.0, change: '\u221241%' },
  ],
  worsening: [
    { name: 'Interleukin-6', from: 2.8, to: 5.0, change: '+79%' },
    { name: 'Cystatin C', from: 1.32, to: 2.0, change: '+52%' },
    { name: 'p-Tau217', from: 0.91, to: 2.0, change: '+120%' },
  ],
};
