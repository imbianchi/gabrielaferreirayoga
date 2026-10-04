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

Content lives in `data/*.json` — one file per section (`hero.json`, `currentProgram.json`, `whatItIs.json`, `programs.json`, `whoAmI.json`, `faq.json`, `contact.json`, `footer.json`, `header.json`, `globals.json`, `seo.json`). Text, prices and WhatsApp messages are edited there, not in the HTML; image fields hold the full path (`/assets/images/hero.webp`). WhatsApp links are built from the message plus the number in `globals.json`. Push to `main` (or wait for the scheduled rebuild) and the live site picks it up automatically.

Non-technical editors use [Pages CMS](https://pagescms.org): a form-based editor over `data/*.json`, configured in `.pages.yml`. Each save commits to `main` and triggers the deploy. Every JSON field must be declared in `.pages.yml` — on save, the CMS rewrites the file with only the declared fields. The build fails (and nothing is deployed) if a JSON references a missing image or the WhatsApp number is empty.

## SEO

Title, description and share image come from `data/seo.json`; the build writes them into the `<head>` (title, Open Graph, Twitter). The FAQPage JSON-LD is generated from `data/faq.json`; the offer catalog (monthly program and single class: name, description, price) from `data/seo.json`. `index.html` keeps these tags with empty values, and the build fails if any is missing. Prices also appear in visible text (`currentProgram.json` → `bulletInfo`, `faq.json`) — keep them in sync.