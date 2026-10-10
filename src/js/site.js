/* ─────────────────────────────────────────────────────────────────────────
   Progressive enhancement only.

   Every page is complete and navigable with this file blocked — and with GSAP
   blocked. Nothing here creates content; the motion layer only sharpens what
   the HTML already renders, and it removes its own hiding rule if it cannot
   run (see the failsafe at the top of initMotion).
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict'

  /* ── Mobile navigation ────────────────────────────────────────────────── */
  var toggle = document.querySelector('[data-nav-toggle]')
  var panel = document.getElementById('site-nav')

  if (toggle && panel) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open))
      panel.toggleAttribute('data-open', open)
      // No scroll lock: locking overflow on the scroll container while the page
      // is scrolled re-bases the fixed panel and it renders off-screen.
      document.documentElement.classList.toggle('nav-open', open)
    }
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true')
    })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false); toggle.focus()
      }
    })
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false) })
    // Must match the stylesheet's menu breakpoint (layout.css, 75rem).
    var mq = window.matchMedia('(min-width: 75.0625rem)')
    var reset = function () { if (mq.matches) setOpen(false) }
    mq.addEventListener ? mq.addEventListener('change', reset) : mq.addListener(reset)
  }

  /* ── Masthead: condense once the page has scrolled ─────────────────────
     An IntersectionObserver on a 1px sentinel, so the site ships no scroll
     handler of its own. */
  var masthead = document.querySelector('[data-masthead]')
  var sentinel = document.querySelector('[data-top-sentinel]')
  if (masthead && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      masthead.toggleAttribute('data-scrolled', !entries[0].isIntersecting)
    }, { threshold: 0 }).observe(sentinel)
  } else if (masthead) {
    masthead.setAttribute('data-scrolled', '')
  }

  /* ── Light / dark ─────────────────────────────────────────────────────
     The saved choice is applied by the inline script in <head>, before first
     paint; this only handles the switch. */
  var root = document.documentElement
  var themeBtn = document.querySelector('[data-theme-toggle]')
  var themeMeta = document.querySelector('meta[name="theme-color"]')
  var syncTheme = function () {
    var light = root.getAttribute('data-theme') === 'light'
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(light))
    if (themeMeta) themeMeta.setAttribute('content', light ? '#f6f7f2' : '#0f1b28')
  }
  syncTheme()
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
      root.setAttribute('data-theme', next)
      try { localStorage.setItem('various:theme', next) } catch (e) {}
      syncTheme()
    })
  }

  /* ── Language switch keeps your place ─────────────────────────────────
     Both editions share one layout, so switching language should not throw
     the reader back to the top. Remember which section was at the top of the
     viewport, and how far into it, and restore that on the other edition. */
  var KEY = 'various:switch'
  var sections = function () { return Array.prototype.slice.call(document.querySelectorAll('main > section, main > nav')) }
  var langLink = document.querySelector('[data-lang-switch]')
  if (langLink) {
    langLink.addEventListener('click', function () {
      try { localStorage.setItem('various:lang', langLink.getAttribute('data-lang-target') || '') } catch (e) {}
      var list = sections(), idx = 0
      for (var i = 0; i < list.length; i++) { if (list[i].getBoundingClientRect().top <= 1) idx = i }
      var el = list[idx]
      var into = el ? Math.max(0, -el.getBoundingClientRect().top) / Math.max(1, el.offsetHeight) : 0
      try {
        sessionStorage.setItem(KEY, JSON.stringify({ to: langLink.href, idx: idx, into: into, y: window.scrollY }))
      } catch (e) {}
    })
  }
  try {
    var saved = JSON.parse(sessionStorage.getItem(KEY) || 'null')
    sessionStorage.removeItem(KEY)
    if (saved && saved.to === location.href.split('#')[0] && saved.y > 0) {
      var restore = function () {
        var el = sections()[saved.idx]
        if (!el) return
        var top = el.getBoundingClientRect().top + window.scrollY + saved.into * el.offsetHeight
        window.scrollTo({ top: top, behavior: 'instant' })
      }
      restore()
      window.addEventListener('load', restore)
    }
  } catch (e) {}

  /* ── Motion ───────────────────────────────────────────────────────────── */
  initMotion()

  function initMotion() {
    // FAILSAFE, and it has to come first. The stylesheet hides animated
    // elements only while <html> carries `js`. If GSAP did not arrive — blocked,
    // offline, a CDN-less corporate proxy — drop the class and the page renders
    // exactly as it does without JavaScript at all.
    if (!window.gsap || !window.ScrollTrigger) {
      document.documentElement.classList.remove('js')
      return
    }

    var gsap = window.gsap
    gsap.registerPlugin(window.ScrollTrigger)

    // The whole motion layer lives inside this query. Under
    // `prefers-reduced-motion: reduce` none of it is created, and gsap.matchMedia
    // reverts anything it set — so the page is simply static, never stuck.
    var mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', function () {
      var EASE = 'power2.out'
      // A rule grows from the edge its text starts at: the right in Arabic,
      // and in an English text group, the left.
      var edgeOf = function (i, el) {
        return getComputedStyle(el.parentElement).direction === 'rtl' ? '100% 50%' : '0% 50%'
      }

      /* Hero: the one deliberate entrance on the page. Staggered, and short —
         a visitor should not be waiting on choreography to read a headline. */
      // fromTo, never from. The stylesheet has already set these to opacity 0,
      // so a plain gsap.from() would animate 0 -> 0 and leave the page blank.
      // Every tween below therefore states its END values explicitly.
      var hero = document.querySelector('[data-hero]')
      if (hero) {
        var bits = hero.querySelectorAll('[data-hero-item]')
        gsap.timeline({ defaults: { ease: EASE, duration: 0.7 } })
          .fromTo(bits, { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.09 })
          .fromTo(hero.querySelectorAll('.rule'),
            { scaleX: 0 },
            { scaleX: 1, transformOrigin: edgeOf, duration: 0.5 }, '-=0.45')

        // A slow drift on the hero photograph. Scrubbed to scroll, so it is
        // never animating while the visitor is still.
        var media = hero.querySelector('.hero__media img')
        if (media) {
          gsap.to(media, {
            yPercent: 8, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
          })
        }
      }

      /* Section reveals. `once: true` — a page that re-animates every time you
         scroll back up is exhausting on a long page. */
      gsap.utils.toArray('[data-animate]').forEach(function (el) {
        gsap.fromTo(el, { y: 22, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, ease: EASE,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      /* Grids stagger their children rather than arriving as one block. */
      gsap.utils.toArray('[data-animate-group]').forEach(function (group) {
        gsap.fromTo(group.children, { y: 26, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.65, ease: EASE, stagger: 0.07,
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        })
      })

      /* The signature rule draws itself from the reading edge — the right, in
         both editions, since they share one layout. A centred rule grows from
         its middle. */
      gsap.utils.toArray('.section .rule').forEach(function (r) {
        var origin = r.classList.contains('rule--center') ? '50% 50%' : edgeOf(0, r)
        gsap.fromTo(r, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: origin, duration: 0.6, ease: EASE,
          scrollTrigger: { trigger: r, start: 'top 92%', once: true },
        })
      })

      /* Stat figures count up — but only ones that carry a real number. The
         pending em-dashes are left alone. */
      gsap.utils.toArray('[data-count]').forEach(function (el) {
        var target = Number(el.getAttribute('data-count'))
        if (!isFinite(target) || target <= 0) return
        var suffix = el.getAttribute('data-count-suffix') || ''
        var obj = { v: 0 }
        gsap.to(obj, {
          v: target, duration: 1.4, ease: 'power1.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: function () { el.textContent = format(Math.round(obj.v)) + suffix },
        })
      })

      /* The method path: each station lights up, then the line to the next
         one draws down and the arrow lands on it. */
      gsap.utils.toArray('[data-path] .path__step').forEach(function (step) {
        var tl = gsap.timeline({ scrollTrigger: { trigger: step, start: 'top 78%', once: true } })
        tl.fromTo(step.querySelector('.path__node'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' })
          .fromTo(step.querySelector('.path__card'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: EASE }, '-=0.2')
        var line = step.querySelector('.path__line')
        var arrow = step.querySelector('.path__arrow')
        if (line) tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, transformOrigin: '50% 0%', duration: 0.7, ease: 'power1.inOut' }, '-=0.15')
        if (arrow) tl.fromTo(arrow, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: EASE }, '-=0.1')
      })

      /* The watermark drifts, very slightly, against the scroll. */
      gsap.utils.toArray('.watermark img').forEach(function (w) {
        gsap.to(w, {
          yPercent: -6, ease: 'none',
          scrollTrigger: { trigger: w.closest('section') || w, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })

    // Images settle in after the fold, so positions computed at load can be
    // stale. One recalculation once everything has loaded.
    window.addEventListener('load', function () { window.ScrollTrigger.refresh() })
  }

  /** Group thousands. Western digits in both editions, as in the profile. */
  function format(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
})()
