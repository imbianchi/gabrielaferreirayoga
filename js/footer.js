/**
 * Footer JavaScript
 * Everything else is rendered by the static build (see scripts/build.mjs);
 * the year is filled here instead of baked in so it can't go stale for a
 * return visitor loading a cached build across a year boundary.
 */
(function () {
    'use strict';

    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = new Date().getFullYear();
})();
