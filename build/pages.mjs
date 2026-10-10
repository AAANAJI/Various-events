// One function per route. Each is handed its own `route` and `lang`, so every
// link and asset reference it emits is relative to where the page will live.

import { esc, t, linkTo, img } from './lib.mjs'
import { ui, brand, contact } from '../content/site.mjs'
import * as C from './components.mjs'
import { home as homeCopy, about, vision, values, method, why, pauses } from '../content/pages.mjs'
import {
  servicesIntro, eventTypes, frameworkAgreements,
  solutionsIntro, solutions, ownersIntro, ownerServices,
} from '../content/services.mjs'
import { projects, categories, workIntro } from '../content/projects.mjs'
import { clients, clientsIntro } from '../content/clients.mjs'
import { stats } from '../content/stats.mjs'

const typeHref = (route, lang, link) => linkTo(route, lang, link.route, lang) + (link.hash ? `#${link.hash}` : '')

/* ── Home ─────────────────────────────────────────────────────────────────
   Short by design. It says what VARIOUS is, shows what it does and three
   projects, and sends the visitor into the right section. The detail lives on
   the pages that own it. */
export function home(route, lang) {
  const featured = projects.filter(p => p.featured).slice(0, 3)
  return {
    title: `${t(brand.name, lang)} — ${t(brand.tagline, lang)}`,
    description: t(about.body[0], lang).slice(0, 155),
    heroImage: 'mood-line',
    body: `
  <section class="hero scope-dark" data-hero>
    <div class="hero__media">${img(route, lang, 'mood-line', {
      alt: lang === 'ar' ? 'مشهد جوي لمشروع ذا لاين في نيوم' : 'Aerial view of The Line, NEOM',
      sizes: '100vw', eager: true, fullBleed: true })}</div>
    <div class="hero__scrim"></div>
    <div class="container hero__body">
      <div class="tb">
        <div data-hero-item>${C.eyebrow(homeCopy.heroEyebrow, lang, { tag: 'p' })}</div>
        <h1 class="hero__title" data-hero-item>${esc(t(brand.tagline, lang))}</h1>
        ${C.rule('rule--wide')}
        <p class="hero__sub" data-hero-item>${esc(t(brand.name, lang))}</p>
      </div>
      <div class="hero__actions" data-hero-item>
        ${C.btn(linkTo(route, lang, 'work', lang), t(ui.seeWork, lang), { variant: 'primary' })}
        ${C.btn(linkTo(route, lang, 'services', lang), t(ui.allServices, lang), { variant: 'ghost', arrow: false })}
      </div>
    </div>
    <a class="scroll-cue" href="#intro" aria-label="${esc(t(homeCopy.intro.eyebrow, lang))}">${C.ARROW_DOWN}</a>
  </section>

  <section class="section" id="intro">
    ${C.watermark(route, lang)}
    <div class="container">
      <div class="split">
        <div class="tb">
          ${C.eyebrow(homeCopy.intro.eyebrow, lang)}
          <p class="statement" data-animate>${esc(t(homeCopy.intro.headline, lang))}</p>
          <div class="prose" style="margin-block-start:var(--sp-6)">
            <p>${esc(t(about.body[0], lang))}</p>
          </div>
          <p style="margin-block-start:var(--sp-6)">
            <a class="link-arrow" href="${esc(linkTo(route, lang, 'about', lang))}">${esc(t(ui.aboutUs, lang))}${C.ARROW}</a>
          </p>
        </div>
        <div class="split__aside">${C.statsBlock(stats, lang)}</div>
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <div class="tb">
        ${C.eyebrow(homeCopy.servicesTeaser.eyebrow, lang)}
        <p class="statement" data-animate>${esc(t(homeCopy.servicesTeaser.headline, lang))}</p>
      </div>
      <ul class="tiles" style="margin-block-start:var(--sp-7)" data-animate-group>
        ${eventTypes.map(s => `<li class="tile">
          <a class="tile__link" href="${esc(typeHref(route, lang, s.link))}">
            <span class="tile__title">${esc(t(s.title, lang))}</span>
          </a>
        </li>`).join('\n        ')}
        <li class="tile">
          <a class="tile__link" href="${esc(linkTo(route, lang, 'contact', lang))}">
            <span class="tile__title">${esc(t(frameworkAgreements.title, lang))}</span>
          </a>
        </li>
      </ul>
      <p style="margin-block-start:var(--sp-6)">
        <a class="link-arrow" href="${esc(linkTo(route, lang, 'services/solutions', lang))}">${esc(t(ui.solutions, lang))}${C.ARROW}</a>
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="tb">
        ${C.eyebrow(homeCopy.workTeaser.eyebrow, lang)}
        <p class="statement" data-animate>${esc(t(homeCopy.workTeaser.headline, lang))}</p>
      </div>
      <div class="work-grid" style="margin-block-start:var(--sp-7)" data-animate-group>
        ${featured.map(p => C.projectCard(route, lang, p)).join('\n        ')}
      </div>
      <p style="margin-block-start:var(--sp-6)">
        <a class="link-arrow" href="${esc(linkTo(route, lang, 'work', lang))}">${esc(t(ui.allWork, lang))}${C.ARROW}</a>
      </p>
    </div>
  </section>

  ${C.pauseBand(route, lang, 'mood-alula', pauses.identity,
    lang === 'ar' ? 'تكوينات صخرية في العلا تحت سماء درامية' : 'Rock formations in AlUla under a dramatic sky')}

  <section class="section">
    ${C.watermark(route, lang, 'watermark--start')}
    <div class="container">
      ${C.eyebrow(homeCopy.whyTeaser.eyebrow, lang)}
      <div style="margin-block-start:var(--sp-6)">${C.numberedList(why.items, lang)}</div>
      <div style="margin-block-start:var(--sp-7)">${C.awardStrip(why.award, lang)}</div>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

/* ── About ────────────────────────────────────────────────────────────── */
export function aboutIndex(route, lang, sectionItem) {
  const explore = [
    { path: 'about/vision', label: vision.eyebrow, text: vision.lead },
    { path: 'about/values', label: values.eyebrow, text: values.lead },
    { path: 'process', label: method.eyebrow, text: method.lead },
  ]
  return {
    title: `${t(about.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(about.body[0], lang),
    heroImage: 'team-crew',
    body: `
  ${pageHeader(route, lang, about.eyebrow, about.lead, 'team-crew',
    lang === 'ar' ? 'أحد أفراد فريق فاريوس في الموقع' : 'A VARIOUS crew member on site')}
  ${C.sectionNav(route, lang, sectionItem)}

  <section class="section">
    ${C.watermark(route, lang)}
    <div class="container">
      <div class="split">
        <div class="prose prose--lead tb" data-animate>
          ${about.body.map(p => `<p>${esc(t(p, lang))}</p>`).join('\n          ')}
        </div>
        <div class="split__aside">${C.statsBlock(stats, lang)}</div>
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      ${C.eyebrow(ui.explore, lang)}
      <ul class="tiles" data-animate-group>
        ${explore.map(e => `<li class="tile">
          <a class="tile__link" href="${esc(linkTo(route, lang, e.path, lang))}">
            <span class="tile__title">${esc(t(e.label, lang))}</span>
            <span class="tile__lead">${esc(t(e.text, lang))}</span>
          </a>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

export function aboutVision(route, lang, sectionItem) {
  const card = (item) => `<div class="statement-card">
      ${C.eyebrow(item.label, lang, { tag: 'h2' })}
      <p class="statement-card__text">${esc(t(item.text, lang))}</p>
    </div>`
  return {
    title: `${t(vision.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(vision.visionItem.text, lang),
    heroImage: 'mood-riyadh',
    body: `
  ${pageHeader(route, lang, vision.eyebrow, vision.lead, 'mood-riyadh',
    lang === 'ar' ? 'مشهد جوي للرياض عند الغروب' : 'Aerial view of Riyadh at sunset')}
  ${C.sectionNav(route, lang, sectionItem)}

  <section class="section">
    ${C.watermark(route, lang)}
    <div class="container">
      <div class="statement-pair" data-animate-group>
        ${card(vision.visionItem)}
        ${card(vision.missionItem)}
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <div class="tb">
        ${C.eyebrow(values.eyebrow, lang)}
        <p class="statement" data-animate>${esc(t(values.lead, lang))}</p>
        <p style="margin-block-start:var(--sp-6)">
          <a class="link-arrow" href="${esc(linkTo(route, lang, 'about/values', lang))}">${esc(t(values.eyebrow, lang))}${C.ARROW}</a>
        </p>
      </div>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

export function aboutValues(route, lang, sectionItem) {
  return {
    title: `${t(values.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(values.lead, lang),
    heroImage: 'kleija',
    body: `
  ${pageHeader(route, lang, values.eyebrow, values.lead, 'kleija',
    lang === 'ar' ? 'جناح من تصميم فاريوس وتنفيذها في مهرجان الكليجا' : 'A stand designed and built by VARIOUS at the Kleija Festival')}
  ${C.sectionNav(route, lang, sectionItem)}

  <section class="section">
    ${C.watermark(route, lang)}
    <div class="container">
      <ul class="numbered numbered--values" data-animate-group>
        ${values.items.map(v => `<li class="numbered__item">
          <h2 class="numbered__title">${esc(t(v.title, lang))}</h2>
          <p class="numbered__text">${esc(t(v.text, lang))}</p>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

/* ── Services ─────────────────────────────────────────────────────────── */
export function servicesIndex(route, lang, sectionItem) {
  return {
    title: `${t(servicesIntro.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(servicesIntro.lead, lang),
    heroImage: 'cover-collage',
    body: `
  ${pageHeader(route, lang, servicesIntro.eyebrow, servicesIntro.lead, 'cover-collage',
    lang === 'ar' ? 'مجموعة من أعمال فاريوس' : 'A collage of VARIOUS projects')}
  ${C.sectionNav(route, lang, sectionItem)}

  <section class="section">
    ${C.watermark(route, lang, 'watermark--start')}
    <div class="container">
      <ul class="type-grid" data-animate-group>
        ${eventTypes.map(s => `<li class="type-card">
          <div class="type-card__media">${img(route, lang, s.image, { alt: '',
            sizes: '(min-width: 68rem) 31vw, (min-width: 40rem) 46vw, 92vw' })}</div>
          <div class="type-card__body">
            <h2 class="type-card__title"><a class="type-card__link" href="${esc(typeHref(route, lang, s.link))}">${esc(t(s.title, lang))}</a></h2>
            <p class="type-card__more">${esc(t(ui.relatedService, lang))}${C.ARROW}</p>
          </div>
        </li>`).join('\n        ')}
      </ul>
      <div class="band" data-animate>
        <h2 class="band__title">${esc(t(frameworkAgreements.title, lang))}</h2>
        ${C.btn(linkTo(route, lang, 'contact', lang), t(ui.talkToUs, lang), { variant: 'ghost' })}
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <div class="duo" data-animate-group>
        ${[
          { path: 'services/solutions', intro: solutionsIntro, groups: solutions },
          { path: 'services/exhibition-owners', intro: ownersIntro, groups: ownerServices },
        ].map(b => `<article class="duo__item">
          ${C.eyebrow(b.intro.eyebrow, lang)}
          <p class="duo__lead">${esc(t(b.intro.lead, lang))}</p>
          <ul class="chips chips--quiet">
            ${b.groups.map(g => `<li class="chip">${esc(t(g.title, lang))}</li>`).join('\n            ')}
          </ul>
          <p style="margin-block-start:var(--sp-6)">
            <a class="link-arrow" href="${esc(linkTo(route, lang, b.path, lang))}">${esc(t(b.intro.eyebrow, lang))}${C.ARROW}</a>
          </p>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

/** A catalogue page: the solutions, or the services for exhibition owners. */
function catalogue(route, lang, sectionItem, { intro, groups, image, alt }) {
  return {
    title: `${t(intro.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(intro.lead, lang),
    heroImage: image,
    body: `
  ${pageHeader(route, lang, intro.eyebrow, intro.lead, image, alt)}
  ${C.sectionNav(route, lang, sectionItem)}

  <section class="section section--tight">
    <div class="container">
      <nav class="jump" aria-label="${esc(t(ui.inThisPage, lang))}">
        <ul class="chips">
          ${groups.map(g => `<li><a class="chip chip--link" href="#${esc(g.id)}">${esc(t(g.title, lang))}</a></li>`).join('\n          ')}
        </ul>
      </nav>
    </div>
  </section>

  <section class="section section--flush">
    ${C.watermark(route, lang)}
    <div class="container">
      <div class="catalogue" data-animate-group>
        ${groups.map(g => C.chipGroup(g, lang)).join('\n        ')}
      </div>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

export function solutionsPage(route, lang, sectionItem) {
  return catalogue(route, lang, sectionItem, {
    intro: solutionsIntro, groups: solutions, image: 'investment-forum',
    alt: lang === 'ar' ? 'أعمال تجهيز نفّذتها فاريوس ضمن الملتقى الدولي للاستثمار' : 'Build works by VARIOUS at the International Investment Forum',
  })
}

export function ownersPage(route, lang, sectionItem) {
  return catalogue(route, lang, sectionItem, {
    intro: ownersIntro, groups: ownerServices, image: 'nova-medical',
    alt: lang === 'ar' ? 'جناح نفّذته فاريوس في أحد المعارض' : 'An exhibition stand built by VARIOUS',
  })
}

/* ── How we work ──────────────────────────────────────────────────────── */
export function process(route, lang) {
  return {
    title: `${t(method.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(method.lead, lang),
    heroImage: 'mood-fireworks',
    body: `
  ${pageHeader(route, lang, method.eyebrow, method.lead, 'mood-fireworks',
    lang === 'ar' ? 'ألعاب نارية فوق حدث جماهيري' : 'Fireworks over a public event')}

  <section class="section section--tight">
    <div class="container container--text">
      <div class="prose prose--lead" data-animate><p>${esc(t(method.body, lang))}</p></div>
    </div>
  </section>

  <section class="section section--flush-top">
    ${C.watermark(route, lang)}
    <div class="container">
      ${C.methodPath(method.steps, lang)}
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

/* ── Work ─────────────────────────────────────────────────────────────── */
export function work(route, lang, sectionItem) {
  return {
    title: `${t(workIntro.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(workIntro.lead, lang),
    heroImage: 'mood-city',
    body: `
  ${pageHeader(route, lang, workIntro.eyebrow, workIntro.lead, 'mood-city',
    lang === 'ar' ? 'مشهد جوي لمدينة سعودية عند الغسق' : 'Aerial view of a Saudi city at dusk')}
  ${C.sectionNav(route, lang, sectionItem)}

  ${categories.map((cat, ci) => {
    const list = projects.filter(p => p.category === cat.id)
    return `<section class="section${ci % 2 ? ' section--alt' : ''}" id="${esc(cat.id)}">
    <div class="container">
      <div class="cat-head tb">
        <h2 class="h2">${esc(t(cat.title, lang))}</h2>
        ${cat.note ? `<p class="cat-head__note">${esc(t(cat.note, lang))}</p>` : ''}
      </div>
      <div class="work-grid" data-animate-group>
        ${list.map(p => C.projectCard(route, lang, p)).join('\n        ')}
      </div>
    </div>
  </section>`
  }).join('\n\n  ')}

  ${ctaBand(route, lang)}`,
  }
}

export function project(route, lang, p, prev, next) {
  const { head, rest } = C.splitTitle(t(p.title, lang))
  const cat = categories.find(c => c.id === p.category)
  const meta = [
    head && { label: ui.client, value: head },
    p.types?.length && { label: ui.types, value: p.types.map(tg => t(tg, lang)).join(lang === 'ar' ? '، ' : ', ') },
    p.scope?.length && { label: ui.scope, value: p.scope.map(tg => t(tg, lang)).join(lang === 'ar' ? '، ' : ', ') },
  ].filter(Boolean)
  const alt = t(p.title, lang)
  const sizes = '(min-width: 68rem) 56vw, 92vw'

  const parts = (p.parts || []).map((part, i) => `<li class="part${part.image ? ' part--media' : ''}">
          ${part.image ? `<div class="part__media">${img(route, lang, part.image, {
            alt: t(part.title, lang), sizes: '(min-width: 62rem) 40vw, 92vw' })}</div>` : ''}
          <div class="part__body tb">
            ${part.group ? `<p class="part__group">${esc(t(part.group, lang))}</p>` : ''}
            <h3 class="part__title">${esc(t(part.title, lang))}</h3>
            ${part.award ? `<p class="card__award">${esc(t(part.award, lang))}</p>` : ''}
            ${part.text ? `<p class="part__text">${esc(t(part.text, lang))}</p>` : ''}
            ${part.scope?.length ? `<ul class="card__tags">${part.scope.map(tg => `<li class="tag">${esc(t(tg, lang))}</li>`).join('')}</ul>` : ''}
          </div>
        </li>`).join('\n        ')

  return {
    title: `${t(p.title, lang)} — ${t(brand.shortName, lang)}`,
    description: t(p.text, lang),
    heroImage: p.image || null,
    heroSizes: sizes,
    body: `
  <section class="section section--tight plate-section">
    ${C.watermark(route, lang)}
    <div class="container">
      <p style="margin-block-end:var(--sp-6)">
        <a class="link-arrow" href="${esc(linkTo(route, lang, 'work', lang) + '#' + p.category)}">${esc(t(ui.backToWork, lang))}${C.ARROW}</a>
      </p>
      <div class="plate">
        <div class="plate__media">${p.image
          ? img(route, lang, p.image, { alt, sizes, eager: true })
          : C.brandPanel(route, lang, head || rest)}</div>
        <div class="plate__body tb">
          ${C.eyebrow(cat.title, lang, { tag: 'p' })}
          ${head ? `<p class="plate__client">${esc(head)}</p>` : ''}
          <h1 class="h1">${esc(rest)}</h1>
          ${C.rule('rule--wide')}
          ${p.award ? `<p class="card__award">${esc(t(p.award, lang))}</p>` : ''}
        </div>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container container--text">
      <div class="prose prose--lead" data-animate><p>${esc(t(p.text, lang))}</p></div>
    </div>
  </section>

  ${parts ? `<section class="section section--tight">
    <div class="container">
      ${C.eyebrow(ui.partsLabel, lang)}
      <ul class="parts" data-animate-group>
        ${parts}
      </ul>
    </div>
  </section>` : ''}

  <section class="section section--tight section--alt">
    <div class="container">
      <ul class="meta" data-animate-group>
        ${meta.map(m => `<li>
          <p class="meta__label">${esc(t(m.label, lang))}</p>
          <p class="meta__value">${esc(m.value)}</p>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <nav class="pager" aria-label="${esc(lang === 'ar' ? 'تنقل بين المشاريع' : 'Project navigation')}">
        ${prev ? `<a class="pager__link" href="${esc(linkTo(route, lang, `work/${prev.slug}`, lang))}">
          <span class="pager__dir">${esc(t(ui.prevProject, lang))}</span>
          <span class="pager__title">${esc(t(prev.title, lang))}</span>
        </a>` : '<span></span>'}
        ${next ? `<a class="pager__link pager__link--next" href="${esc(linkTo(route, lang, `work/${next.slug}`, lang))}">
          <span class="pager__dir">${esc(t(ui.nextProject, lang))}</span>
          <span class="pager__title">${esc(t(next.title, lang))}</span>
        </a>` : '<span></span>'}
      </nav>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

/* ── Clients ──────────────────────────────────────────────────────────── */
export function clientsPage(route, lang) {
  return {
    title: `${t(clientsIntro.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(clientsIntro.lead, lang),
    heroImage: 'mood-riyadh',
    body: `
  ${pageHeader(route, lang, clientsIntro.eyebrow, clientsIntro.lead, 'mood-riyadh',
    lang === 'ar' ? 'مشهد جوي للرياض عند الغروب' : 'Aerial view of Riyadh at sunset')}

  <section class="section">
    <div class="container">
      <ul class="roster" data-animate-group>
        ${clients.map(c => {
          const rel = relatedWork(c)
          const name = esc(t(c, lang))
          const label = rel.href
            ? `<a class="roster__link" href="${esc(linkTo(route, lang, rel.href, lang))}">${name}</a>`
            : name
          return `<li class="roster__item">
          <span class="roster__name">${label}
            ${rel.caption ? `<span class="roster__caption">${esc(rel.caption[lang])}</span>` : ''}
          </span>
        </li>`
        }).join('\n        ')}
      </ul>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

/**
 * Turn the client roster into a second index into the portfolio, using only
 * what is already in the data — no curation, no invented links.
 */
function relatedWork(client) {
  const mine = projects.filter(p => p.client === client.ar)
  if (mine.length === 1) {
    const p = mine[0]
    const ar = C.splitTitle(p.title.ar), en = C.splitTitle(p.title.en)
    return { href: `work/${p.slug}`, caption: { ar: ar.rest, en: en.rest } }
  }
  if (mine.length > 1) {
    return { href: `work/${mine[0].slug}`, caption: { ar: arabicCount(mine.length), en: `${mine.length} projects` } }
  }
  return { href: null, caption: null }
}

/** Arabic counts agree with their noun by magnitude; the dual carries the number. */
function arabicCount(n) {
  if (n === 1) return 'مشروع'
  if (n === 2) return 'مشروعان'
  if (n <= 10) return `${n} مشاريع`
  return `${n} مشروعًا`
}

/* ── Contact ──────────────────────────────────────────────────────────── */
export function contactPage(route, lang) {
  return {
    title: `${t(ui.getInTouch, lang)} — ${t(brand.shortName, lang)}`,
    description: `${t(brand.name, lang)} — ${contact.phone} · ${contact.email}`,
    heroImage: 'mood-fireworks',
    body: `
  <section class="hero hero--short scope-dark" data-hero>
    <div class="hero__media">${img(route, lang, 'mood-fireworks', {
      alt: lang === 'ar' ? 'ألعاب نارية فوق حدث جماهيري' : 'Fireworks over a public event',
      sizes: '100vw', eager: true, fullBleed: true })}</div>
    <div class="hero__scrim"></div>
    <div class="container hero__body">
      <div class="tb">
        <div data-hero-item>${C.eyebrow({ ar: 'تواصل معنا', en: 'Contact' }, lang, { tag: 'p' })}</div>
        <h1 class="h1" data-hero-item>${esc(t(pauses.closing, lang))}</h1>
      </div>
    </div>
  </section>

  <section class="section">
    ${C.watermark(route, lang)}
    <div class="container">
      <ul class="contact-grid" data-animate-group>
        <li class="contact-item">
          <p class="contact-item__label">${esc(t(ui.phoneWhatsapp, lang))}</p>
          <p class="contact-item__value"><a href="tel:${esc(contact.phoneHref)}" class="lt" dir="ltr">${esc(contact.phone)}</a></p>
          <p class="contact-item__extra"><a class="link-arrow" href="${esc(contact.whatsappHref)}" rel="noopener" target="_blank">${esc(t(ui.whatsapp, lang))}${C.ARROW}</a></p>
        </li>
        <li class="contact-item">
          <p class="contact-item__label">${esc(t(ui.emailUs, lang))}</p>
          <p class="contact-item__value"><a href="mailto:${esc(contact.email)}" class="lt" dir="ltr">${esc(contact.email)}</a></p>
        </li>
        <li class="contact-item">
          <p class="contact-item__label">${esc(t(ui.website, lang))}</p>
          <p class="contact-item__value"><a href="${esc(contact.websiteHref)}" class="lt" dir="ltr" rel="noopener">${esc(contact.website)}</a></p>
        </li>
        <li class="contact-item">
          <p class="contact-item__label">${esc(t(ui.address, lang))}</p>
          <p class="contact-item__value">${esc(t(contact.address, lang))}</p>
        </li>
        <li class="contact-item contact-item--wide">
          <p class="contact-item__label">${esc(t(ui.followUs, lang))}</p>
          ${C.socialLinks(lang, { withHandles: true })}
        </li>
      </ul>
    </div>
  </section>`,
  }
}

/* ── 404 ──────────────────────────────────────────────────────────────── */
export function notFound(route, lang) {
  return {
    title: lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found',
    description: '',
    body: `
  <section class="section" style="min-block-size:60vh;display:grid;align-items:center">
    ${C.watermark(route, lang)}
    <div class="container">
      ${C.eyebrow({ ar: 'خطأ 404', en: 'Error 404' }, lang, { tag: 'p' })}
      <h1 class="h1">${esc(lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found')}</h1>
      ${C.rule()}
      <p class="lead">${esc(lang === 'ar'
        ? 'الرابط الذي طلبته غير متاح. يمكنك العودة إلى الصفحة الرئيسية.'
        : 'The page you asked for is not available. You can return to the homepage.')}</p>
      <div style="margin-block-start:var(--sp-6)">
        ${C.btn(linkTo(route, lang, '', lang), lang === 'ar' ? 'الصفحة الرئيسية' : 'Homepage')}
      </div>
    </div>
  </section>`,
  }
}

/* ── Shared blocks ────────────────────────────────────────────────────── */
function pageHeader(route, lang, eyebrowPair, lead, image, alt, fullBleed = true) {
  return `<section class="hero hero--page scope-dark" data-hero>
    <div class="hero__media">${img(route, lang, image, { alt, sizes: '100vw', eager: true, fullBleed })}</div>
    <div class="hero__scrim"></div>
    <div class="container hero__body">
      <div class="tb">
        ${C.pair(eyebrowPair, lang, { tag: 'h1', className: 'h1', attrs: 'data-hero-item' })}
        ${C.rule('rule--wide')}
        <p class="lead" data-hero-item>${esc(t(lead, lang))}</p>
      </div>
    </div>
  </section>`
}

function ctaBand(route, lang) {
  return `<section class="section cta scope-dark">
    ${C.watermark(route, lang, 'watermark--start watermark--bottom')}
    <div class="container">
      <hr class="rule rule--center">
      <h2 class="h2 cta__title">${esc(t(ui.getInTouch, lang))}</h2>
      <div class="cta__actions">
        ${C.btn(linkTo(route, lang, 'contact', lang), t(ui.talkToUs, lang))}
        ${C.btn(`tel:${contact.phoneHref}`, contact.phone, { variant: 'ghost', arrow: false, isolate: true })}
      </div>
    </div>
  </section>`
}
