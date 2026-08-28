import { PATHS } from './globals.js';

const headerHtml = await fetch(`${PATHS.modules}/header.html`).then(res => res.text());
document.getElementById('header').innerHTML = headerHtml;

import headerJson from '../data/header.json' with { type: 'json' };

/**
 * Header JavaScript
 * Handle data from header.json
 */
(async function () {
    'use strict';

    // Dynamically insert menu items
    const navLinksContainer = document.querySelector('.nav__links');
    if (navLinksContainer && headerJson.menuItems) {
        navLinksContainer.innerHTML = headerJson.menuItems.map(item => {
            return `<li><a href="${item.link}">${item.label}</a></li>`;
        }).join('');
    }

    // Dynamically insert CTA button
    const ctaButton = document.querySelector('.nav__cta-desktop');
    if (ctaButton && headerJson.ctaButton) {
        ctaButton.href = headerJson.ctaButton.link;

        const whatsappIcon = await fetch(`${PATHS.svg}/whatsapp.svg`).then(res => res.text());
        const arrowIcon = await fetch(`${PATHS.svg}/arrow.svg`).then(res => res.text());

        ctaButton.innerHTML = `
            ${whatsappIcon}
                ${headerJson.ctaButton.label}
            ${arrowIcon}
        `;
    }
})();


/**
 * Header JavaScript
 * Handles sticky header and scrollspy functionality
 */
(function () {
    'use strict';

    /* ── Sticky header ────────────────────────────────────── */
    const header = document.querySelector('.site-header');
    const hero = document.querySelector('.hero');

    function updateHeaderBg() {
        if (!header || !hero) return;
        const heroBottom = hero.getBoundingClientRect().bottom;
        if (heroBottom <= 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateHeaderBg, { passive: true });
    updateHeaderBg();

    /* ── Scrollspy: highlight current section in the nav ────── */
    const navLinks = document.querySelectorAll('.nav__links a');
    const spySections = Array.from(navLinks)
        .map((a) => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    if (spySections.length && 'IntersectionObserver' in window) {
        const spy = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const link = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
                    if (!link) return;
                    navLinks.forEach((a) => a.classList.remove('active'));
                    link.classList.add('active');
                });
            },
            { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
        );
        spySections.forEach((section) => spy.observe(section));
    }

})();