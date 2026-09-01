// One function per route. Each returns { title, description, body } and is
// handed the page's own `route` and `lang` so every link it emits is relative.

import { esc, t, linkTo, img } from './lib.mjs'
import { num, ui, brand, contact } from '../content/site.mjs'
import * as C from './components.mjs'
import { about, founders, vision, mission, values, services, method, sectors, why, pauses } from '../content/pages.mjs'
import { projects, additionalWorks, workIntro } from '../content/projects.mjs'
import { clients, clientsIntro } from '../content/clients.mjs'
import { stats, statsIntro } from '../content/stats.mjs'

// The secondary-language echo always goes through C.echoSpan, which keeps the
// `dir` attribute on an inline span so the block stays aligned with its sibling.

/* ── Home ─────────────────────────────────────────────────────────────── */
export function home(route, lang, A) {
  const featured = projects.filter(p => p.featured).slice(0, 5)
  return {
    title: `${t(brand.name, lang)} — ${t(brand.tagline, lang)}`,
    description: t(about.body[0], lang),
    body: `
  <section class="hero">
    <div class="hero__media">${img(route, lang, 'mood-line', {
      alt: lang === 'ar' ? 'مشهد جوي لمشروع ذا لاين في نيوم' : 'Aerial view of The Line, NEOM',
      sizes: '100vw', eager: true })}</div>
    <div class="hero__scrim"></div>
    <div class="container hero__body">
      ${C.eyebrow({ ar: 'الملف التعريفي — ٢٠٢٦', en: 'Company Profile — 2026' }, lang)}
      <h1 class="hero__title">
        <span class="pair__lead">${esc(t(brand.name, lang))}</span>
      </h1>
      <p class="text-en" style="margin-block-start:.75rem;font-size:var(--fs-lead)">${C.echoSpan(brand.name, lang)}</p>
      ${C.rule('rule--wide')}
      <p class="hero__tagline">${esc(t(brand.tagline, lang))}</p>
      <p class="text-en" style="margin-block-start:.5rem">${C.echoSpan(brand.tagline, lang)}</p>
      <div class="hero__actions">
        ${C.btn(linkTo(route, lang, 'work', lang), t(ui.allWork, lang), { variant: 'primary' })}
        ${C.btn(linkTo(route, lang, 'contact', lang), t(ui.startConversation, lang), { variant: 'ghost', arrow: false })}
      </div>
    </div>
  </section>

  <section class="section">
    ${C.watermark(route, lang)}
    <div class="container">
      ${C.eyebrow(about.eyebrow, lang, 1)}
      <p class="lead" style="max-inline-size:34ch;font-size:var(--fs-h2);color:var(--text-strong);font-weight:600">${esc(t(about.lead, lang))}</p>
      <p class="text-en" style="margin-block-start:1rem;max-inline-size:52ch">${C.echoSpan(about.lead, lang)}</p>
      <div class="prose" style="margin-block-start:2.5rem">
        <p>${esc(t(about.body[0], lang))}</p>
        <p>${esc(t(about.body[1], lang))}</p>
      </div>
      <p style="margin-block-start:2rem">
        <a class="link-arrow" href="${esc(linkTo(route, lang, 'about', lang))}">${esc(t(ui.readMore, lang))}${C.ARROW}</a>
      </p>
    </div>
  </section>

  <section class="section section--dark">
    <div class="container">
      ${C.eyebrow(services.eyebrow, lang, 2)}
      ${C.pair({ ar: services.lead.ar, en: services.lead.en }, lang, { tag: 'h2', className: 'h2' })}
      <div style="margin-block-start:3rem">
        ${C.numberedList(services.items, lang, { columns: 3 })}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${C.eyebrow(workIntro.eyebrow, lang, 3)}
      <p class="lead">${esc(t(workIntro.lead, lang))}</p>
      <div class="work-grid" style="margin-block-start:3rem">
        ${featured.map((p, i) => C.projectCard(route, lang, p, { featured: i === 0 })).join('\n        ')}
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
      ${C.eyebrow(statsIntro.eyebrow, lang, 4)}
      <div style="margin-block-start:2.5rem">${C.statsBlock(stats, lang)}</div>
    </div>
  </section>

  <section class="section section--dark">
    <div class="container">
      ${C.eyebrow(sectors.eyebrow, lang, 5)}
      <ul class="sectors" style="margin-block-start:2rem">
        ${sectors.items.map(s => `<li class="sector">${esc(t(s, lang))}<span class="sector__en">${C.echoSpan(s, lang)}</span></li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${C.eyebrow(why.eyebrow, lang, 6)}
      <div style="margin-block-start:2.5rem">${C.numberedList(why.items, lang)}</div>
    </div>
  </section>

  ${ctaBand(route, lang, A)}`,
  }
}

/* ── About ────────────────────────────────────────────────────────────── */
export function about_(route, lang, A) {
  return {
    title: `${t(about.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(about.body[0], lang),
    body: `
  ${pageHeader(route, lang, A, about.eyebrow, about.lead, 'team-crew',
    lang === 'ar' ? 'أحد أفراد فريق فاريوس في الموقع' : 'A VARIOUS crew member on site')}

  <section class="section">
    <div class="container container--text">
      <div class="prose">
        ${about.body.map(p => `<p>${esc(t(p, lang))}</p>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section section--dark">
    ${C.watermark(route, lang)}
    <div class="container container--text">
      ${C.eyebrow(founders.eyebrow, lang)}
      ${C.rule()}
      <blockquote class="prose" style="font-size:var(--fs-lead);color:var(--text-accent);line-height:1.7">
        ${founders.quote.map(p => `<p>«${esc(t(p, lang))}»</p>`).join('\n        ')}
      </blockquote>
      <p style="margin-block-start:2rem;font-weight:600;color:var(--text-strong)">${esc(t(founders.attribution, lang))}</p>
      <p class="text-en">${C.echoSpan(founders.attribution, lang)}</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="numbered numbered--three" style="gap:var(--sp-7)">
        <div class="numbered__item" style="border-block-start-color:var(--lime-400);border-block-start-width:2px">
          ${C.eyebrow(vision.eyebrow, lang)}
          <p class="lead" style="color:var(--text-strong)">${esc(t(vision.text, lang))}</p>
          <p class="text-en" style="margin-block-start:1rem">${C.echoSpan(vision.text, lang)}</p>
        </div>
        <div class="numbered__item" style="border-block-start-color:var(--lime-400);border-block-start-width:2px">
          ${C.eyebrow(mission.eyebrow, lang)}
          <p class="lead" style="color:var(--text-strong)">${esc(t(mission.text, lang))}</p>
          <p class="text-en" style="margin-block-start:1rem">${C.echoSpan(mission.text, lang)}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--dark">
    <div class="container">
      ${C.eyebrow(values.eyebrow, lang)}
      <div style="margin-block-start:2.5rem">${C.numberedList(values.items, lang)}</div>
    </div>
  </section>

  <section class="section">
    ${C.watermark(route, lang, 'watermark--start')}
    <div class="container">
      ${C.eyebrow(method.eyebrow, lang)}
      ${C.pair(method.lead, lang, { tag: 'p', className: 'h2' })}
      <div style="margin-block-start:2.5rem">${C.numberedList(method.steps, lang, { columns: 3 })}</div>
    </div>
  </section>

  <section class="section section--dark">
    <div class="container">
      ${C.eyebrow(statsIntro.eyebrow, lang)}
      <div style="margin-block-start:2.5rem">${C.statsBlock(stats, lang)}</div>
    </div>
  </section>

  ${ctaBand(route, lang, A)}`,
  }
}

/* ── Services ─────────────────────────────────────────────────────────── */
export function servicesPage(route, lang, A) {
  return {
    title: `${t(services.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(services.lead, lang),
    body: `
  ${pageHeader(route, lang, A, services.eyebrow, services.lead, 'saudi-cup',
    lang === 'ar' ? 'ممر مقوّس ينفذه فريق فاريوس' : 'An arched colonnade built by the VARIOUS team')}

  <section class="section">
    <div class="container">
      ${C.numberedList(services.items, lang, { columns: 3 })}
    </div>
  </section>

  <section class="section section--dark">
    ${C.watermark(route, lang)}
    <div class="container">
      ${C.eyebrow(method.eyebrow, lang)}
      ${C.pair(method.lead, lang, { tag: 'p', className: 'h2' })}
      <div style="margin-block-start:2.5rem">${C.numberedList(method.steps, lang, { columns: 3 })}</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${C.eyebrow(sectors.eyebrow, lang)}
      <ul class="sectors" style="margin-block-start:2rem">
        ${sectors.items.map(s => `<li class="sector">${esc(t(s, lang))}<span class="sector__en">${C.echoSpan(s, lang)}</span></li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  ${ctaBand(route, lang, A)}`,
  }
}

/* ── Work index ───────────────────────────────────────────────────────── */
export function work(route, lang, A) {
  return {
    title: `${t(workIntro.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(workIntro.lead, lang),
    body: `
  ${pageHeader(route, lang, A, workIntro.eyebrow, workIntro.lead, 'mood-fireworks',
    lang === 'ar' ? 'ألعاب نارية فوق حدث جماهيري' : 'Fireworks over a public event')}

  <section class="section">
    <div class="container">
      <p class="muted" style="max-inline-size:var(--measure)">${esc(t(workIntro.note, lang))}</p>
      <div class="work-grid" style="margin-block-start:3rem">
        ${projects.map((p, i) => C.projectCard(route, lang, p, { featured: i === 0 || i === 7 })).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section section--dark">
    ${C.watermark(route, lang, 'watermark--start')}
    <div class="container">
      ${C.eyebrow({ ar: 'ومن أعمالنا أيضًا', en: 'Also from our work' }, lang)}
      <ul class="roster" style="margin-block-start:2rem">
        ${additionalWorks.map((w, i) => `<li class="roster__item">
          <span class="roster__num">${esc(num(i + 1, lang))}</span>
          <span class="roster__name">${esc(t(w.client, lang))} — ${esc(t(w.title, lang))}
            <span class="roster__name-en">${C.echoSpan(w.client, lang)} — ${C.echoSpan(w.title, lang)}</span>
          </span>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  ${ctaBand(route, lang, A)}`,
  }
}

/* ── Project detail ───────────────────────────────────────────────────── */
export function project(route, lang, A, p, prev, next) {
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
    body: `
  <section class="project-hero">
    <div class="project-hero__media">${img(route, lang, p.image, {
      alt: [client, title].filter(Boolean).join(' — '), sizes: '100vw', eager: true })}</div>
  </section>

  <section class="section section--tight">
    ${C.watermark(route, lang)}
    <div class="container">
      <p style="margin-block-end:1.5rem">
        <a class="link-arrow" href="${esc(linkTo(route, lang, 'work', lang))}">${esc(t(ui.backToWork, lang))}${C.ARROW}</a>
      </p>
      ${C.eyebrow({ ar: 'مشروع', en: 'Project' }, lang)}
      <h1 class="h1">${esc(title)}</h1>
      <p class="text-en" style="margin-block-start:.75rem;font-size:var(--fs-lead)">${C.echoSpan(p.title, lang)}</p>
      ${C.rule('rule--wide')}
      <div class="prose" style="font-size:var(--fs-lead);color:var(--text-accent)">
        <p>${esc(t(p.text, lang))}</p>
      </div>
      <p class="text-en" style="margin-block-start:1.25rem;max-inline-size:var(--measure)">${C.echoSpan(p.text, lang)}</p>
    </div>
  </section>

  ${meta.length ? `<section class="section section--tight section--dark">
    <div class="container">
      <ul class="meta">
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

  ${ctaBand(route, lang, A)}`,
  }
}

/* ── Clients ──────────────────────────────────────────────────────────── */
export function clientsPage(route, lang, A) {
  return {
    title: `${t(clientsIntro.eyebrow, lang)} — ${t(brand.shortName, lang)}`,
    description: t(clientsIntro.lead, lang),
    body: `
  ${pageHeader(route, lang, A, clientsIntro.eyebrow, clientsIntro.lead, 'mood-riyadh',
    lang === 'ar' ? 'مشهد جوي للرياض عند الغروب' : 'Aerial view of Riyadh at sunset')}

  <section class="section">
    <div class="container">
      <ul class="roster">
        ${clients.map((c, i) => `<li class="roster__item">
          <span class="roster__num">${esc(num(i + 1, lang))}</span>
          <span class="roster__name">${esc(t(c, lang))}
            <span class="roster__name-en">${C.echoSpan(c, lang)}</span>
          </span>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section class="section section--dark">
    ${C.watermark(route, lang, 'watermark--start')}
    <div class="container">
      ${C.eyebrow(sectors.eyebrow, lang)}
      <ul class="sectors" style="margin-block-start:2rem">
        ${sectors.items.map(s => `<li class="sector">${esc(t(s, lang))}<span class="sector__en">${C.echoSpan(s, lang)}</span></li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  ${ctaBand(route, lang, A)}`,
  }
}

/* ── Contact ──────────────────────────────────────────────────────────── */
export function contactPage(route, lang, A) {
  return {
    title: `${t(ui.getInTouch, lang)} — ${t(brand.shortName, lang)}`,
    description: `${t(brand.name, lang)} — ${contact.phone} · ${contact.email}`,
    body: `
  <section class="hero" style="min-block-size:clamp(22rem,58vh,34rem)">
    <div class="hero__media">${img(route, lang, 'mood-fireworks', {
      alt: lang === 'ar' ? 'ألعاب نارية فوق حدث جماهيري' : 'Fireworks over a public event',
      sizes: '100vw', eager: true })}</div>
    <div class="hero__scrim"></div>
    <div class="container hero__body">
      ${C.eyebrow({ ar: 'الخاتمة وبيانات التواصل', en: 'Contact' }, lang)}
      <h1 class="hero__title" style="font-size:var(--fs-h1)">${esc(t(pauses.closing, lang))}</h1>
      <p class="text-en" style="margin-block-start:.75rem">${C.echoSpan(pauses.closing, lang)}</p>
    </div>
  </section>

  <section class="section">
    ${C.watermark(route, lang)}
    <div class="container">
      <ul class="contact-grid">
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
export function notFound(route, lang, A) {
  return {
    title: lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found',
    description: '',
    body: `
  <section class="section" style="min-block-size:60vh;display:grid;align-items:center">
    ${C.watermark(route, lang)}
    <div class="container">
      ${C.eyebrow({ ar: 'خطأ ٤٠٤', en: 'Error 404' }, lang)}
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
function pageHeader(route, lang, A, eyebrowPair, lead, image, alt) {
  return `<section class="hero" style="min-block-size:clamp(24rem,62vh,38rem)">
    <div class="hero__media">${img(route, lang, image, { alt, sizes: '100vw', eager: true })}</div>
    <div class="hero__scrim"></div>
    <div class="container hero__body">
      ${C.eyebrow(eyebrowPair, lang)}
      <h1 class="h1">${esc(t(eyebrowPair, lang))}</h1>
      ${C.rule('rule--wide')}
      <p class="lead">${esc(t(lead, lang))}</p>
      <p class="text-en" style="margin-block-start:.75rem;max-inline-size:var(--measure)">${C.echoSpan(lead, lang)}</p>
    </div>
  </section>`
}

function ctaBand(route, lang, A) {
  return `<section class="section section--dark" style="text-align:center">
    ${C.watermark(route, lang, 'watermark--start watermark--bottom')}
    <div class="container">
      <hr class="rule" style="margin-inline:auto">
      <p class="h2" style="max-inline-size:20ch;margin-inline:auto">${esc(t(ui.getInTouch, lang))}</p>
      <p class="text-en" style="margin-block-start:.75rem">${C.echoSpan(ui.getInTouch, lang)}</p>
      <div style="margin-block-start:2rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
        ${C.btn(linkTo(route, lang, 'contact', lang), t(ui.startConversation, lang))}
        ${C.btn(`tel:${contact.phoneHref}`, contact.phone, { variant: 'ghost', arrow: false })}
      </div>
    </div>
  </section>`
}
