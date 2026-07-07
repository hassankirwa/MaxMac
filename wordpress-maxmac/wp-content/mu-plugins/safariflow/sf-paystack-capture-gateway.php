<?php
/**
 * SF_Paystack_Capture_Gateway — required (not included at top level) from sf-checkout-api.php
 * on `plugins_loaded`, once \WTE\Paystack\Gateway is guaranteed to exist. See that file's
 * docblock for why this is deferred.
 */

defined( 'ABSPATH' ) || exit;

class SF_Paystack_Capture_Gateway extends \WTE\Paystack\Gateway {
	public ?string $captured_authorization_url = null;
	public ?WP_Error $captured_error           = null;
	public ?int $captured_booking_id           = null;
	public ?string $captured_payment_key       = null;

	public function process_payment( \WPTravelEngine\Core\Models\Post\Booking $booking, \WPTravelEngine\Core\Models\Post\Payment $payment, \WPTravelEngine\Core\Booking\BookingProcess $booking_instance ): void {
		$this->captured_booking_id  = $booking->get_id();
		$this->captured_payment_key = $payment->get_payment_key();

		$secret = $this->get_secret_key();
		if ( '' === $secret ) {
			$this->captured_error = new WP_Error( 'paystack_not_configured', __( 'Paystack is not configured.', 'safariflow' ) );
			return;
		}

		$currency = strtoupper( $payment->get_payable_currency() );
		if ( ! $this->is_supports_currency( $currency ) ) {
			$this->captured_error = new WP_Error(
				'unsupported_currency',
				sprintf( __( 'Paystack cannot process the store currency (%s).', 'safariflow' ), $currency )
			);
			return;
		}

		$amount_subunit = (int) round( ( (float) $payment->get_payable_amount() ) * 100 );
		$billing        = (array) $payment->get_meta( 'billing_info' );
		$email          = sanitize_email( $billing['email'] ?? '' );
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
			$this->captured_error = $response;
			return;
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( empty( $body['status'] ) || empty( $body['data']['authorization_url'] ) ) {
			$this->captured_error = new WP_Error( 'paystack_error', $body['message'] ?? __( 'Unknown error from Paystack.', 'safariflow' ) );
			return;
		}

		$payment->set_meta( 'paystack_reference', $reference )->save();
		$this->captured_authorization_url = esc_url_raw( $body['data']['authorization_url'] );
		// Deliberately no wp_redirect()/exit here — that's the entire point of this wrapper.
	}
}
