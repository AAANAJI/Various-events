#!/usr/bin/env node
/**
 * Build guard. The site is served from a subpath, so a single root-absolute
 * URL ("/assets/site.css") silently resolves outside the deployment and 404s —
 * the classic "unstyled black-on-white Times New Roman" failure. This refuses
 * to let one ship, and also verifies every local link actually resolves to a
 * file on disk.
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { walk } from './lib.mjs'

const DIST = new URL('../dist/', import.meta.url).pathname
let errors = 0
const fail = m => { console.error(`  ✗ ${m}`); errors++ }

if (!existsSync(DIST)) { console.error('dist/ does not exist — run the build first.'); process.exit(1) }

const files = walk(DIST)
const html = files.filter(f => f.endsWith('.html'))
console.log(`Checking ${html.length} HTML files (${files.length} files total)…\n`)

// 1. No root-absolute links anywhere.
const ABS = /\b(?:href|src|srcset|action|content)\s*=\s*"(\/[^"/][^"]*)"/g
for (const f of html) {
  const body = readFileSync(join(DIST, f), 'utf8')
  for (const m of body.matchAll(ABS)) fail(`${f}: root-absolute URL "${m[1]}"`)
}

// 2. Every local href/src resolves to something that exists.
const REF = /\b(?:href|src)\s*=\s*"([^"#?][^":]*?)"/g
for (const f of html) {
  const body = readFileSync(join(DIST, f), 'utf8')
  const base = dirname(join(DIST, f))
  for (const m of body.matchAll(REF)) {
    const raw = m[1]
    if (/^(https?:|mailto:|tel:|data:|#)/i.test(raw)) continue
    const clean = raw.split(/[#?]/)[0]
    if (!clean) continue
    let target = resolve(base, clean)
    if (!existsSync(target)) { fail(`${f}: dead link "${raw}"`); continue }
    if (statSync(target).isDirectory() && !existsSync(join(target, 'index.html'))) {
      fail(`${f}: "${raw}" is a directory with no index.html`)
    }
  }
}

// 3. srcset candidates resolve too.
for (const f of html) {
  const body = readFileSync(join(DIST, f), 'utf8')
  const base = dirname(join(DIST, f))
  for (const m of body.matchAll(/srcset\s*=\s*"([^"]+)"/g)) {
    for (const cand of m[1].split(',')) {
      const url = cand.trim().split(/\s+/)[0]
      if (!url || /^(https?:|data:)/i.test(url)) continue
      if (!existsSync(resolve(base, url))) fail(`${f}: dead srcset candidate "${url}"`)
    }
  }
}

// 4. Logical properties only. One stylesheet serves both reading directions, so
//    a single physical `margin-left` or `text-align: right` silently breaks the
//    mirror on one edition only — the kind of bug nobody notices until a client
//    does. This is what stops the discipline decaying as pages get added.
const cssPath = join(DIST, 'css/site.css')
if (existsSync(cssPath)) {
  const css = readFileSync(cssPath, 'utf8')
  const PHYSICAL = [
    /(?:margin|padding)-(?:left|right)\s*:/g,
    /border-(?:left|right)(?:-\w+)?\s*:/g,
    /text-align\s*:\s*(?:left|right)\b/g,
    /float\s*:\s*(?:left|right)\b/g,
    // Bare offsets. `inset:` and `inset-inline-*` are direction-neutral and fine.
    /(?:^|[;{]|\n)\s*(?:top|bottom|left|right)\s*:\s*[-\d]/g,
  ]
  for (const re of PHYSICAL) {
    for (const m of css.matchAll(re)) {
      const line = css.slice(0, m.index).split('\n').length
      fail(`css/site.css:${line}: physical property "${m[0].trim().replace(/\s+/g, ' ')}" — use the logical equivalent (inset-inline-start, margin-inline-end, text-align: start/end)`)
    }
  }
}

// 5. Every page declares lang and dir, and is marked noindex for staging.
for (const f of html) {
  const body = readFileSync(join(DIST, f), 'utf8')
  const tag = /<html[^>]*>/i.exec(body)?.[0] ?? ''
  if (!/\blang="(ar|en)"/.test(tag)) fail(`${f}: <html> missing a valid lang attribute`)
  if (!/\bdir="(rtl|ltr)"/.test(tag)) fail(`${f}: <html> missing a valid dir attribute`)
  if (!/name="robots"[^>]*noindex/i.test(body)) fail(`${f}: missing noindex robots meta`)
  if (!/<title>[^<]+<\/title>/i.test(body)) fail(`${f}: missing or empty <title>`)
}

// 6. Both language editions exist for every route.
const arRoutes = html.filter(f => !f.startsWith('en/')).map(f => f.replace(/index\.html$/, ''))
for (const r of arRoutes) {
  if (!existsSync(join(DIST, 'en', r, 'index.html'))) fail(`missing English edition for route "${r || '/'}"`)
}

console.log(errors === 0
  ? `\n✓ All checks passed — ${html.length} pages, zero root-absolute links, zero dead links.`
  : `\n✗ ${errors} problem(s) found.`)
process.exit(errors === 0 ? 0 : 1)
