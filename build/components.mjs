// Reusable markup pieces. Every function takes the page's `route` and `lang` so
// it can compute its own relative links — nothing here ever emits "/...".

import { esc, t, linkTo, rootFrom, img } from './lib.mjs'
import { figure, ui, brand, contact, copyrightYear } from '../content/site.mjs'

export const ARROW = '<svg class="btn__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'

/** Menu and disclosure indicator. Points down, in both editions. */
export const CHEVRON_DOWN = '<svg class="chev" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M2.5 4.25 6 7.75l3.5-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'

/** A downward arrow: the scroll cue and the connectors on the method path. */
export const ARROW_DOWN = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false"><path d="M9 2v13M4 10l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'

const SOCIAL_ICON = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M4 4l16 16M20 4L4 20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M8 10.5V17M8 7.2v.1M11.5 17v-6.5M11.5 13.2c0-1.6 1-2.7 2.5-2.7s2.5 1 2.5 2.7V17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><rect x="2.5" y="5.5" width="19" height="13" rx="3.5" stroke="currentColor" stroke-width="1.6"/><path d="M10.2 9.4v5.2l4.5-2.6-4.5-2.6z" fill="currentColor"/></svg>',
}

const SUN = '<svg class="theme-toggle__sun" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
const MOON = '<svg class="theme-toggle__moon" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M19.5 14.6A7.8 7.8 0 0 1 9.4 4.5a7.8 7.8 0 1 0 10.1 10.1z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>'

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
 * The logo, exactly as supplied: the mark and the wordmark, no plate, no shadow.
 * Both wordmark colourways are emitted and the stylesheet shows the one that
 * matches the ground it sits on, so switching theme never re-fetches anything.
 */
export function logo(route, lang, { eager = false, className = '' } = {}) {
  const up = rootFrom(route, lang)
  const load = eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'
  // The lockup is fixed — wordmark, then the mark to its right — so it is
  // laid out left-to-right in every context and never mirrors.
  return `<span class="logo ${esc(className)}">
        <img class="logo__word logo__word--light" src="${esc(up)}assets/logo/wordmark-light.svg" alt="" width="440" height="101" ${load}>
        <img class="logo__word logo__word--dark" src="${esc(up)}assets/logo/wordmark-dark.svg" alt="" width="440" height="101" ${load}>
        <img class="logo__mark" src="${esc(up)}assets/logo/mark.svg" alt="" width="236" height="201" ${load}>
      </span>`
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

/** A nav entry's href, including the in-page anchor for category entries. */
export function navHref(route, lang, item) {
  return linkTo(route, lang, item.path, lang) + (item.hash ? `#${item.hash}` : '')
}

const isCurrent = (route, path) =>
  path === '' ? route === '' : (route === path || route.startsWith(path + '/'))

export function masthead(route, lang, nav) {
  const other = lang === 'ar' ? 'en' : 'ar'

  const items = nav.map(item => {
    const current = isCurrent(route, item.path)
    const href = navHref(route, lang, item)
    const homeClass = item.id === 'home' ? ' nav__item--home' : ''
    if (!item.children) {
      return `<li class="nav__item${homeClass}">
          <a class="nav__link" href="${esc(href)}"${current ? ' aria-current="page"' : ''}>${esc(t(item, lang))}</a>
        </li>`
    }
    const subs = item.children.map(c => {
      const sc = route === c.path && !c.hash
      return `<li><a class="subnav__link" href="${esc(navHref(route, lang, c))}"${sc ? ' aria-current="page"' : ''}>${esc(t(c, lang))}</a></li>`
    }).join('\n              ')
    // No JS: the submenu opens on hover and on focus-within, and on mobile the
    // children are simply always visible. Nothing here depends on a script.
    return `<li class="nav__item nav__item--has-sub">
          <a class="nav__link" href="${esc(href)}"${current ? ' aria-current="page"' : ''}>${esc(t(item, lang))}${CHEVRON_DOWN}</a>
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
        ${logo(route, lang, { eager: true })}
      </a>
      <nav id="site-nav" class="nav" aria-label="${esc(t(ui.menu, lang))}">
        <ul class="nav__list">
        ${items}
        </ul>
      </nav>
      <div class="masthead__tools">
        <a class="lang-switch" data-lang-switch data-lang-target="${other}"
           href="${esc(linkTo(route, lang, route, other))}"
           lang="${other}" dir="${other === 'ar' ? 'rtl' : 'ltr'}"
           title="${esc(t(ui.switchLangFull, lang))}">${esc(t(ui.switchLang, lang))}</a>
        <button class="theme-toggle" type="button" data-theme-toggle
                aria-label="${esc(t(ui.theme, lang))}" title="${esc(t(ui.theme, lang))}">
          ${SUN}${MOON}
        </button>
        <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav">
          <span class="visually-hidden">${esc(t(ui.menu, lang))}</span>
          <svg class="nav-toggle__open" viewBox="0 0 26 26" fill="none" aria-hidden="true"><path d="M3 7h20M3 13h20M3 19h20" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
          <svg class="nav-toggle__close" viewBox="0 0 26 26" fill="none" aria-hidden="true"><path d="M5 5l16 16M21 5L5 21" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  </header>`
}

/** A section's own sub-navigation, shown on the pages inside it. */
export function sectionNav(route, lang, item) {
  if (!item || !item.children) return ''
  const links = item.children.map(c =>
    `<li><a class="sectionnav__link" href="${esc(navHref(route, lang, c))}"${route === c.path && !c.hash ? ' aria-current="page"' : ''}>${esc(t(c, lang))}</a></li>`
  ).join('\n        ')
  return `<nav class="sectionnav" aria-label="${esc(t(ui.inThisSection, lang))}">
      <div class="container">
        <ul class="sectionnav__list">
        ${links}
        </ul>
      </div>
    </nav>`
}

/** The social accounts, as icon links with their handles spelled out for AT. */
export function socialLinks(lang, { withHandles = false } = {}) {
  return `<ul class="social">
      ${contact.social.map(s => `<li><a class="social__link" href="${esc(s.href)}" rel="noopener" target="_blank" aria-label="${esc(`${s.label} — ${s.handle}`)}">
        <span class="social__icon">${SOCIAL_ICON[s.id]}</span>${withHandles ? `<span class="social__handle lt" dir="ltr">${esc(s.handle)}</span>` : ''}
      </a></li>`).join('\n      ')}
    </ul>`
}

/**
 * The footer: brand and a direct line on top, four labelled columns, the
 * social accounts, and a single legal line. Always set on the dark ground —
 * in the light theme too — so every page ends on the brand's own colour.
 */
export function footer(route, lang, { nav }) {
  const L = (path, label, hash) =>
    `<li><a href="${esc(linkTo(route, lang, path, lang) + (hash ? `#${hash}` : ''))}">${esc(t(label, lang))}</a></li>`
  const section = id => nav.find(n => n.id === id)
  const col = (title, links) => `<div class="site-footer__col">
          <h2 class="site-footer__heading">${esc(t(title, lang))}</h2>
          <ul>
            ${links.join('\n            ')}
          </ul>
        </div>`
  const about = section('about'), services = section('services'), work = section('work')

  return `<footer class="site-footer scope-dark">
    ${watermark(route, lang, 'watermark--start watermark--bottom')}
    <div class="container">
      <div class="site-footer__top">
        <div class="site-footer__brand tb">
          <a href="${esc(linkTo(route, lang, '', lang))}" aria-label="${esc(t(brand.name, lang))}">${logo(route, lang)}</a>
          <p class="site-footer__tagline">${esc(t(brand.tagline, lang))}</p>
        </div>
        <div class="site-footer__reach">
          <a class="btn btn--primary" href="${esc(contact.whatsappHref)}" rel="noopener" target="_blank"><span>${esc(t(ui.whatsapp, lang))}</span>${ARROW}</a>
          <a class="btn btn--ghost" href="mailto:${esc(contact.email)}"><span class="lt" dir="ltr">${esc(contact.email)}</span></a>
        </div>
      </div>
      <div class="site-footer__grid">
        ${col(ui.company, about.children.map(c => L(c.path, c)).concat(L('process', section('process')), L('clients', section('clients'))))}
        ${col(services, services.children.map(c => L(c.path, c)))}
        ${col(work, work.children.map(c => L(c.path, c, c.hash)))}
        <div class="site-footer__col">
          <h2 class="site-footer__heading">${esc(t(section('contact'), lang))}</h2>
          <ul class="site-footer__contact">
            <li><span class="site-footer__label">${esc(t(ui.phoneWhatsapp, lang))}</span><a href="tel:${esc(contact.phoneHref)}" class="lt" dir="ltr">${esc(contact.phone)}</a></li>
            <li><span class="site-footer__label">${esc(lang === 'ar' ? 'البريد الإلكتروني' : 'Email')}</span><a href="mailto:${esc(contact.email)}" class="lt" dir="ltr">${esc(contact.email)}</a></li>
            <li><span class="site-footer__label">${esc(t(ui.address, lang))}</span><span>${esc(t(contact.address, lang))}</span></li>
          </ul>
        </div>
      </div>
      <div class="site-footer__social">
        <p class="site-footer__heading">${esc(t(ui.followUs, lang))}</p>
        ${socialLinks(lang)}
      </div>
      <div class="site-footer__legal">
        <p>© ${copyrightYear} ${esc(t(brand.legalName, lang))}. ${esc(t(ui.copyright, lang))}.</p>
        <p><a class="lt" dir="ltr" href="${esc(contact.websiteHref)}" rel="noopener">${esc(contact.website)}</a></p>
      </div>
    </div>
  </footer>`
}

/** A "pause" band — one sentence over a landscape photograph. */
export function pauseBand(route, lang, image, text, alt) {
  return `<section class="pause scope-dark">
    <div class="pause__media">${img(route, lang, image, { alt: alt || '', sizes: '100vw', fullBleed: true })}</div>
    <div class="pause__scrim"></div>
    <div class="container">
      ${rule()}
      <p class="pause__text">${esc(t(text, lang))}</p>
    </div>
  </section>`
}

/**
 * Stand-in for a project photograph that has not been supplied: the brand's
 * star on its own ground, with the client's name. Reads as a designed panel,
 * not a missing image, and carries no "coming soon" text to a client preview.
 */
export function brandPanel(route, lang, label, { className = '' } = {}) {
  const up = rootFrom(route, lang)
  return `<div class="brand-panel ${esc(className)}" role="img" aria-label="${esc(label || '')}">
      <img class="brand-panel__pattern" src="${esc(up)}assets/logo/pattern-white.svg" alt="" width="1322" height="1304" loading="lazy" decoding="async">
      <img class="brand-panel__mark" src="${esc(up)}assets/logo/mark.svg" alt="" width="236" height="201" loading="lazy" decoding="async">
      ${label ? `<span class="brand-panel__label">${esc(label)}</span>` : ''}
    </div>`
}

/** "Client — Project" splits into a label and a title; a bare name stays whole. */
export function splitTitle(title) {
  const i = title.indexOf(' — ')
  return i < 0 ? { head: null, rest: title } : { head: title.slice(0, i), rest: title.slice(i + 3) }
}

/** Project card for the work grid. */
export function projectCard(route, lang, project, { featured = false } = {}) {
  const href = linkTo(route, lang, `work/${project.slug}`, lang)
  const { head, rest } = splitTitle(t(project.title, lang))
  const alt = t(project.title, lang)
  const tags = (project.types || []).slice(0, 1).concat((project.scope || []).slice(0, 2))
    .map(tg => `<li class="tag">${esc(t(tg, lang))}</li>`).join('')
  const sizes = featured
    ? '(min-width: 68rem) 62vw, (min-width: 40rem) 92vw, 92vw'
    : '(min-width: 68rem) 31vw, (min-width: 40rem) 46vw, 92vw'

  return `<article class="card${featured ? ' card--featured' : ''}">
      <div class="card__media">
        ${project.image ? img(route, lang, project.image, { alt, sizes }) : brandPanel(route, lang, head || rest)}
      </div>
      ${head ? `<p class="card__client">${esc(head)}</p>` : ''}
      <h3 class="card__title"><a class="card__link" href="${esc(href)}">${esc(rest)}</a></h3>
      ${project.award ? `<p class="card__award">${esc(t(project.award, lang))}</p>` : ''}
      ${tags ? `<ul class="card__tags">${tags}</ul>` : ''}
    </article>`
}

/** Titled blocks — values and the reasons to choose VARIOUS. */
export function numberedList(items, lang) {
  const body = items.map(item => `<li class="numbered__item">
        <h3 class="numbered__title">${esc(t(item.title, lang))}</h3>
        <p class="numbered__text">${esc(t(item.text, lang))}</p>
      </li>`).join('\n      ')
  return `<ul class="numbered" data-animate-group>\n      ${body}\n    </ul>`
}

/** The one independent recognition, set as a strip. */
export function awardStrip(award, lang) {
  return `<div class="award" data-animate>
      <span class="award__mark" aria-hidden="true">★</span>
      <p class="award__body"><strong class="award__label">${esc(t(award.label, lang))}</strong>
      <span class="award__text">${esc(t(award.text, lang))}</span></p>
    </div>`
}

/** Stats. Only confirmed figures are listed in content/stats.mjs. */
export function statsBlock(stats, lang) {
  const body = stats.map(s => {
    const plus = s.plus ? '+' : ''
    return `<li class="stat">
        <p class="stat__value"><span class="lt" dir="ltr" data-count="${esc(s.value)}"${plus ? ` data-count-suffix="${plus}"` : ''}>${esc(figure(s.value))}${plus}</span></p>
        <p class="stat__label">${esc(t(s.label, lang))}</p>
      </li>`
  }).join('\n      ')
  return `<ul class="stats" data-animate-group>\n      ${body}\n    </ul>`
}

/**
 * A titled group of short items set as chips — the service catalogues. Chips
 * rather than bullets: they wrap cleanly in either reading direction.
 */
export function chipGroup(group, lang, { tag = 'h2' } = {}) {
  return `<article class="chip-group" id="${esc(group.id)}">
      <${tag} class="chip-group__title">${esc(t(group.title, lang))}</${tag}>
      <ul class="chips">
        ${group.items.map(i => `<li class="chip">${esc(t(i, lang))}</li>`).join('\n        ')}
      </ul>
    </article>`
}

/**
 * The method as a connected path: numbered stations joined by a line, with an
 * arrow down to the next one. Stations alternate either side of the line on
 * wide screens and stack beside it on narrow ones.
 */
export function methodPath(steps, lang, { compact = false } = {}) {
  const n = steps.length
  const items = steps.map((s, i) => `<li class="path__step">
        <span class="path__node" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <div class="path__card">
          <h2 class="path__title"><span class="visually-hidden">${i + 1} ${esc(t(ui.pageOf, lang))} ${n}: </span>${esc(t(s.title, lang))}</h2>
          <p class="path__text">${esc(t(s.text, lang))}</p>
        </div>
        ${i < n - 1 ? `<span class="path__link" aria-hidden="true"><span class="path__line"></span><span class="path__arrow">${ARROW_DOWN}</span></span>` : ''}
      </li>`).join('\n      ')
  return `<ol class="path${compact ? ' path--compact' : ''}" data-path>\n      ${items}\n    </ol>`
}
