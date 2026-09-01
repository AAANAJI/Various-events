# VARIOUS for Events Services — website

A bilingual (Arabic / English) static site for **فاريوس لخدمات الفعاليات**,
built from the 2026 company profile deck.

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
# expect: 200, ~32000b, text/css
```

Finally, open `/various/` and `/various/en/work/saudi-cup/` and confirm both
render fully styled, in the right reading direction.

---

## Content still awaiting confirmation

Nothing in this repository is invented. Where the source deck carried a
placeholder, the value is `null` and the template omits the field entirely.

**The six figures** — `content/stats.mjs` is the only file to edit. Set a number
and its tile renders; leave it `null` and the tile shows a neutral em-dash with
its label intact, so the section never looks broken. Five are pending:

- years of experience · events & exhibitions delivered · government & private
  clients · m² of stands fabricated · specialists on the team

*Sectors served* is already filled in at 9, derived from the nine sectors the
deck itself lists.

**Per-project years and locations** — `content/projects.mjs`. The deck printed
the literal words «السنة» / «الموقع» / «الدورة» alongside a «للاعتماد»
(to be confirmed) marker for most projects. Only the four it actually stated are
present: Boulevard City Riyadh, Clock Tower Makkah, Hayat Mall Riyadh, Sinclair
Riyadh, plus the Media Excellence Award's fifth edition.

**Project films** — the deck states that every project has a documentary film on
the company's YouTube channel, and its project slides carry a «التوثيق: فيلم
يوتيوب + أرشيف صور» field plus a note about per-project QR codes. No channel or
video URLs were supplied, so no links are published and that metadata field is
omitted. Supply the URLs and each project page can carry its film.

**Also flagged in the deck itself**

- Founders' names and titles — «تأكيد الأسماء والمسميات» on the founders' slide.
- The website domain — the deck marks `variouseventsksa.com` «تأكيد النطاق»,
  and it does not match the email domain `variousevent.com`.
- Client logos — the deck's client slide is a logo grid awaiting artwork. No
  logo files were supplied, so the names are set typographically instead.

---

## How it is put together

```
content/     the words. Every string is an { ar, en } pair.
build/       the generator. Zero dependencies.
src/css/     tokens → base → layout → components, concatenated in that order.
src/js/      progressive enhancement only; every page works without it.
assets/      fonts, photographs, logos — the source of truth, copied verbatim.
dist/        generated output. Not committed.
```

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

Follows the deck's own system, «منظومة الوقفة» / The Pause System: navy ground,
full-bleed photography under a gradient scrim, the 56×3 lime-to-green rule
opening each statement, Arabic-Indic section numerals, and the five-point star
constellation bled off a corner as a watermark.

Arabic leads and English echoes beneath it; on the English edition the roles
swap. One typeface — IBM Plex Sans Arabic, self-hosted, extracted from the deck —
covers Arabic, Latin *and* Arabic-Indic digits, so both editions are
typographically identical.

### Bilingual mechanics

Arabic RTL at the root, English LTR under `/en/`. Every route exists in both;
`check.mjs` fails the build if one is missing. Layout uses CSS logical
properties throughout, so a single stylesheet serves both directions with no
mirrored overrides.

Two bidi rules the code depends on:

- The `dir` attribute goes on an **inline span**, never on the block. A block
  with `dir="ltr"` inside an RTL page resolves `text-align: start` to the left
  edge, tearing every English line away from the Arabic above it.
- Latin numeral runs — phone numbers, the CR number — need explicit LTR
  isolation, or the bidi algorithm moves the leading `+` to the end and
  `+966 55 051 1403` renders as `1403 051 55 966+`.

### Verified

`build/check.mjs` enforces six invariants and fails the build on any of them:
no root-absolute URLs, no dead links, no dead `srcset` candidates, no physical
CSS properties (see the bidi note above — one stylesheet serves both
directions), `lang`/`dir`/`noindex`/`<title>` on every page, and both language
editions of every route.

Against a real browser, on every page in both languages:

- 40 pages crawled: no console errors, no failed requests, no broken images, no
  horizontal overflow, exactly one `h1` each, no skipped heading levels
- Fourteen viewport widths from 320px to 1920px: no overflow, no text under 12px
- All text meets WCAG AA contrast — the alphas in `tokens.css` are set from
  measured ratios, not by eye
- No photograph renders above 1.3× its real pixel width at any viewport
- Skip link takes the first Tab; the mobile menu opens, closes on Escape and
  returns focus to its trigger
- Every image carries alt text and intrinsic dimensions, so nothing shifts as
  photographs load; the above-the-fold image is preloaded with `imagesizes`
  matched to its `sizes`, so nothing is fetched twice
- Works with JavaScript blocked and with `prefers-reduced-motion`: nothing is
  hidden in either case, and the masthead is opaque rather than transparent
- No scroll handlers ship at all
- Total HTML across all 42 pages: 0.48 MB

### Staging hygiene

Every page is served `noindex, nofollow`, with a matching `robots.txt`. A
preview carrying a client's name should not be indexable. **Remove both before
any production launch.**
