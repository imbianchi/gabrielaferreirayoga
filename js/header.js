import { PATHS, VERSION } from './globals.js';

const headerHtml = await fetch(`${PATHS.modules}/header.html?v=${VERSION}`).then(res => res.text());
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

        const whatsappIcon = await fetch(`${PATHS.svg}/whatsapp.svg?v=${VERSION}`).then(res => res.text());
        const arrowIcon = await fetch(`${PATHS.svg}/arrow.svg?v=${VERSION}`).then(res => res.text());

        ctaButton.innerHTML = `
            ${whatsappIcon}
                ${headerJson.ctaButton.label}
            ${arrowIcon}
        `;
    }
})();


/**
 * Header JavaScript
 * Handles sticky header, mobile menu and scrollspy functionality
 */
(function () {
    'use strict';

    /* ── Sticky header ────────────────────────────────────── */
    const header = document.querySelector('.site-header');

    function updateHeaderBg() {
        const hero = document.querySelector('.hero');
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

    /* ── Mobile menu ──────────────────────────────────────── */
    const mobileMenu = document.querySelector('.mobile-menu');
    const hamburgerBtn = document.querySelector('.nav__hamburger');
    const closeBtn = document.querySelector('.mobile-menu__close');
    const backdrop = document.querySelector('.mobile-menu__backdrop');
    const panel = document.querySelector('.mobile-menu__panel');

    const focusableSelectors =
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function openMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.add('is-open');
        hamburgerBtn && hamburgerBtn.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        // Move focus to close button
        closeBtn && closeBtn.focus();
        document.addEventListener('keydown', menuKeyHandler);
    }

    function closeMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('is-open');
        hamburgerBtn && hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        hamburgerBtn && hamburgerBtn.focus();
        document.removeEventListener('keydown', menuKeyHandler);
    }

    function menuKeyHandler(e) {
        if (e.key === 'Escape') { closeMenu(); return; }
        if (e.key !== 'Tab') return;
        if (!panel) return;

        // Focus trap inside panel
        const focusable = Array.from(panel.querySelectorAll(focusableSelectors));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    hamburgerBtn && hamburgerBtn.addEventListener('click', openMenu);
    closeBtn && closeBtn.addEventListener('click', closeMenu);
    backdrop && backdrop.addEventListener('click', closeMenu);

    // Close menu when a nav link is clicked
    const menuLinks = document.querySelectorAll('.mobile-menu__nav a, .mobile-menu__cta');
    menuLinks.forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

})();

/**
 * Scrollspy: highlight the current section in the desktop nav.
 * Exported (not auto-run) because the sections it observes only exist
 * in their final form once every section module has replaced its
 * placeholder <div> — script.js calls this after all imports resolve.
 */
export function initScrollspy() {
    'use strict';

    const navLinks = document.querySelectorAll('.nav__links a');
    const spySections = Array.from(navLinks)
        .map(function (a) { return document.querySelector(a.getAttribute('href')); })
        .filter(Boolean);

    if (!spySections.length || !('IntersectionObserver' in window)) return;

    const spy = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const link = document.querySelector('.nav__links a[href="#' + entry.target.id + '"]');
                if (!link) return;
                navLinks.forEach(function (a) { a.classList.remove('active'); });
                link.classList.add('active');
            });
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    spySections.forEach(function (section) { spy.observe(section); });
}