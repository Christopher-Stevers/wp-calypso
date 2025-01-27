/**
 * External Dependencies
 */
const { app, dialog } = require( 'electron' );

/**
 * Internal dependencies
 */
const settings = require( '../../lib/settings' );
const assets = require( '../../lib/assets' );
const log = require( '../../lib/logger' )( 'desktop:failed-to-load' );

/**
 * Module variables
 */
const FAIL_TO_LOAD_FILE = 'failed-to-start.html';
const FAILED_FILE = 'file://' + assets.getPath( FAIL_TO_LOAD_FILE );
const NETWORK_FAILED_FILE = 'file://' + assets.getPath( 'network-failed.html' );

// Error codes we might get in the course of using the app and should not result in an error page
// Full list of error codes here: https://code.google.com/p/chromium/codesearch#chromium/src/net/base/net_error_list.h
const ERRORS_TO_IGNORE = [
	-3, // ABORTED
	-30, // ERR_BLOCKED_BY_CSP
	-102, // CONNECTION_REFUSED
	-109, // ADDRESS_UNREACHABLE
	-502, // NO_PRIVATE_KEY_FOR_CERT
	-501, // INSECURE_RESPONSE
];

let finalTry = false;

function isErrorPage( sender ) {
	if ( sender && typeof sender.getURL !== 'undefined' ) {
		let url = sender.getURL();

		if ( url.indexOf( '#-' ) !== -1 ) {
			url = url.substring( 0, url.indexOf( '#-' ) );
		}

		if ( url === FAILED_FILE ) {
			return true;
		}
	}

	return false;
}

function failedToLoadError( view ) {
	// We had an error loading the error page. Try a final time to load it via the server now the proxy has been disabled
	if ( finalTry === false ) {
		view.webContents.loadURL( `file://${ assets.getPath( 'failed-to-start.html' ) }#-666` );
		finalTry = true;
	} else {
		// Last resort. We don't want to get in a loop trying to load the error page. Disable the proxy, show a dialog, and quit
		settings.saveSetting( 'proxy-type', '' );

		dialog.showMessageBox(
			{
				buttons: [ 'OK' ],
				title: 'Aww shucks',
				message:
					'Something went wrong starting up WordPress.com. If you are using a proxy then please make sure it is running',
			},
			function () {
				app.quit();
			}
		);
	}
}

// TODO: evaluate if this is still the way to go to handle requests.
// @adlk: Keep in mind that every request, even the ones we do not control (e.g. atomic- or self hosted sites), might cause the app to "soft-crash" even though the user experience might not be affected directly by some requests that fail.
module.exports = function ( { view } ) {
	// This attempts to catch some network errors and display an error screen in order to avoid a blank white page
	view.webContents.on(
		'did-fail-load',
		async function ( event, errorCode, errorDescription, validatedURL ) {
			log.error( `Failed to load URL '${ validatedURL }'` );

			if ( ERRORS_TO_IGNORE.indexOf( errorCode ) === -1 ) {
				if ( isErrorPage( event.sender ) ) {
					failedToLoadError( view );
				} else {
					log.error(
						'Failed to load URL, showing fallback page: code=' + errorCode + ' ' + errorDescription
					);

					await view.webContents.session.setProxy( { proxyRules: 'direct://' } );
					const file = errorCode === -106 ? NETWORK_FAILED_FILE : FAILED_FILE;
					view.webContents.loadURL( file + '#' + errorCode );
				}
			}
		}
	);
};
