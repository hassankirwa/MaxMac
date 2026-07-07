<?php
/**
 * Plugin Name: SafariFlow REST Enrichments
 * Description: Adds headless-friendly fields (starting price, currency, rating, tag) to the WP Travel Engine trip REST response so the Astro catalog needs no per-trip package calls.
 *
 * Must-use plugin — loads automatically, no activation.
 */

defined( 'ABSPATH' ) || exit;

add_filter(
	'rest_prepare_trip',
	function ( $response, $post ) {
		if ( ! ( $response instanceof \WP_REST_Response ) ) {
			return $response;
		}

		$data = $response->get_data();

		// Starting ("from") price = primary package price, computed by WTE's own model.
		$from_price = 0.0;
		$sale_price = null;
		if ( class_exists( '\WPTravelEngine\Core\Models\Post\Trip' ) ) {
			try {
				$trip       = new \WPTravelEngine\Core\Models\Post\Trip( $post->ID );
				$from_price = (float) $trip->get_price();
				if ( method_exists( $trip, 'has_sale' ) && $trip->has_sale() ) {
					$sale_price = (float) $trip->get_sale_price();
				}
			} catch ( \Throwable $e ) {
				$from_price = 0.0;
			}
		}

		$data['sf_from_price'] = $from_price;
		$data['sf_sale_price'] = $sale_price;
		$data['sf_currency']   = function_exists( 'wptravelengine_settings' )
			? (string) wptravelengine_settings()->get( 'currency_code', 'USD' )
			: 'USD';
		$data['sf_rating'] = (float) ( get_post_meta( $post->ID, '_sf_rating', true ) ?: 0 );
		$data['sf_tag']    = (string) get_post_meta( $post->ID, '_sf_tag', true );

		// Featured image URLs at two sizes so the headless catalog renders real photos
		// (card grids + trip hero) instead of gradient placeholders. Empty string when a
		// trip has no featured image, so the frontend can fall back to its gradient.
		$thumb_id              = get_post_thumbnail_id( $post->ID );
		$data['sf_image']      = $thumb_id ? ( wp_get_attachment_image_url( $thumb_id, 'large' ) ?: '' ) : '';
		$data['sf_image_card'] = $thumb_id ? ( wp_get_attachment_image_url( $thumb_id, 'medium_large' ) ?: '' ) : '';
		$data['sf_image_alt']  = $thumb_id ? (string) get_post_meta( $thumb_id, '_wp_attachment_image_alt', true ) : '';

		$response->set_data( $data );

		return $response;
	},
	10,
	2
);
