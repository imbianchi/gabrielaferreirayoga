import { PATHS } from './globals.js';

const currentProgramHtml = await fetch(`${PATHS.modules}/currentProgram.html`).then(res => res.text());
document.getElementById('program').outerHTML = currentProgramHtml;

import currentProgramJson from '../data/currentProgram.json' with { type: 'json' };

/**
 * Current Program JavaScript
 * Handle data from currentProgram.json
 */
(async function () {
    'use strict';

    const monthLabel = new Date(2000, currentProgramJson.month - 1)
        .toLocaleDateString('pt-PT', { month: 'long' });

    const eyebrow = document.getElementById('program-eyebrow');
    if (eyebrow) eyebrow.textContent = `${currentProgramJson.sectionTitle} · ${monthLabel}`;

    const heading = document.getElementById('program-heading');
    if (heading) heading.textContent = currentProgramJson.mainTitle;

    const intro = document.querySelector('.program__intro p');
    if (intro) intro.textContent = currentProgramJson.textSummary;

    const note = document.querySelector('.program__note');
    if (note) note.textContent = currentProgramJson.textSummaryExtended;

    const infoList = document.querySelector('.program__info-list');
    if (infoList && currentProgramJson.bulletInfo) {
        infoList.innerHTML = currentProgramJson.bulletInfo
            .map((item) => `<li>${item}</li>`)
            .join('<li class="program__info-dot" aria-hidden="true">&bull;</li>');
    }

    const triggerLabel = document.querySelector('.accordion__trigger-label');
    if (triggerLabel) triggerLabel.textContent = currentProgramJson.secondTitle;

    const bodyParagraphs = document.querySelectorAll('.accordion__body-inner > p');
    if (bodyParagraphs[0]) bodyParagraphs[0].textContent = currentProgramJson.secondTextSummary;

    const slider = currentProgramJson.slider;
    if (slider) {
        const lessonCards = document.querySelector('.lesson-cards');
        if (lessonCards && slider.slides) {
            lessonCards.innerHTML = slider.slides.map((slide, index) => {
                const num = String(index + 1).padStart(2, '0');
                return `
                    <article class="lesson-card" role="listitem">
                        <img
                            src="${PATHS.images}/${slide.image}.webp"
                            alt="Aula ${num} — ${slide.title}"
                            class="lesson-card__img"
                            width="700"
                            height="980"
                            loading="lazy">
                        <div class="lesson-card__overlay">
                            <span class="lesson-card__eyebrow">Aula ${num}</span>
                            <h3 class="lesson-card__title">${slide.title}</h3>
                            <p class="lesson-card__desc">${slide.description}</p>
                        </div>
                    </article>
                `;
            }).join('');
        }

        const sliderEyebrow = document.querySelector('.accordion__inner-eyebrow');
        if (sliderEyebrow) sliderEyebrow.textContent = slider.title;

        if (bodyParagraphs[1]) bodyParagraphs[1].textContent = slider.textSummary;

        const ctaButton = document.querySelector('.accordion__inner-btn');
        if (ctaButton && slider.ctaButton) {
            ctaButton.href = slider.ctaButton.link;
            const arrowIcon = await fetch(`${PATHS.svg}/arrow.svg`).then(res => res.text());
            ctaButton.innerHTML = `
                ${slider.ctaButton.text}
                ${arrowIcon}
            `;
        }
    }
})();
