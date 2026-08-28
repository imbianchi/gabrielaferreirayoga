/* ============================================================
   Gabriela Ferreira Yoga — script.js
   Vanilla JavaScript, no dependencies
   ============================================================ */

import './hero.js';
import './header.js';
import './currentProgram.js';
import './whatItIs.js';
import './programs.js';
import './whoAmI.js';
import './faq.js';
import './contact.js';
import './footer.js';

(function () {
  'use strict';

  /* ── Footer year ──────────────────────────────────────── */
  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  /* ── Smooth scroll ────────────────────────────────────── */
  function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const headerH = header ? header.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const hash = anchor.getAttribute('href').slice(1);
    if (!hash) return;
    const target = document.getElementById(hash);
    if (!target) return;
    e.preventDefault();
    smoothScrollTo(hash);
  });

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

  /* ── Program accordion ("Learn more") ─────────────────── */
  const progAccordion = document.querySelector('[data-accordion="program"]');
  if (progAccordion) {
    const trigger = progAccordion.querySelector('.accordion__trigger');
    const body = progAccordion.querySelector('.accordion__body');
    const icon = progAccordion.querySelector('.accordion__icon');

    function openProgAccordion() {
      trigger.setAttribute('aria-expanded', 'true');
      body.style.maxHeight = body.scrollHeight + 'px';
      icon && (icon.textContent = '−');
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
        icon && (icon.textContent = '+');
      } else {
        openProgAccordion();
      }
    });

    // Open by default on desktop; mobile stays closed until tapped.
    if (window.innerWidth >= 1024) {
      trigger.setAttribute('aria-expanded', 'true');
      body.style.maxHeight = 'none';
      icon && (icon.textContent = '−');
    }
  }

  /* ── FAQ accordion (single-open) ─────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  function openFaqItem(item) {
    const trigger = item.querySelector('.faq-item__trigger');
    const body = item.querySelector('.faq-item__body');
    const icon = item.querySelector('.faq-item__icon');
    trigger && trigger.setAttribute('aria-expanded', 'true');
    icon && (icon.textContent = '−');
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
    icon && (icon.textContent = '+');
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

  // Open first FAQ item by default
  if (faqItems.length > 0) {
    openFaqItem(faqItems[0]);
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
  }

})();
