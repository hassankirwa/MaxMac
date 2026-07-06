<?php
/**
 * Self-contained admin settings for the Paystack gateway.
 *
 * Stored under its own option key (wte_paystack_settings) so it does not depend
 * on the WP Travel Engine React settings schema. Only keys + enable are stored —
 * test/live mode is auto-detected from the secret key prefix.
 *
 * @package WTE\Paystack
 */

namespace WTE\Paystack;

defined( 'ABSPATH' ) || exit;

class Settings {

	const OPTION = 'wte_paystack_settings';
	const GROUP  = 'wte_paystack_group';

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'menu' ), 99 );
		add_action( 'admin_init', array( $this, 'register' ) );
	}

	public function menu(): void {
		add_submenu_page(
			'edit.php?post_type=booking',
			__( 'Paystack Gateway', 'wte-paystack' ),
			__( 'Paystack Gateway', 'wte-paystack' ),
			'manage_options',
			'wte-paystack',
			array( $this, 'render' )
		);
	}

	public function register(): void {
		register_setting( self::GROUP, self::OPTION, array( $this, 'sanitize' ) );
	}

	public function sanitize( $input ): array {
		return array(
			'enable'     => isset( $input['enable'] ) ? '1' : '',
			'title'      => sanitize_text_field( $input['title'] ?? '' ),
			'public_key' => sanitize_text_field( $input['public_key'] ?? '' ),
			'secret_key' => sanitize_text_field( $input['secret_key'] ?? '' ),
		);
	}

	public function render(): void {
		$o          = (array) get_option( self::OPTION, array() );
		$secret     = (string) ( $o['secret_key'] ?? '' );
		$mode       = 0 === strpos( $secret, 'sk_test_' ) ? 'TEST' : ( '' !== $secret ? 'LIVE' : '—' );
		$field_name = self::OPTION;
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Paystack Gateway (Custom)', 'wte-paystack' ); ?></h1>
			<p>
				<?php
				printf(
					/* translators: %s: TEST, LIVE or dash. */
					esc_html__( 'Mode detected from secret key prefix: %s', 'wte-paystack' ),
					'<strong>' . esc_html( $mode ) . '</strong>'
				);
				?>
			</p>
			<form method="post" action="options.php">
				<?php settings_fields( self::GROUP ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><?php esc_html_e( 'Enable Paystack', 'wte-paystack' ); ?></th>
						<td>
							<label>
								<input type="checkbox" name="<?php echo esc_attr( $field_name ); ?>[enable]" value="1" <?php checked( $o['enable'] ?? '', '1' ); ?> />
								<?php esc_html_e( 'Show Paystack as an option at checkout', 'wte-paystack' ); ?>
							</label>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Checkout Title', 'wte-paystack' ); ?></th>
						<td><input type="text" class="regular-text" name="<?php echo esc_attr( $field_name ); ?>[title]" value="<?php echo esc_attr( $o['title'] ?? '' ); ?>" placeholder="Pay with Card / Bank (Paystack)" /></td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Public Key', 'wte-paystack' ); ?></th>
						<td><input type="text" class="regular-text" name="<?php echo esc_attr( $field_name ); ?>[public_key]" value="<?php echo esc_attr( $o['public_key'] ?? '' ); ?>" placeholder="pk_test_..." /></td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Secret Key', 'wte-paystack' ); ?></th>
						<td>
							<input type="text" class="regular-text" name="<?php echo esc_attr( $field_name ); ?>[secret_key]" value="<?php echo esc_attr( $secret ); ?>" placeholder="sk_test_..." />
							<p class="description"><?php esc_html_e( 'Test vs live is auto-detected: sk_test_ = test, sk_live_ = live. There is no separate toggle.', 'wte-paystack' ); ?></p>
						</td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>
			<hr />
			<p class="description">
				<?php esc_html_e( 'Test card: 4084 0840 8408 4081 · any future expiry · CVV 408 · PIN 0000 · OTP 123456.', 'wte-paystack' ); ?>
			</p>
		</div>
		<?php
	}
}
