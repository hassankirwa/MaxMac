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

function mapTrip(t: any, dests: TermMap, acts: TermMap, types: TermMap, i: number): PackageItem {
  const destName =
    (t.destination ?? []).map((id: number) => dests[id]).filter(Boolean)[0] ?? 'East Africa';
  const exps = (t.activities ?? [])
    .map((id: number) => normExp(acts[id] ?? ''))
    .filter(Boolean);
  const tripTypes = (t.trip_types ?? [])
    .map((id: number) => types[id] ?? '')
    .filter(Boolean);
  const chips = [...new Set<string>(exps)].slice(0, 3);
  const tag = decode(t.sf_tag || exps[0] || 'Popular');

  return {
    slug: t.slug,
    wpId: t.id,
    name: decode(t?.title?.rendered ?? t?.title ?? ''),
    region: destName,
    dest: destName,
    tag,
    days: Number(t?.duration?.period ?? 0) || 0,
    priceN: Math.round(Number(t.sf_from_price ?? 0)),
    currency: (t.sf_currency as string) || 'USD',
    rating: Number(t.sf_rating ?? 0) || 4.8,
    gradient: GRADIENTS[destName] ?? FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length],
    image: (t.sf_image as string) || '',
    imageCard: (t.sf_image_card as string) || (t.sf_image as string) || '',
    imageAlt: (t.sf_image_alt as string) || '',
    blurb: decode(t?.excerpt?.rendered ?? ''),
    exps,
    tripTypes,
    chips: chips.length ? chips : [tag],
    highlights: Array.isArray(t.highlights) ? t.highlights.map(decode) : [],
    itinerary: Array.isArray(t.itineraries)
      ? t.itineraries.map((it: any) => ({ title: decode(it.title ?? ''), desc: decode(it.content ?? '') }))
      : [],
    includes: Array.isArray(t.cost_includes) ? t.cost_includes.map(decode) : [],
    excludes: Array.isArray(t.cost_excludes) ? t.cost_excludes.map(decode) : [],
  };
}

export interface TravelerCategoryOption {
  id: number;
  label: string;
  price: number;
  salePrice: number | null;
  hasSale: boolean;
}

export interface TripPackageOption {
  id: number;
  name: string;
  isPrimary: boolean;
  travelerCategories: TravelerCategoryOption[];
}

/** Fetch a trip's real packages + traveler-category pricing, for the live quote widget. Returns [] on failure. */
export async function getTripPackages(tripId: number): Promise<TripPackageOption[]> {
  try {
    const raw = await fetchJSON(`/wp-json/wptravelengine/v2/trips/${tripId}/packages`);
    if (!Array.isArray(raw)) return [];
    return raw.map((p: any) => ({
      id: p.id,
      name: decode(p.name ?? ''),
      isPrimary: Boolean(p.is_primary),
      travelerCategories: (p.traveler_categories ?? []).map((c: any) => ({
        id: c.id,
        label: decode(c.label ?? ''),
        price: Number(c.price ?? 0),
        salePrice: c.sale_price ? Number(c.sale_price) : null,
        hasSale: Boolean(c.has_sale),
      })),
    }));
  } catch (e) {
    console.warn('[wte] getTripPackages failed:', (e as Error).message);
    return [];
  }
}

export interface TaxonomyTerm {
  name: string;
  slug: string;
  /** Number of published trips tagged with this term. */
  count: number;
  /** Parent term ID (0 = top-level). Lets a landing page group children under parents. */
  parent: number;
}

/** Backwards-compatible alias — the experiences page imports this shape. */
export type Experience = TaxonomyTerm;

/**
 * Fetch a WTE taxonomy's terms (with live trip counts) for a landing page. `normalize` lets the
 * activities taxonomy match the frontend's expOptions casing. Returns [] on failure so callers
 * can fall back to static data.
 */
async function fetchTaxonomyTerms(
  taxonomy: string,
  normalize?: (s: string) => string
): Promise<TaxonomyTerm[]> {
  const terms = await fetchJSON(`/wp-json/wp/v2/${taxonomy}?per_page=100&_fields=id,name,slug,count,parent`);
  if (!Array.isArray(terms)) return [];
  return terms
    .map((t: any) => {
      const raw = decode(t.name ?? '');
      return {
        name: normalize ? normalize(raw) : raw,
        slug: String(t.slug ?? ''),
        count: Number(t.count ?? 0),
        parent: Number(t.parent ?? 0),
      };
    })
    .filter((x: TaxonomyTerm) => x.name);
}

const byCountThenName = (a: TaxonomyTerm, b: TaxonomyTerm) =>
  b.count - a.count || a.name.localeCompare(b.name);

/**
 * WTE "activities" taxonomy — surfaced as "experiences". Names normalized to expOptions casing so
 * /packages?exp= filtering lines up. Only terms with at least one trip are returned.
 */
export async function getExperiences(): Promise<Experience[]> {
  try {
    return (await fetchTaxonomyTerms('activities', normExp))
      .filter((e) => e.count > 0)
      .sort(byCountThenName);
  } catch (e) {
    console.warn('[wte] getExperiences failed, using static fallback:', (e as Error).message);
    return [];
  }
}

/** WTE "destination" taxonomy. Returns all regions (even 0-trip ones — they're intended categories). */
export async function getDestinations(): Promise<TaxonomyTerm[]> {
  try {
    return (await fetchTaxonomyTerms('destination')).sort(byCountThenName);
  } catch (e) {
    console.warn('[wte] getDestinations failed, using static fallback:', (e as Error).message);
    return [];
  }
}

/** WTE "trip_types" taxonomy. Empty until terms are created + assigned to trips in wp-admin. */
export async function getTripTypes(): Promise<TaxonomyTerm[]> {
  try {
    return (await fetchTaxonomyTerms('trip_types')).sort(byCountThenName);
  } catch (e) {
    console.warn('[wte] getTripTypes failed:', (e as Error).message);
    return [];
  }
}

/** Fetch and map all published trips. Returns [] on any failure so callers can fall back to static data. */
export async function getTrips(): Promise<PackageItem[]> {
  try {
    const [trips, dests, acts, types] = await Promise.all([
      fetchJSON('/wp-json/wptravelengine/v2/trips?per_page=100'),
      termMap('destination'),
      termMap('activities'),
      termMap('trip_types'),
    ]);
    if (!Array.isArray(trips)) return [];
    return trips.map((t, i) => mapTrip(t, dests, acts, types, i));
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
