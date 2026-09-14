import { MarkerStatus } from './types';

export const STATUS_LABEL: Record<MarkerStatus, string> = {
  optimal: 'Optimal',
  needs_attention: 'Needs attention',
  out_of_range: 'Out of range',
  not_tested: 'Not tested',
};

export const STATUS_CLASSES: Record<MarkerStatus, { dot: string; text: string; bg: string }> = {
  optimal: { dot: 'bg-status-optimal', text: 'text-status-optimal', bg: 'bg-status-optimalBg' },
  needs_attention: { dot: 'bg-status-watch', text: 'text-status-watch', bg: 'bg-status-watchBg' },
  out_of_range: { dot: 'bg-status-elevated', text: 'text-status-elevated', bg: 'bg-status-elevatedBg' },
  not_tested: { dot: 'bg-status-neutral', text: 'text-status-neutral', bg: 'bg-status-neutralBg' },
};

export const DOMAIN_STATUS_LABEL: Record<string, string> = {
  optimal: 'Optimal',
  watch: 'Watch',
  elevated: 'Elevated',
  not_tested: 'Not tested',
};

export const DOMAIN_ACCENTS: Record<string, { text: string; bg: string }> = {
  inflammation: { text: 'text-domain-inflammation', bg: 'bg-domain-inflammationBg' },
  organ: { text: 'text-domain-organ', bg: 'bg-domain-organBg' },
  hormones: { text: 'text-domain-hormones', bg: 'bg-domain-hormonesBg' },
  vitamins: { text: 'text-domain-vitamins', bg: 'bg-domain-vitaminsBg' },
  brain: { text: 'text-domain-brain', bg: 'bg-domain-brainBg' },
  microbiome: { text: 'text-domain-microbiome', bg: 'bg-domain-microbiomeBg' },
};

export function formatValue(value: number | null, unit: string | null) {
  if (value === null) return '\u2014';
  const text = Number.isInteger(value) ? value.toLocaleString() : value.toString();
  return unit ? `${text} ${unit}` : text;
}
