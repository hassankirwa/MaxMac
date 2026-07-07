/**
 * ISO 3166-1 alpha-2 country code → ISO 4217 currency code.
 *
 * Used to turn a detected visitor country (Cloudflare `CF-IPCountry`, or a browser locale
 * region) into a display currency. Not every currency here will have an FX rate available;
 * `currency.ts` falls back to USD (then base) when a rate is missing, so partial coverage or
 * pegged/volatile currencies degrade gracefully rather than breaking the price.
 */
export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // East / Southern Africa (core market)
  KE: 'KES', TZ: 'TZS', UG: 'UGX', RW: 'RWF', ET: 'ETB', ZA: 'ZAR', ZM: 'ZMW',
  ZW: 'ZWL', BW: 'BWP', NA: 'NAD', MZ: 'MZN', MW: 'MWK', MU: 'MUR', SC: 'SCR',
  // West / Central / North Africa
  NG: 'NGN', GH: 'GHS', EG: 'EGP', MA: 'MAD', DZ: 'DZD', TN: 'TND', CI: 'XOF',
  SN: 'XOF', CM: 'XAF', AO: 'AOA',
  // Eurozone
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR', AT: 'EUR',
  IE: 'EUR', PT: 'EUR', FI: 'EUR', GR: 'EUR', LU: 'EUR', SK: 'EUR', SI: 'EUR',
  EE: 'EUR', LV: 'EUR', LT: 'EUR', CY: 'EUR', MT: 'EUR', HR: 'EUR',
  // Rest of Europe
  GB: 'GBP', CH: 'CHF', NO: 'NOK', SE: 'SEK', DK: 'DKK', PL: 'PLN', CZ: 'CZK',
  HU: 'HUF', RO: 'RON', BG: 'BGN', IS: 'ISK', UA: 'UAH', RU: 'RUB', TR: 'TRY',
  // Americas
  US: 'USD', CA: 'CAD', MX: 'MXN', BR: 'BRL', AR: 'ARS', CL: 'CLP', CO: 'COP',
  PE: 'PEN', UY: 'UYU',
  // Middle East
  AE: 'AED', SA: 'SAR', QA: 'QAR', KW: 'KWD', BH: 'BHD', OM: 'OMR', IL: 'ILS',
  JO: 'JOD', LB: 'LBP',
  // Asia-Pacific
  IN: 'INR', CN: 'CNY', JP: 'JPY', KR: 'KRW', HK: 'HKD', SG: 'SGD', MY: 'MYR',
  TH: 'THB', ID: 'IDR', PH: 'PHP', VN: 'VND', PK: 'PKR', BD: 'BDT', LK: 'LKR',
  AU: 'AUD', NZ: 'NZD',
};
