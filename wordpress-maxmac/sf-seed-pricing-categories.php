<?php
/**
 * One-off, idempotent seeder: adds "Child" and "Infant" WP Travel Engine pricing categories
 * and gives every trip package a per-category price, so the Astro adult/child/infant selection
 * actually prices through WTE's real engine. Child = 50% of that package's Adult price,
 * Infant = 25% (rounded to nearest 10) — edit freely in wp-admin → Trip → Date & Price.
 *
 * Run once:  php sf-seed-pricing-categories.php   (then delete it — it's not a plugin).
 * Safe to re-run: it skips categories/packages it has already processed.
 */

define( 'WP_USE_THEMES', false );
require __DIR__ . '/wp-load.php';

const TAX = 'trip-packages-categories';

function sf_get_or_create_category( string $name ): int {
	$existing = get_term_by( 'name', $name, TAX );
	if ( $existing ) {
		return (int) $existing->term_id;
	}
	$res = wp_insert_term( $name, TAX );
	if ( is_wp_error( $res ) ) {
		fwrite( STDERR, "Failed to create '$name': " . $res->get_error_message() . "\n" );
		exit( 1 );
	}
	add_term_meta( $res['term_id'], 'is_primary_pricing_catgory', '' );
	return (int) $res['term_id'];
}

$child_id  = sf_get_or_create_category( 'Child' );
$infant_id = sf_get_or_create_category( 'Infant' );
echo "Child term id: $child_id, Infant term id: $infant_id\n";

$packages = get_posts(
	array(
		'post_type'      => 'trip-packages',
		'post_status'    => 'any',
		'posts_per_page' => -1,
		'fields'         => 'ids',
	)
);
echo 'Found ' . count( $packages ) . " trip packages.\n";

$round10 = fn( $n ) => (int) ( round( $n / 10 ) * 10 );

foreach ( $packages as $pkg_id ) {
	$cats = get_post_meta( $pkg_id, 'package-categories', true );
	if ( ! is_array( $cats ) || empty( $cats['c_ids'] ) ) {
		echo "  #$pkg_id: no package-categories meta, skipping\n";
		continue;
	}

	$primary_id = (int) ( get_post_meta( $pkg_id, '_primary_category_id', true ) ?: array_key_first( $cats['prices'] ) );
	$adult_price = (int) ( $cats['prices'][ $primary_id ] ?? 0 );
	if ( $adult_price <= 0 ) {
		echo "  #$pkg_id: no adult price, skipping\n";
		continue;
	}

	$add = array(
		$child_id  => $round10( $adult_price * 0.5 ),
		$infant_id => $round10( $adult_price * 0.25 ),
	);

	$changed = false;
	foreach ( $add as $cid => $price ) {
		if ( isset( $cats['c_ids'][ $cid ] ) ) {
			continue; // already seeded
		}
		$cats['c_ids'][ $cid ]         = $cid;
		$cats['labels'][ $cid ]        = $cid === $child_id ? 'Child' : 'Infant';
		$cats['prices'][ $cid ]        = $price;
		$cats['pricing_types'][ $cid ] = 'per-person';
		$cats['min_paxes'][ $cid ]     = 0;
		$changed = true;
	}

	if ( $changed ) {
		update_post_meta( $pkg_id, 'package-categories', $cats );
		echo "  #$pkg_id: added Child={$add[$child_id]}, Infant={$add[$infant_id]} (Adult=$adult_price)\n";
	} else {
		echo "  #$pkg_id: already has Child/Infant, skipping\n";
	}
}

echo "Done.\n";
