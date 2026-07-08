<?php
/**
 * Plugin Name: SafariFlow Contact API
 * Description: Headless contact/enquiry endpoint for the Astro frontend. Stores each enquiry as a
 *              private `sf_enquiry` post (visible in wp-admin) and emails the site admin.
 *              Registered under the same `safariflow/v1` namespace as the checkout API, so it
 *              inherits that plugin's CORS handling for the Astro origin.
 *
 * Must-use plugin — loads automatically, no activation.
 */

defined( 'ABSPATH' ) || exit;

const SF_CONTACT_NAMESPACE = 'safariflow/v1';
const SF_CONTACT_POST_TYPE = 'sf_enquiry';

/**
 * Enquiries are stored as a private CPT so the team can read/track them in wp-admin, independent
 * of whether the notification email is delivered. Not public, not in REST.
 */
add_action(
	'init',
	function () {
		register_post_type(
			SF_CONTACT_POST_TYPE,
			array(
				'labels'       => array(
					'name'          => __( 'Enquiries', 'safariflow' ),
					'singular_name' => __( 'Enquiry', 'safariflow' ),
					'menu_name'     => __( 'Enquiries', 'safariflow' ),
				),
				'public'       => false,
				'show_ui'      => true,
				'show_in_menu' => true,
				'menu_icon'    => 'dashicons-email',
				'supports'     => array( 'title', 'editor', 'custom-fields' ),
				'capability_type' => 'post',
			)
		);
	}
);

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			SF_CONTACT_NAMESPACE,
			'/contact',
			array(
				'methods'             => 'POST',
				'callback'            => 'sf_contact_handle_submit',
				'permission_callback' => '__return_true',
			)
		);
	}
);

/**
 * Validate, store, and email a contact enquiry.
 *
 * Body: { name, email, message, phone?, subject?, company? }
 * `company` is a honeypot — bots fill hidden fields, so a non-empty value is silently accepted
 * (returns ok) without storing or emailing, denying spammers a signal.
 */
function sf_contact_handle_submit( WP_REST_Request $request ) {
	$body = $request->get_json_params();

	// Honeypot: pretend success so bots don't retry, but do nothing.
	if ( ! empty( $body['company'] ) ) {
		return array( 'ok' => true );
	}

	foreach ( array( 'name', 'email', 'message' ) as $field ) {
		if ( empty( $body[ $field ] ) ) {
			return new WP_Error( 'invalid_request', "Missing field: {$field}", array( 'status' => 400 ) );
		}
	}

	$email = sanitize_email( $body['email'] );
	if ( ! is_email( $email ) ) {
		return new WP_Error( 'invalid_request', 'Please enter a valid email address.', array( 'status' => 400 ) );
	}

	$name    = sanitize_text_field( $body['name'] );
	$phone   = isset( $body['phone'] ) ? sanitize_text_field( $body['phone'] ) : '';
	$subject = isset( $body['subject'] ) ? sanitize_text_field( $body['subject'] ) : 'Website enquiry';
	$message = sanitize_textarea_field( $body['message'] );

	$post_id = wp_insert_post(
		array(
			'post_type'    => SF_CONTACT_POST_TYPE,
			'post_status'  => 'private',
			'post_title'   => sprintf( '%s — %s', $name, $subject ),
			'post_content' => $message,
			'meta_input'   => array(
				'sf_email'   => $email,
				'sf_phone'   => $phone,
				'sf_subject' => $subject,
			),
		),
		true
	);

	if ( is_wp_error( $post_id ) ) {
		return new WP_Error( 'contact_failed', __( 'Could not save your message. Please try again.', 'safariflow' ), array( 'status' => 500 ) );
	}

	// Notify the site admin. Delivery failure must not fail the request — the enquiry is already
	// stored in wp-admin, so we still return success.
	$admin = get_option( 'admin_email' );
	if ( $admin ) {
		$lines = array(
			"Name:    {$name}",
			"Email:   {$email}",
			"Phone:   {$phone}",
			"Subject: {$subject}",
			'',
			'Message:',
			$message,
		);
		wp_mail(
			$admin,
			"New enquiry: {$subject}",
			implode( "\n", $lines ),
			array( 'Reply-To: ' . $name . ' <' . $email . '>' )
		);
	}

	return array( 'ok' => true );
}
