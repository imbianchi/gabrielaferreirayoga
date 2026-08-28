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

})();
