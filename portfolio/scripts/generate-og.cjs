/*
 * Regenerates public/og-image.png (1200x630) — the social-share preview image.
 *
 * Usage:
 *   npm i -D @resvg/resvg-js
 *   node scripts/generate-og.cjs
 *
 * Edit the name / role / tags below, then re-run. @resvg/resvg-js is only needed
 * for this script, so it lives as a devDependency (or install it on demand).
 */
const fs = require('fs')
const path = require('path')
const { Resvg } = require('@resvg/resvg-js')

const W = 1200
const H = 630

const NAME = 'Manoj P.'
const ROLE = 'Full Stack Developer & AI Engineer'
const TAGLINE = 'Responsive web, cloud & LLM-powered applications · London, UK'
const TAGS = ['React', 'Node.js', 'Python', 'AWS', 'RAG', 'LLM APIs']

let tx = 80
const tagSvg = TAGS.map((t) => {
  const w = 34 + t.length * 15
  const pill = `
    <g>
      <rect x="${tx}" y="486" rx="22" ry="22" width="${w}" height="44"
            fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)"/>
      <text x="${tx + w / 2}" y="514" text-anchor="middle"
            font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="600"
            fill="#c9ccd8">${t}</text>
    </g>`
  tx += w + 14
  return pill
}).join('')

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c4b5fd"/>
      <stop offset="0.5" stop-color="#a5b4fc"/>
      <stop offset="1" stop-color="#67e8f9"/>
    </linearGradient>
    <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#a78bfa"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
    <radialGradient id="glowV" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#8b5cf6" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowC" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#08080d"/>
  <circle cx="1040" cy="90" r="360" fill="url(#glowV)"/>
  <circle cx="140" cy="620" r="340" fill="url(#glowC)"/>
  <rect x="80" y="78" width="72" height="72" rx="18" fill="url(#mark)"/>
  <text x="116" y="128" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif"
        font-size="44" font-weight="800" fill="#0a0a12">M</text>
  <text x="168" y="126" font-family="Segoe UI, Arial, sans-serif" font-size="26"
        font-weight="700" fill="#f3f4f8">Manoj<tspan fill="#a78bfa">.dev</tspan></text>
  <g>
    <rect x="928" y="92" width="192" height="44" rx="22"
          fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)"/>
    <circle cx="954" cy="114" r="6" fill="#34d399"/>
    <text x="972" y="121" font-family="Segoe UI, Arial, sans-serif" font-size="18"
          fill="#b4b7c4">Open to work</text>
  </g>
  <text x="78" y="300" font-family="Segoe UI, Arial, sans-serif" font-size="104"
        font-weight="800" fill="#f3f4f8" letter-spacing="-3">${NAME}</text>
  <text x="80" y="372" font-family="Segoe UI, Arial, sans-serif" font-size="46"
        font-weight="700" fill="url(#brand)">${ROLE}</text>
  <text x="80" y="424" font-family="Segoe UI, Arial, sans-serif" font-size="26"
        fill="#9aa0b0">${TAGLINE}</text>
  ${tagSvg}
</svg>`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: W },
  font: { loadSystemFonts: true },
  background: '#08080d',
})
const out = path.join(__dirname, '..', 'public', 'og-image.png')
fs.writeFileSync(out, resvg.render().asPng())
console.log('Wrote', out)
