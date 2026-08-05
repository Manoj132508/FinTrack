# Manoj P. — Portfolio

A premium, animated single-page portfolio built with **React + Vite**, **Framer Motion**, and **Lenis** smooth scrolling. Dark aesthetic with an aurora background, scroll-triggered reveals, magnetic buttons, 3D tilt cards, count-up stats, a filterable projects grid, and a working contact form.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # production build → dist/
npm run preview  # preview the build
```

## Editing content

All copy lives in one file: [`src/data/content.js`](src/data/content.js). Update text, projects, skills, and links there — no component edits needed.

## ✅ Finish-setup checklist

A few values are placeholders you should set in `src/data/content.js` (and `index.html`):

1. **Social links** — `profile.github` and `profile.linkedin` are currently generic (`https://github.com/`, `https://www.linkedin.com/`). Replace with your real profile URLs.
2. **Deployed URL** — set `profile.siteUrl` and update the matching URLs in `index.html`
   (`<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`). Absolute URLs are
   required for social-share previews to work.
3. **Contact form** (optional, to receive messages in-page) — the form works out of the box by
   opening the visitor's email app pre-addressed to you. To get real in-page submissions,
   set **one** of these in `content.js`:
   - `profile.formspreeEndpoint` → your Formspree endpoint, e.g. `https://formspree.io/f/abcdwxyz`
     (free at [formspree.io](https://formspree.io))
   - `profile.web3formsKey` → your Web3Forms access key (free at [web3forms.com](https://web3forms.com))

## Social preview image

`public/og-image.png` (1200×630) is the image shown when the site is shared on
LinkedIn / X / Slack etc. Replace it with your own 1200×630 PNG anytime, or regenerate
the branded one from `scripts/generate-og.cjs` (see the comment in that file).

## Deploy

This is a static site — deploy `dist/` (after `npm run build`) to **Vercel**, **Netlify**, or
**GitHub Pages**. On Vercel/Netlify just point them at this folder; the framework preset is Vite.

## Tech

React 18 · Vite 5 · Framer Motion · Lenis · hand-rolled CSS design system.
