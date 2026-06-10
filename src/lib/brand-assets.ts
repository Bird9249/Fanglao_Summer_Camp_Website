/**
 * Bump when replacing `public/summer-camp-logo.png`.
 * Prod nginx caches `.png` for 1 year (`immutable`); query string forces a fresh fetch.
 */
export const CAMP_LOGO_VERSION = '20260610b'

export const campLogoSrc = `/summer-camp-logo.png?v=${CAMP_LOGO_VERSION}`
