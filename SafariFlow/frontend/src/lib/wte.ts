/**
 * WP Travel Engine headless client (Approach A: headless catalog + WP-hosted checkout).
 *
 * Reads trips from the WP REST API and maps them into the frontend's PackageItem
 * shape so existing components render live WordPress data with no UI changes.
 * The starting price / rating / tag come from the `sf-rest-fields` mu-plugin, so
 * the whole catalog needs just three requests (trips + two taxonomies).
 */
import type { PackageItem } from '../data/packages';

const WP_URL = (import.meta.env.PUBLIC_WP_URL ?? 'http://localhost:8000').replace(/\/+$/, '');

/** Strip tags + decode the handful of HTML entities WP emits. */
function decode(input: string): string {
  return (input || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#0?38;/g, '&')
    .replace(/&#8217;|&#0?39;|&rsquo;/g, "'")
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/** Match WP activity term names to the frontend's expOptions casing. */
const EXP_NORMALIZE: Record<string, string> = {
  'Wildlife Safari': 'Wildlife safari',
  'Beach & Coast': 'Beach & coast',
};
const normExp = (s: string) => EXP_NORMALIZE[s] ?? s;

/** Thematic gradients by destination, with an index-rotating fallback. */
const GRADIENTS: Record<string, [string, string]> = {
  Tanzania: ['#c98a3c', '#7a4a1e'],
  Kenya: ['#c98a3c', '#6e4a22'],
  'Kenyan Coast': ['#3fa9c9', '#1c6f86'],
  Zanzibar: ['#4a9d7a', '#256149'],
};
const FALLBACK_GRADIENTS: [string, string][] = [
  ['#c98a3c', '#7a4a1e'],
  ['#3fa9c9', '#1c6f86'],
  ['#5b7fa6', '#2c4a63'],
  ['#4a9d7a', '#256149'],
  ['#b98a52', '#5e3d1c'],
];

type TermMap = Record<number, string>;

async function fetchJSON(path: string): Promise<any> {
  const res = await fetch(`${WP_URL}${path}`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`WP ${path} -> ${res.status}`);
  return res.json();
}

async function termMap(taxonomy: string): Promise<TermMap> {
  const terms = await fetchJSON(`/wp-json/wp/v2/${taxonomy}?per_page=100&_fields=id,name`);
  const map: TermMap = {};
  for (const t of terms) map[t.id] = decode(t.name);
  return map;
}

function mapTrip(t: any, dests: TermMap, acts: TermMap, i: number): PackageItem {
  const destName =
    (t.destination ?? []).map((id: number) => dests[id]).filter(Boolean)[0] ?? 'East Africa';
  const exps = (t.activities ?? [])
    .map((id: number) => normExp(acts[id] ?? ''))
    .filter(Boolean);
  const chips = [...new Set<string>(exps)].slice(0, 3);
  const tag = decode(t.sf_tag || exps[0] || 'Popular');

  return {
    slug: t.slug,
    name: decode(t?.title?.rendered ?? t?.title ?? ''),
    region: destName,
    dest: destName,
    tag,
    days: Number(t?.duration?.period ?? 0) || 0,
    priceN: Math.round(Number(t.sf_from_price ?? 0)),
    rating: Number(t.sf_rating ?? 0) || 4.8,
    gradient: GRADIENTS[destName] ?? FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length],
    blurb: decode(t?.excerpt?.rendered ?? ''),
    exps,
    chips: chips.length ? chips : [tag],
    highlights: Array.isArray(t.highlights) ? t.highlights.map(decode) : [],
    itinerary: Array.isArray(t.itineraries)
      ? t.itineraries.map((it: any) => ({ title: decode(it.title ?? ''), desc: decode(it.content ?? '') }))
      : [],
    includes: Array.isArray(t.cost_includes) ? t.cost_includes.map(decode) : [],
    excludes: Array.isArray(t.cost_excludes) ? t.cost_excludes.map(decode) : [],
  };
}

/** Fetch and map all published trips. Returns [] on any failure so callers can fall back to static data. */
export async function getTrips(): Promise<PackageItem[]> {
  try {
    const [trips, dests, acts] = await Promise.all([
      fetchJSON('/wp-json/wptravelengine/v2/trips?per_page=100'),
      termMap('destination'),
      termMap('activities'),
    ]);
    if (!Array.isArray(trips)) return [];
    return trips.map((t, i) => mapTrip(t, dests, acts, i));
  } catch (e) {
    console.warn('[wte] getTrips failed, using static fallback:', (e as Error).message);
    return [];
  }
}

/**
 * WP-hosted booking hand-off. The WP trip page carries the WP Travel Engine
 * booking widget → add-to-cart → checkout (where the Paystack gateway lives).
 */
export function bookUrl(slug: string): string {
  return `${WP_URL}/trip/${slug}/`;
}

export const wpBase = WP_URL;
