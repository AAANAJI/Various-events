// Reusable markup pieces. Every function takes the page's `route` and `lang` so
// it can compute its own relative links — nothing here ever emits "/...".

import { esc, t, linkTo, rootFrom, img } from './lib.mjs'
import { num, figure, ui, brand, copyrightYear } from '../content/site.mjs'

export const ARROW = '<svg class="btn__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'

/**
 * A section label. One language — the reader picked an edition — and no number:
 * a slide is item N of a sequence, a web section is a destination.
 */
export function eyebrow(label, lang, { tag = 'h2' } = {}) {
  return `<${tag} class="eyebrow">${esc(t(label, lang))}</${tag}>`
}

/** A page heading. `attrs` carries hooks such as the motion layer's. */
export function pair(value, lang, { tag = 'h2', className = '', attrs = '' } = {}) {
  return `<${tag} class="${esc(className)}"${attrs ? ' ' + attrs : ''}>${esc(t(value, lang))}</${tag}>`
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

/** Expand nav entries that pull their children from a content file. */
export function resolveNav(nav, sources) {
  return nav.map(item => {
    if (!item.childrenFrom) return item
    const list = sources[item.childrenFrom] || []
    return {
      ...item,
      children: [
        { id: `${item.id}-index`, path: item.path, ar: 'كل الخدمات', en: 'All services' },
        ...list.map(x => ({ id: x.slug, path: `${item.path}/${x.slug}`, ar: x.title.ar, en: x.title.en })),
      ],
    }
  })
}

const isCurrent = (route, path) =>
  path === '' ? route === '' : (route === path || route.startsWith(path + '/'))

export function masthead(route, lang, nav) {
  const other = lang === 'ar' ? 'en' : 'ar'
  const up = rootFrom(route, lang)

  const items = nav.map(item => {
    const current = isCurrent(route, item.path)
    const href = linkTo(route, lang, item.path, lang)
    if (!item.children) {
      return `<li class="nav__item">
          <a class="nav__link" href="${esc(href)}"${current ? ' aria-current="page"' : ''}>${esc(t(item, lang))}</a>
        </li>`
    }
    const subs = item.children.map(c => {
      const sc = route === c.path
      return `<li><a class="subnav__link" href="${esc(linkTo(route, lang, c.path, lang))}"${sc ? ' aria-current="page"' : ''}>${esc(t(c, lang))}</a></li>`
    }).join('\n              ')
    // No JS: the submenu opens on hover and on focus-within, and on mobile the
    // children are simply always visible. Nothing here depends on a script.
    return `<li class="nav__item nav__item--has-sub">
          <a class="nav__link" href="${esc(href)}"${current ? ' aria-current="page"' : ''}>${esc(t(item, lang))}<span class="nav__chev" aria-hidden="true"></span></a>
          <div class="subnav">
            <ul class="subnav__list">
              ${subs}
            </ul>
          </div>
        </li>`
  }).join('\n        ')

  return `<header class="masthead" data-masthead>
    <div class="container masthead__inner">
      <a class="masthead__brand" href="${esc(linkTo(route, lang, '', lang))}" aria-label="${esc(t(brand.name, lang))}">
        <img class="masthead__mark" src="${esc(up)}assets/logo/mark.svg" alt="" width="236" height="201" fetchpriority="high" decoding="async">
        <img class="masthead__wordmark" src="${esc(up)}assets/logo/wordmark-light.svg" alt="" width="440" height="101" fetchpriority="high" decoding="async">
      </a>
      <nav id="site-nav" class="nav" aria-label="${esc(t(ui.menu, lang))}">
        <ul class="nav__list">
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

/** A section's own sub-navigation, shown on the pages inside it. */
export function sectionNav(route, lang, item) {
  if (!item || !item.children) return ''
  const links = item.children.map(c =>
    `<li><a class="sectionnav__link" href="${esc(linkTo(route, lang, c.path, lang))}"${route === c.path ? ' aria-current="page"' : ''}>${esc(t(c, lang))}</a></li>`
  ).join('\n        ')
  return `<nav class="sectionnav" aria-label="${esc(t(ui.inThisSection, lang))}">
      <div class="container">
        <p class="sectionnav__label">${esc(t(ui.inThisSection, lang))}</p>
        <ul class="sectionnav__list">
        ${links}
        </ul>
      </div>
    </nav>`
}

export function footer(route, lang, { contact, ui: u, nav }) {
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

  return `<article class="card${featured ? ' card--featured' : ''}">
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
      ${tags ? `<ul class="card__tags">${tags}</ul>` : ''}
    </article>`
}

/** Numbered blocks — values, methodology, why-us. */
export function numberedList(items, lang, { columns = 2 } = {}) {
  const body = items.map(item => {
    const title = t(item.title, lang)
    const text = t(item.text, lang)
    return `<li class="numbered__item">
        <h3 class="numbered__title">${esc(title)}</h3>
        <p class="numbered__text">${esc(text)}</p>
      </li>`
  }).join('\n      ')
  return `<ul class="numbered" data-animate-group>\n      ${body}\n    </ul>`
}

/** Stats. A stat with no value yet renders an em-dash and keeps its label. */
export function statsBlock(stats, lang) {
  const body = stats.map(s => {
    const known = s.value != null
    const shown = known ? figure(s.value, lang) : '—'
    const plus = known && s.plus ? (lang === 'ar' ? '+' : '+') : ''
    // A unit beside a pending em-dash reads as a broken value, so it waits for the number.
    const unit = s.unit && known ? `<span class="stat__unit">${esc(t(s.unit, lang))}</span>` : ''
    // A screen reader announcing "dash, Years of experience" is meaningless.
    // The dash is decoration; the pending state is said in words, but only to
    // assistive technology — a visible "to be confirmed" would read as an
    // unfinished document to a client.
    const figureMarkup = known
      ? `<span class="lt" data-count="${esc(s.value)}"${plus ? ` data-count-suffix="${esc(plus)}"` : ''}>${esc(plus)}${esc(shown)}</span>${unit}`
      : `<span class="lt" aria-hidden="true">${esc(shown)}</span>` +
        `<span class="visually-hidden">${esc(t(ui.toBeConfirmed, lang))}</span>`
    return `<li class="stat ${known ? 'stat--known' : 'stat--pending'}">
        <p class="stat__value">${figureMarkup}</p>
        <p class="stat__label">${esc(t(s.label, lang))}</p>
      </li>`
  }).join('\n      ')
  return `<ul class="stats" data-animate-group>\n      ${body}\n    </ul>`
}
