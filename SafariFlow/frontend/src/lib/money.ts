/**
 * Format an amount in its actual currency (WTE's configured currency_code) — never assume USD.
 *
 * In the browser, once the currency runtime (currency.ts) is ready, an amount given in the
 * catalog's BASE currency is converted to the visitor's display currency automatically. This
 * makes every client-side render path (cart, checkout, header) localize without extra wiring;
 * they just need to re-render on the `sf-currency-changed` event. On the server (build time)
 * and before the runtime is ready, the amount is formatted as-is in the given currency.
 */
export function formatMoney(amount: number, currency: string = 'USD'): string {
  if (typeof window !== 'undefined') {
    const w = window as unknown as {
      __sfCurrency?: { base: string; ready: boolean };
      __sfFormat?: (amountBase: number) => string;
    };
    // Only convert amounts that are actually in the base currency the runtime knows about.
    if (w.__sfCurrency?.ready && w.__sfFormat && w.__sfCurrency.base === currency) {
      return w.__sfFormat(amount);
    }
  }
  return formatCurrency(amount, currency);
}

/** Plain currency formatting with no conversion, with a fallback for unknown codes. */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
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
