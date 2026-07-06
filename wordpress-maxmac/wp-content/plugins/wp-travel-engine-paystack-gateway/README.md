# WP Travel Engine — Paystack Gateway (Custom)

Adds **Paystack** as a payment gateway for WP Travel Engine's WP-hosted checkout
(cards, bank transfer, USSD, mobile money). Built for a headless setup where an
Astro storefront hands off to the WordPress checkout.

## How it works

Server-side, single base URL (`https://api.paystack.co`) — **mode is decided by the
secret key prefix**, not a sandbox toggle:

1. **Initialize** — `process_payment()` POSTs to `/transaction/initialize`
   (`amount` in the currency subunit ×100, Bearer secret-key auth), then
   `wp_redirect()`s the buyer to `data.authorization_url`.
2. **Return** — Paystack redirects back to a `callback_url` carrying
   `payment_key` + `callback_type=paystack`. WP Travel Engine's
   `BookingProcess::process_gateway_callback()` dispatches
   `handle_paystack_request()`.
3. **Verify** — that method GETs `/transaction/verify/{reference}` and finalizes
   the booking **only** when `data.status === 'success'** (never trusts the
   redirect alone), via `Booking::sync_payment_success_metas()`.

Registration is via the `wptravelengine_registering_payment_gateways` filter;
the class extends `WPTravelEngine\PaymentGateways\BaseGateway`.

## Setup

1. **Bookings → Paystack Gateway** in wp-admin.
2. Paste your **Public Key** (`pk_test_…`) and **Secret Key** (`sk_test_…`) from
   `dashboard.paystack.com` → **Settings → API Keys & Webhooks** (Test Mode).
   Test keys work immediately — no business activation needed.
3. Tick **Enable Paystack**, Save. Mode auto-detects: `sk_test_` = test,
   `sk_live_` = live.
4. Set the store currency to a Paystack-supported one: **NGN, GHS, ZAR, KES, USD**.

## Test card

`4084 0840 8408 4081` · any future expiry · CVV `408` · PIN `0000` · OTP `123456`.

## Notes / limitations

- **Webhooks won't fire on `localhost`** (Paystack can't reach your machine). The
  redirect + server-side verify path still works because the verify call is
  outbound. Add webhook signature verification (`x-paystack-signature`,
  HMAC-SHA512 of the raw body with your secret) once the site is on a public URL.
- `reference` uses the WTE payment key. If you need to re-attempt a failed
  payment against a brand-new Paystack reference, extend `process_payment()` to
  append a unique suffix and store it (already read back on verify via
  `paystack_reference`).
- No license/updater — this is a custom in-house addon, not a wptravelengine.com
  product.
