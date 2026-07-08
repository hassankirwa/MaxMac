import { wpBase } from './wte';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  phone?: string;
  subject?: string;
  /** Honeypot — must stay empty; a real user never fills this hidden field. */
  company?: string;
}

export class ContactError extends Error {}

/** POST an enquiry to the WP `safariflow/v1/contact` endpoint. Throws ContactError on failure. */
export async function submitContact(payload: ContactPayload): Promise<void> {
  const res = await fetch(`${wpBase}/wp-json/safariflow/v1/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.code) {
    throw new ContactError(data.message ?? 'Could not send your message. Please try again.');
  }
}
