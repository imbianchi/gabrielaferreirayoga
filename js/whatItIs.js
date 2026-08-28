import { PATHS, VERSION } from './globals.js';

const whatItIsHtml = await fetch(`${PATHS.modules}/whatItIs.html?v=${VERSION}`).then(res => res.text());
document.getElementById('kundalini').outerHTML = whatItIsHtml;

import whatItIsJson from '../data/whatItIs.json' with { type: 'json' };

/**
 * What Is Kundalini Yoga JavaScript
 * Handle data from whatItIs.json
 */
(function () {
    'use strict';

    const img = document.querySelector('.kundalini__photo-col img');
    if (img && whatItIsJson.image) {
        img.src = `${PATHS.images}/${whatItIsJson.image}.webp`;
    }

    const eyebrow = document.querySelector('.kundalini__text-col .eyebrow');
    if (eyebrow) eyebrow.textContent = whatItIsJson.sectionTitle;

    const heading = document.getElementById('kundalini-heading');
    if (heading) heading.textContent = whatItIsJson.mainTitle;

    const paragraphs = document.querySelectorAll('.kundalini__text-col p');
    if (paragraphs[0]) paragraphs[0].textContent = whatItIsJson.textSummary;
    if (paragraphs[1]) paragraphs[1].textContent = whatItIsJson.textSummaryExtended;
})();
