import { PATHS, VERSION } from './globals.js';

const programsHtml = await fetch(`${PATHS.modules}/programs.html?v=${VERSION}`).then(res => res.text());
document.getElementById('path').outerHTML = programsHtml;

import programsJson from '../data/programs.json' with { type: 'json' };

/**
 * Path Section JavaScript
 * Handle data from programs.json
 */
(function () {
    'use strict';

    const eyebrow = document.querySelector('.path .eyebrow');
    if (eyebrow) eyebrow.textContent = programsJson.sectionTitle;

    const heading = document.getElementById('path-heading');
    if (heading && programsJson.subTitle && programsJson.wordToHighlight) {
        const highlighted = programsJson.subTitle.replace(
            programsJson.wordToHighlight,
            `<span class="italic-accent">${programsJson.wordToHighlight}</span>`
        );
        heading.innerHTML = `${programsJson.mainTitle}.<br>${highlighted}`;
    }

    const lead = document.querySelector('.path__lead');
    if (lead) lead.textContent = programsJson.textSummary;

    const list = document.getElementById('path-list');
    const programs = programsJson.programs;
    if (!list || !programs || !programs.length) return;

    const currentMonth = new Date().getMonth() + 1;
    const firstMonth = Math.min(...programs.map((p) => p.month));
    // Before the season starts, show the first program as available already
    // (e.g. sign-ups open in August for the September program).
    const current = programs.find((p) => p.month === currentMonth)
        || (currentMonth < firstMonth ? programs[0] : undefined);

    programs.forEach((program, index) => {
        const isCurrent = !!current && program.month === current.month;
        const monthLabel = new Date(2000, program.month - 1).toLocaleDateString('pt-PT', { month: 'long' });

        const li = document.createElement('li');
        li.className = 'path__item reveal' + (isCurrent ? ' is-current' : '');

        const num = document.createElement('span');
        num.className = 'path__num';
        num.setAttribute('aria-hidden', 'true');
        num.textContent = String(index + 1).padStart(2, '0');

        const content = document.createElement('div');
        content.className = 'path__content';

        const month = document.createElement('span');
        month.className = 'path__month';
        month.textContent = monthLabel;

        const title = document.createElement('div');
        title.className = 'path__title';
        title.textContent = program.title;

        const desc = document.createElement('p');
        desc.className = 'path__desc';
        desc.textContent = program.textSummary;

        content.append(month, title, desc);
        li.append(num, content);

        if (isCurrent) {
            const badgeCol = document.createElement('div');
            badgeCol.className = 'path__badge-col';
            const badge = document.createElement('span');
            badge.className = 'badge-available';
            badge.textContent = 'Disponível';
            badgeCol.appendChild(badge);
            li.appendChild(badgeCol);
        }

        list.appendChild(li);
    });
})();
