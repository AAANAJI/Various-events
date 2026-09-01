# VARIOUS for Events Services — website

A bilingual (Arabic / English) static site for **فاريوس لخدمات الفعاليات**,
built from the 2026 company profile deck.

Intended home: **https://staging.shfrah.com/various/**
(Arabic at that root, English at `/various/en/`.)

---

## Status

The site is complete and verified. **It is not yet live** — two things are
needed that only someone with server and repository access can do. See
[Before it can deploy](#before-it-can-deploy).

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

## Before it can deploy

Both were confirmed by an actual CI run
([run #1](https://github.com/AAANAJI/Various-events/actions)) — the build and
link check passed; the deploy stopped at the server probe.

### 1. The three repository secrets are not set

The CI log shows all three resolving to empty strings. Set them at
**Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `SSH_HOST` | the staging server's IP or hostname |
| `SSH_USER` | `deploy` |
| `SSH_PRIVATE_KEY` | the full private key, **including** the `-----BEGIN…` / `-----END…` lines *and* a trailing newline |

A key pasted without its trailing newline is the usual cause of
`Load key: error in libcrypto`.

### 2. The target directory does not exist

`https://staging.shfrah.com/various/` currently returns a genuine 404, and the
deploy user cannot create top-level directories. Someone with root runs, once:

```sh
install -d -o deploy -g deploy /var/www/staging/various
```

Once both are done, push to this branch (or use **Run workflow**) and the deploy
runs unattended. The workflow probes the directory before letting `rsync
--delete` near it, so a missing directory reports itself rather than failing
with a bare permission error.

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

Against a real browser, on every page in both languages:

- 40 pages crawled: no console errors, no failed requests, no broken images, no
  horizontal overflow, exactly one `h1` each
- Zero root-absolute links, zero dead links, zero dead `srcset` candidates
- All text meets WCAG AA contrast (the alphas in `tokens.css` are set from
  measured ratios, not by eye)
- Skip link takes the first Tab; mobile menu opens, closes on Escape and returns
  focus to its trigger
- Every image carries alt text and intrinsic dimensions, so nothing shifts as
  photographs load
- Total HTML across all 42 pages: 0.47 MB

### Staging hygiene

Every page is served `noindex, nofollow`, with a matching `robots.txt`. A
preview carrying a client's name should not be indexable. **Remove both before
any production launch.**
