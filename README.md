# Gabriela Ferreira Yoga

Static one-page website for **Gabriela Ferreira Yoga** — Kundalini Yoga classes in Vila Nova de Gaia, Portugal.

## Tech stack

Plain HTML5 + CSS3 + vanilla JavaScript (ES modules) for behaviour, plus a small Node build script (no framework) that bakes content into static HTML at build time.

## Structure

```
index.html      — page shell (SEO metadata + JSON-LD + mount points)
css/style.css   — all styles (mobile-first, design-token driven)
js/             — one ES module per section (behaviour only: accordions, menu, scrollspy, reveal) + script.js
modules/        — HTML fragments, one per section (filled by scripts/build.mjs at build time)
data/           — content as JSON (single source of truth per section)
scripts/build.mjs — reads modules/ + data/, bakes the final index.html into dist/
assets/images/  — photos (webp)
assets/svg/     — inline SVG assets
robots.txt      — points to sitemap
sitemap.xml     — canonical URL
```

Content is baked at **build time**, not fetched by the browser: `scripts/build.mjs` fills each `modules/*.html` fragment with the matching `data/*.json`, and inlines the result into `index.html`, producing a fully pre-rendered `dist/index.html`. The browser never fetches `modules/` or `data/` — `js/*.js` only wires up interactive behaviour (accordions, mobile menu, scrollspy, scroll reveal) on markup that's already there. This keeps the page indexable and fast (no client-side render step blocking the LCP image or headings) while keeping content editing as simple as editing a JSON file.

## How to run

```bash
npm install
npm run build     # writes the finished site to dist/
npx serve dist     # or: python -m http.server 8080 --directory dist
```

Then visit `http://localhost:8080` (or whatever port `serve`/`http.server` prints).

Editing `index.html`, `modules/*.html` or `css/` directly (without running `npm run build`) works too for layout/style changes, but the mount points (`<div id="hero">`, etc.) will stay empty until a build fills them in — that's expected during authoring, not a bug.

## Deployment

Served as a **GitHub Page**, built and deployed automatically by `.github/workflows/deploy.yml`: on every push to `main` (and once a month, on the 1st, so the current monthly program stays correct even with no pushes), it runs `npm run build` and publishes `dist/` via GitHub Pages. Requires GitHub Pages set to **Source: GitHub Actions** in the repo settings (Settings → Pages) — nothing is ever committed to the repo from the build.

## Edit content

Content lives in `data/*.json` — one file per section (`hero.json`, `currentProgram.json`, `whatItIs.json`, `programs.json`, `whoAmI.json`, `faq.json`, `contact.json`, `footer.json`, `header.json`). Text, links (WhatsApp, Instagram) and prices are edited there, not in the HTML. Push to `main` (or wait for the daily rebuild) and the live site picks it up automatically.

## SEO

Search metadata (title, description, Open Graph, Twitter) and structured data (LocalBusiness + hasOfferCatalog + FAQPage JSON-LD) are in the `<head>` of `index.html`. Keep prices in the catalog in sync with `data/currentProgram.json` and `data/faq.json`.