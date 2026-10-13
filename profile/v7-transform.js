/* ─────────────────────────────────────────────────────────────────────────
   Builds the printed profile from the client's approved copy deck, on v7's
   own page designs.

   Runs inside Chromium against the v7 file. Every page keeps v7's styles:
   pages that exist in v7 are re-worded in place, and pages v7 has no
   counterpart for (service lists, project pages, chapter dividers) are
   clones of the v7 page closest to them, filled with the deck's words.
   Nothing here carries v7 wording: all copy comes in through `A.c`, which is
   the same content the website is built from.

   window.reviseV7(lang, A) → turns the open document into one edition.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict'

  // The four networks' own marks, as filled glyphs on a 24px grid.
  const ICONS = {
    instagram: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z',
    x: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  }

  const INDIC = /[٠-٩]/g
  const western = s => s.replace(INDIC, d => String(d.charCodeAt(0) - 0x0660))
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const st = (el, k) => (el.getAttribute('style') || '').includes(k)
  const $ = (root, sel) => root.querySelector(sel)
  const html = s => { const t = document.createElement('template'); t.innerHTML = s.trim(); return t.content.firstElementChild }
  const keep = el => { el.setAttribute('data-keep-fs', '1'); return el }
  const headOf = page => [...page.querySelectorAll('span')].find(x => /font-size:\s*36px/.test(x.getAttribute('style') || ''))
  const bigOf = page => [...page.querySelectorAll('div')].find(d => !d.children.length && /font-size:(3[6-9]|4\d)px/.test(d.getAttribute('style') || ''))

  window.reviseV7 = function (lang, A) {
    const EN = lang === 'en'
    const C = A.c
    const L = o => (o == null ? '' : typeof o === 'string' ? o : o[lang])
    const dir = EN ? 'ltr' : 'rtl'
    const start = EN ? 'left' : 'right'
    const v7 = [...document.querySelectorAll('.page')]
    if (v7.length !== 35) throw new Error('expected the 35-page v7, found ' + v7.length)
    const P = n => v7[n - 1]
    const body = document.body
    const splitTitle = t => { const i = t.indexOf(' — '); return i < 0 ? { head: '', rest: t } : { head: t.slice(0, i), rest: t.slice(i + 3) } }
    if (EN) document.documentElement.lang = 'en'

    // Rail dot styles, read from v7 itself before anything is touched.
    const railOf = p => p.querySelector(':scope > div[style*="left:28px;top:106px"]')
    const dotStyles = {}
    for (const p of v7) {
      const rail = railOf(p); if (!rail) continue
      const theme = p.classList.contains('light') ? 'light' : 'dark'
      const kids = [...rail.children], m = kids.findIndex(k => k.querySelector('img'))
      dotStyles[theme] = dotStyles[theme] || {}
      if (m > 0) dotStyles[theme].done = kids[0].getAttribute('style')
      if (m < kids.length - 1) dotStyles[theme].todo = kids[kids.length - 1].getAttribute('style')
    }
    const markSpan = railOf(P(1)).querySelector('span:has(img)').cloneNode(true)

    // Section header: the page's own language leads, the other trails.
    const setHeader = (page, ar, en) => {
      const t = headOf(page), e = t.nextElementSibling
      if (EN) { t.textContent = en; t.style.direction = 'ltr'; e.textContent = ar; e.classList.remove('lt'); e.style.direction = 'rtl' }
      else { t.textContent = ar; e.textContent = en.toUpperCase() }
    }
    const dropLogo = p => p.querySelectorAll(':scope > div[style*="top:54px"][style*="z-index:9"]').forEach(d => d.remove())

    /* ── Cover ─────────────────────────────────────────────────────────── */
    {
      const box = $(P(1), ':scope > div[style*="right:72px;top:190px"]')
      const [eyebrow, title, nameEn, tagBox] = box.children
      if (EN) { box.style.direction = 'ltr'; title.innerHTML = 'VARIOUS<br>for Events Services'; eyebrow.style.direction = 'ltr' }
      nameEn.remove()
      tagBox.children[1].textContent = L(C.brand.tagline)
      tagBox.children[2].remove()
    }

    /* ── Who we are: one page, the copy deck's two paragraphs ─────────── */
    {
      const pg = P(5)
      setHeader(pg, 'من نحن', 'Who We Are')
      const box = $(pg, ':scope > div[style*="top:184px;right:72px;width:600px"]')
      keep(box); box.style.width = '640px'
      const [text, twin] = box.children
      text.innerHTML = C.about.body.map(L).join('<br><br>')
      text.style.fontSize = (EN ? 22 : 26) + 'px'; text.style.lineHeight = EN ? '1.65' : '1.9'
      if (EN) { text.style.direction = 'ltr'; text.style.textAlign = 'left' }
      twin.remove()
    }

    /* ── Vision, Mission ──────────────────────────────────────────────── */
    const textPage = (pg, ar, en, text, size, wide) => {
      setHeader(pg, ar, en)
      const big = bigOf(pg)
      big.textContent = L(text)
      big.nextElementSibling.remove()
      big.style.fontSize = size + 'px'; big.style.lineHeight = '1.5'
      if (EN) { big.style.direction = 'ltr'; big.style.textAlign = 'left' }
      if (wide) { big.parentElement.style.maxWidth = wide + 'px'; big.parentElement.parentElement.style.width = wide + 'px' }
      keep(big.parentElement)
    }
    textPage(P(7), 'رؤيتنا', 'Our Vision', C.vision.visionItem.text, EN ? 26 : 31, 440)
    textPage(P(8), 'رسالتنا', 'Our Mission', C.vision.missionItem.text, EN ? 36 : 42)

    /* ── Values: five cards ───────────────────────────────────────────── */
    {
      const pg = P(9)
      setHeader(pg, 'قيمنا', 'Our Values')
      const grid = $(pg, ':scope > div[style*="grid-template-columns:1fr 1fr"]')
      keep(grid)
      grid.style.gridTemplateColumns = 'repeat(6,1fr)'
      grid.style.direction = dir
      grid.innerHTML = C.values.items.map((v, i) => `<div style="grid-column:span ${i < 3 ? 2 : 3};background:#152433;padding:24px 28px;display:flex;flex-direction:column;direction:${dir};text-align:${start}">
        <div style="display:flex;align-items:center;gap:14px"><span style="font-size:26px;font-weight:700;color:#afda68">${String(i + 1).padStart(2, '0')}</span><span style="font-size:32px;font-weight:700;color:#ffffff">${esc(L(v.title))}</span></div>
        <div style="font-size:21px;line-height:1.65;color:rgba(255,255,255,.88);margin-top:14px">${esc(L(v.text))}</div></div>`).join('')
    }

    /* ── Services and solutions, from v7's services page ──────────────── */
    const svcTpl = P(10)
    const svcBlock = (num, title, items, size) => html(`<div style="border-top:1px solid rgba(69,122,46,.45);padding:14px 0 6px;direction:${dir};text-align:${start}">
      <div style="display:flex;align-items:baseline;gap:12px">${num
        ? `<span style="font-size:22px;font-weight:700;color:#457a2e">${num}</span>`
        : '<span style="flex:none;align-self:center;width:10px;height:10px;background:linear-gradient(90deg,#afda68,#457a2e)"></span>'}
        <span style="font-size:${size}px;font-weight:700;line-height:1.35;color:#0f1b28">${esc(title)}</span></div>
      ${items ? `<div style="font-size:20px;line-height:1.7;color:rgba(15,27,40,.86);margin-top:9px">${items.map(i => esc(L(i))).join('<span style="color:#457a2e;font-weight:700;padding:0 7px">·</span>')}</div>` : ''}</div>`)
    const newSvcPage = () => {
      const pg = svcTpl.cloneNode(true)
      const bodyBox = $(pg, ':scope > div[style*="top:184px;right:72px;left:72px;display:flex"]')
      keep(bodyBox); bodyBox.innerHTML = ''; bodyBox.style.gap = '48px'; bodyBox.style.direction = dir
      const cols = [0, 1].map(() => { const c = document.createElement('div'); c.setAttribute('style', 'flex:1;display:flex;flex-direction:column;gap:14px;min-width:0'); bodyBox.appendChild(c); return c })
      body.appendChild(pg)
      return { pg, cols }
    }
    // Fill columns in order; open a new page when a block no longer fits.
    const flow = (blocks, ar, en) => {
      const pages = []
      let cur = newSvcPage(); pages.push(cur)
      for (const b of blocks) {
        let placed = false
        while (!placed) {
          for (const col of cur.cols) {
            col.appendChild(b)
            const over = b.getBoundingClientRect().bottom - cur.pg.getBoundingClientRect().top > 640
            if (!over || (col === cur.cols[0] && col.children.length === 1)) { placed = true; break }
            col.removeChild(b)
          }
          if (!placed) { cur = newSvcPage(); pages.push(cur) }
        }
      }
      pages.forEach((p, i) => setHeader(p.pg, pages.length > 1 ? `${ar} (${i + 1}/${pages.length})` : ar, pages.length > 1 ? `${en} (${i + 1}/${pages.length})` : en))
      return pages.map(p => p.pg)
    }
    const partOne = (() => {
      const { pg, cols } = newSvcPage()
      const names = [...C.eventTypes.map(e => L(e.title)), L(C.frameworkAgreements.title)]
      names.forEach((n, i) => cols[i < 4 ? 0 : 1].appendChild(svcBlock('', n, null, 30)))
      setHeader(pg, 'أولًا — خدماتنا', 'Part One — Our Services')
      return pg
    })()
    const solutionPages = flow(C.solutions.map((g, i) => svcBlock(String(i + 1).padStart(2, '0'), L(g.title), g.items, 27)),
      'ثانيًا — حلولنا', 'Part Two — Our Solutions')
    const ownerPages = flow(C.ownerServices.map((g, i) => svcBlock(String(i + 1).padStart(2, '0'), L(g.title), g.items, 27)),
      'ثالثًا — خدمات أصحاب المعارض', 'Part Three — For Exhibition Owners')

    /* ── How we work: the website's connected path ────────────────────── */
    {
      const mp = P(11)
      setHeader(mp, 'منهجية عملنا', 'How We Work')
      $(mp, ':scope > div[style*="top:186px;right:72px;left:72px"]').remove()
      const Y0 = 150, PITCH = 96, NODE = 58, GAP = PITCH - NODE, n = C.method.steps.length
      const path = keep(html('<div style="position:absolute;inset:0;direction:ltr"></div>'))
      path.innerHTML = C.method.steps.map((s, i) => {
        const top = Y0 + i * PITCH, right = i % 2 === 0, first = i === 0
        const node = `<div style="position:absolute;left:${640 - NODE / 2}px;top:${top}px;width:${NODE}px;height:${NODE}px;border-radius:50%;border:2px solid #afda68;background:${first ? '#afda68' : '#0f1b28'};color:${first ? '#0f1b28' : '#ffffff'};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;z-index:2">${String(i + 1).padStart(2, '0')}</div>`
        const link = i < n - 1
          ? `<svg style="position:absolute;left:630px;top:${top + NODE}px" width="20" height="${GAP}" viewBox="0 0 20 ${GAP}"><line x1="10" y1="0" x2="10" y2="${GAP - 5}" stroke="#afda68" stroke-width="2"/><path d="M4 ${GAP - 12} L10 ${GAP - 4} L16 ${GAP - 12}" fill="none" stroke="#afda68" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''
        const align = right && EN ? 'left' : 'right'
        const card = `<div style="position:absolute;top:${top - 2}px;${right ? 'right' : 'left'}:72px;width:490px;direction:${dir};text-align:${align}"><div style="font-size:36px;font-weight:700;line-height:1.25;color:#ffffff">${esc(L(s.title))}</div><div style="font-size:22px;line-height:1.5;color:rgba(255,255,255,.86);margin-top:4px">${esc(L(s.text))}</div></div>`
        return node + link + card
      }).join('')
      mp.insertBefore(path, $(mp, ':scope > div[style*="top:54px"], :scope > div[style*="bottom:50px"]'))
    }

    /* ── Numbers: only the figures the client has given ───────────────── */
    {
      const np = P(12)
      setHeader(np, 'فاريوس بالأرقام', 'VARIOUS in Numbers')
      const grid = $(np, 'div[style*="grid-template-columns:repeat(3,1fr)"]')
      keep(grid)
      grid.style.gridTemplateColumns = 'repeat(2,1fr)'; grid.style.top = '240px'
      grid.innerHTML = C.stats.map(s => `<div style="border-top:1px solid rgba(69,122,46,.45);padding-top:16px;direction:${dir};text-align:${start}">
        <div style="font-size:128px;font-weight:700;line-height:1.1;color:#0f1b28"><span class="lt">${s.value}${s.plus ? '+' : ''}</span></div>
        <div style="font-size:30px;color:rgba(15,27,40,.86);margin-top:9px">${esc(L(s.label))}</div></div>`).join('')
    }

    /* ── Why VARIOUS: five reasons and the award ──────────────────────── */
    {
      const wp = P(33)
      setHeader(wp, 'لماذا فاريوس', 'Why VARIOUS')
      const box = $(wp, ':scope > div[style*="top:190px;right:72px;left:72px"]')
      keep(box); box.style.top = '172px'
      box.innerHTML = C.why.items.map((w, i) => `<div style="display:flex;direction:${dir};gap:26px;align-items:baseline;padding:8px 0;border-bottom:1px solid rgba(15,27,40,.12)">
        <span style="flex:none;width:36px;font-size:24px;font-weight:700;color:#457a2e">${String(i + 1).padStart(2, '0')}</span>
        <span style="flex:none;width:300px;font-size:24px;font-weight:700;line-height:1.35;color:#0f1b28;text-align:${start}">${esc(L(w.title))}</span>
        <span style="flex:1;font-size:19px;line-height:1.55;color:rgba(15,27,40,.86);text-align:${start}">${esc(L(w.text))}</span></div>`).join('') +
        `<div style="margin-top:16px;display:flex;direction:${dir};align-items:center;gap:16px;border:1px solid rgba(69,122,46,.45);padding:12px 20px;background:rgba(175,218,104,.14)">
          <span style="flex:none;width:36px;height:36px;border-radius:50%;background:#afda68;color:#0f1b28;display:flex;align-items:center;justify-content:center;font-size:19px">★</span>
          <span style="font-size:19px;font-weight:600;line-height:1.5;color:#0f1b28;text-align:${start}">${esc(L(C.why.award.label))} · ${esc(L(C.why.award.text))}</span></div>`
      // Everything stays above the page number.
      const base = new Map([...box.querySelectorAll('*')].map(e => [e, parseFloat(getComputedStyle(e).fontSize)]))
      let f = 1
      while (box.getBoundingClientRect().bottom - wp.getBoundingClientRect().top > 625 && f > 0.6) { f *= 0.95; base.forEach((bz, e) => { e.style.fontSize = (bz * f).toFixed(1) + 'px' }) }
    }

    /* ── Projects: v7's half-photo layout, alternating sides ──────────── */
    const clientName = ar => { const c = C.clients.find(x => x.ar === ar); return c ? L(c) : ar }
    const logoOf = c => c && c.logo && A.logos[c.logo] ? A.logos[c.logo] : ''
    const specs = []
    for (const p of C.projects) {
      const { head, rest } = splitTitle(L(p.title))
      const tags = [...(p.types || []), ...(p.scope || [])].map(L).filter((t, i, a) => a.indexOf(t) === i)
      const base = { cat: p.category, client: p.client, tags }
      if (p.slug === 'ministry-of-culture') {
        for (const part of p.parts) specs.push({ ...base, title: `${head} — ${L(part.title)}`, text: L(part.text), image: part.image, tags: (part.scope || []).map(L) })
      } else if (p.slug === 'snood-hotels') {
        const groups = []
        for (const part of p.parts) { if (part.group) groups.push({ g: part.group, parts: [] }); groups[groups.length - 1].parts.push(part) }
        groups.forEach((g, i) => specs.push({ ...base, title: head, sub: L(g.g), text: i === 0 ? L(p.text) : '', parts: g.parts.map(x => ({ title: L(x.title), award: x.award ? L(x.award) : '' })) }))
      } else {
        specs.push({ ...base, title: L(p.title), text: L(p.text), image: p.image, award: p.award && !(p.parts || []).some(x => x.award) ? L(p.award) : '',
          parts: (p.parts || []).map(x => ({ title: L(x.title), text: x.text ? L(x.text) : '', award: x.award ? L(x.award) : '' })) })
      }
    }
    const fit = col => {
      const pc = col.firstElementChild
      const base = new Map([...pc.querySelectorAll('*')].map(e => [e, parseFloat(getComputedStyle(e).fontSize)]))
      let f = 1
      while (pc.offsetHeight > 555 && f > 0.6) { f *= 0.94; base.forEach((b, e) => { e.style.fontSize = (b * f).toFixed(1) + 'px' }) }
    }
    const projectPage = (s, k) => {
      const dark = k % 2 === 0                       // v7's dark page has the photo on the right
      const pg = (dark ? P(17) : P(16)).cloneNode(true)
      const K = dark
        ? { strong: '#ffffff', body: 'rgba(255,255,255,.88)', line: 'rgba(255,255,255,.16)', muted: 'rgba(255,255,255,.66)', pill: 'rgba(255,255,255,.28)', plate: 'rgba(255,255,255,.22)', accent: '#afda68' }
        : { strong: '#0f1b28', body: 'rgba(15,27,40,.86)', line: 'rgba(15,27,40,.16)', muted: 'rgba(15,27,40,.60)', pill: 'rgba(15,27,40,.24)', plate: 'rgba(15,27,40,.16)', accent: '#457a2e' }
      const frame = $(pg, ':scope > div[style*="width:660px;z-index:2"] > div[style*="overflow:hidden"]')
      if (s.image && A.photos[s.image]) frame.querySelector('img').src = A.photos[s.image]
      else frame.innerHTML = `<div style="position:absolute;inset:0;background:${dark ? '#132232' : '#eef1ea'};display:flex;align-items:center;justify-content:center;padding:48px">
        <div style="width:100%;height:100%;border:3px dashed ${K.accent};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;direction:${dir}">
          <span style="font-size:30px;font-weight:700;color:${K.strong}">${EN ? 'Project photo needed here' : 'مطلوب صورة للمشروع هنا'}</span>
          <span style="font-size:20px;color:${K.muted}">${esc(s.title)}</span></div></div>`
      $(pg, ':scope > div[style*="top:60px"][style*="width:540px"]').remove()
      pg.querySelectorAll(':scope > div[style*="linear-gradient(180deg,rgba(15,27,40"]').forEach(d => d.remove())
      const col = $(pg, ':scope > div[style*="top:112px"][style*="width:540px"]')
      keep(col)
      col.setAttribute('style', `position:absolute;top:0;bottom:0;${dark ? 'left' : 'right'}:72px;width:540px;display:flex;flex-direction:column;justify-content:center;direction:${dir};text-align:${start}`)
      const cl = C.clients.find(x => x.ar === s.client)
      const plate = s.client ? `<div style="width:220px;height:78px;margin-bottom:28px;background:${cl && cl.onDark ? '#0f1b28' : '#ffffff'};border:1px solid ${K.plate};display:flex;align-items:center;justify-content:center;padding:8px 16px;text-align:center">${logoOf(cl)
        ? `<img src="${logoOf(cl)}" alt="${esc(clientName(s.client))}" style="max-width:100%;max-height:100%;object-fit:contain">`
        : `<span style="font-size:18px;font-weight:700;line-height:1.3;color:#0f1b28;direction:${dir}">${esc(clientName(s.client))}</span>`}</div>` : ''
      const badge = t => `<span style="display:inline-block;margin-inline-start:8px;padding:1px 10px;background:#afda68;color:#0f1b28;font-size:15px;font-weight:700">★ ${esc(t)}</span>`
      col.innerHTML = `<div class="pc">${plate}
        <div style="font-size:36px;font-weight:700;line-height:1.3;color:${K.strong}">${esc(s.title)}</div>
        ${s.sub ? `<div style="font-size:24px;font-weight:600;color:${K.accent};margin-top:6px">${esc(s.sub)}</div>` : ''}
        ${s.text ? `<div style="font-size:21px;line-height:1.7;color:${K.body};margin-top:18px">${esc(s.text)}</div>` : ''}
        ${(s.parts || []).map(x => `<div style="margin-top:14px;border-top:1px solid ${K.line};padding-top:12px"><div style="font-size:21px;font-weight:600;color:${K.strong}">${esc(x.title)}${x.award ? badge(x.award) : ''}</div>${x.text ? `<div style="font-size:18px;line-height:1.6;color:${K.body};margin-top:4px">${esc(x.text)}</div>` : ''}</div>`).join('')}
        ${s.award ? `<div style="margin-top:16px">${badge(s.award).replace('margin-inline-start:8px;', '')}</div>` : ''}
        ${s.tags.length ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:20px">${s.tags.map(t => `<span style="border:1px solid ${K.pill};border-radius:99px;padding:6px 16px;font-size:17px;color:${K.muted};white-space:nowrap">${esc(t)}</span>`).join('')}</div>` : ''}</div>`
      body.appendChild(pg)
      fit(col)
      return pg
    }
    // Every project in the client's copy deck, in the deck's order; a project
    // without a photograph says so in its frame until the photograph arrives.
    const shown = specs
    const projectPages = shown.map(projectPage)
    const firstOfCat = {}
    shown.forEach((x, i) => { if (!firstOfCat[x.cat]) firstOfCat[x.cat] = projectPages[i] })

    /* ── Clients: the approved list ───────────────────────────────────── */
    {
      const cp = P(32)
      setHeader(cp, 'عملاؤنا', 'Our Clients')
      const grid = $(cp, 'div[style*="grid-template-columns:repeat(5,1fr)"]')
      const proto = grid.firstElementChild
      grid.innerHTML = ''
      for (const c of C.clients) {
        const cell = proto.cloneNode(true)
        const lg = logoOf(c)
        cell.style.height = '92px'
        cell.innerHTML = lg
          ? `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:100%;height:100%">
              <div style="width:150px;height:46px;background:${c.onDark ? '#0f1b28' : 'transparent'};display:flex;align-items:center;justify-content:center;padding:${c.onDark ? '4px 10px' : '0'}"><img src="${lg}" alt="${esc(L(c))}" style="max-width:100%;max-height:100%;object-fit:contain"></div>
              <span style="font-size:12px;line-height:1.3;color:rgba(15,27,40,.62);direction:${dir};text-align:center">${esc(L(c))}</span></div>`
          : `<span style="font-size:16px;font-weight:600;line-height:1.4;color:rgba(15,27,40,.78);direction:${dir};text-align:center">${esc(L(c))}</span>`
        grid.appendChild(cell)
      }
      grid.style.gridTemplateColumns = 'repeat(6,1fr)'
      grid.style.direction = dir
      for (const d of cp.querySelectorAll('div, span')) if (d.textContent.includes('شبكة الشعارات') && !d.querySelector('div, span')) d.remove()
    }

    /* ── Closing: the closing line and the contact details, one page ──── */
    const closing = P(34)
    {
      setHeader(closing, 'التواصل والبيانات النظامية', 'Contact & Legal')
      const scrim = document.createElement('div')
      scrim.setAttribute('style', 'position:absolute;inset:0;background:linear-gradient(90deg,rgba(15,27,40,.92) 0%,rgba(15,27,40,.70) 50%,rgba(15,27,40,.10) 100%)')
      $(closing, ':scope > div[style*="position:absolute;inset:0"]').appendChild(scrim)
      const lineBox = $(closing, ':scope > div[style*="top:266px;right:110px"]')
      lineBox.setAttribute('style', `position:absolute;top:210px;right:72px;width:500px;direction:${dir};text-align:${start}`)
      keep(lineBox)
      const inner = lineBox.firstElementChild
      inner.setAttribute('style', '')
      inner.children[1].remove()
      inner.children[0].textContent = L(C.brand.tagline)
      inner.children[0].setAttribute('style', 'font-size:50px;font-weight:700;line-height:1.35;color:#ffffff')
      const block = $(P(35), ':scope > div[style*="top:186px;left:72px;width:600px"]')
      closing.appendChild(block)
      block.style.width = '590px'
      const rows = [...block.querySelectorAll('div[style*="padding:12px 0"]')]
      const labels = EN ? ['Phone & WhatsApp', 'Email', 'Web', 'Address', 'Social'] : ['الهاتف والواتساب', 'البريد', 'الموقع', 'العنوان', 'حسابات التواصل']
      const link = (href, t) => `<a class="lt" href="${href}" style="color:inherit;text-decoration:none">${t}</a>`
      const values = [
        link(C.contactLinks.whatsapp, C.contact.phone), link('mailto:' + C.contact.email, C.contact.email), link(C.contact.websiteHref, C.contact.website), esc(L(C.contact.address)),
        `<span style="display:flex;flex-wrap:wrap;gap:10px 26px;direction:ltr">${C.contact.social.map(x => `<a href="${x.href}" style="display:inline-flex;align-items:center;gap:10px;color:inherit;text-decoration:none"><svg viewBox="0 0 24 24" width="30" height="30" fill="#afda68" style="flex:none"><path d="${ICONS[x.id]}"/></svg><span class="lt" style="font-size:17px">${x.handle}</span></a>`).join('')}</span>`,
      ]
      rows.slice(0, 5).forEach((r, i) => {
        r.children[0].textContent = labels[i]; r.children[0].style.width = '175px'
        r.children[1].innerHTML = values[i]
        if (EN) { r.style.direction = 'ltr'; r.children[0].style.textAlign = 'left'; r.children[1].style.textAlign = 'left' }
      })
      if (rows[5]) rows[5].remove()                       // no QR code has been supplied
      const [legalAr, legalEn] = block.querySelectorAll('div[style*="margin-top"]:not([style*="padding"])')
      const legal = EN ? legalEn : legalAr
      ;(EN ? legalAr : legalEn).remove()
      legal.textContent = L(C.legal)
      if (EN) { legal.style.textAlign = 'left'; legal.style.direction = 'ltr' }
    }

    /* ── Chapter dividers, cloned from v7's PAUSE page on navy ────────── */
    const pause = P(22)
    const makeDivider = (ar, en, ar2, en2, img, links) => {
      const d = pause.cloneNode(true)
      d.classList.remove('light'); d.setAttribute('style', 'background:#0f1b28')
      const wm = $(d, ':scope > div[style*="top:-170px;right:-240px"]')
      wm.setAttribute('style', wm.getAttribute('style').replace(/color:#[0-9a-f]+/, 'color:#ffffff').replace(/opacity:0\.0\d+/, 'opacity:0.035'))
      const svgImg = $(d, 'svg image'), clip = $(d, 'clipPath'), id = 'dv' + Math.random().toString(36).slice(2, 8)
      svgImg.setAttribute('href', img); clip.id = id; svgImg.setAttribute('clip-path', `url(#${id})`)
      setHeader(d, ar, en)
      headOf(d).style.color = '#ffffff'; headOf(d).nextElementSibling.style.color = '#d3e9b0'
      const big = bigOf(d)
      big.textContent = EN ? en2 : ar2; big.style.color = '#ffffff'
      big.nextElementSibling.remove()
      if (EN) { big.style.direction = 'ltr'; big.style.textAlign = 'left' }
      const list = document.createElement('div')
      list.setAttribute('data-keep-fs', '1')
      list.setAttribute('style', 'margin-top:34px;border-top:1px solid rgba(255,255,255,.14)')
      big.parentElement.appendChild(list)
      for (const f of d.querySelectorAll(':scope > div[style*="bottom:50px"] span')) f.style.color = 'rgba(255,255,255,.55)'
      d._links = links; d._list = list
      return d
    }
    const D = {
      about: makeDivider('من نحن', 'Who We Are', 'فريق واحد، وقصة تستحق أن تُروى.', 'One team, and a story worth telling.', A.photos['mood-riyadh'],
        [['من نحن', 'Who We Are', P(5)], ['الرؤية والرسالة', 'Vision & Mission', P(7)], ['قيمنا', 'Our Values', P(9)]]),
      services: makeDivider('خدماتنا وحلولنا', 'Services & Solutions', 'من الفكرة الأولى إلى إطفاء آخر ضوء.', 'From the first idea to the last light.', A.photos['mood-line'],
        [['خدماتنا وحلولنا', 'Services & Solutions', partOne], ['منهجية عملنا', 'How We Work', P(11)], ['فاريوس بالأرقام', 'VARIOUS in Numbers', P(12)], ['القطاعات التي نخدمها', 'Sectors We Serve', P(13)]]),
      work: makeDivider('أعمالنا', 'Featured Work', 'مشاريع تتحدّث عن نفسها.', 'Work that speaks for itself.', A.photos['saudi-cup'],
        [['أعمالنا', 'Featured Work', P(14)]]),
      clients: makeDivider('عملاؤنا', 'Our Clients', 'ثقةٌ نعتزّ بها، مشروعًا بعد مشروع.', 'Trust we are proud of, one project at a time.', A.photos['mood-city'],
        [['عملاؤنا', 'Our Clients', P(31)], ['لماذا فاريوس', 'Why VARIOUS', P(33)]]),
    }

    /* ── v7 pages kept from the previous round, each in one language ──── */
    const oneLang = (pg, ar, en) => {
      setHeader(pg, ar, en)
      const eyebrow = headOf(pg).nextElementSibling
      for (const tw of [...pg.querySelectorAll('.lt')]) {
        if (tw === eyebrow || !/[A-Za-z]/.test(tw.textContent) || tw.closest('div[style*="bottom:50px"]') || tw.parentElement.closest('.lt')) continue
        if (EN) {
          let src = tw.previousElementSibling
          while (src && !/[\u0600-\u06FF]/.test(src.textContent)) src = src.previousElementSibling
          if (src) { src.innerHTML = tw.innerHTML; src.style.direction = 'ltr'; if (!src.closest('span[style*="border-radius:99px"]')) src.style.textAlign = 'left' }
        }
        tw.remove()
      }
    }
    $(P(14), ':scope > div[style*="top:500px;right:72px;width:760px"]')?.remove()
    oneLang(P(13), 'القطاعات التي نخدمها', 'Sectors We Serve')
    oneLang(P(14), 'أعمالنا', 'Featured Work')
    oneLang(P(22), 'وقفة', 'Pause')
    oneLang(P(31), 'عملاؤنا', 'Our Clients')

    /* ── Assemble ──────────────────────────────────────────────────────── */
    const order = [P(1), P(2),
      D.about, P(5), P(7), P(8), P(9),
      D.services, partOne, ...solutionPages, ...ownerPages, P(11), P(12), P(13),
      D.work, P(14), ...projectPages.slice(0, shown.findIndex(x => x.cat !== shown[0].cat)), P(22), ...projectPages.slice(shown.findIndex(x => x.cat !== shown[0].cat)),
      D.clients, P(31), P(32), P(33),
      closing]
    body.replaceChildren(...order)
    const total = order.length
    const pageNo = el => String(order.indexOf(el) + 1).padStart(2, '0')
    order.forEach((p, i) => { p.id = 'p' + String(i + 1).padStart(2, '0') })

    // The lockup stays on the cover and the closing page only.
    for (const p of order) if (p !== order[0] && p !== closing) dropLogo(p)

    // Footers: page number, linked back to the contents; v7's internal caption goes.
    for (const p of order) {
      const foot = $(p, ':scope > div[style*="bottom:50px"][style*="display:flex"]'); if (!foot) continue
      foot.style.pointerEvents = 'auto'
      const num = [...foot.children].find(s => s.classList.contains('lt'))
      for (const s of [...foot.children]) if (s !== num) s.remove()
      num.innerHTML = `<a href="#p02" style="color:inherit;text-decoration:none">${pageNo(p)}<span style="opacity:.5"> / ${total}</span></a>`
    }

    // The page rail, rebuilt for the new page count.
    for (const p of order) {
      const rail = railOf(p); if (!rail) continue
      const s = dotStyles[p.classList.contains('light') ? 'light' : 'dark'], i = order.indexOf(p)
      rail.innerHTML = ''
      for (let k = 0; k < total; k++) {
        if (k === i) { rail.appendChild(markSpan.cloneNode(true)); continue }
        const dot = document.createElement('span'); dot.setAttribute('style', k < i ? s.done : s.todo); rail.appendChild(dot)
      }
    }

    // Contents.
    {
      const grid = $(P(2), 'div[style*="grid-template-columns:repeat(4,1fr)"]')
      const cellStyle = grid.firstElementChild.getAttribute('style')
      const entries = [
        ['من نحن', 'Who We Are', P(5)], ['الرؤية والرسالة', 'Vision & Mission', P(7)], ['قيمنا', 'Our Values', P(9)],
        ['خدماتنا وحلولنا', 'Services & Solutions', partOne], ['منهجية عملنا', 'How We Work', P(11)], ['فاريوس بالأرقام', 'VARIOUS in Numbers', P(12)],
        ['القطاعات التي نخدمها', 'Sectors We Serve', P(13)], ['أعمالنا', 'Featured Work', P(14)], ['عملاؤنا', 'Our Clients', P(31)],
        ['لماذا فاريوس', 'Why VARIOUS', P(33)], ['التواصل والبيانات النظامية', 'Contact & Legal', closing],
      ]
      setHeader(P(2), 'المحتويات', 'Index')
      grid.style.direction = dir
      grid.innerHTML = entries.map(([ar, en, t], i) => `<a href="#${t.id}" style="${cellStyle};color:inherit;text-decoration:none;direction:${dir};text-align:${start}">
        <div style="font-size:30px;font-weight:700;color:#afda68">${String(i + 1).padStart(2, '0')}</div>
        <div style="margin-top:auto"><div style="font-size:19.5px;font-weight:600;line-height:1.4;color:#ffffff">${esc(EN ? en : ar)}</div></div>
        <div style="font-size:12px;color:#a9c39a;margin-top:10px">${EN ? 'p. ' : 'صـ '}${pageNo(t)}</div></a>`).join('') +
        Array.from({ length: 12 - entries.length }, () => `<div style="${cellStyle}"></div>`).join('')
    }

    // Divider contents.
    for (const d of Object.values(D)) {
      d._list.innerHTML = d._links.map(([ar, en, t]) => `<a href="#${t.id}" style="display:flex;direction:${dir};justify-content:space-between;gap:20px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.08);color:#ffffff;text-decoration:none">
        <span style="font-size:20px;font-weight:600;text-align:${start}">${esc(EN ? en : ar)}</span>
        <span style="font-size:17px;color:#a9c39a">${EN ? 'p. ' : 'صـ '}${pageNo(t)}</span></a>`).join('')
    }

    /* ── Larger type. v7 set body copy at 12–17px on a 1280px page; it
       grows by size band, and boxes sized for the old type grow with it.
       Pages built above carry data-keep-fs and set their own sizes. ───── */
    const grow = z => z <= 12 ? 17 : z <= 15 ? z * 1.36 : z <= 18 ? z * 1.28 : z <= 24 ? z * 1.17 : z <= 40 ? z * 1.06 : z
    for (const el of document.querySelectorAll('.page [style*="font-size"]')) {
      if (el.closest('[data-keep-fs]')) continue
      const m = /font-size:\s*([\d.]+)px/.exec(el.getAttribute('style')); if (!m) continue
      el.style.fontSize = (el.closest('div[style*="bottom:50px"]') ? 15 : Math.round(grow(+m[1]) * 10) / 10) + 'px'
    }
    for (const el of document.querySelectorAll('.page [style*="height:"]')) {
      if (!el.textContent.trim() || el.querySelector('img, svg') || el.closest('[data-keep-fs]')) continue
      const sty = el.getAttribute('style')
      if (/(^|;)\s*height:\s*[\d.]+px/.test(sty)) el.setAttribute('style', sty.replace(/(^|;)(\s*)height:/, '$1$2min-height:'))
    }

    // Western digits throughout.
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT)
    for (let n; (n = walker.nextNode());) if (INDIC.test(n.nodeValue)) n.nodeValue = western(n.nodeValue)

    return { pages: total, leftovers: [] }
  }
})()
