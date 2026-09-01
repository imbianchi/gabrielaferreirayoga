/**
 * FAQ JavaScript
 * Accordion (single-open) behavior. Content is already rendered by
 * the static build (see scripts/build.mjs).
 */
(function () {
    'use strict';

    const faqItems = document.querySelectorAll('.faq-item');

    function openFaqItem(item) {
        const trigger = item.querySelector('.faq-item__trigger');
        const body = item.querySelector('.faq-item__body');
        const icon = item.querySelector('.faq-item__icon');
        trigger && trigger.setAttribute('aria-expanded', 'true');
        icon && icon.classList.add('is-open');
        if (body) {
            body.style.maxHeight = body.scrollHeight + 'px';
            body.addEventListener('transitionend', function onEnd() {
                if (trigger && trigger.getAttribute('aria-expanded') === 'true') {
                    body.style.maxHeight = 'none';
                }
                body.removeEventListener('transitionend', onEnd);
            });
        }
    }

    function closeFaqItem(item) {
        const trigger = item.querySelector('.faq-item__trigger');
        const body = item.querySelector('.faq-item__body');
        const icon = item.querySelector('.faq-item__icon');
        // Set explicit height before collapsing so transition works
        if (body && body.style.maxHeight === 'none') {
            body.style.maxHeight = body.scrollHeight + 'px';
            // Force reflow
            body.offsetHeight; // eslint-disable-line no-unused-expressions
        }
        trigger && trigger.setAttribute('aria-expanded', 'false');
        icon && icon.classList.remove('is-open');
        body && (body.style.maxHeight = '0');
    }

    faqItems.forEach(function (item) {
        const trigger = item.querySelector('.faq-item__trigger');
        trigger && trigger.addEventListener('click', function () {
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';
            // Close all
            faqItems.forEach(function (other) {
                if (other !== item) closeFaqItem(other);
            });
            if (isOpen) {
                closeFaqItem(item);
            } else {
                openFaqItem(item);
            }
        });
    });
})();
