/**
 * Cloudflare Pages Function: GET /api/geo
 *
 * Returns the visitor's country (from Cloudflare's edge geolocation) and mapped currency.
 * Works alongside the statically-built Astro site — no adapter needed. Does NOT run under
 * `astro dev`; the client falls back to a browser-locale guess there (see currency.ts).
 */

// Kept in sync with src/lib/country-currency.ts. Duplicated because Pages Functions bundle
// separately from the Astro app and can't import from src/.
const COUNTRY_TO_CURRENCY = {
  KE: 'KES', TZ: 'TZS', UG: 'UGX', RW: 'RWF', ET: 'ETB', ZA: 'ZAR', ZM: 'ZMW',
  ZW: 'ZWL', BW: 'BWP', NA: 'NAD', MZ: 'MZN', MW: 'MWK', MU: 'MUR', SC: 'SCR',
  NG: 'NGN', GH: 'GHS', EG: 'EGP', MA: 'MAD', DZ: 'DZD', TN: 'TND', CI: 'XOF',
  SN: 'XOF', CM: 'XAF', AO: 'AOA',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR', AT: 'EUR',
  IE: 'EUR', PT: 'EUR', FI: 'EUR', GR: 'EUR', LU: 'EUR', SK: 'EUR', SI: 'EUR',
  EE: 'EUR', LV: 'EUR', LT: 'EUR', CY: 'EUR', MT: 'EUR', HR: 'EUR',
  GB: 'GBP', CH: 'CHF', NO: 'NOK', SE: 'SEK', DK: 'DKK', PL: 'PLN', CZ: 'CZK',
  HU: 'HUF', RO: 'RON', BG: 'BGN', IS: 'ISK', UA: 'UAH', RU: 'RUB', TR: 'TRY',
  US: 'USD', CA: 'CAD', MX: 'MXN', BR: 'BRL', AR: 'ARS', CL: 'CLP', CO: 'COP',
  PE: 'PEN', UY: 'UYU',
  AE: 'AED', SA: 'SAR', QA: 'QAR', KW: 'KWD', BH: 'BHD', OM: 'OMR', IL: 'ILS',
  JO: 'JOD', LB: 'LBP',
  IN: 'INR', CN: 'CNY', JP: 'JPY', KR: 'KRW', HK: 'HKD', SG: 'SGD', MY: 'MYR',
  TH: 'THB', ID: 'IDR', PH: 'PHP', VN: 'VND', PK: 'PKR', BD: 'BDT', LK: 'LKR',
  AU: 'AUD', NZ: 'NZD',
};

export function onRequestGet({ request }) {
  const country =
    request.cf?.country || request.headers.get('CF-IPCountry') || null;
  const currency = country ? COUNTRY_TO_CURRENCY[country] ?? null : null;

  return new Response(JSON.stringify({ country, currency }), {
    headers: {
      'Content-Type': 'application/json',
      // Per-visitor result; let the browser cache briefly but never a shared cache.
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
