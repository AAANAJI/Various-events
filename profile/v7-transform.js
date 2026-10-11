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

  // The four networks' own marks, as filled glyphs on a 24px grid.
  const ICONS = {
    instagram: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z',
    x: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  }

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
    const removed = [P(3), P(4), P(6), P(30)]

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

    // v7's remaining «to confirm» highlights on project pages are draft notes.
    for (const page of projectPages) {
      for (const mk of page.querySelectorAll('span[style*="background:#fff3b8"]')) mk.remove()
    }

    /* ── 4. Project pages: balanced, no PROJECT tag, a client-logo slot ────
       The PROJECT tag goes. So does the shade over the photograph's top edge:
       it existed to keep the logo lockup legible, and on light pages it tinted
       the white edge of the frame grey. The text column is centred in the full
       height rather than hanging from the top, and carries the client's logo
       slot at its head. No logo files have been supplied, so the slot carries
       the client's name until the vector arrives. */
    for (const page of projectPages) {
      const light = page.classList.contains('light')
      page.querySelector(':scope > div[style*="top:60px"][style*="width:540px"]')?.remove()
      page.querySelectorAll(':scope > div[style*="linear-gradient(180deg,rgba(15,27,40"]').forEach(d => d.remove())
      const col = page.querySelector(':scope > div[style*="top:112px"][style*="width:540px"]')
      const clientCell = [...col.querySelectorAll('div[style*="grid-template-columns:repeat(2,1fr)"] > div')]
        .find(c => c.children[0].textContent.trim() === 'العميل')
      const name = clientCell ? clientCell.children[1].textContent.trim() : ''
      const known = name && !/^الجهة/.test(name)
      col.setAttribute('style', col.getAttribute('style').replace('top:112px', 'top:0;bottom:0') +
        `;display:flex;flex-direction:column;justify-content:center;direction:${EN ? 'ltr' : 'rtl'}`)
      const plate = document.createElement('div')
      plate.className = 'client-logo'
      plate.setAttribute('data-keep-fs', '1')
      plate.setAttribute('style', `align-self:flex-start;flex:none;width:220px;height:78px;margin-bottom:30px;background:#ffffff;border:1px solid ${light ? 'rgba(15,27,40,.14)' : 'rgba(255,255,255,.22)'};display:flex;align-items:center;justify-content:center;padding:6px 14px;text-align:center`)
      plate.innerHTML = known
        ? `<span data-client="1" style="font-size:18px;font-weight:700;line-height:1.3;color:#0f1b28">${name}</span>`
        : `<span style="font-size:17px;background:#fff3b8;color:#0f1b28;padding:0 5px">شعار الجهة</span>`
      if (known) col.prepend(plate)     // no client named, no slot: nothing is left highlighted
      if (EN) {
        col.style.textAlign = 'left'
        col.querySelectorAll('[style*="direction:rtl"]').forEach(d => { d.style.direction = 'ltr' })
        col.querySelectorAll('[style*="text-align:right"]').forEach(d => { d.style.textAlign = 'left' })
      }
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
    line.setAttribute('style', 'position:absolute;top:200px;right:72px;width:500px')
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
    val(4, `<span style="display:flex;flex-wrap:wrap;gap:10px 26px;direction:ltr">${assets.social.map(x => `<a href="${x.href}" style="display:inline-flex;align-items:center;gap:10px;color:inherit;text-decoration:none"><svg viewBox="0 0 24 24" width="30" height="30" fill="#afda68" style="flex:none"><path d="${ICONS[x.id]}"/></svg><span class="lt" style="font-size:17px">${x.handle}</span></a>`).join('')}</span>`)
    rows[5].remove()                     // no QR code has been supplied
    rows.forEach(r => { r.children[0].style.width = '175px' })
    contactBlock.style.width = '590px'
    // «شركة», not «مؤسسة» — the registered entity is a company.
    const legal = contactBlock.querySelector('div[style*="margin-top:22px;font-size:12px"]')
    legal.textContent = 'شركة الفعاليات المتنوعة لتنظيم المعارض والمؤتمرات — س.ت 1010960212'
    legal.nextElementSibling.textContent = 'Various Events Company for Organizing Exhibitions and Conferences — CR 1010960212'
    contact.remove()

    /* ── 5b. «من نحن» is one page (note 1), set with the client's copy: v7's
       star page, with the two paragraphs from the approved copy deck. ───── */
    const aboutBox = P(5).querySelector(':scope > div[style*="top:184px;right:72px;width:600px"]')
    aboutBox.style.width = '640px'
    aboutBox.setAttribute('data-keep-fs', '1')
    aboutBox.children[0].style.fontSize = (EN ? 22 : 26) + 'px'
    aboutBox.children[0].style.lineHeight = EN ? '1.65' : '1.9'
    aboutBox.children[1].style.fontSize = '22px'
    aboutBox.children[0].innerHTML = assets.about.ar.join('<br><br>')
    aboutBox.children[1].innerHTML = assets.about.en.join('<br><br>')

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
      D.about, byV7(5), byV7(7), byV7(8), byV7(9),
      D.services, byV7(10), byV7(11), byV7(12), byV7(13),
      D.work, byV7(14), ...PROJECTS.slice(0, 7).map(byV7), byV7(22), ...PROJECTS.slice(7).map(byV7),
      D.clients, byV7(31), byV7(32), byV7(33),
      closing,
    ]
    const anchor = { about: byV7(5), vision: byV7(7), values: byV7(9), services: byV7(10), method: byV7(11), numbers: byV7(12), sectors: byV7(13), works: byV7(14), clients: byV7(31), why: byV7(33), closing }
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

    /* ── 12. Only the figures the client has given (note 3). The placeholders
       for years, sectors, m² and team size are not shown at all. ─────────── */
    const numbers = byV7(12)
    const ngrid = numbers.querySelector('div[style*="grid-template-columns:repeat(3,1fr)"]')
    for (const cell of [...ngrid.children]) {
      const label = cell.children[1].textContent.trim()
      const fill = { 'فعالية ومعرضًا نفّذناها': '160+', 'عميلًا من القطاعين الحكومي والخاص': '100+' }[label]
      if (!fill) { cell.remove(); continue }
      cell.setAttribute('data-keep-fs', '1')
      cell.children[0].innerHTML = `<span class="lt">${fill}</span>`
      cell.children[0].style.fontSize = '128px'
      cell.children[1].style.fontSize = '30px'
      const twin = cell.children[2]
      twin.innerHTML = twin.innerHTML.replace(/<span[^>]*>X<\/span>\+/, fill)
      if (EN) {
        cell.children[1].textContent = twin.textContent.split(' — ').slice(1).join(' — ')
        cell.style.textAlign = 'left'
        cell.style.direction = 'ltr'
      }
      twin.remove()
    }
    ngrid.style.gridTemplateColumns = 'repeat(2,1fr)'
    ngrid.style.top = '240px'

    // The works introduction loses its «every project … QR» note (note 4).
    byV7(14).querySelector(':scope > div[style*="top:500px;right:72px;width:760px"]')?.remove()

    /* ── 12b. How we work, as the website draws it (note 2): numbered
       stations on one line, each joined to the next by an arrow pointing
       down, alternating either side. Words are the client's new copy. ───── */
    const mp = byV7(11)
    mp.querySelector(':scope > div[style*="top:186px;right:72px;left:72px"]').remove()
    const Y0 = 150, PITCH = 96, NODE = 58, GAP = PITCH - NODE
    const path = document.createElement('div')
    path.setAttribute('data-keep-fs', '1')
    path.setAttribute('style', 'position:absolute;inset:0;direction:ltr')
    path.innerHTML = assets.method.map((st_, i) => {
      const top = Y0 + i * PITCH, right = i % 2 === 0, first = i === 0
      const node = `<div style="position:absolute;left:${640 - NODE / 2}px;top:${top}px;width:${NODE}px;height:${NODE}px;border-radius:50%;border:2px solid #afda68;background:${first ? '#afda68' : '#0f1b28'};color:${first ? '#0f1b28' : '#ffffff'};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;z-index:2">${String(i + 1).padStart(2, '0')}</div>`
      const link = i < assets.method.length - 1
        ? `<svg style="position:absolute;left:630px;top:${top + NODE}px" width="20" height="${GAP}" viewBox="0 0 20 ${GAP}"><line x1="10" y1="0" x2="10" y2="${GAP - 5}" stroke="#afda68" stroke-width="2"/><path d="M4 ${GAP - 12} L10 ${GAP - 4} L16 ${GAP - 12}" fill="none" stroke="#afda68" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''
      const align = right && EN ? 'left' : 'right'
      const card = `<div style="position:absolute;top:${top - 2}px;${right ? 'right' : 'left'}:72px;width:490px;direction:${EN ? 'ltr' : 'rtl'};text-align:${align}"><div style="font-size:36px;font-weight:700;line-height:1.25;color:#ffffff">${st_.title[lang]}</div><div style="font-size:22px;line-height:1.5;color:rgba(255,255,255,.86);margin-top:4px">${st_.text[lang]}</div></div>`
      return node + link + card
    }).join('')
    mp.insertBefore(path, mp.querySelector(':scope > div[style*="top:54px"], :scope > div[style*="bottom:50px"]'))

    /* ── 12c. Clients: the approved list of 23, six to a row, without the
       draft placeholders or the "awaiting logos" note. ────────────────── */
    const cpage = byV7(32)
    const cgrid = cpage.querySelector('div[style*="grid-template-columns:repeat(5,1fr)"]')
    const cproto = cgrid.firstElementChild
    cgrid.innerHTML = ''
    for (const c of assets.clients) {
      const cell = cproto.cloneNode(true)
      cell.innerHTML = `<span data-client="1" style="font-size:12px;line-height:1.4;color:rgba(15,27,40,.74)">${c[lang]}</span>`
      cgrid.appendChild(cell)
    }
    cgrid.style.gridTemplateColumns = 'repeat(6,1fr)'
    for (const d of cpage.querySelectorAll('div, span')) {
      if (d.textContent.includes('شبكة الشعارات') && !d.querySelector('div, span')) d.remove()
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

    /* ── 14b. Larger type (note 7). v7 set body copy at 12–17px on a 1280px
       page; it grows by size band, and boxes sized for the old type grow
       with it. Pages built here carry data-keep-fs and set their own sizes. */
    const grow = z => z <= 12 ? 17 : z <= 15 ? z * 1.36 : z <= 18 ? z * 1.28 : z <= 24 ? z * 1.17 : z <= 40 ? z * 1.06 : z
    for (const el of document.querySelectorAll('.page [style*="font-size"]')) {
      if (el.closest('[data-keep-fs]')) continue
      const m = /font-size:\s*([\d.]+)px/.exec(el.getAttribute('style')); if (!m) continue
      const pageCap = ((assets.cap || {})[lang] || {})[el.closest('.page').id]
      let z = el.closest('div[style*="bottom:50px"]') ? 15 : Math.round(grow(+m[1]) * 10) / 10
      if (pageCap && +m[1] <= 18) z = Math.min(z, pageCap)
      el.style.fontSize = z + 'px'
    }
    for (const el of document.querySelectorAll('.page [style*="height:"]')) {
      if (!el.textContent.trim() || el.querySelector('img, svg') || el.closest('[data-keep-fs]')) continue
      const sty = el.getAttribute('style')
      if (/(^|;)\s*height:\s*[\d.]+px/.test(sty)) el.setAttribute('style', sty.replace(/(^|;)(\s*)height:/, '$1$2min-height:'))
    }

    // Project pages: the centred text column reads at a larger size still.
    for (const col of document.querySelectorAll('.page > div[style*="top:0;bottom:0"][style*="width:540px"]')) {
      for (const el of col.querySelectorAll('[style*="font-size"]')) {
        if (el.closest('[data-keep-fs]')) continue
        el.style.fontSize = (parseFloat(el.style.fontSize) * 1.12).toFixed(1) + 'px'
      }
    }
    // English runs longer than Arabic for the same lines.
    if (EN) { const v = [...byV7(7).querySelectorAll('div')].find(d => !d.children.length && parseFloat(d.style.fontSize) > 36); if (v) { v.style.fontSize = '27px'; v.style.lineHeight = '1.45'; v.parentElement.style.width = '440px'; v.parentElement.parentElement.style.width = '440px' } }

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
