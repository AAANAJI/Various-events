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

  // The networks' own marks, as filled glyphs on a 24px grid.
  const ICONS = {
    instagram: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z',
    x: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
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
    // One language per edition: the title in the edition's language, no
    // translated eyebrow beside it; the English edition reads left to right.
    const setHeader = (page, ar, en) => {
      const t = headOf(page)
      t.textContent = EN ? en : ar
      if (t.nextElementSibling) t.nextElementSibling.remove()
      if (EN) {
        t.style.direction = 'ltr'
        const row = t.parentElement; row.style.direction = 'ltr'
        const wrap = row.parentElement; wrap.style.textAlign = 'left'
        const pos = wrap.parentElement
        pos.setAttribute('data-hdr', '1')
        if (pos.style.right && !pos.style.left) { pos.style.left = pos.style.right; pos.style.right = 'auto' }
      }
    }
    const dropLogo = p => p.querySelectorAll(':scope > div[style*="top:54px"][style*="z-index:9"]').forEach(d => d.remove())

    /* ── Cover ─────────────────────────────────────────────────────────── */
    {
      const box = $(P(1), ':scope > div[style*="right:72px;top:190px"]')
      const [eyebrow, title, nameEn, tagBox] = box.children
      eyebrow.classList.remove('lt'); eyebrow.textContent = EN ? 'COMPANY PROFILE — 2026' : 'الملف التعريفي — 2026'
      if (EN) {
        box.style.direction = 'ltr'; title.innerHTML = 'VARIOUS<br>for Events Services'; eyebrow.style.direction = 'ltr'
        // Left to right: the title block on the left, the logo on the right.
        box.style.left = '72px'; box.style.right = 'auto'
        const lg = $(P(1), ':scope > div[style*="top:54px"][style*="z-index:9"]')
        lg.style.left = 'auto'; lg.style.right = '64px'; lg.style.display = 'flex'; lg.style.justifyContent = 'flex-end'
      }
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
      return big
    }
    const visionBig = textPage(P(7), 'رؤيتنا', 'Our Vision', C.vision.visionItem.text, EN ? 26 : 31, 440)
    {
      // "Vision 2030" never breaks across lines, and the closing clause stands apart.
      const big = visionBig, vt = L(C.vision.visionItem.text), at = vt.indexOf(EN ? ' and to be' : ' وأن نكون')
      const nb = t => esc(t).replace(/(رؤية 2030|Vision 2030)/, '<span style="white-space:nowrap">$1</span>')
      big.style.fontWeight = '500'
      big.innerHTML = at > 0 ? `${nb(vt.slice(0, at))}<span style="display:block;margin-top:20px;font-weight:700;color:#457a2e">${nb(vt.slice(at + 1))}</span>` : nb(vt)
    }
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
    // One row per group: its name and its own pictogram on a tile, its items
    // as the pills the project pages use. Tiles alternate navy and green, so
    // a reader can tell the rows apart at a glance and find a group again.
    const SOL_ICONS = [
      '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
      '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.5h6V4M8.5 13l2.5 2.5 4.5-5"/>',
      '<path d="M4 20l1-5L16 4l4 4L9 19zM14 6l4 4"/>',
      '<path d="M4 20V6l14 14zM8 16v-3l3 3z"/>',
      '<path d="M14 6l4-2 2 2-2 4-2-1-9 9-2-2 9-9z"/>',
      '<path d="M12 4L3 20h18zM12 4v16M9 20l3-6 3 6"/>',
      '<path d="M4 10v4h3l5 4V6l-5 4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
      '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
      '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
      '<path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.6l1.1-6L3.4 9.4l6-.8z"/>',
      '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.3"/><path d="M16 14.2c2.9.3 5 2.6 5 5.8"/>',
      '<path d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h2a2.5 2.5 0 0 1 0 5h-2M8 3v2M12 3v2"/>',
      '<path d="M4 10v4l3 .5V9.5zM7 9.5L18 5v14L7 14.5M9 15l1 5h2.5l-1-4.2"/>',
      '<path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4z"/><circle cx="12" cy="13" r="3.3"/>',
    ]
    const OWN_ICONS = [
      '<rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M4 11h9M13 4v16M13 15h7"/>',
      '<path d="M4 20V8l8-4 8 4v12M4 12h16M9 20v-5h6v5"/>',
      '<path d="M13 3L5 13.5h6L10 21l9-11h-6z"/>',
      '<path d="M7 9V4h10v5M7 17H4.5V9h15v8H17"/><rect x="7" y="14" width="10" height="6"/>',
      '<rect x="6" y="6" width="12" height="15" rx="2"/><path d="M10 6V3h4v3"/><circle cx="12" cy="12" r="2.2"/><path d="M9 17.5h6"/>',
      '<rect x="3.5" y="8" width="17" height="11" rx="2"/><path d="M9 8V5.5h6V8M3.5 13h17"/>',
      '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
      '<path d="M4 4v16h16M8 16v-4M12 16V8M16 16v-6"/>',
    ]
    const svcBlock = (title, items, icon, alt) => html(`<div style="display:flex;align-items:stretch;gap:20px;direction:${dir}">
      <div style="flex:none;width:290px;box-sizing:border-box;background:${alt ? '#457a2e' : '#0f1b28'};padding:14px 18px;display:flex;align-items:center;gap:14px;text-align:${start}">
        <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="${alt ? '#ffffff' : '#afda68'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex:none">${icon || ''}</svg>
        <span style="font-size:22px;font-weight:700;line-height:1.35;color:#ffffff">${esc(title)}</span></div>
      <div style="flex:1;display:flex;flex-wrap:wrap;align-content:center;gap:8px;padding:4px 0">${items.map(i => `<span style="border:1px solid ${alt ? 'rgba(69,122,46,.55)' : 'rgba(15,27,40,.22)'};background:${alt ? '#f3f8ec' : '#ffffff'};border-radius:99px;padding:${EN ? '5px 13px' : '6px 15px'};font-size:${EN ? 16 : 17}px;line-height:1.35;color:rgba(15,27,40,.9)">${esc(L(i))}</span>`).join('')}</div></div>`)
    const SVC = { h: 486, gap: 16 }
    const newSvcPage = () => {
      const pg = svcTpl.cloneNode(true)
      const bodyBox = $(pg, ':scope > div[style*="top:184px;right:72px;left:72px;display:flex"]')
      keep(bodyBox); bodyBox.innerHTML = ''; bodyBox.style.display = 'flex'; bodyBox.style.flexDirection = 'column'; bodyBox.style.gap = SVC.gap + 'px'
      bodyBox.style.top = '168px'; bodyBox.style.direction = dir
      body.appendChild(pg)
      return { pg, box: bodyBox }
    }
    // Stack rows down the page, spread evenly; a new page opens when the next row will not fit.
    const flow = (groups, icons, ar, en) => {
      const pages = []
      let cur = newSvcPage(); pages.push(cur)
      for (const [k, g] of groups.entries()) {
        const row = svcBlock(L(g.title), g.items, icons[k], k % 2 === 1)
        cur.box.appendChild(row)
        if (cur.box.offsetHeight > SVC.h && cur.box.children.length > 1) { row.remove(); cur = newSvcPage(); pages.push(cur); cur.box.appendChild(row) }
      }
      pages.forEach((p, i) => setHeader(p.pg, pages.length > 1 ? `${ar} (${i + 1}/${pages.length})` : ar, pages.length > 1 ? `${en} (${i + 1}/${pages.length})` : en))
      return pages.map(p => p.pg)
    }
    const partOne = (() => {
      const { pg, box } = newSvcPage()
      const names = [...C.eventTypes.map(e => L(e.title)), L(C.frameworkAgreements.title)]
      box.style.display = 'grid'; box.style.gridTemplateColumns = 'repeat(4,1fr)'; box.style.gap = '18px'
      box.innerHTML = names.map(n => `<div style="background:#0f1b28;min-height:178px;padding:22px 22px 24px;display:flex;flex-direction:column;justify-content:space-between;direction:${dir};text-align:${start}">
        <span style="width:44px;height:5px;background:linear-gradient(90deg,#afda68,#457a2e)"></span>
        <span style="font-size:25px;font-weight:700;line-height:1.35;color:#ffffff">${esc(n)}</span></div>`).join('')
      setHeader(pg, 'خدماتنا', 'Our Services')
      return pg
    })()
    const solutionPages = flow(C.solutions, SOL_ICONS, 'حلولنا', 'Our Solutions')
    const ownerPages = flow(C.ownerServices, OWN_ICONS, 'خدمات أصحاب المعارض', 'For Exhibition Owners')

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
      box.setAttribute('style', `position:absolute;top:168px;right:72px;left:72px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;direction:${dir}`)
      const cellCss = `padding:20px 22px 22px;display:flex;flex-direction:column;min-height:206px;box-sizing:border-box;text-align:${start}`
      box.innerHTML = C.why.items.map((w, i) => `<div style="background:#0f1b28;${cellCss}">
        <span style="font-size:22px;font-weight:700;color:#afda68">${String(i + 1).padStart(2, '0')}</span>
        <span style="font-size:24px;font-weight:700;line-height:1.35;color:#ffffff;margin-top:8px">${esc(L(w.title))}</span>
        <span style="font-size:17.5px;line-height:1.55;color:rgba(255,255,255,.86);margin-top:10px">${esc(L(w.text))}</span></div>`).join('') +
        `<div style="background:linear-gradient(135deg,#afda68,#7fb24a);${cellCss}">
          <span style="width:38px;height:38px;border-radius:50%;background:#0f1b28;color:#afda68;display:flex;align-items:center;justify-content:center;font-size:20px">★</span>
          <span style="font-size:24px;font-weight:700;line-height:1.35;color:#0f1b28;margin-top:10px">${esc(L(C.why.award.label))}</span>
          <span style="font-size:17.5px;font-weight:600;line-height:1.55;color:#0f1b28;margin-top:8px">${esc(L(C.why.award.text))}</span></div>`
      // Everything stays above the page number.
      const base = new Map([...box.querySelectorAll('span')].map(e => [e, parseFloat(getComputedStyle(e).fontSize)]))
      let f = 1
      while (box.getBoundingClientRect().bottom - wp.getBoundingClientRect().top > 648 && f > 0.6) { f *= 0.96; base.forEach((bz, e) => { if (bz < 30 || !e.textContent.includes('★')) e.style.fontSize = (bz * f).toFixed(1) + 'px' }) }
    }

    /* ── Projects: v7's half-photo layout, alternating sides ──────────── */
    const clientName = ar => { const c = C.clients.find(x => x.ar === ar); return c ? L(c) : ar }
    const logoOf = c => c && c.logo && A.logos[c.logo] ? A.logos[c.logo] : ''
    // The client's order: by the size of the project and of the client —
    // government first, then companies.
    const ORDER = ['ministry-of-culture', 'moh-nonprofit-pavilion', 'moe-education-exhibition', 'saso-boulevard-city', 'passports-founding-day',
      'regional-hq-dialogues', 'health-endowment-fund', 'investment-forum', 'media-excellence-award', 'tahakom-ceos-meeting', 'tahakom-great-place-to-work',
      'sab-founding-day', 'snood-hotels', 'retal-annual-ceremony', 'obeikan-health', 'btc-networks-black-hat', 'mindware-black-hat', 'sera-leap', 'trax',
      'nova-medical', 'sinclair', 'hayat-mall', 'othaim-mall']
    const rank = p => { const i = ORDER.indexOf(p.slug); return i < 0 ? ORDER.length : i }
    const specs = []
    for (const p of [...C.projects].sort((a, b) => rank(a) - rank(b))) {
      const { head, rest } = splitTitle(L(p.title))
      const tags = [...(p.types || []), ...(p.scope || [])].map(L).filter((t, i, a) => a.indexOf(t) === i)
      const base = { slug: p.slug, cat: p.category, client: p.client, tags }
      if (p.slug === 'ministry-of-culture') {
        for (const part of p.parts) specs.push({ ...base, title: `${head} — ${L(part.title)}`, text: L(part.text), image: part.image, tags: (part.scope || []).map(L) })
      } else if (p.slug === 'snood-hotels') {
        const groups = []
        for (const part of p.parts) { if (part.group) groups.push({ g: part.group, parts: [] }); groups[groups.length - 1].parts.push(part) }
        groups.forEach((g, i) => specs.push({ ...base, title: head, sub: L(g.g), image: g.parts[0].image, text: i === 0 ? L(p.text) : '', parts: g.parts.map(x => ({ title: L(x.title), award: x.award ? L(x.award) : '' })) }))
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
      // The client's logo alone: no plate, no frame; white on the dark pages.
      const tone = dark ? 'brightness(0) invert(1)' : cl && cl.onDark ? 'brightness(0)' : 'none'
      const plate = s.client ? `<div style="height:96px;margin-bottom:24px;display:flex;align-items:center">${logoOf(cl)
        ? `<img src="${dark && cl.logoLight && A.logos[cl.logoLight] ? A.logos[cl.logoLight] : logoOf(cl)}" alt="${esc(clientName(s.client))}" style="max-width:290px;max-height:96px;object-fit:contain;filter:${dark && cl.logoLight ? 'none' : tone}">`
        : `<span style="font-size:20px;font-weight:700;line-height:1.3;color:${K.strong};direction:${dir}">${esc(clientName(s.client))}</span>`}</div>` : ''
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
          ? `<div style="width:150px;height:56px;display:flex;align-items:center;justify-content:center"><img src="${lg}" alt="${esc(L(c))}" style="max-width:100%;max-height:100%;object-fit:contain;filter:${c.onDark ? 'brightness(0)' : 'none'}"></div>`
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
      setHeader(closing, 'التواصل', 'Contact')
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
      const labels = EN ? ['Phone & WhatsApp', 'Email', 'Website', 'Address', 'Social'] : ['الهاتف والواتساب', 'البريد', 'الموقع الإلكتروني', 'العنوان', 'حسابات التواصل']
      const link = (href, t) => `<a class="lt" href="${href}" style="color:inherit;text-decoration:none">${t}</a>`
      const values = [
        link(C.contactLinks.whatsapp, C.contact.phone), link('mailto:' + C.contact.email, C.contact.email), link(C.contact.websiteHref, C.contact.website), esc(L(C.contact.address)),
        `<span style="display:grid;grid-template-columns:repeat(2,max-content);gap:10px 30px;direction:ltr;width:max-content;${EN ? '' : 'margin-left:auto'}">${C.contact.social.map(x => `<a href="${x.href}" style="display:inline-flex;align-items:center;gap:10px;color:inherit;text-decoration:none"><svg viewBox="0 0 24 24" width="30" height="30" fill="#afda68" style="flex:none"><path d="${ICONS[x.id]}"/></svg><span class="lt" style="font-size:17px">${x.handle}</span></a>`).join('')}</span>`,
      ]
      rows.slice(0, 5).forEach((r, i) => {
        r.children[0].textContent = labels[i]; r.children[0].style.width = '175px'
        r.children[1].innerHTML = values[i]
        if (EN) { r.style.direction = 'ltr'; r.children[0].style.textAlign = 'left'; r.children[1].style.textAlign = 'left' }
      })
      if (rows[5]) rows[5].remove()                       // no QR code has been supplied
      if (EN) {                                           // the title is on the left, so the lockup moves to the right
        const lg = $(closing, ':scope > div[style*="top:54px"][style*="z-index:9"]')
        lg.style.left = 'auto'; lg.style.right = '64px'; lg.style.display = 'flex'; lg.style.justifyContent = 'flex-end'
      }
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
      headOf(d).style.color = '#ffffff'
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
      about: makeDivider('من نحن', 'Who We Are', 'فريق واحد، وقصة تُروى.', 'One team, and a story to tell.', A.photos['mood-riyadh'],
        [['من نحن', 'Who We Are', P(5)], ['الرؤية والرسالة', 'Vision & Mission', P(7)], ['قيمنا', 'Our Values', P(9)]]),
      services: makeDivider('خدماتنا وحلولنا', 'Services & Solutions', 'من الفكرة الأولى إلى لحظة التسليم.', 'From the first idea to the final handover.', A.photos['mood-services'],
        [['خدماتنا وحلولنا', 'Services & Solutions', partOne], ['منهجية عملنا', 'How We Work', P(11)], ['فاريوس بالأرقام', 'VARIOUS in Numbers', P(12)]]),
      work: makeDivider('أعمالنا', 'Featured Work', 'مشاريع تتحدّث عن نفسها.', 'Work that speaks for itself.', A.photos['saudi-cup'],
        [['أعمالنا', 'Featured Work', P(14)]]),
      clients: makeDivider('عملاؤنا', 'Our Clients', 'ثقةٌ نعتزّ بها، مشروعًا بعد مشروع.', 'Trust we are proud of, one project at a time.', A.photos['mood-city'],
        [['عملاؤنا', 'Our Clients', P(32)], ['لماذا فاريوس', 'Why VARIOUS', P(33)]]),
    }
    // The clients statement sits on the divider itself rather than on a page of its own.
    D.clients._list.before(html(`<div data-keep-fs="1" style="margin-top:18px;font-size:22px;line-height:1.6;color:rgba(255,255,255,.86);direction:${dir};text-align:${start}">${esc(L(C.clientsLead))}</div>`))

    /* ── v7 pages kept from the previous round, each in one language ──── */
    const oneLang = (pg, ar, en) => {
      setHeader(pg, ar, en)
      for (const tw of [...pg.querySelectorAll('.lt')]) {
        if (!/[A-Za-z]/.test(tw.textContent) || tw.closest('div[style*="bottom:50px"]') || tw.parentElement.closest('.lt')) continue
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
    const half = Math.max(1, shown.findIndex(x => x.slug === 'sab-founding-day'))   // the pause sits between government and companies
    const order = [P(1), P(2),
      D.about, P(5), P(7), P(8), P(9),
      D.services, partOne, ...solutionPages, ...ownerPages, P(11), P(12),
      D.work, P(14), ...projectPages.slice(0, half), P(22), ...projectPages.slice(half),
      D.clients, P(32), P(33),
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
        ['أعمالنا', 'Featured Work', P(14)], ['عملاؤنا', 'Our Clients', P(32)],
        ['لماذا فاريوس', 'Why VARIOUS', P(33)], ['التواصل', 'Contact', closing],
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

    // English edition: a title sits on the left edge of its page's content, so
    // it never lands on the decorative mark when the content is in the right half.
    if (EN) {
      for (const pg of body.querySelectorAll('.page')) {
        const pos = pg.querySelector('[data-hdr]'); if (!pos) continue
        const x0 = pg.getBoundingClientRect().left, y0 = pg.getBoundingClientRect().top
        let min = Infinity
        const w = document.createTreeWalker(pg, NodeFilter.SHOW_TEXT)
        for (let n; (n = w.nextNode());) {
          if (!n.textContent.trim() || pos.contains(n) || n.parentElement.closest('div[style*="bottom:50px"]')) continue
          const rg = document.createRange(); rg.selectNodeContents(n)
          const r = rg.getBoundingClientRect()
          if (!r.width || r.top - y0 < 130 || r.bottom - y0 > 650) continue
          min = Math.min(min, r.left - x0)
        }
        for (const im of pg.querySelectorAll('img[alt]')) {         // client logos count as content; decorative art does not
          const r = im.parentElement.getBoundingClientRect()          // the logo's box: the image itself may not have decoded yet
          if (r.width && r.width < 600 && r.height < 400 && r.top - y0 > 130 && r.bottom - y0 < 650) min = Math.min(min, r.left - x0)
        }
        if (min !== Infinity && min > 200) { pos.style.left = Math.round(min) + 'px'; pos.style.right = 'auto' }
      }
    }

    // Western digits throughout.
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT)
    for (let n; (n = walker.nextNode());) if (INDIC.test(n.nodeValue)) n.nodeValue = western(n.nodeValue)

    return { pages: total, leftovers: [] }
  }
})()
