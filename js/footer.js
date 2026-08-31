import { PATHS, VERSION } from './globals.js';

const footerHtml = await fetch(`${PATHS.modules}/footer.html?v=${VERSION}`).then(res => res.text());
document.getElementById('footer').outerHTML = footerHtml;

import footerJson from '../data/footer.json' with { type: 'json' };
import globalsJson from '../data/globals.json' with { type: 'json' };

/**
 * Footer JavaScript
 * Handle data from footer.json and globals.json
 */
(async function () {
    'use strict';

    const logo = document.querySelector('.site-footer .logo__img');
    if (logo && footerJson.logoImage) {
        logo.src = `${PATHS.images}/${footerJson.logoImage}.png`;
    }

    const contactHeading = document.querySelector('.footer__contact-heading');
    if (contactHeading) contactHeading.textContent = footerJson.columnTitle;

    const copyText = document.querySelector('.footer__copy-text');
    if (copyText) copyText.textContent = footerJson.text;

    const socialLinks = {
        instagram: (social) => ({
            href: `https://instagram.com/${social.userName}`,
            label: `@${social.userName}`,
            ariaLabel: `Instagram @${social.userName} (abre em nova aba)`,
        }),
        whatsapp: (social) => ({
            href: `https://wa.me/${social.number}?text=${encodeURIComponent('Olá, Gabriela. Gostaria de saber mais sobre as aulas de Kundalini Yoga.')}`,
            label: 'WhatsApp',
            ariaLabel: 'WhatsApp — contactar Gabriela Ferreira (abre em nova aba)',
        }),
    };

    const contactLinksContainer = document.querySelector('.footer__contact-links');
    if (contactLinksContainer && globalsJson.socials) {
        const icons = await Promise.all(
            globalsJson.socials.map((social) => fetch(`${PATHS.svg}/${social.icon}.svg?v=${VERSION}`).then((res) => res.text()))
        );

        contactLinksContainer.innerHTML = globalsJson.socials.map((social, index) => {
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
                    ${icons[index]}
                    ${label}
                </a>
            `;
        }).join('');
    }

    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = new Date().getFullYear();
})();
