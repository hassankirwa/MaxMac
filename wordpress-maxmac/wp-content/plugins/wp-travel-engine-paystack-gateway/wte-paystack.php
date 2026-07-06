<?php
/**
 * Plugin Name:       WP Travel Engine - Paystack Gateway (Custom)
 * Description:       Adds Paystack (cards, bank transfer, USSD, mobile money) as a payment gateway for WP Travel Engine. Server-side initialize → redirect → verify. No sandbox URL — mode is derived from the secret key prefix.
 * Version:           1.0.0
 * Author:            MaxMac
 * License:           GPL-2.0+
 * Text Domain:       wte-paystack
 * Requires PHP:      7.4
 * WTE requires at least: 6.0.0
 */

defined( 'ABSPATH' ) || exit;

define( 'WTE_PAYSTACK_VERSION', '1.0.0' );
define( 'WTE_PAYSTACK_PATH', plugin_dir_path( __FILE__ ) );

/**
 * Boot after all plugins are loaded so WP Travel Engine's classes exist.
 * The PaymentGateways registry is built lazily at request time (checkout /
 * booking / admin settings), which is always after `plugins_loaded`, so adding
 * the registration filter here is guaranteed to be in place before it runs.
 */
add_action(
	'plugins_loaded',
	function () {
		if ( ! class_exists( '\WPTravelEngine\PaymentGateways\BaseGateway' ) ) {
			add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-error"><p><strong>WTE Paystack Gateway</strong> requires <strong>WP Travel Engine 6.0+</strong> to be installed and active.</p></div>';
				}
			);
			return;
		}

		require_once WTE_PAYSTACK_PATH . 'includes/class-paystack-settings.php';
		require_once WTE_PAYSTACK_PATH . 'includes/class-paystack-gateway.php';

		new \WTE\Paystack\Settings();

		add_filter(
			'wptravelengine_registering_payment_gateways',
			function ( $gateways ) {
				$gateways['paystack'] = new \WTE\Paystack\Gateway();
				return $gateways;
			}
		);
	},
	20
);
