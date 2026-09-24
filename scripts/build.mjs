#!/usr/bin/env node
/**
 * Static build: bakes data/*.json into modules/*.html templates and
 * inlines the result into index.html, so the site ships as plain,
 * pre-rendered HTML instead of relying on client-side fetch() calls
 * to assemble the page. Content is still edited only in data/*.json —
 * this script is the one place that turns that data into markup.
 *
 * Output goes to dist/ (git-ignored); nothing generated is committed.
 */
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const read = (relPath) => readFileSync(path.join(ROOT, relPath), 'utf8');
const readJSON = (relPath) => JSON.parse(read(relPath));
const readSvg = (name) => read(`assets/svg/${name}.svg`).trim();
const monthLabel = (month) =>
  new Date(2000, month - 1).toLocaleDateString('pt-PT', { month: 'long' });

function loadFragment(modulePath) {
  return cheerio.load(read(modulePath), null, false);
}

function renderHeader() {
  const json = readJSON('data/header.json');
  const $ = loadFragment('modules/header.html');

  $('.nav__links').html(
    json.menuItems.map((item) => `<li><a href="${item.link}">${item.label}</a></li>`).join('')
  );

  const cta = $('.nav__cta-desktop');
  cta.attr('href', json.ctaButton.link);
  cta.html(`${readSvg('whatsapp')}${json.ctaButton.label}${readSvg('arrow')}`);

  return $.html();
}

function renderHero() {
  const json = readJSON('data/hero.json');
  const $ = loadFragment('modules/hero.html');

  const img = $('.hero__bg img');
  img.attr('src', `/assets/images/${json.image}.webp`);

  $('.hero__content h1').text(json.mainTitle);
  $('.hero__accent').text(json.subTitle);
  $('.hero__lead').text(json.textSummary);

  const cta = $('.hero__cta');
  cta.attr('href', json.ctaButton.link);
  cta.html(`${json.ctaButton.title}${readSvg('arrow')}`);

  return $.html();
}

function renderCurrentProgram() {
  const json = readJSON('data/currentProgram.json');
  const $ = loadFragment('modules/currentProgram.html');

  $('#program-eyebrow').text(`${json.sectionTitle} · ${monthLabel(json.month)}`);
  $('#program-heading').text(json.mainTitle);
  $('.program__intro p').text(json.textSummary);
  $('.program__note').text(json.textSummaryExtended);

  $('.program__info-list').html(
    json.bulletInfo
      .map((item) => `<li>${item}</li>`)
      .join('<li class="program__info-dot" aria-hidden="true">&bull;</li>')
  );

  $('.accordion__trigger-label').text(json.secondTitle);
  const bodyParagraphs = $('.accordion__body-inner > p');
  $(bodyParagraphs[0]).text(json.secondTextSummary);

  const slider = json.slider;
  if (slider) {
    $('.lesson-cards').html(
      slider.slides
        .map((slide, index) => {
          const num = String(index + 1).padStart(2, '0');
          return `
            <article class="lesson-card" role="listitem">
              <img
                src="/assets/images/${slide.image}.webp"
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
        })
        .join('')
    );

    $('.accordion__inner-eyebrow').text(slider.title);
    $(bodyParagraphs[1]).text(slider.textSummary);

    const ctaButton = $('.accordion__inner-btn');
    ctaButton.attr('href', slider.ctaButton.link);
    ctaButton.html(`${slider.ctaButton.text}${readSvg('arrow')}<span class="sr-only"> (abre em nova aba)</span>`);
  }

  return $.html();
}

function renderWhatItIs() {
  const json = readJSON('data/whatItIs.json');
  const $ = loadFragment('modules/whatItIs.html');

  $('.kundalini__photo-col img').attr('src', `/assets/images/${json.image}.webp`);
  $('.kundalini__text-col .eyebrow').text(json.sectionTitle);
  $('#kundalini-heading').text(json.mainTitle);

  const paragraphs = $('.kundalini__text-col p');
  $(paragraphs[0]).text(json.textSummary);
  $(paragraphs[1]).text(json.textSummaryExtended);

  return $.html();
}

function renderPrograms() {
  const json = readJSON('data/programs.json');
  const $ = loadFragment('modules/programs.html');

  $('.path .eyebrow').text(json.sectionTitle);

  const highlighted = json.subTitle.replace(
    json.wordToHighlight,
    `<span class="italic-accent">${json.wordToHighlight}</span>`
  );
  $('#path-heading').html(`${json.mainTitle}.<br>${highlighted}`);
  $('.path__lead').text(json.textSummary);

  const programs = json.programs;
  const firstMonth = Math.min(...programs.map((p) => p.month));
  const year = new Date().getFullYear();
  const today = (() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  })();

  // Each program has its own Mondays-only class run (4 weekly classes).
  function mondaysInMonth(month) {
    const mondays = [];
    const d = new Date(year, month - 1, 1);
    while (d.getMonth() === month - 1) {
      if (d.getDay() === 1) mondays.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return mondays;
  }

  // A program's badge state, recomputed on every build (the deploy workflow
  // rebuilds daily so this stays correct without a content change):
  //  - "available": from its first Monday class through its last Monday
  //    class — the program is running and single classes can still be sold.
  //  - "enrolling": from the 21st of the previous month (when sign-ups for
  //    the next program open) until its own first Monday class.
  // The two windows never overlap for one program, but adjacent programs
  // can each show their own badge at once during the handover week.
  function badgeStateFor(program) {
    const mondays = mondaysInMonth(program.month);
    const firstClass = mondays[0];
    const lastClass = mondays[mondays.length - 1];
    const enrollmentOpensAt =
      program.month === firstMonth
        ? new Date(0) // the very first program has no prior month to open from — open from the start
        : new Date(year, program.month - 2, 21);

    if (today >= firstClass && today <= lastClass) return 'available';
    if (today >= enrollmentOpensAt && today < firstClass) return 'enrolling';
    return null;
  }

  const items = programs
    .map((program, index) => {
      const state = badgeStateFor(program);
      const badge =
        state === 'available'
          ? `<div class="path__badge-col"><span class="badge-available">Disponível</span></div>`
          : state === 'enrolling'
          ? `<div class="path__badge-col"><span class="badge-enrolling">Inscrição aberta</span></div>`
          : '';
      return `
        <li class="path__item reveal${state ? ` is-${state}` : ''}">
          <span class="path__num" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
          <div class="path__content">
            <span class="path__month">${monthLabel(program.month)}</span>
            <h3 class="path__title">${program.title}</h3>
            <p class="path__desc">${program.textSummary}</p>
          </div>
          ${badge}
        </li>
      `;
    })
    .join('');
  $('#path-list').html(items);

  return $.html();
}

function renderWhoAmI() {
  const json = readJSON('data/whoAmI.json');
  const $ = loadFragment('modules/whoAmI.html');

  $('.about .eyebrow').text(json.sectionTitle);
  $('#about-heading').text(json.mainTitle);
  $('.about__subtitle').text(json.subTitle);

  const paragraphs = $('.about__text-col p:not(.about__subtitle)');
  $(paragraphs[0]).text(json.textSummary);
  $(paragraphs[1]).text(json.textSummaryExtended);
  $(paragraphs[2]).text(json.textSummaryExtendedTwo);

  $('.about__photo-col img').attr('src', `/assets/images/${json.image}.webp`);

  return $.html();
}

function renderFaq() {
  const json = readJSON('data/faq.json');
  const $ = loadFragment('modules/faq.html');

  $('.faq .eyebrow').text(json.sectionTitle);
  $('#faq-heading').html(
    json.mainTitle.replace(json.wordToHighlight, `<span class="italic-accent">${json.wordToHighlight}</span>`)
  );

  $('.faq-accordion').html(
    json.questions
      .map((item, index) => {
        const n = index + 1;
        return `
          <div class="faq-item reveal" role="listitem">
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
      })
      .join('')
  );

  return $.html();
}

function renderContact() {
  const json = readJSON('data/contact.json');
  const $ = loadFragment('modules/contact.html');

  $('.cta-banner__bg img').attr('src', `/assets/images/${json.image}.webp`);
  $('.cta-banner__content .eyebrow').text(json.sectionTitle);
  $('#cta-banner-heading').text(json.mainTitle);

  const cta = $('.cta-banner__btn');
  cta.attr('href', json.ctaButton.link);
  cta.html(`${json.ctaButton.text}${readSvg('arrow')}<span class="sr-only"> (abre em nova aba)</span>`);

  return $.html();
}

function renderFooter() {
  const footerJson = readJSON('data/footer.json');
  const globalsJson = readJSON('data/globals.json');
  const $ = loadFragment('modules/footer.html');

  $('.site-footer .logo__img').attr('src', `/assets/images/${footerJson.logoImage}.png`);
  $('.footer__contact-heading').text(footerJson.columnTitle);
  $('.footer__copy-text').text(footerJson.text);

  const socialLinks = {
    instagram: (social) => ({
      href: `https://instagram.com/${social.userName}`,
      label: `@${social.userName}`,
      ariaLabel: `Instagram @${social.userName} (abre em nova aba)`,
    }),
    whatsapp: (social) => ({
      href: `https://wa.me/${social.number}?text=${encodeURIComponent(
        'Olá, Gabriela. Gostaria de saber mais sobre as aulas de Kundalini Yoga.'
      )}`,
      label: 'Fala comigo',
      ariaLabel: 'WhatsApp — contactar Gabriela Ferreira (abre em nova aba)',
    }),
  };

  $('.footer__contact-links').html(
    globalsJson.socials
      .map((social) => {
        const build = socialLinks[social.icon];
        if (!build) return '';
        const { href, label, ariaLabel } = build(social);
        return `
          <a
            href="${href}"
            class="footer__contact-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="${ariaLabel}">
            ${readSvg(social.icon)}
            ${label}
          </a>
        `;
      })
      .join('')
  );

  // #footer-year is left empty here — filled client-side (see js/footer.js)
  // so it never goes stale for a return visitor loading a cached build.

  return $.html();
}

function build() {
  const $ = cheerio.load(read('index.html'));

  $('#header').html(renderHeader());
  $('#hero').html(renderHero());
  $('#program').replaceWith(renderCurrentProgram());
  $('#kundalini').replaceWith(renderWhatItIs());
  $('#path').replaceWith(renderPrograms());
  $('#about').replaceWith(renderWhoAmI());
  $('#faq').replaceWith(renderFaq());
  $('#contact').replaceWith(renderContact());
  $('#footer').replaceWith(renderFooter());

  rmSync(DIST, { recursive: true, force: true });
  mkdirSync(DIST, { recursive: true });

  writeFileSync(path.join(DIST, 'index.html'), $.html());

  for (const entry of ['assets', 'css', 'js', 'robots.txt', 'sitemap.xml', 'site.webmanifest', 'CNAME']) {
    cpSync(path.join(ROOT, entry), path.join(DIST, entry), { recursive: true });
  }

  console.log('Built dist/');
}

build();
