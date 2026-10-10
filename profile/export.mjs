#!/usr/bin/env node
/**
 * Print each edition of the profile to PDF.
 *
 *   node profile/build.mjs && node profile/export.mjs
 *
 * Needs Playwright with Chromium. It is not a dependency of the website —
 * the site builds with nothing installed — so it is resolved from the local
 * node_modules first and then from the global install.
 *
 * Chromium turns every `<a href="#id">` into an internal PDF link, so the
 * contents page, the chapter dividers, the page footers and the client list
 * all stay clickable in the exported file.
 */
import { createRequire } from 'node:module'
import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { statSync } from 'node:fs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'dist-profile')

async function loadPlaywright() {
  try { return createRequire(import.meta.url)('playwright') } catch {}
  const globalRoot = execSync('npm root -g').toString().trim()
  return (await import(pathToFileURL(join(globalRoot, 'playwright/index.js')).href)).default
}

const { chromium } = await loadPlaywright()
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] })
const names = { ar: 'VARIOUS-Profile-2026-AR.pdf', en: 'VARIOUS-Profile-2026-EN.pdf' }

for (const lang of ['ar', 'en']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto(pathToFileURL(join(OUT, lang, 'index.html')).href, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  const file = join(OUT, names[lang])
  await page.pdf({
    path: file,
    width: '1280px',
    height: '720px',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  })
  const pages = await page.locator('section.page').count()
  console.log(`${names[lang]}: ${pages} pages, ${(statSync(file).size / 1024 / 1024).toFixed(1)} MB`)
  await page.close()
}
await browser.close()
