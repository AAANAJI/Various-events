#!/usr/bin/env node
/**
 * Revise the approved v7 profile into separate Arabic and English editions.
 *
 *   node profile/revise-v7.mjs <path/to/VARIOUS…v7.html> [outDir]
 *
 * The v7 file is the client-approved design and the source of truth; it is
 * not stored in this repository. This script loads it in Chromium, applies the
 * client's revision notes to v7's own markup (profile/v7-transform.js), and
 * writes, per language, the revised HTML and its PDF. Internal links survive
 * into the PDF as clickable destinations.
 *
 * Needs Playwright with Chromium, resolved locally or from the global install.
 */
import { createRequire } from 'node:module'
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const [, , src, outArg] = process.argv
if (!src) { console.error('usage: node profile/revise-v7.mjs <v7.html> [outDir]'); process.exit(1) }
const OUT = resolve(outArg || join(ROOT, 'dist-profile'))
mkdirSync(OUT, { recursive: true })

async function loadPlaywright() {
  try { return createRequire(import.meta.url)('playwright') } catch {}
  const g = execSync('npm root -g').toString().trim()
  return (await import(pathToFileURL(join(g, 'playwright/index.js')).href)).default
}

const imgDir = join(ROOT, 'assets/img')
const dataUri = (mime, buf) => `data:${mime};base64,${buf.toString('base64')}`
/** The 1600px variant if there is one, else the largest the repository has. */
function photo(name) {
  const widths = readdirSync(imgDir).map(f => new RegExp(`^${name}-(\\d+)\\.jpg$`).exec(f)).filter(Boolean).map(m => +m[1]).sort((a, b) => a - b)
  if (!widths.length) throw new Error(`no photograph named ${name}`)
  const w = widths.includes(1600) ? 1600 : widths[widths.length - 1]
  return dataUri('image/jpeg', readFileSync(join(imgDir, `${name}-${w}.jpg`)))
}

// The profile is built from the same content files as the website, so the
// two cannot disagree: this is the client's approved copy deck.
const load = async f => import(pathToFileURL(join(ROOT, 'content', f)).href)
const [site, pages, services, projects, clients, stats] = await Promise.all(
  ['site', 'pages', 'services', 'projects', 'clients', 'stats'].map(f => load(`${f}.mjs`)))

const content = {
  brand: site.brand,
  contact: site.contact,
  contactLinks: { whatsapp: site.contact.whatsappHref },
  legal: {
    ar: 'شركة الفعاليات المتنوعة لتنظيم المعارض والمؤتمرات — سجل تجاري 1010960212',
    en: 'Various Events Company for Organizing Exhibitions and Conferences — CR 1010960212',
  },
  about: pages.about, vision: pages.vision, values: pages.values, method: pages.method, why: pages.why,
  eventTypes: services.eventTypes, frameworkAgreements: services.frameworkAgreements,
  solutions: services.solutions, ownerServices: services.ownerServices,
  projects: projects.projects, categories: projects.categories,
  clients: clients.clients, stats: stats.stats,
}
const names = new Set(['mood-riyadh', 'cover-collage', 'mood-line', 'mood-fireworks', 'mood-city'])
for (const p of content.projects) { if (p.image) names.add(p.image); for (const x of p.parts || []) if (x.image) names.add(x.image) }
const photos = Object.fromEntries([...names].map(n => [n, photo(n)]))
Object.assign(photos, { d1: photos['mood-riyadh'], d2: photos['cover-collage'], d3: photos['mood-line'], d4: photos['mood-fireworks'], d5: photos['mood-city'] })

const assets = {
  c: content,
  photos,
  mark: dataUri('image/svg+xml', readFileSync(join(ROOT, 'assets/logo/mark.svg'))),
}

const { chromium } = await loadPlaywright()
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] })
const outNames = { ar: 'VARIOUS-Profile-AR-2026-v10', en: 'VARIOUS-Profile-EN-2026-v10' }

for (const lang of ['ar', 'en']) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  await page.goto(pathToFileURL(resolve(src)).href, { waitUntil: 'load', timeout: 180000 })
  const tag = await page.addScriptTag({ path: join(HERE, 'v7-transform.js') })
  const result = await page.evaluate(([l, a]) => window.reviseV7(l, a), [lang, assets])
  await tag.evaluate(s => s.remove())     // the delivered HTML carries no script
  await page.evaluate(() => document.fonts.ready)
  if (result.leftovers.length) console.warn(`${lang}: Arabic left untranslated:\n  ` + result.leftovers.join('\n  '))
  const html = '<!DOCTYPE html>' + await page.evaluate(() => document.documentElement.outerHTML)
  writeFileSync(join(OUT, outNames[lang] + '.html'), html)
  const pdf = join(OUT, outNames[lang] + '.pdf')
  await page.pdf({ path: pdf, width: '1280px', height: '720px', printBackground: true, preferCSSPageSize: true })
  console.log(`${outNames[lang]}.pdf — ${result.pages} pages, ${(statSync(pdf).size / 1048576).toFixed(1)} MB`)
  await page.close()
}
await browser.close()
