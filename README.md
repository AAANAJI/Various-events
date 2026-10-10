# VARIOUS for Events Services — website

A bilingual (Arabic / English) static site for **فاريوس لخدمات الفعاليات**,
built from the 2026 company profile and the client's approved copy deck.

Intended home: **https://staging.shfrah.com/various/**
(Arabic at that root, English at `/various/en/`.)

---

## Status

**Live** at https://staging.shfrah.com/various/ (English at `/various/en/`).

Every push to this branch redeploys it. The one-time setup below is done —
it is kept as the record of how, and for the next project on this host.

---

## Quick start

No dependencies, no bundler, no install step. Node 20+ only.

```sh
node build/build.mjs     # generate dist/
node build/check.mjs     # fail on broken or root-absolute links
node build/serve.mjs     # preview at http://localhost:8347/various/
```

`npm run dev` does all three.

The preview server deliberately serves under `/various/`, the same subpath as
production, so a path bug shows up locally instead of on a client's screen.

---

## The one-time setup (done)

### 1. The three repository secrets

Set at **Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `SSH_HOST` | the staging server's IP or hostname |
| `SSH_USER` | `deploy` |
| `SSH_PRIVATE_KEY` | the full private key, **including** the `-----BEGIN…` / `-----END…` lines *and* a trailing newline |

`SSH_PRIVATE_KEY` accepts either the raw PEM or a single base64 line. Prefer
base64: it is one unbroken string, which is far easier to copy correctly off a
phone terminal, and it makes `Load key: error in libcrypto` — a PEM pasted
without its trailing newline — impossible. The workflow takes the longest run of
base64 characters in the secret, so banner text copied along with the key is
absorbed rather than breaking the deploy.

### 2. The target directory

The deploy user cannot create top-level directories under `/var/www/staging/`,
so this needed one run as root. `scripts/server-setup.sh` does it, along with
generating and authorising the CI key:

```sh
curl -fsSL https://raw.githubusercontent.com/AAANAJI/Various-events/claude/events-site-design-staging-u5jac0/scripts/server-setup.sh -o s.sh
less s.sh          # read it before running it
sudo bash s.sh
```

The workflow probes the directory before letting `rsync --delete` near it, so a
missing or unwritable directory reports itself rather than failing with a bare
permission error.

### Motion

GSAP 3.15 with ScrollTrigger, self-hosted in `assets/js/` rather than pulled
from a CDN — no third-party request, and the checksum sweep can verify it like
any other file. 123KB, about 46KB over the wire once gzipped.

It is strictly a layer on top. Three guards have to hold before anything is
hidden: the visitor has not asked for reduced motion, an inline script has set
`js` on `<html>` before first paint, and `site.js` has confirmed GSAP actually
loaded — it removes `js` again if it did not. A blocked script, a failed asset
and a reduced-motion preference therefore all land on the same outcome:
everything visible, nothing animated.

One trap worth recording. Because the stylesheet pre-hides the animated
elements, `gsap.from()` is wrong here — it animates *from* a value *to whatever
the element currently is*, which is `opacity: 0`, so it animates 0 → 0 and the
page stays blank. Every tween states its end values explicitly with `fromTo()`.

### Verified on the live server

Measured after the first successful deploy (run #11):

- **No SPA fallback on this prefix.** A missing path returns a genuine 404 of
  162 bytes, so status codes here are trustworthy — which is what pre-rendering
  a directory per route buys, and it makes every later diagnosis easier.
- **All 117 files byte-identical** to the local build, by md5.
- `css/site.css` → `text/css`, `.woff2` → `font/woff2`, `.svg` → `image/svg+xml`,
  `.jpg` → `image/jpeg`. The silent font-fallback trap is not present here.
- Both editions and deep links in both languages resolve, and the cross-language
  switch on a depth-3 page resolves to a real page.

A headless browser could not be used against the live URL: this environment's
proxy resets the browser's TLS tunnel even though `curl` succeeds. The browser
suite therefore ran against the local copy, which the checksum sweep proves is
byte-identical to what the server returns.

### Re-checking after a future deploy

Status codes cannot be fully trusted on every prefix of this host — some have an
nginx SPA fallback that answers missing files with `200` and a small HTML shell.
This prefix does not, but confirm it again if the server config ever changes:

```sh
curl -s -o /dev/null -w '%{http_code} %{size_download}b %{content_type}\n' \
  "https://staging.shfrah.com/various/this-does-not-exist-$RANDOM"
# expect: 404 — status codes on this prefix are then trustworthy
```

Then check the two things that fail silently:

```sh
# Fonts. A wrong type still renders on most browsers but falls back to a system
# font on some, with nothing in the console.
curl -sI https://staging.shfrah.com/various/assets/fonts/IBMPlexSansArabic-400.woff2 | grep -i content-type
# expect: font/woff2

# The stylesheet actually arrived. If this returns text/html, the page will
# render as unstyled black-on-white Times New Roman.
curl -s -o /dev/null -w '%{http_code} %{size_download}b %{content_type}\n' \
  https://staging.shfrah.com/various/css/site.css
# expect: 200, ~54000b, text/css
```

Finally, open `/various/` and `/various/en/work/ministry-of-culture/` and confirm both
render fully styled, in the right reading direction.

---

## The company profile (PDF)

The printed profile is generated from the same `content/` files as the website,
so the two cannot disagree.

```sh
node profile/build.mjs    # dist-profile/{ar,en}/index.html
node profile/export.mjs   # dist-profile/VARIOUS-Profile-2026-{AR,EN}.pdf
```

`export.mjs` needs Playwright with Chromium (resolved from `node_modules` or the
global install); the website itself still needs nothing. Two editions, Arabic
and English, 45 landscape pages each at 1280×720: cover, contents, five chapters
each opening on a divider page, and one closing page. The contents, the
dividers, every page footer and the client list are internal links in the PDF.
Project pages put the text on one half and the photograph on the other,
alternating, with a slot for the client's logo.

`dist-profile/` is generated and not committed.

---

## Content still awaiting confirmation

The copy is the client's approved copy deck (2026 revision). Nothing is
invented; where the deck has a gap, the site leaves it out rather than filling
it.

**Figures** — `content/stats.mjs` is the only file to edit. Two are published,
both stated in the copy deck: 160+ events and exhibitions, 100+ clients. Team
size, founding year and m² fabricated are still outstanding (copy deck B1–B3);
add an entry and it renders.

**Project photographs** — 11 of the 22 projects have photographs. The other 11
render a branded panel (the star on navy, with the client's name) in place of
the photo, so nothing reads as broken. Drop a JPEG into `assets/img/` as
`<name>-<width>.jpg` and set `image:` in `content/projects.mjs`.

**Client logos** — the roster is set typographically until vector logos
(AI/EPS/SVG) are supplied, together with each government entity's permission
to use its logo (copy deck E2).

**Social URLs** — the copy deck gives handles only. Instagram and X are
unambiguous; LinkedIn is linked as a company page and YouTube as an
`@handle`, the platforms' current defaults. Confirm both.

**Project films** — no YouTube links per project yet (copy deck F3).

---

## How it is put together

```
content/     the words. Every string is an { ar, en } pair.
build/       the generator. Zero dependencies.
src/css/     tokens → base → layout → components, concatenated in that order.
src/js/      progressive enhancement only; every page works without it.
assets/      fonts, photographs, logos — the source of truth, copied verbatim.
scripts/     one-time server setup.
dist/        generated output. Not committed.
```

### Information architecture

34 routes per language, 68 pages. The homepage is deliberately short: it says
what VARIOUS is, shows what it does and three projects, and sends the visitor
into the section they want. The detail lives on the page that owns it.

```
/                               home — short, an index into the rest
/about/                         who we are, and the figures
  /about/vision/                vision and mission
  /about/values/                the five values
/services/                      the kinds of event we deliver
  /services/solutions/          14 disciplines, every item listed
  /services/exhibition-owners/  8 service groups for show organisers
/process/                       how we work — the five steps, as a path
/work/                          the portfolio, in three categories
  /work/<slug>/                 one page per project  (22)
/clients/                       the client roster, linked to the work
/contact/                       phone & WhatsApp, email, social
```

`nav` in `content/site.mjs` is the single source for the menu, the section
sub-navigation and the footer columns. The menu is CSS-only — sub-menus open
on hover **and** on `:focus-within`, so every item is keyboard-reachable with
no JavaScript at all.

### Two rules that govern everything

**Every path is relative.** The site is served from a subpath, so a single
root-absolute `/assets/…` URL would resolve outside the deployment and 404 —
the classic unstyled-Times-New-Roman failure. `build/lib.mjs` computes a `../`
ladder from each page's own depth, and `build/check.mjs` fails the build if one
slips in. The site therefore works at any subpath, or at a domain root, with no
configuration change.

**Every route is a real directory** with its own `index.html`, so nginx's
default directory index resolves it. No `try_files` rewrite is needed, which
means the prefix stays honest: an unknown URL returns a true 404 rather than a
200 serving a shell, and any later diagnosis can trust status codes.

### Design

Follows the profile's own system, «منظومة الوقفة» / The Pause System: navy
ground, full-bleed photography under a gradient scrim, the 56×3 lime-to-green
rule opening each statement, and the five-point star constellation bled off a
corner as a watermark. One typeface — IBM Plex Sans Arabic, self-hosted —
covers Arabic and Latin, so both editions are typographically identical.

**Light and dark.** Dark is the default, as in the profile; the switch in the
masthead turns the light theme on and remembers it. Every colour is a token in
`tokens.css`, set per theme, and `.scope-dark` re-declares the dark set on the
things that stay dark in both — photographic heroes, the pause bands, the call
to action and the footer. A saved choice is applied by an inline script before
first paint, so there is no flash.

**The logo** is shown exactly as drawn — wordmark, then the mark to its right,
no plate, no shadow — and that lockup never mirrors.

**Western digits everywhere**, in Arabic too, so the website and the printed
profile agree.

### Bilingual mechanics

Arabic at the root, English under `/en/`. Every route exists in both;
`check.mjs` fails the build if one is missing.

**One layout for both languages.** By the client's instruction, switching
language must not move anything: every block keeps its place and only the text
inside it changes direction. So `body` is laid out right-to-left in both
editions, and in English (`base.css`):

- a **text group** (`.tb` — a heading with its lead, a hero's copy) reads LTR
  inside but shrinks to its content, so the group stays on the same side of the
  page as its Arabic twin;
- a **boxed component** (a card, a tile, a contact block) keeps its box, and
  its copy reads LTR;
- grids, rows and lists keep the shared geometry, so the order of elements is
  identical too.

`<html dir>` still states the language's true direction. The language switch
also remembers which section you were reading and restores it on the other
edition.

Layout still uses logical properties only (`check.mjs` enforces it): the text
leaves that turn LTR in English carry their padding and borders with them.

**Each edition is single-language**, and there is no section numbering —
except on `/process/`, where the five steps are a sequence and are drawn as a
connected path, each station joined to the next by an arrow pointing down.

Latin numeral runs — phone numbers, email, handles — carry explicit LTR
isolation, or the bidi algorithm moves the leading `+` to the end and
`+966 55 051 1403` renders as `1403 051 55 966+`.

### Motion

GSAP 3.15 with ScrollTrigger, self-hosted in `assets/js/` rather than pulled
from a CDN — no third-party request, and the checksum sweep can verify it like
any other file.

It is strictly a layer on top. Three guards have to hold before anything is
hidden: the visitor has not asked for reduced motion, an inline script has set
`js` on `<html>` before first paint, and `site.js` has confirmed GSAP actually
loaded — it removes `js` again if it did not. A blocked script, a failed asset
and a reduced-motion preference therefore all land on the same outcome:
everything visible, nothing animated.

One trap worth recording. Because the stylesheet pre-hides the animated
elements, `gsap.from()` is wrong here — it animates *from* a value *to whatever
the element currently is*, which is `opacity: 0`, so it animates 0 → 0 and the
page stays blank. Every tween states its end values explicitly with `fromTo()`.

### Verified

`build/check.mjs` enforces six invariants and fails the build on any of them:
no root-absolute URLs, no dead links, no dead `srcset` candidates, no physical
CSS properties, `lang`/`dir`/`noindex`/`<title>` on every page, and both
language editions of every route.

Against a real browser, all 68 pages at 390px and 1280px, in both themes:
no console errors, no failed requests, no broken images, no horizontal
overflow, and all text outside the photo heroes at WCAG AA contrast. The mobile
menu opens over a scrolled page with its close button on top, at 390px and
320px.

### Staging hygiene

Every page is served `noindex, nofollow`, with a matching `robots.txt`. A
preview carrying a client's name should not be indexable. **Remove both before
any production launch.**
