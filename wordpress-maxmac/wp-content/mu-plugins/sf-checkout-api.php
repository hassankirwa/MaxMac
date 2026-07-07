<?php
/**
 * Plugin Name: SafariFlow Checkout API
 * Description: Headless quote/checkout bridge between the Astro frontend and WP Travel Engine (WTE).
 *              Reuses WTE's real cart/booking/payment classes directly (never edits the wp-travel-engine
 *              or wp-travel-engine-paystack-gateway plugin files) so bookings/payments created here are
 *              indistinguishable from ones created through WTE's own checkout page.
 *
 * Must-use plugin — loads automatically, no activation.
 */

defined( 'ABSPATH' ) || exit;

const SF_CHECKOUT_NAMESPACE      = 'safariflow/v1';
const SF_CHECKOUT_ALLOWED_ORIGIN = 'http://localhost:4321';
const SF_CHECKOUT_REDIRECT_SLUG  = 'booking-redirect';

/**
 * Return leg: WTE's own booking-completion flow (BookingProcess::maybe_redirect() ->
 * wptravelengine_redirect_to_thank_you_page(), and the Paystack gateway's
 * handle_paystack_request() after a real payment) both redirect to whatever WP Page is
 * configured as the "Thank You" page in WTE Settings → Pages, with ?payment_key=... appended.
 * That setting now points at a dedicated "Booking Redirect" page (see NOTES — created once via
 * wp-admin, slug `booking-redirect`); this hook bounces it straight to the Astro confirmation
 * page instead of ever rendering that WP page.
 */
add_action(
	'template_redirect',
	function () {
		if ( ! is_page( SF_CHECKOUT_REDIRECT_SLUG ) || empty( $_GET['payment_key'] ) ) {
			return;
		}

		$key = sanitize_text_field( wp_unslash( $_GET['payment_key'] ) );
		wp_redirect( SF_CHECKOUT_ALLOWED_ORIGIN . '/booking-confirmation?payment_key=' . rawurlencode( $key ) );
		exit;
	}
);

/**
 * CORS: only for our own namespace, only the exact allowlisted Astro origin, no credentials
 * (quote/checkout/status are stateless JSON in/out — no cookies needed).
 *
 * WordPress core registers its own broad `rest_send_cors_headers` (reflects back whatever
 * Origin was sent, plus `Access-Control-Allow-Credentials: true`) via `rest_api_init` at the
 * default priority. Rather than race that registration with remove_filter(), we run our own
 * filter at a late priority so it fires after core's and overwrites its headers — header()
 * replaces a same-named header by default — for our namespace only. All other REST routes are
 * left exactly as core configures them.
 */
add_filter(
	'rest_pre_serve_request',
	function ( $served, $result, $request ) {
		if ( str_starts_with( $request->get_route(), '/' . SF_CHECKOUT_NAMESPACE . '/' ) ) {
			header( 'Access-Control-Allow-Origin: ' . SF_CHECKOUT_ALLOWED_ORIGIN );
			header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
			header( 'Access-Control-Allow-Headers: Content-Type' );
			header( 'Access-Control-Allow-Credentials: false' );
		}

		return $served;
	},
	999,
	3
);

add_action(
	'rest_api_init',
	function () {
		// Short-circuit CORS preflight for our namespace before route dispatch even runs.
		if ( 'OPTIONS' === ( $_SERVER['REQUEST_METHOD'] ?? '' )
			&& str_starts_with( $_SERVER['REQUEST_URI'] ?? '', '/wp-json/' . SF_CHECKOUT_NAMESPACE . '/' ) ) {
			header( 'Access-Control-Allow-Origin: ' . SF_CHECKOUT_ALLOWED_ORIGIN );
			header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
			header( 'Access-Control-Allow-Headers: Content-Type' );
			header( 'Access-Control-Allow-Credentials: false' );
			status_header( 204 );
			exit;
		}
	},
	0
);

/**
 * Build an in-memory WP_REST_Request from a JSON payload — no $_POST/$_REQUEST involved.
 */
function sf_checkout_request_from_json( array $data ): WP_REST_Request {
	$request = new WP_REST_Request( 'POST' );
	$request->set_header( 'Content-Type', 'application/json' );
	$request->set_body( wp_json_encode( $data ) );

	return $request;
}

/**
 * Compute a priced quote for a trip/package/traveler selection without persisting anything.
 * Reuses WTE's real, server-side pricing path (Item::from_request() -> TripPackage traveler
 * categories) — never trusts a client-submitted cost.
 */
function sf_checkout_handle_quote( WP_REST_Request $request ) {
	$body = $request->get_json_params();
	if ( empty( $body['tripId'] ) || empty( $body['packageId'] ) ) {
		return new WP_Error( 'invalid_request', __( 'tripId and packageId are required.', 'safariflow' ), array( 'status' => 400 ) );
	}

	$cart_payload = array(
		'tripID'        => (int) $body['tripId'],
		'packageID'     => (int) $body['packageId'],
		'travelers'     => (object) ( $body['travelers'] ?? array() ),
		'tripDate'      => $body['tripDate'] ?? '',
		'extraServices' => $body['addonIds'] ?? array(),
	);

	// Throwaway cart — constructed after WordPress's `init` hook has already fired, so it
	// never auto-loads any existing session cart data (see Legacy\Cart::__construct(), which
	// only registers a `read_cart_onload` callback on `init`). Nothing here touches the real
	// $GLOBALS['wte_cart'] or its session.
	$quote_cart = new \WPTravelEngine\Core\Cart\Cart();
	$synthetic  = sf_checkout_request_from_json( $cart_payload );

	$result = \WPTravelEngine\Core\Controllers\Ajax\AddToCart::process( $synthetic );
	if ( is_wp_error( $result ) ) {
		return $result;
	}

	// AddToCart::process() operates on $GLOBALS['wte_cart'], not our throwaway instance — read
	// totals from the global (it only contains this one synthetic item, since real cart usage
	// happens client-side in Astro and never reaches WordPress until checkout).
	global $wte_cart;
	$wte_cart->calculate_totals();

	$partial = wp_travel_engine_get_trip_partial_payment_data( (int) $body['tripId'] );
	$total   = $wte_cart->get_cart_total();
	$subtotal = $wte_cart->get_subtotal();

	$response = array(
		'lineItems' => array_map(
			function ( $item ) {
				return array(
					'tripId'  => $item['trip_id'] ?? null,
					'label'   => get_the_title( $item['trip_id'] ?? 0 ),
					'pax'     => $item['pax'] ?? array(),
					'cost'    => $item['pax_cost'] ?? array(),
					'total'   => $item['trip_price'] ?? 0,
				);
			},
			$wte_cart->getItems()
		),
		'subtotal' => (float) $subtotal,
		'total'    => (float) $total,
		'currency' => (string) wptravelengine_settings()->get( 'currency_code', 'USD' ),
		'partialPayment' => array(
			'available' => ! empty( $partial ),
			'amount'    => $partial['value'] ?? null,
			'type'      => $partial['type'] ?? null,
		),
	);

	// Clear the global cart — this was a quote, not a real add-to-cart. The real cart lives in
	// Astro/localStorage until checkout submits everything in one shot.
	$wte_cart->clear();

	return $response;
}

/**
 * Wraps the real Paystack gateway class and overrides only the final step: instead of
 * `wp_redirect($authorization_url); exit;` (unrecoverable from a REST callback — see the
 * class docblock note below), it captures the authorization URL (or error) on itself so our
 * REST handler can read it back and return it as JSON. Every other line is inherited
 * unchanged from the real gateway (secret key lookup, currency check, amount/billing/
 * reference/callback-url construction, the actual /transaction/initialize call) — this
 * class must stay in sync with wp-travel-engine-paystack-gateway's process_payment() if that
 * plugin's request shape ever changes, since we deliberately don't call it directly.
 *
 * The class declaration is deferred to `plugins_loaded` (rather than evaluated at this file's
 * top level) because mu-plugins load before regular plugins in WordPress's bootstrap order —
 * checking class_exists('\WTE\Paystack\Gateway') here unconditionally would always be false,
 * since the Paystack gateway plugin hasn't executed yet at mu-plugin load time. Priority 30
 * specifically: wp-travel-engine-paystack-gateway's own main file defers its class require +
 * gateway registration to `plugins_loaded` at priority 20, so we must run after that, not at
 * the default priority 10.
 */
add_action(
	'plugins_loaded',
	function () {
		if ( ! class_exists( '\WTE\Paystack\Gateway' ) || class_exists( 'SF_Paystack_Capture_Gateway' ) ) {
			return;
		}

		require __DIR__ . '/safariflow/sf-paystack-capture-gateway.php';
	},
	30
);

/**
 * Build an in-memory RequestParser (WTE's own WP_REST_Request subclass — BookingProcess's
 * constructor is typed against it specifically) with body (POST-style) params.
 *
 * Deliberately NOT JSON: BookingProcess::validate_form_data() reads
 * `$this->request->get_body_params()` directly (not the merged get_param(), and not
 * get_json_params()) to run the billing validator — so the billing/travellers/emergency data
 * must land in the request's body-params bucket, or the validator sees empty values and
 * silently rejects everything as "invalid_value". set_body_params() populates exactly that
 * bucket; get_param() elsewhere in the constructor still resolves correctly too, since its
 * merge order includes body params.
 */
function sf_checkout_request_parser_from_array( array $data ): \WPTravelEngine\Utilities\RequestParser {
	$request = new \WPTravelEngine\Utilities\RequestParser( 'POST' );
	$request->set_body_params( $data );

	return $request;
}

/**
 * Run a real WTE booking + payment through BookingProcess, then start (not finish) the
 * Paystack transaction, returning its authorization URL for Astro to redirect the browser to.
 */
function sf_checkout_handle_checkout( WP_REST_Request $request ) {
	if ( ! class_exists( 'SF_Paystack_Capture_Gateway' ) ) {
		return new WP_Error( 'paystack_unavailable', __( 'Paystack gateway plugin is not active.', 'safariflow' ), array( 'status' => 500 ) );
	}

	$body = $request->get_json_params();

	foreach ( array( 'tripId', 'packageId', 'tripDate', 'billing', 'travellers', 'emergency' ) as $field ) {
		if ( empty( $body[ $field ] ) ) {
			return new WP_Error( 'invalid_request', "Missing field: {$field}", array( 'status' => 400 ) );
		}
	}

	// Pre-validate exactly what WPTravelEngine\Validator\Checkout requires, so we never trigger
	// BookingProcess's internal wp_send_json_error()+die() on a validator failure (that would
	// bypass our REST envelope/CORS headers entirely — see BookingProcess.php's constructor).
	$billing = $body['billing'];
	foreach ( array( 'fname', 'lname', 'email', 'phone', 'address', 'city', 'country' ) as $field ) {
		if ( empty( $billing[ $field ] ) ) {
			return new WP_Error( 'invalid_request', "Missing billing field: {$field}", array( 'status' => 400 ) );
		}
	}
	if ( ! is_email( $billing['email'] ) ) {
		return new WP_Error( 'invalid_request', 'Invalid billing email.', array( 'status' => 400 ) );
	}

	// Build the cart against the REAL global — BookingProcess reads its items directly.
	global $wte_cart;
	$wte_cart->clear();

	$cart_payload = array(
		'tripID'        => (int) $body['tripId'],
		'packageID'     => (int) $body['packageId'],
		'travelers'     => (object) ( $body['travelers'] ?? array() ),
		'tripDate'      => $body['tripDate'],
		'extraServices' => $body['addonIds'] ?? array(),
	);
	$cart_result = \WPTravelEngine\Core\Controllers\Ajax\AddToCart::process( sf_checkout_request_from_json( $cart_payload ) );
	if ( is_wp_error( $cart_result ) ) {
		return $cart_result;
	}

	// Swap in the capturing gateway for the 'paystack' slot, for this request only.
	$gateways     = \WPTravelEngine\PaymentGateways\PaymentGateways::instance();
	$real_gateway = $gateways->get_payment_gateway( 'paystack' );
	$capture      = new SF_Paystack_Capture_Gateway();
	$gateways->register_gateway( $capture );

	/**
	 * Safety net: BookingProcess::maybe_redirect() (called unconditionally at the end of its
	 * constructor) itself calls wptravelengine_redirect_to_thank_you_page() — which does an
	 * unconditional wp_safe_redirect()+exit whenever a booking ref + payment key exist, with NO
	 * filter to opt out. So even though our capture gateway never redirects, the constructor's
	 * own trailing redirect still fires and calls exit — meaning this function's normal `return`
	 * below is never reached in the success path. PHP still runs shutdown functions after
	 * exit/die though, and no response body has been sent yet (only queued headers), so this is
	 * the actual point where we override the queued redirect and emit our JSON response instead.
	 */
	register_shutdown_function(
		function () use ( $capture ) {
			if ( headers_sent() || ( ! $capture->captured_authorization_url && ! $capture->captured_error ) ) {
				return;
			}

			header_remove( 'Location' );
			header( 'Content-Type: application/json; charset=UTF-8' );
			header( 'Access-Control-Allow-Origin: ' . SF_CHECKOUT_ALLOWED_ORIGIN );
			header( 'Access-Control-Allow-Credentials: false' );

			// wp_safe_redirect() already queued the 302 status line via a raw "HTTP/1.1 302 ..."
			// header() call. http_response_code() alone doesn't reliably override that under
			// PHP's built-in dev server, so also send an explicit status-line header (which
			// does replace it — header()'s $replace defaults to true for same-type headers).
			$protocol = $_SERVER['SERVER_PROTOCOL'] ?? 'HTTP/1.1';

			if ( $capture->captured_error ) {
				header( "{$protocol} 500 Internal Server Error", true, 500 );
				http_response_code( 500 );
				echo wp_json_encode(
					array(
						'code'    => $capture->captured_error->get_error_code(),
						'message' => $capture->captured_error->get_error_message(),
					)
				);
				return;
			}

			header( "{$protocol} 200 OK", true, 200 );
			http_response_code( 200 );
			echo wp_json_encode(
				array(
					'bookingRef'       => $capture->captured_booking_id,
					'paymentKey'       => $capture->captured_payment_key,
					'authorizationUrl' => $capture->captured_authorization_url,
				)
			);
		}
	);

	try {
		$payment_mode = 'partial' === ( $body['paymentMode'] ?? '' ) ? 'partial' : 'full_payment';

		$checkout_request = sf_checkout_request_parser_from_array(
			array(
				'billing'                       => $billing,
				'travellers'                    => $body['travellers'],
				'emergency'                      => $body['emergency'],
				'wpte_checkout_paymnet_method'   => 'paystack',
				'wp_travel_engine_payment_mode'  => $payment_mode,
			)
		);

		new \WPTravelEngine\Core\Booking\BookingProcess( $checkout_request, $wte_cart );
	} catch ( \Throwable $e ) {
		return new WP_Error( 'checkout_failed', $e->getMessage(), array( 'status' => 500 ) );
	} finally {
		// Always put the real gateway back, regardless of outcome — matters for persistent
		// PHP workers (php-fpm etc.), harmless no-op under `php -S`'s per-request processes.
		$gateways->register_gateway( $real_gateway );
	}

	// Reached only if BookingProcess returned without ever creating a booking (e.g. its empty-
	// cart guard) — the shutdown function above handles the normal (redirect-then-exit) path.
	if ( $capture->captured_error ) {
		return $capture->captured_error;
	}
	if ( $capture->captured_authorization_url ) {
		return array(
			'bookingRef'       => $capture->captured_booking_id,
			'paymentKey'       => $capture->captured_payment_key,
			'authorizationUrl' => $capture->captured_authorization_url,
		);
	}

	return new WP_Error( 'checkout_failed', __( 'Could not start checkout.', 'safariflow' ), array( 'status' => 500 ) );
}

/**
 * Safe booking/payment status lookup by payment_key, for the Astro confirmation page.
 * Returns only display-safe fields — never raw billing/traveler meta.
 */
function sf_checkout_handle_booking_status( WP_REST_Request $request ) {
	$payment_key = sanitize_text_field( $request->get_param( 'payment_key' ) );

	// Same lookup path WTE itself uses for the gateway return leg (set both at
	// payment-gateway-dispatch time and again at completion_redirect_url()).
	$payment_id = get_transient( "payment_key_{$payment_key}" );
	$payment    = $payment_id ? wptravelengine_get_payment( $payment_id ) : null;
	if ( ! $payment ) {
		return new WP_Error( 'not_found', __( 'Booking not found.', 'safariflow' ), array( 'status' => 404 ) );
	}

	$booking_id = $payment->get_meta( 'booking_id' );
	$booking    = $booking_id ? wptravelengine_get_booking( $booking_id ) : null;
	if ( ! $booking ) {
		return new WP_Error( 'not_found', __( 'Booking not found.', 'safariflow' ), array( 'status' => 404 ) );
	}

	return array(
		'status'    => $payment->get_payment_status(),
		'amount'    => (float) $booking->get_total(),
		'currency'  => $booking->get_currency(),
		'tripTitle' => $booking->get_trip_title(),
		'tripDate'  => $booking->get_trip_datetime(),
		'leadName'  => trim( $booking->get_billing_fname() . ' ' . $booking->get_billing_lname() ),
	);
}

/**
 * WTE's own valid country list (ISO code => name), so the Astro checkout form uses a real
 * <select> instead of free text — Checkout validator's sanitize_country() only accepts values
 * that exactly match this list (either the code or the name).
 */
function sf_checkout_handle_countries( WP_REST_Request $request ) {
	$countries = \WPTravelEngine\Helpers\Functions::get_countries();
	$out       = array();
	foreach ( $countries as $code => $name ) {
		$out[] = array( 'value' => $code, 'label' => $name );
	}

	return $out;
}

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			SF_CHECKOUT_NAMESPACE,
			'/quote',
			array(
				'methods'             => 'POST',
				'callback'            => 'sf_checkout_handle_quote',
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			SF_CHECKOUT_NAMESPACE,
			'/checkout',
			array(
				'methods'             => 'POST',
				'callback'            => 'sf_checkout_handle_checkout',
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			SF_CHECKOUT_NAMESPACE,
			'/countries',
			array(
				'methods'             => 'GET',
				'callback'            => 'sf_checkout_handle_countries',
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			SF_CHECKOUT_NAMESPACE,
			'/bookings/(?P<payment_key>[a-zA-Z0-9\-]+)',
			array(
				'methods'             => 'GET',
				'callback'            => 'sf_checkout_handle_booking_status',
				'permission_callback' => '__return_true',
				'args'                => array(
					'payment_key' => array( 'required' => true ),
				),
			)
		);
	}
);
