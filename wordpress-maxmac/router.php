<?php
/**
 * Router for PHP's built-in dev server (`php -S`), which does NOT process .htaccess.
 * Without this, WordPress pretty permalinks and /wp-json/ REST routes 404, because the
 * server only looks for a literal file at the request path. This mirrors what .htaccess
 * does under Apache: serve real files directly, route everything else to index.php.
 *
 * Launch WordPress with:
 *   php -S localhost:8000 -t "C:/Users/hassan.kirwa/Documents/MaxMac/wordpress-maxmac" \
 *       "C:/Users/hassan.kirwa/Documents/MaxMac/wordpress-maxmac/router.php"
 */

$root = __DIR__;
$path = parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH );
$file = realpath( $root . $path );

// Serve an existing static file (css/js/images/php in wp-admin, wp-includes, etc.) as-is,
// but only if it's genuinely inside the docroot (guard against ../ traversal).
if ( $file && strpos( $file, $root ) === 0 && is_file( $file ) ) {
	if ( substr( $file, -4 ) === '.php' ) {
		// Let the built-in server execute the target PHP file (e.g. /wp-admin/, /wp-login.php).
		chdir( dirname( $file ) );
		require $file;
		return true;
	}
	return false; // non-PHP asset — let the server stream it.
}

// Everything else is a WordPress route (front end + /wp-json REST): hand off to the front controller.
chdir( $root );
require $root . '/index.php';
return true;
