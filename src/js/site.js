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
    var mq = window.matchMedia('(min-width: 68rem)')
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

  /* ── Remember the reader's language choice ────────────────────────────── */
  var langLink = document.querySelector('[data-lang-switch]')
  if (langLink) {
    langLink.addEventListener('click', function () {
      try { localStorage.setItem('various:lang', langLink.getAttribute('data-lang-target') || '') } catch (e) {}
    })
  }

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
            { scaleX: 1, transformOrigin: 'inline-start center', duration: 0.5 }, '-=0.45')

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

      /* The signature rule draws itself from the reading edge. */
      gsap.utils.toArray('.section .rule').forEach(function (r) {
        gsap.fromTo(r, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: 'inline-start center', duration: 0.6, ease: EASE,
          scrollTrigger: { trigger: r, start: 'top 92%', once: true },
        })
      })

      /* Stat figures count up — but only ones that carry a real number. The
         pending em-dashes are left alone. */
      gsap.utils.toArray('[data-count]').forEach(function (el) {
        var target = Number(el.getAttribute('data-count'))
        if (!isFinite(target) || target <= 0) return
        var suffix = el.getAttribute('data-count-suffix') || ''
        var isArabic = document.documentElement.lang === 'ar'
        var obj = { v: 0 }
        gsap.to(obj, {
          v: target, duration: 1.4, ease: 'power1.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: function () { el.textContent = suffix + format(Math.round(obj.v), isArabic) },
        })
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

  /** Group thousands, and render Arabic-Indic digits on the Arabic edition. */
  function format(n, isArabic) {
    var s = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, isArabic ? '٬' : ',')
    return isArabic ? s.replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[Number(d)] }) : s
  }
})()
