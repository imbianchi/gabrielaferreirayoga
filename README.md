# Gabriela Ferreira Yoga

Static one-page website for **Gabriela Ferreira Yoga** — Kundalini Yoga classes in Vila Nova de Gaia, Portugal.

## Tech stack

Plain HTML5 + CSS3 + vanilla JavaScript (ES modules). No frameworks, no build tools, no npm, no dependencies.

## Structure

```
index.html      — page shell (SEO metadata + JSON-LD + mount points)
css/style.css   — all styles (mobile-first, design-token driven)
js/             — one ES module per section + script.js for behaviour
modules/        — HTML fragments injected per section (fetch-based)
data/           — content as JSON (single source of truth per section)
assets/images/  — photos (webp)
assets/svg/     — inline SVG assets
robots.txt      — points to sitemap
sitemap.xml     — canonical URL
```

Every section is loaded at runtime: `js/*.js` fetches the matching HTML fragment from `modules/`, imports the content from `data/`, and injects it into the mount point in `index.html`.

## How to run

The page relies on `fetch()`, so it must be served over HTTP (opening `index.html` directly will not work):

```bash
# Python 3
python -m http.server 8080

# Node.js (npx only, no install)
npx serve .
```

Then visit `http://localhost:8080`.

## Deployment

Served as a **GitHub Page** from the repository root (no build step). GitHub Pages must be configured to serve from the `main` branch, root directory.

## Edit content

Content lives in `data/*.json` — one file per section (`hero.json`, `currentProgram.json`, `whatItIs.json`, `programs.json`, `whoAmI.json`, `faq.json`, `contact.json`, `footer.json`, `header.json`). Text, links (WhatsApp, Instagram) and prices are edited there, not in the HTML.

## SEO

Search metadata (title, description, Open Graph, Twitter) and structured data (LocalBusiness + hasOfferCatalog + FAQPage JSON-LD) are in the `<head>` of `index.html`. Keep prices in the catalog in sync with `data/currentProgram.json` and `data/faq.json`.