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
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
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

const jpeg = f => 'data:image/jpeg;base64,' + readFileSync(join(ROOT, 'assets/img', f)).toString('base64')
const { contact } = await import(pathToFileURL(join(ROOT, 'content/site.mjs')).href)

const { about, method } = await import(pathToFileURL(join(ROOT, 'content/pages.mjs')).href)
const { clients } = await import(pathToFileURL(join(ROOT, 'content/clients.mjs')).href)

const assets = {
  // The client's approved copy for the pages whose words changed.
  about: { ar: about.body.map(p => p.ar), en: about.body.map(p => p.en) },
  method: method.steps,
  clients,
  cap: { en: { p09: 16.5 }, ar: {} },
  // Divider photographs: two the approved profile does not already use, and
  // two of its own.
  images: {
    d1: jpeg('mood-riyadh-1600.jpg'),
    d2: jpeg('mood-line-1600.jpg'),
    d3: jpeg('saudi-cup-1520.jpg'),
    d4: jpeg('mood-city-1600.jpg'),
  },
  social: contact.social,
  dict: JSON.parse(readFileSync(join(HERE, 'v7-dictionary.json'), 'utf8')),
}

const { chromium } = await loadPlaywright()
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] })
const names = { ar: 'VARIOUS-Profile-AR-2026-v8', en: 'VARIOUS-Profile-EN-2026-v8' }

for (const lang of ['ar', 'en']) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  await page.goto(pathToFileURL(resolve(src)).href, { waitUntil: 'load', timeout: 180000 })
  const tag = await page.addScriptTag({ path: join(HERE, 'v7-transform.js') })
  const result = await page.evaluate(([l, a]) => window.reviseV7(l, a), [lang, assets])
  await tag.evaluate(s => s.remove())     // the delivered HTML carries no script
  await page.evaluate(() => document.fonts.ready)
  if (result.leftovers.length) console.warn(`${lang}: Arabic left untranslated:\n  ` + result.leftovers.join('\n  '))
  const html = '<!DOCTYPE html>' + await page.evaluate(() => document.documentElement.outerHTML)
  writeFileSync(join(OUT, names[lang] + '.html'), html)
  const pdf = join(OUT, names[lang] + '.pdf')
  await page.pdf({ path: pdf, width: '1280px', height: '720px', printBackground: true, preferCSSPageSize: true })
  console.log(`${names[lang]}.pdf — ${result.pages} pages, ${(statSync(pdf).size / 1048576).toFixed(1)} MB`)
  await page.close()
}
await browser.close()
