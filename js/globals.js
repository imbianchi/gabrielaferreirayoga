/**
 * Global constants
 * Shared paths used across the site's JS modules — update here instead
 * of hardcoding strings in every module.
 */
export const PATHS = {
    modules: '../modules',
    data: '../data',
    images: '/assets/images',
    svg: '/assets/svg',
};

/**
 * Cache-busting version for fetch()ed assets (modules/*.html,
 * assets/svg/*.svg). Bump this any time one of those files changes —
 * the browser otherwise happily serves a stale cached copy even after
 * a normal reload, since these files aren't referenced by <script>/
 * <link> tags and get no automatic cache invalidation.
 */
export const VERSION = '1';
