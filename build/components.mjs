// Reusable markup pieces. Every function takes the page's `route` and `lang` so
// it can compute its own relative links — nothing here ever emits "/...".

import { esc, t, linkTo, rootFrom, img } from './lib.mjs'
import { num, figure, ui, nav, brand, copyrightYear } from '../content/site.mjs'

export const ARROW = '<svg class="btn__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'

/**
 * Eyebrow: primary label, hairline, secondary label. Optionally numbered.
 *
 * `tag` defaults to h2 because this IS the section's heading — the numbered
 * items beneath it are h3s, and without it the document skips a level. A small
 * visual treatment does not make it a lesser heading.
 */
export function eyebrow(label, lang, n, { tag = 'h2' } = {}) {
  const lead = t(label, lang)
  const echo = lang === 'ar' ? label.en : label.ar
  return `<${tag} class="eyebrow">
      ${n ? `<span class="eyebrow__num">${esc(num(n, lang))}</span><span class="eyebrow__sep"></span>` : ''}
      <span>${esc(lead)}</span>
      <span class="eyebrow__sep"></span>
      <span class="eyebrow__en"${lang === 'ar' ? ' lang="en" dir="ltr"' : ' lang="ar" dir="rtl"'}>${esc(echo)}</span>
    </${tag}>`
}

/** A heading whose primary language leads and whose other language echoes below. */
export function pair(value, lang, { tag = 'h2', className = '' } = {}) {
  const lead = t(value, lang)
  const other = lang === 'ar' ? 'en' : 'ar'
  // `lang` is safe on the block and lets :lang() reach it; only `dir` has to
  // stay on the inner span, since on a block it would flip text-align.
  return `<${tag} class="${esc(className)}">
      <span class="pair__lead">${esc(lead)}</span>
      <span class="pair__echo" lang="${other}">${echoSpan(value, lang)}</span>
    </${tag}>`
}

/**
 * The secondary-language echo.
 *
 * The `dir` attribute must sit on an INLINE span, never on the block that
 * holds it. A block carrying dir="ltr" inside an RTL page resolves
 * `text-align: start` to the LEFT edge, which tears the English line away from
 * the Arabic it belongs under. HTML's UA stylesheet already gives any element
 * with `dir` an implicit `unicode-bidi: isolate`, so an inline span is enough
 * to keep the run's punctuation in place while the block stays aligned with
 * its Arabic sibling.
 */
export function echoSpan(value, lang) {
  const other = lang === 'ar' ? 'en' : 'ar'
  const text = typeof value === 'string' ? value : (lang === 'ar' ? value.en : value.ar)
  return `<span lang="${other}" dir="${other === 'ar' ? 'rtl' : 'ltr'}">${esc(text)}</span>`
}

export function rule(extra = '') { return `<hr class="rule ${extra}">` }

/**
 * The deck's watermark: the five-star constellation blown up and bled off a
 * corner at ~3.5% opacity. Referenced rather than inlined so the browser
 * fetches it once for the whole site; `alt=""` keeps it out of the a11y tree.
 */
export function watermark(route, lang, extra = '') {
  const up = rootFrom(route, lang)
  return `<div class="watermark ${extra}" aria-hidden="true">
      <img src="${esc(up)}assets/logo/pattern-white.svg" alt="" width="1322" height="1304" loading="lazy" decoding="async">
    </div>`
}

/**
 * `isolate: true` wraps the label in an LTR-isolated span. Required for any
 * Latin-numeral run inside an RTL page — a phone number left to the bidi
 * algorithm renders "+966 55 051 1403" as "1403 051 55 966+".
 */
export function btn(href, label, { variant = 'primary', arrow = true, attrs = '', isolate = false } = {}) {
  const inner = isolate
    ? `<span class="lt" dir="ltr">${esc(label)}</span>`
    : `<span>${esc(label)}</span>`
  return `<a class="btn btn--${variant}" href="${esc(href)}"${attrs ? ' ' + attrs : ''}>
      ${inner}${arrow ? ARROW : ''}
    </a>`
}

export function masthead(route, lang) {
  const other = lang === 'ar' ? 'en' : 'ar'
  const up = rootFrom(route, lang)
  const items = nav.map(item => {
    const href = linkTo(route, lang, item.path, lang)
    const isHome = item.path === ''
    const current = isHome ? route === '' : (route === item.path || route.startsWith(item.path + '/'))
    return `<li><a class="nav__link" href="${esc(href)}"${current ? ' aria-current="page"' : ''}>${esc(t(item, lang))}</a></li>`
  }).join('\n        ')

  return `<header class="masthead" data-masthead>
    <div class="container masthead__inner">
      <a class="masthead__brand" href="${esc(linkTo(route, lang, '', lang))}" aria-label="${esc(t(brand.name, lang))}">
        <img class="masthead__mark" src="${esc(up)}assets/logo/mark.svg" alt="" width="236" height="201" fetchpriority="high" decoding="async">
        <img class="masthead__wordmark" src="${esc(up)}assets/logo/wordmark-light.svg" alt="" width="440" height="101" fetchpriority="high" decoding="async">
      </a>
      <nav id="site-nav" class="nav" aria-label="${esc(t(ui.menu, lang))}">
        <ul style="display:contents">
        ${items}
        </ul>
      </nav>
      <a class="lang-switch" data-lang-switch data-lang-target="${other}"
         href="${esc(linkTo(route, lang, route, other))}"
         lang="${other}" dir="${other === 'ar' ? 'rtl' : 'ltr'}"
         title="${esc(t(ui.switchLangFull, lang))}">${esc(t(ui.switchLang, lang))}</a>
      <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav">
        <span class="visually-hidden">${esc(t(ui.menu, lang))}</span>
        <svg class="nav-toggle__open" viewBox="0 0 26 26" fill="none" aria-hidden="true"><path d="M3 7h20M3 13h20M3 19h20" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
        <svg class="nav-toggle__close" viewBox="0 0 26 26" fill="none" aria-hidden="true"><path d="M5 5l16 16M21 5L5 21" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
      </button>
    </div>
  </header>`
}

export function footer(route, lang, { contact, ui: u }) {
  const up = rootFrom(route, lang)
  const navLinks = nav.slice(1).map(item =>
    `<li><a href="${esc(linkTo(route, lang, item.path, lang))}">${esc(t(item, lang))}</a></li>`
  ).join('\n            ')

  return `<footer class="site-footer">
    ${watermark(route, lang, 'watermark--start watermark--bottom')}
    <div class="container">
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          <img src="${esc(up)}assets/logo/wordmark-light.svg" alt="${esc(t(brand.name, lang))}" width="440" height="101" loading="lazy" decoding="async">
          <p class="text-en" style="max-inline-size:34ch">${esc(t(brand.tagline, lang))}</p>
        </div>
        <div>
          <h2>${esc(t(u.links, lang))}</h2>
          <ul>
            ${navLinks}
          </ul>
        </div>
        <div>
          <h2>${esc(t(nav.find(n => n.id === 'contact'), lang))}</h2>
          <ul>
            <li><a href="tel:${esc(contact.phoneHref)}" class="lt">${esc(contact.phone)}</a></li>
            <li><a href="mailto:${esc(contact.email)}" class="lt">${esc(contact.email)}</a></li>
            <li>${esc(t(contact.address, lang))}</li>
          </ul>
        </div>
      </div>
      <div class="site-footer__legal">
        <span>© ${copyrightYear} ${esc(t(brand.legalName, lang))}</span>
        <span>${esc(t(u.crLabel, lang))} <span class="lt">${esc(brand.cr)}</span></span>
        <span>${esc(t(u.copyright, lang))}</span>
      </div>
    </div>
  </footer>`
}

/** A "pause" band — one sentence over a landscape photograph. */
export function pauseBand(route, lang, image, text, alt) {
  return `<section class="pause">
    <div class="pause__media">${img(route, lang, image, { alt: alt || '', sizes: '100vw', fullBleed: true })}</div>
    <div class="pause__scrim"></div>
    <div class="container">
      ${rule()}
      <p class="pause__text">${esc(t(text, lang))}</p>
      <p class="text-en" style="margin-inline:auto;max-inline-size:40ch;margin-block-start:1rem">${echoSpan(text, lang)}</p>
    </div>
  </section>`
}

/** Project card for the work grid. */
export function projectCard(route, lang, project, { featured = false } = {}) {
  const href = linkTo(route, lang, `work/${project.slug}`, lang)
  const client = project.client ? t(project.client, lang) : ''
  const title = t(project.title, lang)
  const alt = [client, title].filter(Boolean).join(' — ')
  const tags = (project.tags || []).slice(0, 2)
    .map(tg => `<li class="tag">${esc(t(tg, lang))}</li>`).join('')

  return `<article class="card${featured ? ' card--featured' : ''}" data-reveal>
      <div class="card__media">
        ${img(route, lang, project.image, {
          alt,
          sizes: featured
            ? '(min-width: 68rem) 62vw, (min-width: 40rem) 92vw, 92vw'
            : '(min-width: 68rem) 31vw, (min-width: 40rem) 46vw, 92vw',
        })}
      </div>
      ${client ? `<p class="card__client">${esc(client)}</p>` : ''}
      <h3 class="card__title"><a class="card__link" href="${esc(href)}">${esc(title)}</a></h3>
      <p class="card__title-en">${echoSpan(project.title, lang)}</p>
      ${tags ? `<ul class="card__tags">${tags}</ul>` : ''}
    </article>`
}

/** Numbered blocks — values, methodology, why-us. */
export function numberedList(items, lang, { columns = 2 } = {}) {
  const body = items.map((item, i) => {
    const title = t(item.title, lang)
    const text = t(item.text, lang)
    return `<li class="numbered__item" data-reveal>
        <span class="numbered__num">${esc(num(i + 1, lang))}</span>
        <h3 class="numbered__title">${esc(title)}
          <span class="numbered__title-en">${echoSpan(item.title, lang)}</span>
        </h3>
        <p class="numbered__text">${esc(text)}</p>
        <p class="numbered__text-en">${echoSpan(item.text, lang)}</p>
      </li>`
  }).join('\n      ')
  return `<ul class="numbered${columns === 3 ? ' numbered--three' : ''}">\n      ${body}\n    </ul>`
}

/** Stats. A stat with no value yet renders an em-dash and keeps its label. */
export function statsBlock(stats, lang) {
  const body = stats.map(s => {
    const known = s.value != null
    const shown = known ? figure(s.value, lang) : '—'
    const plus = known && s.plus ? (lang === 'ar' ? '+' : '+') : ''
    // A unit beside a pending em-dash reads as a broken value, so it waits for the number.
    const unit = s.unit && known ? `<span class="stat__unit">${esc(t(s.unit, lang))}</span>` : ''
    return `<li class="stat ${known ? 'stat--known' : 'stat--pending'}">
        <p class="stat__value"><span class="lt">${esc(plus)}${esc(shown)}</span>${unit}</p>
        <p class="stat__label">${esc(t(s.label, lang))}</p>
        <p class="stat__label-en">${echoSpan(s.label, lang)}</p>
      </li>`
  }).join('\n      ')
  return `<ul class="stats">\n      ${body}\n    </ul>`
}
