import { wpBase } from './wte';
import type { CartTraveler } from './cart';

export interface CountryOption {
  value: string;
  label: string;
}

export interface TravellerDetails {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  country: string;
}

export interface EmergencyContact {
  fname: string;
  lname: string;
  phone: string;
  country: string;
  relation: string;
}

export interface BillingDetails {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface CheckoutPayload {
  tripId: number;
  packageId: number;
  travelers: Record<number, number>;
  tripDate: string;
  billing: BillingDetails;
  travellers: TravellerDetails[];
  emergency: EmergencyContact;
  paymentMode: 'full_payment' | 'partial';
}

export interface CheckoutResult {
  bookingRef: number;
  paymentKey: string;
  authorizationUrl: string;
}

export class CheckoutError extends Error {}

const COUNTRIES_CACHE_KEY = 'sf_countries_cache_v1';

/**
 * WTE's country list is effectively static — cache it in sessionStorage so repeat visits to
 * checkout (or navigating back to it) don't re-fetch 249 entries over the network every time.
 */
export async function getCountries(): Promise<CountryOption[]> {
  try {
    const cached = sessionStorage.getItem(COUNTRIES_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {
    // sessionStorage unavailable (private mode, etc.) — fall through to a network fetch.
  }

  const res = await fetch(`${wpBase}/wp-json/safariflow/v1/countries`);
  if (!res.ok) return [];
  const data = await res.json();

  try {
    sessionStorage.setItem(COUNTRIES_CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore — caching is a nice-to-have, not required for correctness.
  }

  return data;
}

export function travelersToPricingMap(travelers: CartTraveler[]): Record<number, number> {
  const map: Record<number, number> = {};
  travelers.forEach((t) => {
    map[t.categoryId] = t.count;
  });
  return map;
}

export async function submitCheckout(payload: CheckoutPayload): Promise<CheckoutResult> {
  const res = await fetch(`${wpBase}/wp-json/safariflow/v1/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || data.code) {
    throw new CheckoutError(data.message ?? 'Checkout failed. Please try again.');
  }
  return data as CheckoutResult;
}
