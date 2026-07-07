/**
 * Client-only cart state. WP Travel Engine's own cart defaults to a single active
 * booking selection (`wp_travel_engine_allow_multiple_cart_items` defaults to false),
 * so this mirrors that: one trip/package/traveler/date selection at a time, held in
 * localStorage until checkout submits it in one shot. No WordPress calls happen here.
 */

export interface CartTraveler {
  categoryId: number;
  label: string;
  count: number;
  pricePerPerson: number;
}

export interface PartialPaymentInfo {
  available: boolean;
  amount: number | null;
  type: string | null;
}

export interface CartSelection {
  tripId: number;
  tripSlug: string;
  tripName: string;
  packageId: number;
  packageName: string;
  tripDate: string;
  travelers: CartTraveler[];
  total: number;
  currency: string;
  partialPayment: PartialPaymentInfo;
  savedAt: number;
}

const STORAGE_KEY = 'sf_cart_selection';
export const CART_EVENT = 'sf-cart-updated';

export function getCartSelection(): CartSelection | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartSelection) : null;
  } catch {
    return null;
  }
}

export function saveCartSelection(selection: CartSelection): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
  window.dispatchEvent(new CustomEvent<CartSelection>(CART_EVENT, { detail: selection }));
}

export function clearCartSelection(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent<null>(CART_EVENT, { detail: null }));
}

export function travelerCount(selection: CartSelection): number {
  return selection.travelers.reduce((sum, t) => sum + t.count, 0);
}
