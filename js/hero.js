/**
 * Hero JavaScript
 * Fades the background photo in over the blurred CSS placeholder once
 * the full-resolution image (already set by the static build) has
 * actually finished loading.
 */
(function () {
    'use strict';

    const bgImg = document.querySelector('.hero__bg img');
    if (!bgImg) return;

    bgImg.addEventListener('load', function () { bgImg.classList.add('is-loaded'); });
    if (bgImg.complete) bgImg.classList.add('is-loaded');
})();
