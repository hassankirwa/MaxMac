<?php
/**
 * Paystack payment gateway for WP Travel Engine.
 *
 * Flow (all server-side, one base URL — mode is decided by the secret key prefix):
 *   process_payment()        POST /transaction/initialize  → redirect to authorization_url
 *   handle_paystack_request() GET  /transaction/verify/{ref} → finalize only on data.status === 'success'
 *
 * @package WTE\Paystack
 */

namespace WTE\Paystack;

use WPTravelEngine\PaymentGateways\BaseGateway;
use WPTravelEngine\Core\Models\Post\Booking;
use WPTravelEngine\Core\Models\Post\Payment;
use WPTravelEngine\Core\Booking\BookingProcess;

defined( 'ABSPATH' ) || exit;

class Gateway extends BaseGateway {

	const OPTION   = 'wte_paystack_settings';
	const API_BASE = 'https://api.paystack.co';

	/** Currencies Paystack can process (account-country dependent subset of these). */
	const SUPPORTED_CURRENCIES = array( 'NGN', 'GHS', 'ZAR', 'KES', 'USD' );

	/** Use the v4 cart path so the gateway is never skipped by the cart-version guard. */
	public static string $cart_version = '4.0';

	/** Default so BaseGateway's $args-dependent methods never hit an uninitialized typed property. */
	protected array $args = array();

	/* ---------- identity ---------- */

	public function get_gateway_id(): string {
		return 'paystack';
	}

	public function get_label(): string {
		return __( 'Paystack', 'wte-paystack' );
	}

	public function get_public_label(): string {
		$title = trim( (string) ( $this->settings()['title'] ?? '' ) );
		return '' !== $title ? $title : __( 'Pay with Card / Bank (Paystack)', 'wte-paystack' );
	}

	public function get_description(): string {
		return __( 'Secure payment via Paystack — cards, bank transfer, USSD, and mobile money.', 'wte-paystack' );
	}

	/* ---------- config ---------- */

	protected function settings(): array {
		return (array) get_option( self::OPTION, array() );
	}

	protected function get_secret_key(): string {
		return trim( (string) ( $this->settings()['secret_key'] ?? '' ) );
	}

	/** Paystack has no sandbox host — test mode is purely the key prefix. */
	public function is_test_mode(): bool {
		return 0 === strpos( $this->get_secret_key(), 'sk_test_' );
	}

	public function is_active(): bool {
		return '1' === ( $this->settings()['enable'] ?? '' ) && '' !== $this->get_secret_key();
	}

	public function is_supports_currency( string $currency ): bool {
		return in_array( strtoupper( $currency ), self::SUPPORTED_CURRENCIES, true );
	}

	/* ---------- payment ---------- */

	/**
	 * Initialize a Paystack transaction and redirect the buyer to Paystack.
	 */
	public function process_payment( Booking $booking, Payment $payment, BookingProcess $booking_instance ): void {
		$secret = $this->get_secret_key();
		if ( '' === $secret ) {
			wp_die( esc_html__( 'Paystack is not configured. Add your secret key in WP Travel Engine → Paystack Gateway.', 'wte-paystack' ) );
		}

		$currency = strtoupper( $payment->get_payable_currency() );
		if ( ! $this->is_supports_currency( $currency ) ) {
			wp_die(
				sprintf(
					/* translators: %s: store currency code. */
					esc_html__( 'Paystack cannot process the store currency (%s). Supported: NGN, GHS, ZAR, KES, USD.', 'wte-paystack' ),
					esc_html( $currency )
				)
			);
		}

		// Amount must be an integer in the currency subunit (kobo / cents / pesewas).
		$amount_subunit = (int) round( ( (float) $payment->get_payable_amount() ) * 100 );

		$billing = (array) $payment->get_meta( 'billing_info' );
		$email   = sanitize_email( $billing['email'] ?? '' );
		if ( '' === $email ) {
			$email = sanitize_email( get_option( 'admin_email' ) );
		}

		$reference    = $payment->get_payment_key();
		$callback_url = $this->get_callback_url( $payment, 'paystack' );

		$response = wp_remote_post(
			self::API_BASE . '/transaction/initialize',
			array(
				'timeout' => 30,
				'headers' => array(
					'Authorization' => 'Bearer ' . $secret,
					'Content-Type'  => 'application/json',
				),
				'body'    => wp_json_encode(
					array(
						'email'        => $email,
						'amount'       => $amount_subunit,
						'currency'     => $currency,
						'reference'    => $reference,
						'callback_url' => $callback_url,
						'metadata'     => array(
							'booking_id'  => $booking->get_id(),
							'payment_id'  => $payment->get_id(),
							'payment_key' => $payment->get_payment_key(),
						),
					)
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			wp_die( esc_html__( 'Could not reach Paystack: ', 'wte-paystack' ) . esc_html( $response->get_error_message() ) );
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( empty( $body['status'] ) || empty( $body['data']['authorization_url'] ) ) {
			$message = $body['message'] ?? __( 'Unknown error from Paystack.', 'wte-paystack' );
			wp_die( esc_html__( 'Paystack error: ', 'wte-paystack' ) . esc_html( $message ) );
		}

		$payment->set_meta( 'paystack_reference', $reference )->save();

		wp_redirect( esc_url_raw( $body['data']['authorization_url'] ) );
		exit;
	}

	/**
	 * Return path from Paystack. Dispatched by WTE's process_gateway_callback()
	 * because the callback URL carries payment_key + callback_type=paystack.
	 * The verify endpoint is the source of truth — never trust the redirect alone.
	 */
	public function handle_paystack_request( Booking $booking, Payment $payment ): void {
		$reference = isset( $_REQUEST['reference'] )
			? sanitize_text_field( wp_unslash( $_REQUEST['reference'] ) )
			: (string) $payment->get_meta( 'paystack_reference' );

		$secret   = $this->get_secret_key();
		$verified = false;
		$amount   = 0.0;
		$data     = array();

		if ( '' !== $secret && '' !== $reference ) {
			$response = wp_remote_get(
				self::API_BASE . '/transaction/verify/' . rawurlencode( $reference ),
				array(
					'timeout' => 30,
					'headers' => array( 'Authorization' => 'Bearer ' . $secret ),
				)
			);

			if ( ! is_wp_error( $response ) ) {
				$body = json_decode( wp_remote_retrieve_body( $response ), true );
				$data = $body['data'] ?? array();
				if ( ! empty( $body['status'] ) && 'success' === ( $data['status'] ?? '' ) ) {
					$verified = true;
					$amount   = ( (float) ( $data['amount'] ?? 0 ) ) / 100;
				}
			}
		}

		$payment->sync_metas(
			array(
				'_transaction_id'  => $data['id'] ?? $reference,
				'gateway_response' => $data,
			)
		);

		if ( $verified ) {
			$booking->sync_payment_success_metas(
				$payment->ID,
				$amount,
				array(
					'send_booking_emails' => true,
					'send_payment_emails' => true,
				)
			);
			do_action( 'wte_booking_cleanup', $payment->get_id(), 'notification' );

			$thankyou = add_query_arg( array( 'payment_key' => $payment->get_payment_key() ), wp_travel_engine_get_booking_confirm_url() );
			wp_safe_redirect( $thankyou );
			exit;
		}

		$booking->sync_payment_failed_metas( $payment->ID, $amount );
		$checkout = function_exists( 'wptravelengine_get_checkout_url' ) ? wptravelengine_get_checkout_url() : home_url( '/' );
		wp_safe_redirect( add_query_arg( array( 'wte_payment' => 'failed' ), $checkout ) );
		exit;
	}
}
