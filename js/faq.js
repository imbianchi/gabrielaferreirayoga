import { PATHS } from './globals.js';

const faqHtml = await fetch(`${PATHS.modules}/faq.html`).then(res => res.text());
document.getElementById('faq').outerHTML = faqHtml;

import faqJson from '../data/faq.json' with { type: 'json' };

/**
 * FAQ JavaScript
 * Handle data from faq.json
 */
(function () {
    'use strict';

    const eyebrow = document.querySelector('.faq .eyebrow');
    if (eyebrow) eyebrow.textContent = faqJson.sectionTitle;

    const heading = document.getElementById('faq-heading');
    if (heading && faqJson.mainTitle && faqJson.wordToHighlight) {
        heading.innerHTML = faqJson.mainTitle.replace(
            faqJson.wordToHighlight,
            `<span class="italic-accent">${faqJson.wordToHighlight}</span>`
        );
    }

    const accordion = document.querySelector('.faq-accordion');
    if (accordion && faqJson.questions) {
        accordion.innerHTML = faqJson.questions.map((item, index) => {
            const n = index + 1;
            return `
                <div class="faq-item" role="listitem">
                    <button
                        class="faq-item__trigger"
                        aria-expanded="false"
                        aria-controls="faq-${n}-body"
                        id="faq-${n}-trigger">
                        <span class="faq-item__question">${item.question}</span>
                        <span class="faq-item__icon" aria-hidden="true">+</span>
                    </button>
                    <div id="faq-${n}-body" class="faq-item__body" role="region" aria-labelledby="faq-${n}-trigger">
                        <div class="faq-item__body-inner">
                            ${item.answer}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
})();
