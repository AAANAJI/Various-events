#!/usr/bin/env node
/**
 * Static site generator. Emits one directory per route per language, so nginx's
 * default directory-index resolves every URL with no server configuration —
 * and an unknown URL returns an honest 404 rather than a 200 that lies.
 */
import { mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { LANGS, DIR, outDir, rootFrom, linkTo, esc, t, indexImages, widthsFor, walk } from './lib.mjs'
import { nav as navSource, ui, brand, contact } from '../content/site.mjs'
import { projects } from '../content/projects.mjs'
import { services } from '../content/services.mjs'
import * as P from './pages.mjs'
import { masthead, footer, resolveNav } from './components.mjs'

// Services drive their own sub-menu, so the menu and the pages cannot drift.
const nav = resolveNav(navSource, { services })
const sectionOf = id => nav.find(n => n.id === id)

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const ASSETS = join(ROOT, 'assets')

// Staging only. A preview site carrying a client's name must not be indexable.
const ROBOTS = 'noindex, nofollow'

rmSync(DIST, { recursive: true, force: true })
mkdirSync(DIST, { recursive: true })

cpSync(ASSETS, join(DIST, 'assets'), { recursive: true })
indexImages(join(ASSETS, 'img'))

// pattern.svg strokes with `currentColor` so it stays recolourable in the repo,
// but it is referenced from an <img>, which cannot inherit colour. Bake the one
// variant this dark-only site needs and ship that instead of both files.
writeFileSync(
  join(DIST, 'assets/logo/pattern-white.svg'),
  readFileSync(join(ASSETS, 'logo/pattern.svg'), 'utf8').replaceAll('currentColor', '#ffffff'),
)
rmSync(join(DIST, 'assets/logo/pattern.svg'))

// One stylesheet, concatenated in cascade order — fewer requests, no bundler.
const css = ['tokens', 'base', 'layout', 'components']
  .map(f => readFileSync(join(ROOT, 'src/css', `${f}.css`), 'utf8'))
  .join('\n')
mkdirSync(join(DIST, 'css'), { recursive: true })
writeFileSync(join(DIST, 'css/site.css'), css)

mkdirSync(join(DIST, 'js'), { recursive: true })
cpSync(join(ROOT, 'src/js/site.js'), join(DIST, 'js/site.js'))

/** Wrap a page's body in the full document shell. */
function document_({ route, lang, title, description, body, heroImage, heroSizes }) {
  const up = rootFrom(route, lang)
  const other = lang === 'ar' ? 'en' : 'ar'
  return `<!doctype html>
<html lang="${lang}" dir="${DIR[lang]}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${ROBOTS}">
<meta name="theme-color" content="#0f1b28">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:locale" content="${lang === 'ar' ? 'ar_SA' : 'en_US'}">
<link rel="alternate" hreflang="${other}" href="${esc(linkTo(route, lang, route, other))}">
<link rel="alternate" hreflang="${lang}" href="${esc(linkTo(route, lang, route, lang))}">
<link rel="icon" href="${esc(up)}assets/logo/mark.svg" type="image/svg+xml">
<link rel="preload" href="${esc(up)}assets/fonts/IBMPlexSansArabic-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${esc(up)}assets/fonts/IBMPlexSansArabic-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${esc(up)}css/site.css">
${heroImage ? preloadHero(up, heroImage, heroSizes) : ''}
</head>
<body>
<a class="skip-link" href="#main">${esc(t(ui.skipToContent, lang))}</a>
${masthead(route, lang, nav)}
<main id="main">
<div data-top-sentinel aria-hidden="true"></div>
${body}
</main>
${footer(route, lang, { contact, ui, nav })}
<script src="${esc(up)}js/site.js" defer></script>
</body>
</html>
`
}

/**
 * Preload the above-the-fold photograph. It is the largest-contentful paint on
 * every page, and it is discovered late because it sits inside the body markup.
 */
function preloadHero(up, name, sizes = '100vw') {
  const ws = widthsFor(name)
  if (!ws.length) return ''
  const srcset = ws.map(w => `${up}assets/img/${name}-${w}.jpg ${w}w`).join(', ')
  // imagesizes MUST match the <img sizes> exactly, or the browser preloads one
  // candidate and then fetches a different one — two downloads instead of none.
  return `<link rel="preload" as="image" imagesrcset="${esc(srcset)}" imagesizes="${esc(sizes)}" fetchpriority="high">`
}

/** Every route, for both languages. */
function routes() {
  const list = [
    { route: '',               render: P.home },
    { route: 'about',          render: (r, l) => P.aboutIndex(r, l, sectionOf('about')) },
    { route: 'about/vision',   render: (r, l) => P.aboutVision(r, l, sectionOf('about')) },
    { route: 'about/values',   render: (r, l) => P.aboutValues(r, l, sectionOf('about')) },
    { route: 'about/founders', render: (r, l) => P.aboutFounders(r, l, sectionOf('about')) },
    { route: 'services',       render: (r, l) => P.servicesIndex(r, l, sectionOf('services')) },
    { route: 'process',        render: P.process },
    { route: 'work',           render: (r, l) => P.work(r, l, sectionOf('work')) },
    { route: 'sectors',        render: (r, l) => P.sectorsPage(r, l, sectionOf('work')) },
    { route: 'clients',        render: P.clientsPage },
    { route: 'contact',        render: P.contactPage },
    { route: '404',            render: P.notFound },
  ]
  services.forEach((s, i) => {
    list.push({
      route: `services/${s.slug}`,
      render: (r, l) => P.servicePage(r, l, s, services[i - 1] ?? null, services[i + 1] ?? null, sectionOf('services')),
    })
  })
  projects.forEach((p, i) => {
    list.push({
      route: `work/${p.slug}`,
      render: (r, l) => P.project(r, l, p, projects[i - 1] ?? null, projects[i + 1] ?? null),
    })
  })
  return list
}

let count = 0
for (const lang of LANGS) {
  for (const { route, render } of routes()) {
    const page = render(route, lang)
    const dir = join(DIST, outDir(route, lang))
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), document_({ route, lang, ...page }))
    count++
  }
}

// A crawler-facing robots.txt, belt and braces alongside the meta tag.
writeFileSync(join(DIST, 'robots.txt'), 'User-agent: *\nDisallow: /\n')

const files = walk(DIST)
const bytes = files.reduce((s, f) => s + readFileSync(join(DIST, f)).length, 0)
console.log(`Built ${count} pages (${LANGS.length} languages × ${routes().length} routes)`)
console.log(`${files.length} files, ${(bytes / 1024 / 1024).toFixed(2)} MB → dist/`)
