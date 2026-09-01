/* ─────────────────────────────────────────────────────────────────────────
   Progressive enhancement only. Every page is complete and navigable with
   this file blocked — nothing here creates content, it only sharpens what the
   HTML already renders.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict'

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ── Mobile navigation ────────────────────────────────────────────────── */
  var toggle = document.querySelector('[data-nav-toggle]')
  var panel  = document.getElementById('site-nav')

  if (toggle && panel) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open))
      panel.toggleAttribute('data-open', open)
      document.documentElement.style.overflow = open ? 'hidden' : ''
    }
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true')
    })
    // Escape closes; focus returns to the trigger.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false); toggle.focus()
      }
    })
    // Following a link inside the panel closes it.
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false)
    })
    // Leaving the mobile breakpoint resets state so the panel can't get stuck.
    var mq = window.matchMedia('(min-width: 60rem)')
    var reset = function () { if (mq.matches) setOpen(false) }
    mq.addEventListener ? mq.addEventListener('change', reset) : mq.addListener(reset)
  }

  /* ── Masthead: condense once the page has scrolled ────────────────────── */
  var masthead = document.querySelector('[data-masthead]')
  if (masthead) {
    var lastState = null
    var onScroll = function () {
      var scrolled = window.scrollY > 24
      if (scrolled !== lastState) {
        masthead.toggleAttribute('data-scrolled', scrolled)
        lastState = scrolled
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  }

  /* ── Reveal on scroll ─────────────────────────────────────────────────── */
  /* The CSS hides [data-reveal] only inside a `(prefers-reduced-motion: no-preference)`
     query AND only once this class is set, so content is never hidden from a
     visitor whose JS failed or who asked for less motion. */
  var targets = document.querySelectorAll('[data-reveal]')
  if (targets.length && !reduced && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal')
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        entry.target.setAttribute('data-revealed', '')
        io.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 })
    targets.forEach(function (el) { io.observe(el) })
  }

  /* ── Remember the reader's language choice ────────────────────────────── */
  /* Only ever used to pre-select the toggle's styling; it never redirects,
     because a silent redirect breaks shared links. */
  var langLink = document.querySelector('[data-lang-switch]')
  if (langLink) {
    langLink.addEventListener('click', function () {
      try { localStorage.setItem('various:lang', langLink.getAttribute('data-lang-target') || '') } catch (e) {}
    })
  }

  /* ── Current-section highlighting in the in-page nav ──────────────────── */
  var sectionLinks = document.querySelectorAll('[data-section-link]')
  if (sectionLinks.length && 'IntersectionObserver' in window) {
    var byId = {}
    var observed = []
    sectionLinks.forEach(function (a) {
      var id = a.getAttribute('href')
      if (!id || id.charAt(0) !== '#') return
      var section = document.getElementById(id.slice(1))
      if (!section) return
      byId[id.slice(1)] = a
      observed.push(section)
    })
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var a = byId[entry.target.id]
        if (a) a.toggleAttribute('data-current', entry.isIntersecting)
      })
    }, { rootMargin: '-45% 0px -45% 0px' })
    observed.forEach(function (s) { so.observe(s) })
  }
})()
