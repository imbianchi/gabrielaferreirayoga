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

    // Background image
    const bgImg = document.querySelector('.hero__bg img');
    if (bgImg && heroJson.image) {
        bgImg.src = `${PATHS.images}/${heroJson.image}.webp`;
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

/**
 * Hero JavaScript
 * Subtle parallax on the background photo — moves a little slower
 * than the scroll, capped so it never reveals the overscanned edge.
 */
(function () {
    'use strict';

    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero__bg');
    if (!hero || !heroBg) return;

    const MAX_OFFSET = 60;
    const SPEED = 0.15;

    function updateParallax() {
        const rect = hero.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
        const offset = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, rect.top * -SPEED));
        heroBg.style.transform = `translateY(${offset}px)`;
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
})();
