/**
 * Client-side currency runtime (browser only).
 *
 * The site is statically built, so prices are baked into the HTML in the catalog's
 * base currency (WTE's `currency_code`, e.g. KES). This module runs in the visitor's
 * browser to:
 *   1. detect their currency (Cloudflare `CF-IPCountry` via /api/geo, with a locale guess
 *      fallback so it still works in `astro dev` where CF functions don't run),
 *   2. load a base→currencies FX table (free, CORS-enabled open.er-api.com, cached),
 *   3. re-render every displayed price into that currency.
 *
 * IMPORTANT: this only affects DISPLAY. Cart amounts and the checkout payload stay in the
 * base currency — Paystack still settles in the base currency (KES). Converted prices are
 * indicative; the checkout UI must say so (see [data-sf-currency-note]).
 *
 * State lives on `window.__sfCurrency` (not module scope) so every bundled <script> on the
 * page shares one source of truth. `window.__sfFormat` / `window.__sfConvert` are exposed so
 * inline `define:vars` scripts (which cannot import) can convert too.
 */
import { COUNTRY_TO_CURRENCY } from './country-currency';

export interface CurrencyState {
  /** Catalog/base currency prices are stored in (e.g. 'KES'). */
  base: string;
  /** Currency currently shown to the visitor. */
  display: string;
  /** Multiplier: amount_in_display = amount_in_base * rate. */
  rate: number;
  /** True once detection + rate load finished (success or graceful fallback). */
  ready: boolean;
}

export const CURRENCY_EVENT = 'sf-currency-changed';

const STATE_KEY = '__sfCurrency';
const OVERRIDE_KEY = 'sf_currency_override';   // manual switcher choice ('' = auto)
const BASE_KEY = 'sf_base_currency';           // last-known catalog base, for price-less pages
const RATES_PREFIX = 'sf_rates_';              // cached FX table per base
const RATE_TTL = 12 * 60 * 60 * 1000;          // 12h — safari prices don't need intraday FX

/** Common currencies offered in the manual switcher, regardless of detected location. */
const SWITCHER_CURRENCIES = ['USD', 'EUR', 'GBP', 'KES', 'ZAR', 'AUD', 'CAD', 'AED', 'INR'];

const win = () => window as unknown as {
  [STATE_KEY]?: CurrencyState;
  __sfFormat?: (amountBase: number) => string;
  __sfConvert?: (amountBase: number) => number;
};

function defaultState(base: string): CurrencyState {
  return { base, display: base, rate: 1, ready: false };
}

export function getState(): CurrencyState {
  return win()[STATE_KEY] ?? defaultState(readStoredBase());
}

function setState(next: CurrencyState): void {
  win()[STATE_KEY] = next;
  win().__sfFormat = (amountBase: number) => formatCurrency(amountBase * next.rate, next.display);
  win().__sfConvert = (amountBase: number) => amountBase * next.rate;
  window.dispatchEvent(new CustomEvent<CurrencyState>(CURRENCY_EVENT, { detail: next }));
}

/** Plain Intl formatter with a graceful fallback for unknown currency codes. */
export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}

/** Convert a base-currency amount into the current display currency. */
export function convert(amountBase: number): number {
  return amountBase * getState().rate;
}

/** Convert + format a base-currency amount into the current display currency. */
export function format(amountBase: number): string {
  const s = getState();
  return formatCurrency(amountBase * s.rate, s.display);
}

// ---------------------------------------------------------------------------
// Detection
// ---------------------------------------------------------------------------

function readStoredBase(): string {
  try {
    return localStorage.getItem(BASE_KEY) || 'USD';
  } catch {
    return 'USD';
  }
}

function readOverride(): string {
  try {
    return localStorage.getItem(OVERRIDE_KEY) || '';
  } catch {
    return '';
  }
}

/** Best-effort currency guess from the browser locale — used when /api/geo is unavailable. */
function guessFromLocale(): string | null {
  try {
    const langs = [navigator.language, ...(navigator.languages || [])];
    for (const tag of langs) {
      const region = tag?.split('-')[1]?.toUpperCase();
      if (region && COUNTRY_TO_CURRENCY[region]) return COUNTRY_TO_CURRENCY[region];
    }
  } catch {
    // ignore
  }
  return null;
}

/** Ask the Cloudflare Pages Function for the visitor's country → currency. */
async function detectFromEdge(): Promise<string | null> {
  try {
    const res = await fetch('/api/geo', { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = (await res.json()) as { currency?: string; country?: string };
    if (data.currency) return data.currency;
    if (data.country && COUNTRY_TO_CURRENCY[data.country]) return COUNTRY_TO_CURRENCY[data.country];
  } catch {
    // ignore — CF functions don't run under `astro dev`, and network can fail.
  }
  return null;
}

// ---------------------------------------------------------------------------
// FX rates
// ---------------------------------------------------------------------------

async function loadRates(base: string): Promise<Record<string, number>> {
  const cacheKey = RATES_PREFIX + base;
  try {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      const cached = JSON.parse(raw) as { at: number; rates: Record<string, number> };
      if (Date.now() - cached.at < RATE_TTL && cached.rates) return cached.rates;
    }
  } catch {
    // fall through to network
  }

  const res = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`);
  if (!res.ok) throw new Error(`rates ${base} -> ${res.status}`);
  const data = (await res.json()) as { result?: string; rates?: Record<string, number> };
  if (data.result !== 'success' || !data.rates) throw new Error('rates payload invalid');

  try {
    localStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), rates: data.rates }));
  } catch {
    // caching is a nice-to-have
  }
  return data.rates;
}

/**
 * Resolve the rate for `display` given the base FX table, honouring the fallback chain:
 * requested display → USD → base. Returns the currency actually usable + its rate.
 */
function resolveRate(
  base: string,
  requested: string,
  rates: Record<string, number>
): { display: string; rate: number } {
  if (requested === base) return { display: base, rate: 1 };
  if (rates[requested]) return { display: requested, rate: rates[requested] };
  if (rates.USD) return { display: 'USD', rate: rates.USD };
  return { display: base, rate: 1 };
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

/** Discover the catalog base currency from the page (first tagged price) or storage. */
function discoverBase(): string {
  const el = document.querySelector<HTMLElement>('[data-sf-currency]');
  const fromPage = el?.dataset.sfCurrency;
  if (fromPage) {
    try {
      localStorage.setItem(BASE_KEY, fromPage);
    } catch {
      // ignore
    }
    return fromPage;
  }
  return readStoredBase();
}

/**
 * Detect currency, load the rate, publish state, and paint the page. Safe to call once per
 * page load; re-runs on Astro view transitions are cheap (cached rate).
 */
export async function initCurrency(): Promise<void> {
  const base = discoverBase();
  const override = readOverride();

  // Seed non-converting state immediately so first paint has a valid (base) value.
  if (!win()[STATE_KEY]) setState(defaultState(base));

  let requested = override || (await detectFromEdge()) || guessFromLocale() || base;

  if (requested === base) {
    setState({ base, display: base, rate: 1, ready: true });
  } else {
    try {
      const rates = await loadRates(base);
      const { display, rate } = resolveRate(base, requested, rates);
      setState({ base, display, rate, ready: true });
    } catch {
      setState({ base, display: base, rate: 1, ready: true }); // FX down → show base
    }
  }

  applyAll();
}

/** Manual switcher choice. Pass '' (or 'auto') to clear the override and re-detect. */
export async function setCurrency(code: string): Promise<void> {
  const state = getState();
  const base = state.base;
  try {
    if (!code || code === 'auto') localStorage.removeItem(OVERRIDE_KEY);
    else localStorage.setItem(OVERRIDE_KEY, code);
  } catch {
    // ignore
  }

  if (!code || code === 'auto') {
    await initCurrency();
    return;
  }
  if (code === base) {
    setState({ base, display: base, rate: 1, ready: true });
    applyAll();
    return;
  }
  try {
    const rates = await loadRates(base);
    const { display, rate } = resolveRate(base, code, rates);
    setState({ base, display, rate, ready: true });
  } catch {
    setState({ base, display: base, rate: 1, ready: true });
  }
  applyAll();
}

// ---------------------------------------------------------------------------
// DOM application
// ---------------------------------------------------------------------------

/** Rewrite every server-rendered `[data-sf-amount]` price into the display currency. */
export function applyPrices(root: ParentNode = document): void {
  const s = getState();
  root.querySelectorAll<HTMLElement>('[data-sf-amount]').forEach((el) => {
    const amount = Number(el.dataset.sfAmount);
    if (!Number.isFinite(amount)) return;
    const suffix = el.dataset.sfSuffix ?? '';
    el.textContent = formatCurrency(amount * s.rate, s.display) + suffix;
  });
}

/** Reveal/fill the "indicative price, charged in base" disclaimer where present. */
export function applyNotes(root: ParentNode = document): void {
  const s = getState();
  const converting = s.display !== s.base;
  root.querySelectorAll<HTMLElement>('[data-sf-currency-note]').forEach((el) => {
    if (converting) {
      el.textContent = `Prices shown in ${s.display} are indicative — you'll be charged in ${s.base} at checkout.`;
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
}

/** Sync any manual currency <select> to the current display currency. */
export function mountSwitchers(root: ParentNode = document): void {
  const s = getState();
  const options = Array.from(new Set([s.base, ...SWITCHER_CURRENCIES, s.display]));
  root.querySelectorAll<HTMLSelectElement>('[data-currency-select]').forEach((sel) => {
    if (!sel.dataset.sfMounted) {
      sel.innerHTML = options
        .map((c) => `<option value="${c}">${c}</option>`)
        .join('');
      sel.addEventListener('change', () => void setCurrency(sel.value));
      sel.dataset.sfMounted = '1';
    }
    sel.value = s.display;
  });
}

function applyAll(root: ParentNode = document): void {
  applyPrices(root);
  applyNotes(root);
  mountSwitchers(root);
}

export { applyAll };
