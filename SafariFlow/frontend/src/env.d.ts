/// <reference types="astro/client" />

import type { CurrencyState } from './lib/currency';

declare global {
  interface Window {
    /** Current currency runtime state (set by src/lib/currency.ts). */
    __sfCurrency?: CurrencyState;
    /** Format a base-currency amount into the visitor's display currency. */
    __sfFormat?: (amountBase: number) => string;
    /** Convert a base-currency amount into the visitor's display currency. */
    __sfConvert?: (amountBase: number) => number;
    /** Trip page: repaint the booking-card total when the display currency changes. */
    __sfRepaintBooking?: () => void;
    /** Trip page: snapshot of the most recent live quote, for add-to-cart. */
    __sfLastQuote?: {
      packageId: number;
      packageName: string;
      tripDate: string;
      travelers: Array<{ categoryId: number; label: string; count: number; pricePerPerson: number }>;
      total: number;
      currency: string;
      partialPayment: { available: boolean; amount: number | null; type: string | null };
    };
  }
}

export {};
