#!/usr/bin/env node
/**
 * The printed company profile, generated from the same content as the website.
 *
 * Two separate editions, Arabic and English, each a 1280×720 landscape
 * document in the profile's own design system («منظومة الوقفة» / The Pause
 * System). One HTML file per edition is written to dist-profile/<lang>/, and
 * profile/export.mjs prints each to PDF with its internal links intact.
 *
 * The client's notes on the previous draft, and where each is handled:
 *   1  founders' word removed ............ not generated
 *   2  internal hyperlinks ............... contents, dividers, footers, clients
 *   3  fewer logos ....................... cover and closing page only
 *   4  "who we are" statement page gone .. about is one page
 *   5  separate AR and EN ................ LANGS loop
 *   6  Western digits .................... content files + num()
 *   7  no alternating languages .......... each edition is single-language
 *   8  no year / location on projects .... no such fields exist
 *   9  half text, half image, alternating  projectPage()
 *  10  chapter dividers .................. divider()
 *  11  "من أعمالنا" list page gone ....... not generated
 *  12  client logo on each project ....... logoPlate()
 *  13  one closing page .................. closing()
 */
import { mkdirSync, writeFileSync, readFileSync, readdirSync, cpSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { brand, contact } from '../content/site.mjs'
import { about, vision, values, method, why, pauses } from '../content/pages.mjs'
import { eventTypes, frameworkAgreements, solutions, solutionsIntro, ownerServices, ownersIntro } from '../content/services.mjs'
import { projects, categories } from '../content/projects.mjs'
import { clients } from '../content/clients.mjs'
import { stats } from '../content/stats.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'dist-profile')
const LANGS = ['ar', 'en']

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const num = n => String(n).padStart(2, '0')
const splitTitle = title => {
  const i = title.indexOf(' — ')
  return i < 0 ? { head: null, rest: title } : { head: title.slice(0, i), rest: title.slice(i + 3) }
}

/* ── Words that exist only in print ─────────────────────────────────────── */
const W = {
  profile:   { ar: 'الملف التعريفي 2026', en: 'Company Profile 2026' },
  contents:  { ar: 'المحتويات', en: 'Contents' },
  chapter:   { ar: 'الفصل', en: 'Chapter' },
  project:   { ar: 'مشروع', en: 'Project' },
  partOf:    { ar: (i, n) => `${i} من ${n}`, en: (i, n) => `${i} of ${n}` },
  client:    { ar: 'العميل', en: 'Client' },
  scope:     { ar: 'نطاق العمل', en: 'Scope' },
  services:  { ar: 'خدماتنا', en: 'Our Services' },
  partOne:   { ar: 'أولًا', en: 'Part one' },
  partTwo:   { ar: 'ثانيًا', en: 'Part two' },
  partThree: { ar: 'ثالثًا', en: 'Part three' },
  continued: { ar: 'تابع', en: 'continued' },
  thanks:    { ar: 'شكرًا لكم', en: 'Thank you' },
  phone:     { ar: 'الهاتف والواتساب', en: 'Phone & WhatsApp' },
  email:     { ar: 'البريد الإلكتروني', en: 'Email' },
  web:       { ar: 'الموقع الإلكتروني', en: 'Website' },
  address:   { ar: 'العنوان', en: 'Address' },
  social:    { ar: 'حسابات التواصل', en: 'Social' },
  numbers:   { ar: 'بالأرقام', en: 'In numbers' },
  framework: { ar: 'ونقدّم خدماتنا كذلك عبر', en: 'Also available through' },
  photosTbc: { ar: 'صور المشروع', en: 'Project photography' },
  award:     { ar: 'جائزة', en: 'Award' },
  legal: {
    ar: 'شركة الفعاليات المتنوعة لتنظيم المعارض والمؤتمرات — سجل تجاري 1010960212',
    en: 'Various Events Company for Organizing Exhibitions and Conferences — CR 1010960212',
  },
}

/* The five chapters. Each opens on a divider page with one short line. */
const CHAPTERS = [
  { id: 'ch-about', title: { ar: 'من نحن', en: 'Who We Are' }, image: 'mood-riyadh',
    line: { ar: 'جهة واحدة، من الفكرة الأولى إلى التقرير الختامي.', en: 'One party, from the first idea to the final report.' } },
  { id: 'ch-services', title: { ar: 'خدماتنا وحلولنا', en: 'Services & Solutions' }, image: 'cover-collage',
    line: { ar: 'كل ما يحتاجه الحدث، تحت سقف واحد.', en: 'Everything an event needs, under one roof.' } },
  { id: 'ch-method', title: { ar: 'كيف نعمل', en: 'How We Work' }, image: 'mood-line',
    line: { ar: 'خطوات واضحة، ونتيجة تُقاس.', en: 'Clear steps. Results you can measure.' } },
  { id: 'ch-work', title: { ar: 'أعمالنا', en: 'Our Work' }, image: 'mood-fireworks',
    line: { ar: 'قصص صنعناها، وتستحق أن تُروى.', en: 'Stories we built — and worth telling.' } },
  { id: 'ch-clients', title: { ar: 'عملاؤنا', en: 'Our Clients' }, image: 'mood-city',
    line: { ar: 'ثقةٌ نبنيها، مشروعًا بعد مشروع.', en: 'Trust, built one project at a time.' } },
]

/* ── Assets ─────────────────────────────────────────────────────────────── */
const imgWidths = (() => {
  const m = new Map()
  for (const f of readdirSync(join(ROOT, 'assets/img'))) {
    const r = /^(.+)-(\d+)\.jpg$/.exec(f); if (!r) continue
    if (!m.has(r[1])) m.set(r[1], [])
    m.get(r[1]).push(Number(r[2]))
  }
  for (const a of m.values()) a.sort((x, y) => x - y)
  return m
})()

/** The best variant for a slot `w` CSS px wide, printed at up to 2× density. */
function photo(name, w) {
  const ws = imgWidths.get(name)
  if (!ws) throw new Error(`profile: no image "${name}"`)
  const want = w * 2
  const pick = ws.find(x => x >= want) ?? ws[ws.length - 1]
  return `../assets/img/${name}-${pick}.jpg`
}

const PATTERN = readFileSync(join(ROOT, 'assets/logo/pattern.svg'), 'utf8')
  .replace(/<\?xml[^>]*\?>\s*/i, '')
  .replace(/<svg/i, '<svg aria-hidden="true" class="pattern"')
  .replace(/style="[^"]*"/, '')

const logo = (tone = 'light') => `<span class="logo">
    <img src="../assets/logo/wordmark-${tone}.svg" alt="VARIOUS for Events Services" class="logo__word">
    <img src="../assets/logo/mark.svg" alt="" class="logo__mark">
  </span>`

/* ── Page shell ─────────────────────────────────────────────────────────── */
function build(lang) {
  const t = v => (v && typeof v === 'object' && 'ar' in v) ? v[lang] : v
  const pages = []   // { id, theme, chapter, html: n => string }
  const add = (p) => { pages.push(p); return p }

  const footer = (n, chapter) => chapter ? `<footer class="foot">
      <span class="foot__num">${num(n)}</span>
      <span class="foot__rule"></span>
      <span class="foot__chapter">${esc(t(chapter.title))}</span>
      <a class="foot__toc" href="#contents">${esc(t(W.contents))}</a>
    </footer>` : ''

  const head = (title, eyebrow, compact = false) => `<header class="head${compact ? ' head--compact' : ''}">
      ${eyebrow ? `<p class="eyebrow">${esc(t(eyebrow))}</p>` : ''}
      <h2 class="head__title">${esc(t(title))}</h2>
      <hr class="rule">
    </header>`

  /* Cover */
  add({ id: 'cover', theme: 'photo', html: () => `
    <div class="bg"><img src="${photo('cover-collage', 1280)}" alt=""></div>
    <div class="scrim scrim--cover"></div>
    <div class="cover">
      <div class="cover__logo">${logo('light')}</div>
      <div class="cover__body">
        <p class="eyebrow">${esc(t(W.profile))}</p>
        <h1 class="cover__title">${esc(t(brand.name))}</h1>
        <hr class="rule rule--wide">
        <p class="cover__tagline">${esc(t(brand.tagline))}</p>
      </div>
    </div>` })

  /* Contents — filled in once page numbers are known. */
  const toc = add({ id: 'contents', theme: 'light', html: null })

  /* ── Chapter 1: who we are ────────────────────────────────────────────── */
  const ch1 = CHAPTERS[0]
  const sec = {}
  const divider = (ch, idx, links) => add({ id: ch.id, theme: 'photo', chapter: ch, divider: true, html: (n) => `
    <div class="bg"><img src="${photo(ch.image, 1280)}" alt=""></div>
    <div class="scrim scrim--divider"></div>
    <div class="divider">
      <p class="divider__num" aria-hidden="true">${num(idx + 1)}</p>
      <div class="divider__body">
        <p class="eyebrow">${esc(t(W.chapter))} ${num(idx + 1)}</p>
        <h2 class="divider__title">${esc(t(ch.title))}</h2>
        <hr class="rule rule--wide">
        <p class="divider__line">${esc(t(ch.line))}</p>
      </div>
      <ul class="divider__links">
        ${links().map(l => `<li><a href="#${l.id}"><span>${esc(t(l.title))}</span><span class="divider__page">${num(l.n)}</span></a></li>`).join('')}
      </ul>
    </div>
    ${footer(n, null)}` })

  const d1 = divider(ch1, 0, () => [sec.about, sec.vision, sec.values])
  sec.about = add({ id: 'about', theme: 'light', chapter: ch1, title: about.eyebrow, html: () => `
    ${watermark()}
    <div class="grid-about">
      <div>
        ${head(about.eyebrow)}
        <div class="prose">${about.body.map(p => `<p>${esc(t(p))}</p>`).join('')}</div>
      </div>
      <div class="about-figures">
        <p class="eyebrow">${esc(t(brand.shortName))} ${esc(t(W.numbers))}</p>
        <ul class="stats">${stats.map(s => `<li>
          <p class="stats__value"><span class="lt">${s.value}${s.plus ? '+' : ''}</span></p>
          <p class="stats__label">${esc(t(s.label))}</p></li>`).join('')}</ul>
        <div class="about-photo"><img src="${photo('team-crew', 420)}" alt=""></div>
      </div>
    </div>` })

  sec.vision = add({ id: 'vision', theme: 'dark', chapter: ch1, title: vision.eyebrow, html: () => `
    <div class="vm">
      <div class="vm__window"><img src="${photo('mood-alula', 560)}" alt=""></div>
      <div class="vm__body">
        ${head(vision.eyebrow)}
        ${[vision.visionItem, vision.missionItem].map(i => `<div class="vm__item">
          <h3 class="vm__label">${esc(t(i.label))}</h3>
          <p class="vm__text">${esc(t(i.text))}</p></div>`).join('')}
      </div>
    </div>` })

  sec.values = add({ id: 'values', theme: 'light', chapter: ch1, title: values.eyebrow, html: () => `
    ${watermark()}
    ${head(values.eyebrow)}
    <p class="lead">${esc(t(values.lead))}</p>
    <ol class="values">${values.items.map((v, i) => `<li>
      <span class="values__num">${num(i + 1)}</span>
      <h3 class="values__title">${esc(t(v.title))}</h3>
      <p class="values__text">${esc(t(v.text))}</p></li>`).join('')}</ol>` })

  /* ── Chapter 2: services ──────────────────────────────────────────────── */
  const ch2 = CHAPTERS[1]
  divider(ch2, 1, () => [sec.services, sec.solutions, sec.owners])
  sec.services = add({ id: 'services', theme: 'dark', chapter: ch2, title: W.services, html: () => `
    ${head(W.services, W.partOne)}
    <ul class="types">${eventTypes.map(s => `<li class="types__item">
      <img src="${photo(s.image, 380)}" alt="">
      <span class="types__title">${esc(t(s.title))}</span></li>`).join('')}</ul>
    <p class="types__extra"><span>${esc(t(W.framework))}</span> <strong>${esc(t(frameworkAgreements.title))}</strong></p>` })

  // The fourteen solution groups run across three pages, so the full lists
  // stay at a readable size.
  // Groups are dealt into three columns by hand, in order, so the columns end
  // level — CSS multi-column balancing leaves one long and one short.
  const group = g => `<section class="group">
      <h3 class="group__title">${esc(t(g.title))}</h3>
      <p class="group__items">${g.items.map(i => `<span>${esc(t(i))}</span>`).join('<i aria-hidden="true">·</i>')}</p>
    </section>`
  const groupList = (groups) => `<div class="groups">${columnsOf(groups, 3).map(col => `<div class="groups__col">${col.map(group).join('')}</div>`).join('')}</div>`
  const solutionPages = [solutions.slice(0, 5), solutions.slice(5, 10), solutions.slice(10)]
  solutionPages.forEach((groups, i) => {
    const pg = add({ id: i ? `solutions-${i + 1}` : 'solutions', theme: 'light', chapter: ch2, title: i ? null : solutionsIntro.eyebrow, html: () => `
    ${i ? head({ ar: `${solutionsIntro.eyebrow.ar} — ${W.continued.ar}`, en: `${solutionsIntro.eyebrow.en} — ${W.continued.en}` }, W.partTwo, true)
        : `<div class="head-row">${head(solutionsIntro.eyebrow, W.partTwo, true)}<p class="lead lead--aside">${esc(t(solutionsIntro.lead))}</p></div>`}
    ${groupList(groups)}` })
    if (!i) sec.solutions = pg
  })
  sec.owners = add({ id: 'owners', theme: 'dark', chapter: ch2, title: ownersIntro.eyebrow, html: () => `
    <div class="head-row">${head(ownersIntro.eyebrow, W.partThree, true)}<p class="lead lead--aside">${esc(t(ownersIntro.lead))}</p></div>
    <div class="groups groups--four">${ownerServices.map(g => `<section class="group">
      <h3 class="group__title">${esc(t(g.title))}</h3>
      <ul class="group__list">${g.items.map(i => `<li>${esc(t(i))}</li>`).join('')}</ul>
    </section>`).join('')}</div>` })

  /* ── Chapter 3: how we work ───────────────────────────────────────────── */
  const ch3 = CHAPTERS[2]
  divider(ch3, 2, () => [sec.method, sec.why])
  sec.method = add({ id: 'method', theme: 'light', chapter: ch3, title: method.eyebrow, html: () => `
    ${watermark()}
    ${head(method.eyebrow)}
    <p class="lead">${esc(t(method.lead))}</p>
    <ol class="path">${method.steps.map((s, i) => `<li class="path__step">
      <span class="path__node">${num(i + 1)}</span>
      ${i < method.steps.length - 1 ? `<span class="path__link" aria-hidden="true"><span class="path__line"></span><svg class="path__arrow" viewBox="0 0 16 16"><path d="M5 2l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>` : ''}
      <h3 class="path__title">${esc(t(s.title))}</h3>
      <p class="path__text">${esc(t(s.text))}</p></li>`).join('')}</ol>` })

  sec.why = add({ id: 'why', theme: 'dark', chapter: ch3, title: why.eyebrow, html: () => `
    ${head(why.eyebrow)}
    <ol class="why">${why.items.map((w, i) => `<li>
      <span class="why__num">${num(i + 1)}</span>
      <div><h3 class="why__title">${esc(t(w.title))}</h3>
      <p class="why__text">${esc(t(w.text))}</p></div></li>`).join('')}</ol>
    <div class="award">
      <span class="award__star" aria-hidden="true">★</span>
      <p><strong>${esc(t(why.award.label))}</strong> — ${esc(t(why.award.text))}</p>
    </div>` })

  /* ── Chapter 4: the work ──────────────────────────────────────────────── */
  const ch4 = CHAPTERS[3]
  const firstOf = {}
  divider(ch4, 3, () => categories.map(c => ({ id: firstOf[c.id].id, title: c.title, n: firstOf[c.id].n })))

  // Expand projects into pages: one per project, except where the copy deck's
  // layout note asks for one page per part (Ministry of Culture) or one page
  // per brand identity (Snood Hotels).
  const projectPages = []
  for (const p of projects) {
    if (p.slug === 'ministry-of-culture') {
      p.parts.forEach((part, i) => projectPages.push({ p, part, index: i + 1, of: p.parts.length, image: part.image }))
    } else if (p.slug === 'snood-hotels') {
      const groups = []
      for (const part of p.parts) { if (part.group) groups.push({ group: part.group, parts: [] }); groups[groups.length - 1].parts.push(part) }
      groups.forEach((g, i) => projectPages.push({ p, group: g, index: i + 1, of: groups.length, image: null }))
    } else {
      projectPages.push({ p, image: p.image })
    }
  }
  projectPages.forEach((pp, k) => {
    const cat = categories.find(c => c.id === pp.p.category)
    const page = add({ id: `work-${pp.p.slug}${pp.index ? '-' + pp.index : ''}`, theme: 'light', chapter: ch4, html: () => projectPage(pp, k, cat) })
    if (!firstOf[cat.id]) firstOf[cat.id] = page
    if (!pp.index || pp.index === 1) pp.p._page = page
  })

  function projectPage(pp, k, cat) {
    const { p, part, group } = pp
    const { head: client, rest } = splitTitle(t(p.title))
    const title = part ? t(part.title) : rest
    const scope = (part ? part.scope : p.scope) || []
    const types = part ? [] : (p.types || [])
    const flip = k % 2 === 1
    const media = pp.image
      ? `<img src="${photo(pp.image, 640)}" alt="${esc(t(p.title))}">`
      : `<div class="panel">${PATTERN}<img class="panel__mark" src="../assets/logo/mark.svg" alt=""></div>`
    const parts = (!part && !group && p.parts) ? p.parts : group ? group.parts : null
    const words = (part ? t(part.text).length : t(p.text).length) + (parts ? parts.reduce((n, x) => n + (x.text ? t(x.text).length : 40), 0) : 0)
    // English runs longer than Arabic for the same copy, so it tips over sooner.
    const limit = lang === 'ar' ? 330 : 380
    const size = words > limit * 1.45 ? ' proj--long proj--xlong' : words > limit ? ' proj--long' : ''
    return `<div class="proj${flip ? ' proj--flip' : ''}${size}">
      <div class="proj__media">${media}</div>
      <div class="proj__body">
        <div class="proj__top">
          <p class="eyebrow">${esc(t(cat.title))}</p>
          ${logoPlate(p.client ? clientName(p.client) : client)}
        </div>
        ${client ? `<p class="proj__client">${esc(client)}${pp.index ? ` · ${esc(W.partOf[lang](pp.index, pp.of))}` : ''}</p>` : ''}
        <h2 class="proj__title">${esc(title)}</h2>
        ${group ? `<p class="proj__group">${esc(t(group.group))}</p>` : ''}
        <hr class="rule">
        ${part && pp.index === 1 ? `<p class="proj__intro">${esc(t(p.text))}</p>` : ''}
        ${part ? `<p class="proj__text">${esc(t(part.text))}</p>` : ''}
        ${group && pp.index === 1 ? `<p class="proj__text">${esc(t(p.text))}</p>` : ''}
        ${!part && !group ? `<p class="proj__text">${esc(t(p.text))}</p>` : ''}
        ${parts ? `<ul class="proj__parts">${parts.map(x => `<li>
          <p class="proj__part">${esc(t(x.title))}${x.award ? ` <span class="badge">★ ${esc(t(x.award))}</span>` : ''}</p>
          ${x.text ? `<p class="proj__part-text">${esc(t(x.text))}</p>` : ''}</li>`).join('')}</ul>` : ''}
        ${p.award && (!group || pp.index === pp.of) ? `<p class="badge badge--big">★ ${esc(t(p.award))}</p>` : ''}
        <ul class="tags">${types.concat(scope).map(x => `<li>${esc(t(x))}</li>`).join('')}</ul>
      </div>
    </div>`
  }
  function clientName(ar) { const c = clients.find(x => x.ar === ar); return c ? t(c) : ar }
  // No vector logos have been supplied yet. Until they are, the plate carries
  // the client's name, set as a wordmark, in the slot the logo will occupy.
  function logoPlate(name) {
    if (!name) return ''
    return `<div class="plate" title="${esc(name)}"><span>${esc(name)}</span></div>`
  }

  /* ── Chapter 5: clients ───────────────────────────────────────────────── */
  const ch5 = CHAPTERS[4]
  divider(ch5, 4, () => [sec.clients])
  sec.clients = add({ id: 'clients', theme: 'light', chapter: ch5, title: { ar: 'عملاؤنا', en: 'Our Clients' }, html: () => `
    ${head({ ar: 'عملاؤنا', en: 'Our Clients' })}
    <ul class="clients">${clients.map(c => {
      const p = projects.find(x => x.client === c.ar)
      const inner = `<span>${esc(t(c))}</span>`
      return `<li>${p && p._page ? `<a href="#${p._page.id}">${inner}</a>` : inner}</li>`
    }).join('')}</ul>` })

  /* Closing — the two closing pages of the previous draft, merged. */
  add({ id: 'closing', theme: 'photo', html: () => `
    <div class="bg"><img src="${photo('mood-fireworks', 1280)}" alt=""></div>
    <div class="scrim scrim--closing"></div>
    <div class="closing">
      <div class="closing__lead">
        <p class="eyebrow">${esc(t(W.thanks))}</p>
        <h2 class="closing__title">${esc(t(pauses.closing))}</h2>
        <hr class="rule rule--wide">
        <p class="closing__tagline">${esc(t(brand.tagline))}</p>
      </div>
      <dl class="closing__contact">
        <div><dt>${esc(t(W.phone))}</dt><dd><a class="lt" href="${esc(contact.whatsappHref)}">${esc(contact.phone)}</a></dd></div>
        <div><dt>${esc(t(W.email))}</dt><dd><a class="lt" href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></dd></div>
        <div><dt>${esc(t(W.web))}</dt><dd><a class="lt" href="${esc(contact.websiteHref)}">${esc(contact.website)}</a></dd></div>
        <div><dt>${esc(t(W.address))}</dt><dd>${esc(t(contact.address))}</dd></div>
        <div class="closing__social"><dt>${esc(t(W.social))}</dt><dd><ul>${contact.social.map(s =>
          `<li><a href="${esc(s.href)}"><span class="closing__net">${esc(s.label)}</span> <span class="lt">${esc(s.handle)}</span></a></li>`).join('')}</ul></dd></div>
      </dl>
      <div class="closing__foot">
        ${logo('light')}
        <p class="closing__legal">${esc(t(W.legal))}</p>
      </div>
    </div>` })

  // Number the pages, then render — the contents and the dividers need the
  // numbers of pages that come after them.
  pages.forEach((p, i) => { p.n = i + 1 })
  toc.html = () => `
    ${watermark()}
    ${head(W.contents)}
    <ol class="toc">${CHAPTERS.map((ch, i) => {
      const d = pages.find(p => p.id === ch.id)
      const subs = pages.filter(p => p.chapter === ch && p.title)
      const extra = ch.id === 'ch-work' ? categories.map(c => ({ id: firstOf[c.id].id, n: firstOf[c.id].n, title: c.title })) : subs.map(s => ({ id: s.id, n: s.n, title: s.title }))
      return `<li class="toc__chapter">
        <a class="toc__head" href="#${ch.id}"><span class="toc__num">${num(i + 1)}</span><span class="toc__title">${esc(t(ch.title))}</span><span class="toc__page">${num(d.n)}</span></a>
        <ul class="toc__subs">${extra.map(s => `<li><a href="#${s.id}"><span>${esc(t(s.title))}</span><span class="toc__page">${num(s.n)}</span></a></li>`).join('')}</ul>
      </li>`
    }).join('')}</ol>`

  const body = pages.map(p => `<section class="page page--${p.theme}${p.divider ? ' page--divider' : ''}" id="${p.id}">
  ${p.html(p.n)}
  ${p.divider || !p.chapter ? '' : footer(p.n, p.chapter)}
</section>`).join('\n')

  return `<!doctype html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8">
<title>${esc(t(brand.name))} — ${esc(t(W.profile))}</title>
<link rel="stylesheet" href="../profile.css">
</head>
<body>
${body}
</body>
</html>
`

  function watermark() { return `<div class="watermark">${PATTERN}</div>` }
}

/** Split `items` into `k` contiguous columns with the tallest as short as possible. */
function columnsOf(items, k) {
  const weight = g => 2.2 + g.items.reduce((s, i) => s + i.ar.length + 3, 0) / 48
  const w = items.map(weight)
  let best = null
  const rec = (start, left, acc) => {
    if (left === 1) {
      const cols = [...acc, items.slice(start)]
      const max = Math.max(...cols.map(c => c.reduce((s, g) => s + w[items.indexOf(g)], 0)))
      if (!best || max < best.max) best = { max, cols }
      return
    }
    for (let end = start + 1; end <= items.length - left + 1; end++) rec(end, left - 1, [...acc, items.slice(start, end)])
  }
  rec(0, k, [])
  return best.cols
}

/* ── Write ──────────────────────────────────────────────────────────────── */
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
cpSync(join(ROOT, 'assets/fonts'), join(OUT, 'assets/fonts'), { recursive: true })
cpSync(join(ROOT, 'assets/logo'), join(OUT, 'assets/logo'), { recursive: true })
cpSync(join(ROOT, 'assets/img'), join(OUT, 'assets/img'), { recursive: true })
cpSync(join(ROOT, 'profile/profile.css'), join(OUT, 'profile.css'))
for (const lang of LANGS) {
  mkdirSync(join(OUT, lang), { recursive: true })
  writeFileSync(join(OUT, lang, 'index.html'), build(lang))
}
console.log(`Profile written to ${OUT}/{${LANGS.join(',')}}/index.html`)
