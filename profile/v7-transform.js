/* ─────────────────────────────────────────────────────────────────────────
   Applies the client's revision notes to the approved v7 profile IN PLACE.

   Runs inside the page (Chromium) against v7's own markup. Nothing is
   restyled: every page keeps v7's inline styles, and the few new pages —
   chapter dividers, the merged closing page, the client-logo slot — are
   cloned from v7 pages that already exist (the PAUSE page, the CLOSING page)
   and filled with text. Pages are addressed by their v7 page number.

   window.reviseV7(lang, assets) → mutates the document into one edition.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict'

  const AR = /[؀-ۿ]/
  const LAT = /[A-Za-z]/
  const INDIC = /[٠-٩]/g
  const western = s => s.replace(INDIC, d => String(d.charCodeAt(0) - 0x0660))
  const st = (el, k) => (el.getAttribute('style') || '').includes(k)
  const css = (el, more) => el.setAttribute('style', (el.getAttribute('style') || '') + ';' + more)
  const yellow = t => `<span style="background:#fff3b8;color:#0f1b28;padding:0 5px">${t}</span>`

  window.reviseV7 = function (lang, assets) {
    const EN = lang === 'en'
    const T = assets.dict               // Arabic → English for strings with no English twin
    const v7 = [...document.querySelectorAll('.page')]
    if (v7.length !== 35) throw new Error('expected the 35-page v7, found ' + v7.length)
    const P = n => v7[n - 1]
    v7.forEach((p, i) => { p.dataset.v7 = String(i + 1) })

    // Theme tokens, read from v7 itself so cloned pages match exactly.
    const railOf = p => p.querySelector(':scope > div[style*="left:28px;top:106px"]')
    const dotStyles = {}
    for (const p of v7) {
      const rail = railOf(p); if (!rail) continue
      const theme = p.classList.contains('light') ? 'light' : 'dark'
      const kids = [...rail.children]
      const m = kids.findIndex(k => k.querySelector('img'))
      dotStyles[theme] = dotStyles[theme] || {}
      if (m > 0) dotStyles[theme].done = kids[0].getAttribute('style')
      if (m < kids.length - 1) dotStyles[theme].todo = kids[kids.length - 1].getAttribute('style')
    }
    const markSpan = railOf(P(1)).querySelector('span:has(img)').cloneNode(true)

    /* ── 1. Pages the notes remove ────────────────────────────────────────
       p3  the one-line «من نحن» statement page            (note 4)
       p6  the founders' word                              (note 1)
       p30 «ومن أعمالنا أيضًا», the also-from-our-work list (note 11) */
    const removed = [P(3), P(6), P(30)]

    /* ── 2. Project pages: half text / half photograph, alternating (note 9)
       v7 already has this layout (Book Fair, Kleija …). The four pages that
       used the full-width photo band are rebuilt into it from a v7 page of
       the same ground, then every project page is set to alternate sides. */
    const PROJECTS = [15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29]
    const isHalf = p => !!p.querySelector(':scope > div[style*="width:660px;z-index:2"]')
    const photoSide = p => st(p.querySelector(':scope > div[style*="width:660px;z-index:2"]'), 'left:0') ? 'left' : 'right'
    const halfTemplate = { dark: P(17), light: P(16) }

    const readProject = p => {
      const title = p.querySelector('div[style*="font-size:27px;font-weight:700"], div[style*="font-size:26px;font-weight:700"]')
      const titleEn = title.nextElementSibling
      const img = p.querySelector('img[src^="data:image/jpeg"]')
      let desc, descEn
      const brief = [...p.querySelectorAll('div')].find(d => d.textContent.trim() === 'عن المشروع' && !d.children.length)
      if (brief) {
        desc = brief.nextElementSibling
        const enLabel = [...p.querySelectorAll('div')].find(d => d.textContent.trim() === 'THE BRIEF' && !d.children.length)
        descEn = enLabel.nextElementSibling
      } else {
        desc = p.querySelector('div[style*="margin-top:16px;font-size:15px"]')
        descEn = desc.nextElementSibling
      }
      const pills = [...p.querySelectorAll('span[style*="border-radius:99px;padding:8px 18px"]')].map(s => s.textContent.trim())
      const meta = [...p.querySelectorAll('div[style="text-align:right"]')]
        .filter(d => d.children.length === 2 && d.children[0].tagName === 'DIV' && st(d.children[0], 'font-size:14px'))
        .map(d => ({ label: d.children[0].textContent.trim(), html: d.children[1].innerHTML }))
      return { img: img.getAttribute('src'), title: title.innerHTML, titleEn: titleEn.innerHTML, desc: desc.innerHTML, descEn: descEn.innerHTML, pills, meta }
    }

    const rebuildAsHalf = (p) => {
      const data = readProject(p)
      const theme = p.classList.contains('light') ? 'light' : 'dark'
      const page = halfTemplate[theme].cloneNode(true)
      page.dataset.v7 = p.dataset.v7
      page.querySelector('img[src^="data:image/jpeg"]').setAttribute('src', data.img)
      const title = page.querySelector('div[style*="font-size:26px;font-weight:700"]')
      title.innerHTML = data.title
      title.nextElementSibling.innerHTML = data.titleEn
      const desc = page.querySelector('div[style*="margin-top:16px;font-size:15px"]')
      desc.innerHTML = data.desc
      desc.nextElementSibling.innerHTML = data.descEn
      const pillBox = page.querySelector('span[style*="border-radius:99px;padding:8px 18px"]').parentElement
      const pillProto = pillBox.firstElementChild
      pillBox.innerHTML = ''
      for (const t of data.pills) { const s = pillProto.cloneNode(true); s.textContent = t; pillBox.appendChild(s) }
      const grid = page.querySelector('div[style*="grid-template-columns:repeat(2,1fr)"]')
      const cellProto = grid.firstElementChild
      grid.innerHTML = ''
      for (const m of data.meta) {
        const c = cellProto.cloneNode(true)
        c.children[0].textContent = m.label
        c.children[1].innerHTML = m.html
        grid.appendChild(c)
      }
      p.replaceWith(page)
      return page
    }

    // Swap every left/right anchor on a half page, mirroring the torn edge.
    const flip = (page) => {
      for (const el of page.querySelectorAll(':scope > div, :scope > div > div[style*="width:120px;z-index:3"]')) {
        if (st(el, 'left:28px;top:106px') || st(el, 'top:-170px;right:-240px')) continue
        const s = el.getAttribute('style')
        if (!/(^|;)\s*(left|right):/.test(s)) continue
        el.setAttribute('style', s.replace(/(^|;)(\s*)(left|right):/g, (m, a, b, side) => `${a}${b}${side === 'left' ? 'right' : 'left'}:`))
        if (st(el, 'width:120px;z-index:3')) {
          const svg = el.querySelector('svg')
          svg.style.transform = (svg.style.transform || '').includes('scaleX(-1)') ? '' : 'scaleX(-1)'
        }
      }
    }

    const projectPages = PROJECTS.map(n => isHalf(P(n)) ? P(n) : rebuildAsHalf(P(n)))
    projectPages.forEach((page, k) => {
      const want = k % 2 === 0 ? 'right' : 'left'
      if (photoSide(page) !== want) flip(page)
    })

    /* ── 3. No year or location on any project (note 8) ────────────────── */
    const YEARISH = /(سنة|السنة|الدورة|الموقع|المدينة|الموسم|edition|year|location|city|season|details to confirm|تفاصيل .*للاعتماد|تفاصيل للاعتماد)/i
    for (const page of projectPages) {
      for (const cell of [...page.querySelectorAll('div[style*="grid-template-columns:repeat(2,1fr)"] > div')]) {
        const label = cell.children[0].textContent.trim()
        if (label === 'السنة' || label === 'الموقع') cell.remove()
      }
      for (const mark of [...page.querySelectorAll('span[style*="background:#fff3b8"]')]) {
        const t = mark.textContent.trim()
        if (/الجهة والدورة والنطاق/.test(t)) { mark.textContent = 'الجهة والنطاق للاعتماد'; continue }
        if (/organizer\/edition\/scope/.test(t)) { mark.textContent = 'organizer/scope to confirm'; continue }
        if (/الجهة المنظمة والتفاصيل/.test(t)) { mark.textContent = 'الجهة المنظمة للاعتماد'; continue }
        if (/organizer\/details/.test(t)) { mark.textContent = 'organizer to confirm'; continue }
        if (YEARISH.test(t) && !mark.closest('div[style*="grid-template-columns"]')) mark.remove()
      }
    }

    /* ── 4. The client's logo on every project page (note 12) ─────────────
       No logo files have been supplied yet, so the slot carries the client's
       name; v7's own placeholder highlight marks it until the vector lands. */
    for (const page of projectPages) {
      const light = page.classList.contains('light')
      const pillRow = page.querySelector('div[style*="top:60px"][style*="width:540px"]')
      const clientCell = [...page.querySelectorAll('div[style*="grid-template-columns:repeat(2,1fr)"] > div')]
        .find(c => c.children[0].textContent.trim() === 'العميل')
      const name = clientCell ? clientCell.children[1].textContent.trim() : ''
      const known = name && !/^الجهة/.test(name)
      css(pillRow, 'justify-content:space-between;align-items:flex-start')
      const plate = document.createElement('div')
      plate.className = 'client-logo'
      plate.setAttribute('style', `flex:none;width:150px;height:48px;margin-top:-8px;background:#ffffff;border:1px solid ${light ? 'rgba(15,27,40,.14)' : 'rgba(255,255,255,.22)'};display:flex;align-items:center;justify-content:center;padding:4px 10px;text-align:center`)
      plate.innerHTML = known
        ? `<span data-client="${name}" style="font-size:12.5px;font-weight:700;line-height:1.3;color:#0f1b28">${name}</span>`
        : yellow('شعار الجهة')
      pillRow.appendChild(plate)
    }

    /* ── 5. One closing page (note 13): v7's CLOSING photograph and line,
       with the contact details from v7's CONTACT page set beside it. ───── */
    const closing = P(34)
    const contact = P(35)
    const contactBlock = contact.querySelector(':scope > div[style*="top:186px;left:72px;width:600px"]')
    const thanks = contact.querySelector(':scope > div[style*="top:200px;right:72px;width:430px"]')
    // A second, left-hand scrim so the details read over the photograph.
    const scrim = document.createElement('div')
    scrim.setAttribute('style', 'position:absolute;inset:0;background:linear-gradient(90deg,rgba(15,27,40,.92) 0%,rgba(15,27,40,.70) 50%,rgba(15,27,40,.10) 100%)')
    closing.querySelector(':scope > div[style*="position:absolute;inset:0"]').appendChild(scrim)
    // Header: v7's CONTACT header replaces CLOSING.
    const closingHead = closing.querySelector('span[style*="font-size:36px;font-weight:700"]')
    closingHead.textContent = 'الخاتمة وبيانات التواصل'
    closingHead.nextElementSibling.textContent = 'CLOSING & CONTACT'
    // The closing line moves to the right column, under «شكرًا لكم».
    const line = closing.querySelector(':scope > div[style*="top:266px;right:110px"]')
    line.setAttribute('style', 'position:absolute;top:200px;right:72px;width:520px')
    const inner = line.firstElementChild
    inner.setAttribute('style', '')
    inner.prepend(thanks.children[0].cloneNode(true), thanks.children[1].cloneNode(true))
    const big = inner.querySelector('div[style*="font-size:78px"]')
    big.setAttribute('style', 'font-size:40px;font-weight:600;line-height:1.4;color:#ffffff;margin-top:34px')
    big.nextElementSibling.setAttribute('style', 'text-align:right;font-size:20px;font-weight:400;line-height:1.55;color:rgba(228,238,246,.72);margin-top:12px')
    closing.appendChild(contactBlock)
    // Fill the details the client has now confirmed; v7's highlight stays only
    // where something is still genuinely missing (the QR code).
    const rows = [...contactBlock.querySelectorAll('div[style*="padding:12px 0"]')]
    const val = (i, html) => { rows[i].children[1].innerHTML = html }
    rows[0].children[0].textContent = 'الهاتف والواتساب'
    val(0, '<a class="lt" href="https://wa.me/966550511403" style="color:inherit;text-decoration:none">+966 55 051 1403</a>')
    val(1, '<a class="lt" href="mailto:info@variousevent.com" style="color:inherit;text-decoration:none">info@variousevent.com</a>')
    val(2, '<a class="lt" href="https://variousevent.com" style="color:inherit;text-decoration:none">variousevent.com</a>')
    val(3, 'الرياض، المملكة العربية السعودية')
    val(4, `<span style="display:flex;flex-wrap:wrap;gap:4px 18px">${assets.social.map(s => `<a href="${s.href}" style="color:inherit;text-decoration:none;white-space:nowrap"><span class="lt"><span style="color:#a9c39a">${s.label}</span> ${s.handle}</span></a>`).join('')}</span>`)
    val(5, yellow('رمز QR'))
    // «شركة», not «مؤسسة» — the registered entity is a company.
    const legal = contactBlock.querySelector('div[style*="margin-top:22px;font-size:12px"]')
    legal.textContent = 'شركة الفعاليات المتنوعة لتنظيم المعارض والمؤتمرات — س.ت 1010960212'
    legal.nextElementSibling.textContent = 'Various Events Company for Organizing Exhibitions and Conferences — CR 1010960212'
    contact.remove()

    /* ── 6. Chapter dividers (note 10), cloned from v7's PAUSE page and set
       on the navy ground so they read as a break between sections. ─────── */
    const pause = P(22)
    const makeDivider = ({ ar, en, line, lineEn, image, links }) => {
      const d = pause.cloneNode(true)
      d.dataset.v7 = 'divider'
      d.classList.remove('light')
      d.setAttribute('style', 'background:#0f1b28')
      const wm = d.querySelector(':scope > div[style*="top:-170px;right:-240px"]')
      wm.setAttribute('style', wm.getAttribute('style').replace(/color:#[0-9a-f]+/, 'color:#ffffff').replace(/opacity:0\.0\d+/, 'opacity:0.035'))
      const svg = d.querySelector('svg image')
      svg.setAttribute('href', image)
      const clip = d.querySelector('clipPath'), id = 'dv' + Math.random().toString(36).slice(2, 8)
      clip.id = id; svg.setAttribute('clip-path', `url(#${id})`)
      const head = d.querySelector('span[style*="font-size:36px;font-weight:700"]')
      head.textContent = ar; css(head, 'color:#ffffff')
      head.nextElementSibling.textContent = en; css(head.nextElementSibling, 'color:#d3e9b0')
      const big = d.querySelector('div[style*="font-size:38px"]')
      big.textContent = line; css(big, 'color:#ffffff')
      big.nextElementSibling.textContent = lineEn; css(big.nextElementSibling, 'color:rgba(228,238,246,.72)')
      // The chapter's contents, as links, under the line.
      const list = document.createElement('div')
      list.className = 'divider-links'
      list.setAttribute('style', 'margin-top:34px;border-top:1px solid rgba(255,255,255,.14)')
      list.dataset.links = JSON.stringify(links)
      big.parentElement.appendChild(list)
      for (const f of d.querySelectorAll(':scope > div[style*="bottom:50px"] span')) css(f, 'color:rgba(255,255,255,.55)')
      return d
    }

    /* ── 7. Assemble the new order ─────────────────────────────────────── */
    const D = {
      about: makeDivider({ ar: 'من نحن', en: 'WHO WE ARE', line: 'فريق واحد، وقصة تستحق أن تُروى.', lineEn: 'One team, and a story worth telling.', image: assets.images.d1, links: ['about', 'vision', 'values'] }),
      services: makeDivider({ ar: 'خدماتنا', en: 'WHAT WE DO', line: 'من الفكرة الأولى إلى إطفاء آخر ضوء.', lineEn: 'From the first idea to the last light.', image: assets.images.d2, links: ['services', 'method', 'numbers', 'sectors'] }),
      work: makeDivider({ ar: 'أعمالنا', en: 'OUR WORKS', line: 'مشاريع تتحدّث عن نفسها.', lineEn: 'Work that speaks for itself.', image: assets.images.d3, links: ['works'] }),
      clients: makeDivider({ ar: 'عملاؤنا', en: 'OUR CLIENTS', line: 'ثقةٌ نعتزّ بها، مشروعًا بعد مشروع.', lineEn: 'Trust we are proud of, one project at a time.', image: assets.images.d4, links: ['clients', 'why'] }),
    }
    const byV7 = n => document.querySelector(`.page[data-v7="${n}"]`)
    const order = [
      byV7(1), byV7(2),
      D.about, byV7(4), byV7(5), byV7(7), byV7(8), byV7(9),
      D.services, byV7(10), byV7(11), byV7(12), byV7(13),
      D.work, byV7(14), ...PROJECTS.slice(0, 7).map(byV7), byV7(22), ...PROJECTS.slice(7).map(byV7),
      D.clients, byV7(31), byV7(32), byV7(33),
      closing,
    ]
    const anchor = { about: byV7(4), vision: byV7(7), values: byV7(9), services: byV7(10), method: byV7(11), numbers: byV7(12), sectors: byV7(13), works: byV7(14), clients: byV7(31), why: byV7(33), closing }
    for (const r of removed) r.remove()
    const body = document.body
    for (const p of order) body.appendChild(p)
    const total = order.length
    order.forEach((p, i) => { p.id = 'p' + String(i + 1).padStart(2, '0') })
    const pageNo = el => String(order.indexOf(el) + 1).padStart(2, '0')

    /* ── 8. Fewer logos (note 3): the lockup stays on the cover and the
       closing page only. ─────────────────────────────────────────────── */
    for (const p of order) {
      if (p === order[0] || p === closing) continue
      for (const l of p.querySelectorAll(':scope > div[style*="top:54px"][style*="z-index:9"]')) l.remove()
    }

    /* ── 9. Footers: v7's page number, renumbered and linked back to the
       contents; the internal direction-deck caption is dropped. ───────── */
    for (const p of order) {
      const foot = p.querySelector(':scope > div[style*="bottom:50px"][style*="display:flex"]')
      if (!foot) continue
      foot.style.pointerEvents = 'auto'
      const spans = [...foot.children]
      const num = spans.find(s => s.classList.contains('lt'))
      for (const s of spans) if (s !== num) s.remove()
      const n = pageNo(p)
      num.innerHTML = `<a href="#p02" style="color:inherit;text-decoration:none">${n}<span style="opacity:.5"> / ${total}</span></a>`
    }

    /* ── 10. The page rail, rebuilt for the new page count. ────────────── */
    for (const p of order) {
      const rail = railOf(p); if (!rail) continue
      const theme = p.classList.contains('light') ? 'light' : 'dark'
      const s = dotStyles[theme]
      const i = order.indexOf(p)
      rail.innerHTML = ''
      for (let k = 0; k < total; k++) {
        if (k === i) { rail.appendChild(markSpan.cloneNode(true)); continue }
        const dot = document.createElement('span')
        dot.setAttribute('style', k < i ? s.done : s.todo)
        rail.appendChild(dot)
      }
    }

    /* ── 11. Contents page (note 2): the founders entry goes, the rest are
       renumbered, re-paged and made into links. ───────────────────────── */
    const index = byV7(2)
    const grid = index.querySelector('div[style*="grid-template-columns:repeat(4,1fr)"]')
    const cells = [...grid.children]
    const cellProto = cells[0]
    const entries = [
      ['من نحن', 'Who We Are', 'about'], ['الرؤية والرسالة', 'Vision & Mission', 'vision'], ['قيمنا', 'Our Values', 'values'],
      ['خدماتنا', 'Our Services', 'services'], ['منهجية عملنا', 'How We Work', 'method'], ['فاريوس بالأرقام', 'VARIOUS in Numbers', 'numbers'],
      ['القطاعات التي نخدمها', 'Sectors We Serve', 'sectors'], ['أعمالنا', 'Our Work', 'works'], ['عملاؤنا', 'Our Clients', 'clients'],
      ['لماذا فاريوس', 'Why VARIOUS', 'why'], ['الخاتمة وبيانات التواصل', 'Contact & Closing', 'closing'],
    ]
    grid.innerHTML = ''
    entries.forEach(([ar, en, key], i) => {
      const c = cellProto.cloneNode(true)
      const target = anchor[key]
      const kids = c.children
      kids[0].textContent = String(i + 1).padStart(2, '0')
      kids[1].children[0].textContent = ar
      kids[1].children[1].textContent = en
      kids[2].textContent = 'صـ ' + pageNo(target)
      const a = document.createElement('a')
      a.href = '#' + target.id
      a.setAttribute('style', c.getAttribute('style') + ';color:inherit;text-decoration:none')
      while (c.firstChild) a.appendChild(c.firstChild)
      grid.appendChild(a)
    })
    // The twelfth cell keeps the grid's ruling; it simply has no entry.
    const filler = document.createElement('div')
    filler.setAttribute('style', cellProto.getAttribute('style'))
    grid.appendChild(filler)

    // Divider contents lists.
    const label = { about: ['من نحن', 'Who We Are'], vision: ['الرؤية والرسالة', 'Vision & Mission'], values: ['قيمنا', 'Our Values'], services: ['خدماتنا', 'Our Services'], method: ['منهجية عملنا', 'How We Work'], numbers: ['فاريوس بالأرقام', 'VARIOUS in Numbers'], sectors: ['القطاعات التي نخدمها', 'Sectors We Serve'], works: ['أعمالنا', 'Our Work'], clients: ['عملاؤنا', 'Our Clients'], why: ['لماذا فاريوس', 'Why VARIOUS'] }
    for (const list of document.querySelectorAll('.divider-links')) {
      for (const key of JSON.parse(list.dataset.links)) {
        const t = anchor[key]
        list.insertAdjacentHTML('beforeend', `<a href="#${t.id}" style="display:flex;direction:rtl;justify-content:space-between;gap:20px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.08);color:#ffffff;text-decoration:none">
          <span class="dv-title" style="font-size:17px;font-weight:600">${label[key][0]}</span>
          <span class="lt dv-en" style="font-size:14px;color:rgba(228,238,246,.72)">${label[key][1]}</span>
          <span style="font-size:13px;color:#a9c39a">صـ ${pageNo(t)}</span></a>`)
      }
      delete list.dataset.links
    }

    /* ── 12. Figures the client has now confirmed (VARIOUS in Numbers). ── */
    const numbers = byV7(12)
    for (const cell of numbers.querySelectorAll('div[style*="grid-template-columns:repeat(3,1fr)"] > div')) {
      const label = cell.children[1].textContent.trim()
      const fill = { 'فعالية ومعرضًا نفّذناها': '160+', 'عميلًا من القطاعين الحكومي والخاص': '100+' }[label]
      if (!fill) continue
      cell.children[0].innerHTML = `<span class="lt">${fill}</span>`
      const en = cell.children[2]
      en.innerHTML = en.innerHTML.replace(/<span[^>]*>X<\/span>\+/, fill)
    }

    /* ── 13. Factual corrections the copy deck flags (G2, G3). ─────────── */
    for (const el of document.querySelectorAll('.page *')) {
      for (const n of el.childNodes) {
        if (n.nodeType !== 3) continue
        n.nodeValue = n.nodeValue.replace(/فاريوس مؤسسة سعودية/g, 'فاريوس شركة سعودية')
      }
    }

    /* ── 14. Language (notes 5 and 7). ───────────────────────────────────
       v7 sets every Arabic line with its English twin directly after it,
       marked `.lt`. The Arabic edition drops the twins; the English edition
       moves each twin into its Arabic line's place — same position, same
       size — and turns it left-to-right. Bilingual LABELS stay bilingual,
       side by side: the section headers, the PROJECT tag and the cover's
       COMPANY PROFILE line. */
    const projectTag = el => { const pill = el.closest('span[style*="border-radius:99px"]'); return pill && pill.textContent.includes('مشروع') }
    order[0].querySelector('span[style*="font-size:14px;color:#a9c39a"]')?.setAttribute('data-keep', '1')
    const isKeeper = el =>
      projectTag(el) ||                                                         // مشروع · PROJECT
      st(el, 'font-size:14px;color:rgba(255,255,255,.56)') ||                 // cover: COMPANY PROFILE — 2026
      el.closest('div[style*="bottom:50px"]') || el.closest('a[href^="http"], a[href^="mailto"]')
    const isHeaderEyebrow = el => st(el, 'font-size:19px;font-weight:400') && el.previousElementSibling && st(el.previousElementSibling, 'font-size:36px')

    const twins = [...document.querySelectorAll('.page .lt')].filter(el => LAT.test(el.textContent) && !isKeeper(el) && !el.parentElement.closest('.lt'))

    // The two-column «من نحن» page is laid out before the general pass.
    twoColumns(byV7(4), EN)

    if (!EN) {
      for (const el of twins) {
        if (isHeaderEyebrow(el)) continue
        if (el.classList.contains('dv-en')) { el.remove(); continue }
        el.remove()
      }
    } else {
      document.documentElement.lang = 'en'
      // VARIOUS in Numbers: the English line is «X+ — label»; the label goes
      // in the label slot and the figure stays in the figure slot.
      for (const cell of byV7(12).querySelectorAll('div[style*="grid-template-columns:repeat(3,1fr)"] > div')) {
        const en = cell.children[2]; if (!en) continue
        cell.children[1].textContent = en.textContent.split(' — ').slice(1).join(' — ')
        ltr(cell.children[1])
        const mark = cell.children[0].querySelector('span[style*="background:#fff3b8"]')
        if (mark) mark.textContent = 'X'
        en.remove()
      }
      for (const el of twins) {
        if (!el.isConnected) continue
        if (isHeaderEyebrow(el)) {
          const title = el.previousElementSibling
          const ar = title.textContent
          title.textContent = titleCase(el.textContent)
          ltr(title)
          el.textContent = ar
          el.classList.remove('lt')
          continue
        }
        if (el.classList.contains('dv-en')) {
          const t = el.parentElement.querySelector('.dv-title'); t.textContent = el.textContent; el.remove(); continue
        }
        const twin = arabicTwin(el)
        if (!twin) continue
        // «Title — text» rows (how we work, why VARIOUS) split back into
        // their two Arabic slots.
        const prev2 = twin.previousElementSibling
        if (el.tagName === 'SPAN' && prev2 && AR.test(prev2.textContent) && /\s—\s/.test(el.textContent) && twin.tagName === 'SPAN') {
          const [head, ...rest] = el.textContent.split(' — ')
          prev2.textContent = head; ltr(prev2)
          twin.textContent = rest.join(' — '); ltr(twin)
          el.remove(); continue
        }
        twin.innerHTML = el.innerHTML
        ltr(twin)
        el.remove()
      }
      // Strings v7 set in Arabic only — labels, tags, names — from the
      // dictionary. Anything left over is reported, not guessed.
      for (const el of document.querySelectorAll('.page *')) {
        for (const n of el.childNodes) {
          if (n.nodeType !== 3 || !AR.test(n.nodeValue)) continue
          if (projectTag(el) && n.nodeValue.trim() === 'مشروع') continue
          if (st(el, 'font-size:19px;font-weight:400') || el.closest('[data-keep]')) continue   // bilingual labels
          const key = n.nodeValue.trim()
          const rep = T[key] ?? T[key.replace(/^صـ\s*/, '')]
          if (key.startsWith('صـ')) { n.nodeValue = 'p. ' + key.replace(/^صـ\s*/, ''); continue }
          // Labels, tags and names keep v7's alignment; only their direction turns.
          if (rep != null) { n.nodeValue = n.nodeValue.replace(key, rep); el.style.direction = 'ltr' }
        }
      }
      for (const s of document.querySelectorAll('[data-client]')) s.style.direction = 'ltr'
    }

    /* ── 15. Western digits throughout (note 6). ───────────────────────── */
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let n; (n = walker.nextNode());) if (INDIC.test(n.nodeValue)) n.nodeValue = western(n.nodeValue)

    return { pages: total, leftovers: EN ? leftoverArabic() : [] }

    /* helpers */
    function ltr(el) { el.style.direction = 'ltr'; el.style.textAlign = 'left' }
    function titleCase(s) {
      const small = new Set(['and', 'of', 'in', 'for', 'the', 'to', 'a'])
      return s.toLowerCase().split(' ').map((w, i) => w === 'various' ? 'VARIOUS' : (i && small.has(w)) ? w : w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }
    function arabicTwin(el) {
      let p = el.previousElementSibling
      while (p && !AR.test(p.textContent)) p = p.previousElementSibling
      if (!p) return null
      // The twin is the innermost element carrying the Arabic line.
      const inner = [...p.querySelectorAll('*')].reverse().find(x => AR.test(x.textContent) && ![...x.children].some(c => AR.test(c.textContent)) && !st(x, 'background:#fff3b8'))
      return p.children.length && inner ? inner : p
    }
    function twoColumns(page, en) {
      const cols = page.querySelectorAll(':scope > div[style*="display:flex;direction:rtl;gap:52px"] > div[style*="text-align:right"]')
      if (cols.length !== 2) return
      const [arCol, otherCol] = cols
      const label = arCol.firstElementChild
      const arParas = arCol.querySelectorAll('p')
      const paraStyle = arParas[0].getAttribute('style')
      label.remove()
      otherCol.querySelector('div').remove()               // the ENGLISH label
      const right = arCol.querySelector('div')
      if (en) {
        // English reads left to right, so its first paragraph takes the left
        // column and the second the right.
        const enParas = [...otherCol.querySelectorAll('p')].map(p => p.textContent)
        right.innerHTML = `<p style="${paraStyle}">${enParas.slice(1).join(' ')}</p>`
        otherCol.innerHTML = `<div style="display:flex;flex-direction:column;gap:22px"><p style="${paraStyle}">${enParas[0] || ''}</p></div>`
        otherCol.querySelectorAll('p').forEach(ltr); right.querySelectorAll('p').forEach(ltr)
      } else {
        const second = arParas[1]
        otherCol.innerHTML = `<div style="display:flex;flex-direction:column;gap:22px"></div>`
        otherCol.firstElementChild.appendChild(second)
      }
      otherCol.classList.remove('lt')
    }
    function leftoverArabic() {
      const out = new Set()
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      for (let n; (n = w.nextNode());) {
        const el = n.parentElement
        if (!AR.test(n.nodeValue)) continue
        if (st(el, 'font-size:19px;font-weight:400') || el.closest('[data-keep]')) continue
        if (projectTag(el) && n.nodeValue.trim() === 'مشروع') continue
        out.add(n.nodeValue.trim())
      }
      return [...out]
    }
  }
})()
