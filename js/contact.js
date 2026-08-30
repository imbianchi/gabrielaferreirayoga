import { PATHS, VERSION } from './globals.js';

const contactHtml = await fetch(`${PATHS.modules}/contact.html?v=${VERSION}`).then(res => res.text());
document.getElementById('contact').outerHTML = contactHtml;

import contactJson from '../data/contact.json' with { type: 'json' };

/**
 * Contact CTA JavaScript
 * Handle data from contact.json
 */
(async function () {
    'use strict';

    const bgImg = document.querySelector('.cta-banner__bg img');
    if (bgImg && contactJson.image) {
        bgImg.src = `${PATHS.images}/${contactJson.image}.webp`;
    }

    const eyebrow = document.querySelector('.cta-banner__content .eyebrow');
    if (eyebrow) eyebrow.textContent = contactJson.sectionTitle;

    const heading = document.getElementById('cta-banner-heading');
    if (heading) heading.textContent = contactJson.mainTitle;

    const text = document.querySelector('.cta-banner__content p');
    if (text) text.textContent = contactJson.text;

    const ctaButton = document.querySelector('.cta-banner__btn');
    if (ctaButton && contactJson.ctaButton) {
        ctaButton.href = contactJson.ctaButton.link;
        const arrowIcon = await fetch(`${PATHS.svg}/arrow.svg?v=${VERSION}`).then(res => res.text());
        ctaButton.innerHTML = `
            ${contactJson.ctaButton.text}
            ${arrowIcon}
            <span class="sr-only"> (abre em nova aba)</span>
        `;
    }
})();
