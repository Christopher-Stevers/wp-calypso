import { __ } from '@wordpress/i18n';

export const modeType = {
	SUGGESTED: 'suggested',
	ADVANCED: 'advanced',
	DONE: 'done',
	OWNERSHIP_VERIFICATION: 'ownership_verification',
};

export const stepType = {
	START: 'start_setup',
	LOG_IN_TO_PROVIDER: 'log_in_to_provider',
	UPDATE_NAME_SERVERS: 'update_name_servers',
	UPDATE_A_RECORDS: 'update_a_records',
	CONNECTED: 'connected',
	VERIFYING: 'verifying',
	ENTER_AUTH_CODE: 'enter_auth_code',
};

export const stepSlug = {
	SUGGESTED_START: 'suggested_start',
	SUGGESTED_LOGIN: 'suggested_login',
	SUGGESTED_UPDATE: 'suggested_update',
	SUGGESTED_VERIFYING: 'suggested_verifying',
	SUGGESTED_CONNECTED: 'suggested_connected',
	ADVANCED_START: 'advanced_start',
	ADVANCED_LOGIN: 'advanced_login',
	ADVANCED_UPDATE: 'advanced_update',
	ADVANCED_VERIFYING: 'advanced_verifying',
	ADVANCED_CONNECTED: 'advanced_connected',
	OWNERSHIP_VERIFICATION_LOGIN: 'ownership_verification_login',
	OWNERSHIP_VERIFICATION_AUTH_CODE: 'ownership_verification_auth_code',
};

export const defaultDomainSetupInfo = {
	data: {
		default_ip_addresses: [ '192.0.78.24', '192.0.78.25' ],
		wpcom_name_servers: [ 'ns1.wordpress.com', 'ns2.wordpress.com', 'ns3.wordpress.com' ],
	},
};

export const stepsHeadingSuggested = __( 'Suggested setup' );
export const stepsHeadingAdvanced = __( 'Advanced setup' );
export const stepsHeadingOwnershipVerification = __( 'Verify domain ownership' );