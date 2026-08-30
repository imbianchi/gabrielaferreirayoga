/* ============================================================
   Gabriela Ferreira Yoga — script.js
   Vanilla JavaScript, no dependencies
   ============================================================ */

import './hero.js';
import { initScrollspy } from './header.js';
import './currentProgram.js';
import './whatItIs.js';
import './programs.js';
import './whoAmI.js';
import './faq.js';
import './contact.js';
import './footer.js';

(function () {
  'use strict';

  /* ── Smooth scroll ────────────────────────────────────── */
  function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const header = document.querySelector('.site-header');
    const headerH = header ? header.getBoundingClientRect().bottom : 0;
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

  /* ── Scrollspy ────────────────────────────────────────────
     Defined in header.js, called here because the section
     elements it observes are only in their final form once
     every section module has replaced its placeholder <div>. */
  initScrollspy();

  /* ── Scroll reveal ────────────────────────────────────────
     Fades/lifts .reveal and .reveal-img elements into place the
     first time they enter the viewport. Elements already visible
     when observed (e.g. the hero) reveal immediately, since
     IntersectionObserver fires on the very first observe() call. */
  /* Stagger delay for elements that reveal together (e.g. FAQ items,
     path cards): siblings fade in one after another instead of all at
     once, so the reveal reads as a cascade rather than a single flat
     pop. Capped so a long list doesn't leave the last items waiting. */
  function staggerDelay(el) {
    const parent = el.parentElement;
    if (!parent) return 0;
    const group = Array.prototype.filter.call(parent.children, function (child) {
      return child.classList.contains('reveal') || child.classList.contains('reveal-img');
    });
    return Math.min(group.indexOf(el), 6) * 90;
  }

  const revealEls = document.querySelectorAll('.reveal, .reveal-img');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.style.transitionDelay = staggerDelay(entry.target) + 'ms';
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      // Negative bottom margin: the element has to be scrolled a good
      // 200px into the viewport — not just barely peeking in — before
      // the fade starts. That extra scroll distance is what makes the
      // reveal read as a deliberate effect instead of an instant blip.
      { rootMargin: '0px 0px -200px 0px', threshold: 0 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

})();
