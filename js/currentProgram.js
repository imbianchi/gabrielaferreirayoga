/**
 * Programa do Mês JavaScript
 * Accordion ("Saber mais") and lesson cards carousel behavior.
 * Content is already rendered by the static build (see scripts/build.mjs).
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
                    body.style.overflow = 'visible';
                }
                body.removeEventListener('transitionend', onEnd);
            });
        }

        trigger && trigger.addEventListener('click', function () {
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                trigger.setAttribute('aria-expanded', 'false');
                body.style.overflow = 'hidden';
                body.style.maxHeight = '0';
                icon && icon.classList.remove('is-open');
            } else {
                openProgAccordion();
            }
        });
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
