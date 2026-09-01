// Build helpers. The one rule that governs this whole file: the site is served
// from a SUBPATH (https://staging.shfrah.com/various/), so nothing may ever emit
// a root-absolute "/..." URL. Every href and src is a "../" ladder computed from
// the emitting page's own depth. `npm run check` fails the build if one slips in.

import { readdirSync, statSync, readFileSync, openSync, readSync, closeSync } from 'node:fs'

export const LANGS = ['ar', 'en']
export const DIR = { ar: 'rtl', en: 'ltr' }

/** Output directory for a route, e.g. ('work/saudi-cup','en') -> 'en/work/saudi-cup'. */
export function outDir(route, lang) {
  const parts = []
  if (lang !== 'ar') parts.push(lang)
  if (route) parts.push(route)
  return parts.join('/')
}

/** Depth of a route's directory, i.e. how many '../' hops back to the site root. */
export function depthOf(route, lang) {
  const d = outDir(route, lang)
  return d === '' ? 0 : d.split('/').length
}

/** The '../' ladder from a page back to the site root. Root page yields './'. */
export function rootFrom(route, lang) {
  const n = depthOf(route, lang)
  return n === 0 ? './' : '../'.repeat(n)
}

/** A relative link from `route` (in `lang`) to `targetRoute` (in `targetLang`). */
export function linkTo(route, lang, targetRoute, targetLang = lang) {
  const up = rootFrom(route, lang)
  const dest = outDir(targetRoute, targetLang)
  const href = dest === '' ? up : `${up}${dest}/`
  return href
}

/** Escape text for HTML body/attribute context. */
export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

/** Pick the localized half of a { ar, en } pair. Tolerates plain strings. */
export function t(v, lang) {
  if (v == null) return ''
  return typeof v === 'string' ? v : (v[lang] ?? v.ar ?? '')
}

/**
 * Read a JPEG's pixel dimensions from its SOF marker. Only the first ~64KB is
 * read, which always covers the header. Used to emit width/height on every
 * <img> so the browser reserves the right box and the page does not shift as
 * photographs load.
 */
function jpegSize(path) {
  const fd = openSync(path, 'r')
  const buf = Buffer.alloc(65536)
  const n = readSync(fd, buf, 0, buf.length, 0)
  closeSync(fd)
  let i = 2
  while (i < n - 9) {
    if (buf[i] !== 0xff) { i++; continue }
    const marker = buf[i + 1]
    // SOF0..SOF15, excluding DHT(C4), JPG(C8) and DAC(CC)
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) }
    }
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue }
    i += 2 + buf.readUInt16BE(i + 2)
  }
  return null
}

/** Widths actually generated for each image, plus its intrinsic aspect ratio. */
const imgWidths = new Map()
const imgRatio = new Map()
export function indexImages(assetsImgDir) {
  for (const f of readdirSync(assetsImgDir)) {
    const m = /^(.+)-(\d+)\.jpg$/.exec(f)
    if (!m) continue
    const [, name, w] = m
    if (!imgWidths.has(name)) imgWidths.set(name, [])
    imgWidths.get(name).push(Number(w))
    if (!imgRatio.has(name)) {
      const size = jpegSize(`${assetsImgDir}/${f}`)
      if (size) imgRatio.set(name, size.height / size.width)
    }
  }
  for (const arr of imgWidths.values()) arr.sort((a, b) => a - b)
  return imgWidths
}

export function widthsFor(name) {
  return imgWidths.get(name) ?? []
}

/**
 * A responsive <img>. `sizes` is the CSS sizes attribute. Always emits a
 * relative src, a srcset across the generated widths, explicit dimensions where
 * known, and lazy/async decoding unless it is the page's LCP image.
 */
export function img(route, lang, name, { alt, sizes, className, eager = false, ratio } = {}) {
  const ws = widthsFor(name)
  if (!ws.length) throw new Error(`No generated widths for image "${name}"`)
  const up = rootFrom(route, lang)
  const src = `${up}assets/img/${name}-${ws[ws.length - 1]}.jpg`
  const srcset = ws.map(w => `${up}assets/img/${name}-${w}.jpg ${w}w`).join(', ')
  // Intrinsic dimensions of the largest variant, so the browser reserves the
  // correct box before the photograph arrives (no layout shift).
  const wMax = ws[ws.length - 1]
  const r = imgRatio.get(name)
  const attrs = [
    `src="${esc(src)}"`,
    `srcset="${esc(srcset)}"`,
    `sizes="${esc(sizes || '100vw')}"`,
    `alt="${esc(alt || '')}"`,
    `width="${wMax}"`,
    r ? `height="${Math.round(wMax * r)}"` : '',
    className ? `class="${esc(className)}"` : '',
    eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"',
    ratio ? `style="aspect-ratio:${esc(ratio)}"` : '',
  ].filter(Boolean)
  return `<img ${attrs.join(' ')}>`
}

/** Inline an SVG file's markup so it can inherit currentColor. */
export function inlineSvg(src, { className, ariaHidden = true } = {}) {
  let s = src.trim().replace(/<\?xml[^>]*\?>\s*/i, '')
  if (className) s = s.replace(/<svg/i, `<svg class="${esc(className)}"`)
  if (ariaHidden) s = s.replace(/<svg/i, '<svg aria-hidden="true" focusable="false"')
  return s
}

export function walk(dir, base = dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = `${dir}/${f}`
    if (statSync(p).isDirectory()) walk(p, base, out)
    else out.push(p.slice(base.length + 1))
  }
  return out
}
