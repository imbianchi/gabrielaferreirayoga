import { PATHS, VERSION } from './globals.js';

const currentProgramHtml = await fetch(`${PATHS.modules}/currentProgram.html?v=${VERSION}`).then(res => res.text());
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
            const arrowIcon = await fetch(`${PATHS.svg}/arrow.svg?v=${VERSION}`).then(res => res.text());
            ctaButton.innerHTML = `
                ${slider.ctaButton.text}
                ${arrowIcon}
            `;
        }
    }
})();

/**
 * Programa do Mês JavaScript
 * Accordion ("Saber mais") and lesson cards carousel behavior
 */
(function () {
    'use strict';

    /* ── Program accordion ("Learn more") ─────────────────── */
    const progAccordion = document.querySelector('[data-accordion="program"]');
    if (progAccordion) {
        const trigger = progAccordion.querySelector('.accordion__trigger');
        const body = progAccordion.querySelector('.accordion__body');
        const icon = progAccordion.querySelector('.accordion__icon');

        function openProgAccordion() {
            trigger.setAttribute('aria-expanded', 'true');
            body.style.maxHeight = body.scrollHeight + 'px';
            icon && icon.classList.add('is-open');
            body.addEventListener('transitionend', function onEnd() {
                if (trigger.getAttribute('aria-expanded') === 'true') {
                    body.style.maxHeight = 'none';
                }
                body.removeEventListener('transitionend', onEnd);
            });
        }

        trigger && trigger.addEventListener('click', function () {
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                trigger.setAttribute('aria-expanded', 'false');
                body.style.maxHeight = '0';
                icon && icon.classList.remove('is-open');
            } else {
                openProgAccordion();
            }
        });

        // Open by default at every screen size.
        trigger.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = 'none';
        icon && icon.classList.add('is-open');
    }

    /* ── Lesson cards prev/next ───────────────────────────── */
    const cardRow = document.querySelector('.lesson-cards');
    const btnPrev = document.querySelector('.lesson-cards-nav--prev');
    const btnNext = document.querySelector('.lesson-cards-nav--next');

    if (cardRow && btnPrev && btnNext) {
        function getCardWidth() {
            const firstCard = cardRow.querySelector('.lesson-card');
            if (!firstCard) return 300;
            const style = window.getComputedStyle(cardRow);
            const gap = parseFloat(style.gap) || 16;
            return firstCard.offsetWidth + gap;
        }
        // Each arrow reflects whether there's actually more to scroll to on
        // that side — both show at once in the middle when there are enough
        // slides, only one shows at the start/end.
        function updateCardNav() {
            const maxScroll = cardRow.scrollWidth - cardRow.clientWidth;
            btnPrev.classList.toggle('is-visible', cardRow.scrollLeft > 8);
            btnNext.classList.toggle('is-visible', cardRow.scrollLeft < maxScroll - 8);
        }

        btnNext.addEventListener('click', function () {
            cardRow.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        });
        btnPrev.addEventListener('click', function () {
            cardRow.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        });

        // Debounced so the arrows reflect where the scroll settles, not every
        // intermediate position while a smooth scroll animation is still moving.
        let scrollSettleTimer;
        function scheduleUpdateCardNav() {
            clearTimeout(scrollSettleTimer);
            scrollSettleTimer = setTimeout(updateCardNav, 120);
        }
        cardRow.addEventListener('scroll', scheduleUpdateCardNav, { passive: true });
        window.addEventListener('resize', updateCardNav);
        updateCardNav();

        // Cinematic focus: the card mostly in view is at full opacity,
        // the ones peeking at the edges are gently dimmed.
        const cards = Array.from(cardRow.querySelectorAll('.lesson-card'));
        let focusRaf;
        function updateCardFocus() {
            const containerRect = cardRow.getBoundingClientRect();
            cards.forEach(function (card) {
                const cardRect = card.getBoundingClientRect();
                const visibleLeft = Math.max(cardRect.left, containerRect.left);
                const visibleRight = Math.min(cardRect.right, containerRect.right);
                const visibleWidth = Math.max(0, visibleRight - visibleLeft);
                card.classList.toggle('is-focused', visibleWidth / cardRect.width > 0.6);
            });
        }
        function scheduleCardFocus() {
            if (focusRaf) return;
            focusRaf = requestAnimationFrame(function () {
                updateCardFocus();
                focusRaf = null;
            });
        }
        cardRow.addEventListener('scroll', scheduleCardFocus, { passive: true });
        window.addEventListener('resize', scheduleCardFocus);
        updateCardFocus();
    }
})();
