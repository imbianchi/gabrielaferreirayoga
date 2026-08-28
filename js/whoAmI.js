import { PATHS, VERSION } from './globals.js';

const whoAmIHtml = await fetch(`${PATHS.modules}/whoAmI.html?v=${VERSION}`).then(res => res.text());
document.getElementById('about').outerHTML = whoAmIHtml;

import whoAmIJson from '../data/whoAmI.json' with { type: 'json' };

/**
 * Who I Am JavaScript
 * Handle data from whoAmI.json
 */
(function () {
    'use strict';

    const eyebrow = document.querySelector('.about .eyebrow');
    if (eyebrow) eyebrow.textContent = whoAmIJson.sectionTitle;

    const heading = document.getElementById('about-heading');
    if (heading) heading.textContent = whoAmIJson.mainTitle;

    const subtitle = document.querySelector('.about__subtitle');
    if (subtitle) subtitle.textContent = whoAmIJson.subTitle;

    const paragraphs = document.querySelectorAll('.about__text-col p:not(.about__subtitle)');
    if (paragraphs[0]) paragraphs[0].textContent = whoAmIJson.textSummary;
    if (paragraphs[1]) paragraphs[1].textContent = whoAmIJson.textSummaryExtended;
    if (paragraphs[2]) paragraphs[2].textContent = whoAmIJson.textSummaryExtendedTwo;

    const img = document.querySelector('.about__photo-col img');
    if (img && whoAmIJson.image) {
        img.src = `${PATHS.images}/${whoAmIJson.image}.webp`;
    }
})();
