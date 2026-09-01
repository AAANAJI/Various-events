// One function per route. Each is handed its own `route` and `lang`, so every
// link and asset reference it emits is relative to where the page will live.

import { esc, t, linkTo, img } from './lib.mjs'
import { num, ui, brand, contact } from '../content/site.mjs'
import * as C from './components.mjs'
import { home as homeCopy, about, vision, values, founders, method, sectors, why, pauses } from '../content/pages.mjs'
import { services, servicesIntro } from '../content/services.mjs'
import { projects, additionalWorks, workIntro } from '../content/projects.mjs'
import { clients, clientsIntro } from '../content/clients.mjs'
import { stats, statsIntro } from '../content/stats.mjs'

/* ── Home ─────────────────────────────────────────────────────────────────
   Short by design. It says what VARIOUS is, shows six services and three
   projects, and sends the visitor into the right section. The detail lives on
   the pages that own it. */
export function home(route, lang) {
  const featured = projects.filter(p => p.featured).slice(0, 3)
  return {
    title: `${t(brand.name, lang)} — ${t(brand.tagline, lang)}`,
    description: t(homeCopy.intro.body, lang).slice(0, 155),
    heroImage: 'mood-line',
    body: `
  <section class="hero" data-hero>
    <div class="hero__media">${img(route, lang, 'mood-line', {
      alt: lang === 'ar' ? 'مشهد جوي لمشروع ذا لاين في نيوم' : 'Aerial view of The Line, NEOM',
      sizes: '100vw', eager: true, fullBleed: true })}</div>
    <div class="hero__scrim"></div>
    <div class="container hero__body">
      <div data-hero-item>${C.eyebrow({ ar: 'صناعة الفعاليات وأجنحة المعارض', en: 'Events & exhibition stands' }, lang, { tag: 'p' })}</div>
      <h1 class="hero__title" data-hero-item>${esc(t(brand.tagline, lang))}</h1>
      ${C.rule('rule--wide')}
      <p class="hero__sub" data-hero-item>${esc(t(brand.name, lang))}</p>
      <div class="hero__actions" data-hero-item>
        ${C.btn(linkTo(route, lang, 'work', lang), t(ui.seeWork, lang), { variant: 'primary' })}
        ${C.btn(linkTo(route, lang, 'services', lang), t(ui.allServices, lang), { variant: 'ghost', arrow: false })}
      </div>
    </div>
  </section>

  <section class="section">
    ${C.watermark(route, lang)}
    <div class="container container--text">
      ${C.eyebrow(homeCopy.intro.eyebrow, lang)}
      <p class="statement" data-animate>${esc(t(homeCopy.intro.headline, lang))}</p>
      <div class="prose" style="margin-block-start:2.5rem">
        <p>${esc(t(homeCopy.intro.body, lang))}</p>
      </div>
      <p style="margin-block-start:2rem">
        <a class="link-arrow" href="${esc(linkTo(route, lang, 'about', lang))}">${esc(t(ui.aboutUs, lang))}${C.ARROW}</a>
      </p>
    </div>
  </section>

  <section class="section section--dark">
    <div class="container">
      ${C.eyebrow(homeCopy.servicesTeaser.eyebrow, lang)}
      <p class="statement" data-animate>${esc(t(homeCopy.servicesTeaser.headline, lang))}</p>
      <ul class="tiles" style="margin-block-start:3rem" data-animate-group>
        ${services.map(s => `<li class="tile">
          <a class="tile__link" href="${esc(linkTo(route, lang, `services/${s.slug}`, lang))}">
            <span class="tile__title">${esc(t(s.title, lang))}</span>
            <span class="tile__lead">${esc(t(s.lead, lang))}</span>
          </a>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${C.eyebrow(homeCopy.workTeaser.eyebrow, lang)}
      <p class="statement" data-animate>${esc(t(homeCopy.workTeaser.headline, lang))}</p>
      <p class="muted" style="margin-block-start:1rem;max-inline-size:var(--measure)">${esc(t(homeCopy.workTeaser.body, lang))}</p>
      <div class="work-grid" style="margin-block-start:3rem" data-animate-group>
        ${featured.map(p => C.projectCard(route, lang, p)).join('\n        ')}
      </div>
      <p style="margin-block-start:2.5rem">
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
      <div style="margin-block-start:2.5rem">${C.numberedList(why.items, lang)}</div>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

/* ── About ────────────────────────────────────────────────────────────── */
export function aboutIndex(route, lang, sectionItem) {
  return {
    title: `${t(about.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(about.body[0], lang),
    heroImage: 'team-crew',
    body: `
  ${pageHeader(route, lang, about.eyebrow, about.lead, 'team-crew',
    lang === 'ar' ? 'أحد أفراد فريق فاريوس في الموقع' : 'A VARIOUS crew member on site')}
  ${C.sectionNav(route, lang, sectionItem)}

  <section class="section">
    <div class="container container--text">
      <div class="prose prose--lead" data-animate>
        ${about.body.map(p => `<p>${esc(t(p, lang))}</p>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section section--dark">
    ${C.watermark(route, lang)}
    <div class="container container--text">
      ${C.eyebrow(about.model.eyebrow, lang)}
      <p class="statement" data-animate>${esc(t(about.model.headline, lang))}</p>
      ${C.rule()}
      <div class="prose">
        ${about.model.body.map(p => `<p>${esc(t(p, lang))}</p>`).join('\n        ')}
      </div>
      <p style="margin-block-start:2rem">
        <a class="link-arrow" href="${esc(linkTo(route, lang, 'process', lang))}">${esc(t(method.eyebrow, lang))}${C.ARROW}</a>
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${C.eyebrow(statsIntro.eyebrow, lang)}
      <div style="margin-block-start:2.5rem">${C.statsBlock(stats, lang)}</div>
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

  <section class="section section--dark">
    <div class="container">
      ${C.eyebrow(values.eyebrow, lang)}
      <p class="statement" data-animate>${esc(t(values.lead, lang))}</p>
      <p style="margin-block-start:2rem">
        <a class="link-arrow" href="${esc(linkTo(route, lang, 'about/values', lang))}">${esc(t(values.eyebrow, lang))}${C.ARROW}</a>
      </p>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

export function aboutValues(route, lang, sectionItem) {
  return {
    title: `${t(values.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(values.lead, lang),
    heroImage: 'saudi-cup',
    body: `
  ${pageHeader(route, lang, values.eyebrow, values.lead, 'saudi-cup',
    lang === 'ar' ? 'ممر مقوّس نفّذه فريق فاريوس' : 'An arched colonnade built by the VARIOUS team', false)}
  ${C.sectionNav(route, lang, sectionItem)}

  <section class="section">
    ${C.watermark(route, lang)}
    <div class="container">
      <ul class="numbered">
        ${values.items.map(v => `<li class="numbered__item">
          <h2 class="numbered__title">${esc(t(v.title, lang))} · ${esc(t(v.strap, lang))}</h2>
          <p class="numbered__text">${esc(t(v.text, lang))}</p>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

export function aboutFounders(route, lang, sectionItem) {
  return {
    title: `${t(founders.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(founders.quote[0], lang),
    heroImage: 'mood-city',
    body: `
  ${pageHeader(route, lang, founders.eyebrow, founders.lead, 'mood-city',
    lang === 'ar' ? 'مشهد جوي لمدينة سعودية عند الغسق' : 'Aerial view of a Saudi city at dusk')}
  ${C.sectionNav(route, lang, sectionItem)}

  <section class="section">
    ${C.watermark(route, lang)}
    <div class="container container--text">
      ${C.rule('rule--wide')}
      <blockquote class="quote" data-animate>
        ${founders.quote.map(p => `<p>«${esc(t(p, lang))}»</p>`).join('\n        ')}
      </blockquote>
      <p class="quote__by">${esc(t(founders.attribution, lang))}</p>
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
    heroImage: 'saso',
    body: `
  ${pageHeader(route, lang, servicesIntro.eyebrow, servicesIntro.lead, 'saso',
    lang === 'ar' ? 'تفعيل تفاعلي نفّذته فاريوس في بوليفارد سيتي بالرياض'
                  : 'An interactive activation built by VARIOUS at Boulevard City, Riyadh')}
  ${C.sectionNav(route, lang, sectionItem)}

  <section class="section">
    <div class="container container--text">
      <div class="prose prose--lead" data-animate><p>${esc(t(servicesIntro.body, lang))}</p></div>
    </div>
  </section>

  <section class="section section--tight">
    ${C.watermark(route, lang, 'watermark--start')}
    <div class="container">
      <ul class="service-list" data-animate-group>
        ${services.map(s => `<li class="service-row">
          <div class="service-row__media">
            ${img(route, lang, s.image, { alt: t(s.title, lang),
              sizes: '(min-width: 62rem) 34vw, 92vw' })}
          </div>
          <div class="service-row__body">
            <h2 class="service-row__title">
              <a href="${esc(linkTo(route, lang, `services/${s.slug}`, lang))}">${esc(t(s.title, lang))}</a>
            </h2>
            <p class="service-row__lead">${esc(t(s.lead, lang))}</p>
            <p class="link-arrow" style="margin-block-start:1.25rem">${esc(t(ui.readMore, lang))}${C.ARROW}</p>
          </div>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

export function servicePage(route, lang, service, prev, next, sectionItem) {
  // Related work is resolved from the project tags — no hand-curated list to drift.
  const related = projects.filter(p =>
    (p.tags || []).some(tg => service.matchTags.includes(tg.ar))).slice(0, 3)
  return {
    title: `${t(service.title, lang)} — ${t(brand.shortName, lang)}`,
    description: t(service.lead, lang),
    heroImage: service.image,
    heroSizes: '(min-width: 68rem) 56vw, 92vw',
    body: `
  <section class="section section--tight plate-section">
    ${C.watermark(route, lang)}
    <div class="container">
      <p style="margin-block-end:var(--sp-6)">
        <a class="link-arrow" href="${esc(linkTo(route, lang, 'services', lang))}">${esc(t(ui.allServices, lang))}${C.ARROW}</a>
      </p>
      <div class="plate">
        <div class="plate__media">${img(route, lang, service.image, {
          alt: t(service.title, lang), sizes: '(min-width: 68rem) 56vw, 92vw', eager: true })}</div>
        <div class="plate__body">
          ${C.eyebrow(servicesIntro.eyebrow, lang, { tag: 'p' })}
          <h1 class="h1">${esc(t(service.title, lang))}</h1>
          ${C.rule('rule--wide')}
          <p class="plate__lead">${esc(t(service.lead, lang))}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container container--text">
      <div class="prose prose--lead" data-animate>
        ${service.body.map(p => `<p>${esc(t(p, lang))}</p>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section section--dark">
    <div class="container">
      ${C.eyebrow(ui.whatWeDo, lang)}
      <ul class="caps" data-animate-group>
        ${service.capabilities.map(c => `<li class="cap">
          <span class="cap__mark" aria-hidden="true"></span>
          <span>${esc(t(c, lang))}</span>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  ${related.length ? `<section class="section">
    <div class="container">
      ${C.eyebrow(ui.relatedWork, lang)}
      <div class="work-grid" style="margin-block-start:2.5rem" data-animate-group>
        ${related.map(p => C.projectCard(route, lang, p)).join('\n        ')}
      </div>
    </div>
  </section>` : ''}

  <section class="section section--tight">
    <div class="container">
      <nav class="pager" aria-label="${esc(lang === 'ar' ? 'تنقل بين الخدمات' : 'Service navigation')}">
        ${prev ? `<a class="pager__link" href="${esc(linkTo(route, lang, `services/${prev.slug}`, lang))}">
          <span class="pager__dir">${esc(t(ui.prevProject, lang))}</span>
          <span class="pager__title">${esc(t(prev.title, lang))}</span>
        </a>` : '<span></span>'}
        ${next ? `<a class="pager__link" href="${esc(linkTo(route, lang, `services/${next.slug}`, lang))}" style="text-align:end">
          <span class="pager__dir">${esc(t(ui.nextService, lang))}</span>
          <span class="pager__title">${esc(t(next.title, lang))}</span>
        </a>` : '<span></span>'}
      </nav>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
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

  <section class="section">
    ${C.watermark(route, lang)}
    <div class="container">
      <ol class="steps" data-animate-group>
        ${method.steps.map((s, i) => `<li class="step">
          <span class="step__num">${esc(num(i + 1, lang))}</span>
          <div class="step__body">
            <h2 class="step__title">${esc(t(s.title, lang))}
            </h2>
            <p class="step__text">${esc(t(s.text, lang))}</p>
            <p class="step__detail">${esc(t(s.detail, lang))}</p>
          </div>
        </li>`).join('\n        ')}
      </ol>
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
    heroImage: 'bb-none',
    body: `
  ${pageHeader(route, lang, workIntro.eyebrow, workIntro.lead, 'mood-city',
    lang === 'ar' ? 'مشهد جوي لمدينة سعودية عند الغسق' : 'Aerial view of a Saudi city at dusk')}
  ${C.sectionNav(route, lang, sectionItem)}

  <section class="section">
    <div class="container">
      <p class="muted" style="max-inline-size:var(--measure)">${esc(t(workIntro.note, lang))}</p>
      <div class="work-grid" style="margin-block-start:3rem" data-animate-group>
        ${projects.map((p, i) => C.projectCard(route, lang, p, { featured: i === 0 })).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section section--dark">
    ${C.watermark(route, lang, 'watermark--start')}
    <div class="container">
      ${C.eyebrow({ ar: 'ومن أعمالنا أيضًا', en: 'Also from our work' }, lang)}
      <ul class="roster" data-animate-group style="margin-block-start:2rem">
        ${additionalWorks.map(w => `<li class="roster__item">
          <span class="roster__name">${esc(t(w.client, lang))} — ${esc(t(w.title, lang))}
          </span>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

export function project(route, lang, p, prev, next) {
  const client = p.client ? t(p.client, lang) : null
  const title = t(p.title, lang)
  const meta = [
    client && { label: ui.client, value: client },
    p.year && { label: ui.year, value: t(p.year, lang) },
    p.location && { label: ui.location, value: t(p.location, lang) },
    p.tags?.length && { label: ui.scope, value: p.tags.map(tg => t(tg, lang)).join('، ') },
  ].filter(Boolean)

  return {
    title: `${client ? client + ' — ' : ''}${title} — ${t(brand.shortName, lang)}`,
    description: t(p.text, lang),
    heroImage: p.image,
    heroSizes: '(min-width: 68rem) 56vw, 92vw',
    body: `
  <section class="section section--tight plate-section">
    ${C.watermark(route, lang)}
    <div class="container">
      <p style="margin-block-end:var(--sp-6)">
        <a class="link-arrow" href="${esc(linkTo(route, lang, 'work', lang))}">${esc(t(ui.backToWork, lang))}${C.ARROW}</a>
      </p>
      <div class="plate">
        <div class="plate__media">${img(route, lang, p.image, {
          alt: [client, title].filter(Boolean).join(' — '),
          sizes: '(min-width: 68rem) 56vw, 92vw', eager: true })}</div>
        <div class="plate__body">
          ${C.eyebrow({ ar: 'مشروع', en: 'Project' }, lang, { tag: 'p' })}
          ${client ? `<p class="plate__client">${esc(client)}</p>` : ''}
          <h1 class="h1">${esc(title)}</h1>
          ${C.rule('rule--wide')}
        </div>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container container--text">
      <div class="prose prose--lead" data-animate><p>${esc(t(p.text, lang))}</p></div>
    </div>
  </section>

  ${meta.length ? `<section class="section section--tight section--dark">
    <div class="container">
      <ul class="meta" data-animate-group>
        ${meta.map(m => `<li>
          <p class="meta__label">${esc(t(m.label, lang))}</p>
          <p class="meta__value">${esc(m.value)}</p>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>` : ''}

  <section class="section section--tight">
    <div class="container">
      <nav class="pager" aria-label="${esc(lang === 'ar' ? 'تنقل بين المشاريع' : 'Project navigation')}">
        ${prev ? `<a class="pager__link" href="${esc(linkTo(route, lang, `work/${prev.slug}`, lang))}">
          <span class="pager__dir">${esc(t(ui.prevProject, lang))}</span>
          <span class="pager__title">${esc(t(prev.title, lang))}</span>
        </a>` : '<span></span>'}
        ${next ? `<a class="pager__link" href="${esc(linkTo(route, lang, `work/${next.slug}`, lang))}" style="text-align:end">
          <span class="pager__dir">${esc(t(ui.nextProject, lang))}</span>
          <span class="pager__title">${esc(t(next.title, lang))}</span>
        </a>` : '<span></span>'}
      </nav>
    </div>
  </section>

  ${ctaBand(route, lang)}`,
  }
}

export function sectorsPage(route, lang, sectionItem) {
  return {
    title: `${t(sectors.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(sectors.lead, lang),
    heroImage: 'investment-forum',
    heroSizes: '100vw',
    body: `
  ${pageHeader(route, lang, sectors.eyebrow, sectors.lead, 'investment-forum',
    lang === 'ar' ? 'لافتات فعالية ليلًا' : 'Event signage at night', false)}
  ${C.sectionNav(route, lang, sectionItem)}

  <section class="section">
    ${C.watermark(route, lang)}
    <div class="container">
      <ul class="sector-grid" data-animate-group>
        ${sectors.items.map(s => `<li class="sector-cell">
          <span class="sector-cell__name">${esc(t(s, lang))}
          </span>
        </li>`).join('\n        ')}
      </ul>
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
  const mine = projects.filter(p => p.client && p.client.ar === client.ar)
  if (mine.length === 1) {
    const p = mine[0]
    return { href: `work/${p.slug}`, caption: { ar: p.title.ar, en: p.title.en } }
  }
  if (mine.length > 1) {
    return { href: 'work', caption: { ar: arabicCount(mine.length), en: `${mine.length} projects` } }
  }
  const listed = additionalWorks.filter(w => w.client.ar === client.ar)
  if (listed.length === 1) return { href: null, caption: { ar: listed[0].title.ar, en: listed[0].title.en } }
  if (listed.length > 1) {
    return { href: null, caption: { ar: arabicCount(listed.length), en: `${listed.length} projects` } }
  }
  return { href: null, caption: null }
}

/** Arabic counts agree with their noun by magnitude; the dual carries the number. */
function arabicCount(n) {
  if (n === 1) return 'مشروع'
  if (n === 2) return 'مشروعان'
  if (n <= 10) return `${num(n, 'ar').replace(/^٠/, '')} مشاريع`
  return `${num(n, 'ar').replace(/^٠/, '')} مشروعًا`
}

/* ── Contact ──────────────────────────────────────────────────────────── */
export function contactPage(route, lang) {
  return {
    title: `${t(ui.getInTouch, lang)} — ${t(brand.shortName, lang)}`,
    description: `${t(brand.name, lang)} — ${contact.phone} · ${contact.email}`,
    heroImage: 'mood-fireworks',
    body: `
  <section class="hero hero--short" data-hero>
    <div class="hero__media">${img(route, lang, 'mood-fireworks', {
      alt: lang === 'ar' ? 'ألعاب نارية فوق حدث جماهيري' : 'Fireworks over a public event',
      sizes: '100vw', eager: true, fullBleed: true })}</div>
    <div class="hero__scrim"></div>
    <div class="container hero__body">
      ${C.eyebrow({ ar: 'تواصل معنا', en: 'Contact' }, lang, { tag: 'p' })}
      <h1 class="h1">${esc(t(pauses.closing, lang))}</h1>
    </div>
  </section>

  <section class="section">
    ${C.watermark(route, lang)}
    <div class="container">
      <ul class="contact-grid" data-animate-group>
        <li class="contact-item">
          <p class="contact-item__label">${esc(t(ui.callUs, lang))}</p>
          <p class="contact-item__value"><a href="tel:${esc(contact.phoneHref)}" class="lt">${esc(contact.phone)}</a></p>
        </li>
        <li class="contact-item">
          <p class="contact-item__label">${esc(t(ui.emailUs, lang))}</p>
          <p class="contact-item__value"><a href="mailto:${esc(contact.email)}" class="lt">${esc(contact.email)}</a></p>
        </li>
        <li class="contact-item">
          <p class="contact-item__label">${esc(lang === 'ar' ? 'الموقع الإلكتروني' : 'Website')}</p>
          <p class="contact-item__value"><a href="${esc(contact.websiteHref)}" class="lt" rel="noopener">${esc(contact.website)}</a></p>
        </li>
        <li class="contact-item">
          <p class="contact-item__label">${esc(t(ui.location, lang))}</p>
          <p class="contact-item__value">${esc(t(contact.address, lang))}</p>
        </li>
      </ul>
      <div style="margin-block-start:3rem;padding-block-start:1.5rem;border-block-start:1px solid var(--rule-hairline)">
        <p class="muted">${esc(t(brand.legalName, lang))}</p>
        <p class="faint" style="font-size:var(--fs-micro);margin-block-start:.25rem">${esc(t(ui.crLabel, lang))} <span class="lt">${esc(brand.cr)}</span></p>
      </div>
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
      ${C.eyebrow({ ar: 'خطأ ٤٠٤', en: 'Error 404' }, lang, { tag: 'p' })}
      <h1 class="h1">${esc(lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found')}</h1>
      ${C.rule()}
      <p class="lead">${esc(lang === 'ar'
        ? 'الرابط الذي طلبته غير متاح. يمكنك العودة إلى الصفحة الرئيسية.'
        : 'The page you asked for is not available. You can return to the homepage.')}</p>
      <div style="margin-block-start:2rem">
        ${C.btn(linkTo(route, lang, '', lang), lang === 'ar' ? 'الصفحة الرئيسية' : 'Homepage')}
      </div>
    </div>
  </section>`,
  }
}

/* ── Shared blocks ────────────────────────────────────────────────────── */
function pageHeader(route, lang, eyebrowPair, lead, image, alt, fullBleed = true) {
  return `<section class="hero hero--page" data-hero>
    <div class="hero__media">${img(route, lang, image, { alt, sizes: '100vw', eager: true, fullBleed })}</div>
    <div class="hero__scrim"></div>
    <div class="container hero__body">
      ${C.pair(eyebrowPair, lang, { tag: 'h1', className: 'h1', attrs: 'data-hero-item' })}
      ${C.rule('rule--wide')}
      <p class="lead" data-hero-item>${esc(t(lead, lang))}</p>
    </div>
  </section>`
}

function ctaBand(route, lang) {
  return `<section class="section section--dark cta" >
    ${C.watermark(route, lang, 'watermark--start watermark--bottom')}
    <div class="container">
      <hr class="rule" style="margin-inline:auto">
      <h2 class="h2 cta__title">${esc(t(ui.getInTouch, lang))}</h2>
      <div class="cta__actions">
        ${C.btn(linkTo(route, lang, 'contact', lang), t(ui.talkToUs, lang))}
        ${C.btn(`tel:${contact.phoneHref}`, contact.phone, { variant: 'ghost', arrow: false, isolate: true })}
      </div>
    </div>
  </section>`
}
