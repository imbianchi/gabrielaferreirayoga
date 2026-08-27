# Gabriela Ferreira Yoga

Static one-page website for **Gabriela Ferreira Yoga** — Kundalini Yoga classes in Vila Nova de Gaia, Portugal.

## Tech stack

Plain HTML5 + CSS3 + vanilla JavaScript. No frameworks, no build tools, no npm, no dependencies.

## How to run

Open `index.html` directly in a browser, or serve the repo root as static files:

```bash
# Python 3
python -m http.server 8080

# Node.js (npx only, no install)
npx serve .
```

Then visit `http://localhost:8080`.

## Deployment

Deployed as a **GitHub Page** from the repository root (no build step required). Configure GitHub Pages to serve from the `main` branch, root directory.

> **TODO:** Once the GitHub Pages URL is known, update the canonical URL in `index.html` and the URL in `sitemap.xml`.

## Files

```
index.html          — single-page site
css/style.css       — all styles (mobile-first, design-token driven)
js/script.js        — vanilla JS (menu, accordions, smooth scroll, sticky header)
images/             — placeholder assets (swap in real photos/icons as needed)
robots.txt          — trivial robots file
sitemap.xml         — trivial sitemap (one URL)
```

## Placeholders to replace

- **WhatsApp number** — search for `351XXXXXXXXX` and `000 000 000` in `index.html` and replace with the real number.
- **Canonical URL** — update `<link rel="canonical">` in `index.html` and `<loc>` in `sitemap.xml`.
- **Images** — drop real photos into `/images/` using the exact filenames already referenced (`hero.jpg`, `kundalini.jpg`, `gabriela.jpg`, `contact-bg.jpg`, `lesson-01.jpg`–`lesson-04.jpg`, `og-cover.jpg`).
- **Logo icon** — replace `/images/logo-icon.svg` with the real logomark (lotus/sun + seated figure silhouette).
- **Favicon** — replace `/images/favicon.ico` and `/images/favicon.svg` with the real icon.

---