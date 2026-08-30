import { PATHS, VERSION } from './globals.js';

const heroHtml = await fetch(`${PATHS.modules}/hero.html?v=${VERSION}`).then(res => res.text());
document.getElementById('hero').innerHTML = heroHtml;

import heroJson from '../data/hero.json' with { type: 'json' };

/**
 * Hero JavaScript
 * Handle data from hero.json
 */
(async function () {
    'use strict';

    // Background image — fade in over the blurred CSS placeholder
    // once the full-resolution photo has actually finished loading.
    const bgImg = document.querySelector('.hero__bg img');
    if (bgImg && heroJson.image) {
        bgImg.addEventListener('load', function () { bgImg.classList.add('is-loaded'); });
        bgImg.src = `${PATHS.images}/${heroJson.image}.webp`;
        if (bgImg.complete) bgImg.classList.add('is-loaded');
    }

    // Title / accent / lead
    const title = document.querySelector('.hero__content h1');
    if (title) title.textContent = heroJson.mainTitle;

    const accent = document.querySelector('.hero__accent');
    if (accent) accent.textContent = heroJson.subTitle;

    const lead = document.querySelector('.hero__lead');
    if (lead) lead.textContent = heroJson.textSummary;

    // CTA button
    const ctaButton = document.querySelector('.hero__cta');
    if (ctaButton && heroJson.ctaButton) {
        ctaButton.href = heroJson.ctaButton.link;

        const arrowIcon = await fetch(`${PATHS.svg}/arrow.svg?v=${VERSION}`).then(res => res.text());

        ctaButton.innerHTML = `
            ${heroJson.ctaButton.title}
            ${arrowIcon}
        `;
    }
})();
