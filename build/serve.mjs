#!/usr/bin/env node
/**
 * Local preview that mirrors production's URL shape exactly: the site is served
 * under /various/, not at the root, so a subpath bug shows up here rather than
 * on the client's screen.
 *
 * It serves straight out of dist/ — no copying. A copied tree goes stale and
 * you end up verifying the wrong bytes (§7 of the deployment playbook).
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'

const DIST = new URL('../dist', import.meta.url).pathname
const PREFIX = '/various'
const PORT = Number(process.env.PORT || 8347)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.jpg':  'image/jpeg',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml',
  '.webmanifest': 'application/manifest+json',
}

createServer(async (req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0])

  if (!url.startsWith(PREFIX)) {
    res.writeHead(302, { Location: PREFIX + '/' }); return res.end()
  }
  let rel = url.slice(PREFIX.length) || '/'
  if (rel === '') rel = '/'

  // Refuse to escape dist/ — this is a dev server, but a traversal bug here
  // would happily read the rest of the filesystem.
  const safe = normalize(rel).replace(/^(\.\.[/\\])+/, '')
  let file = join(DIST, safe)

  try {
    let s = await stat(file).catch(() => null)
    if (s?.isDirectory()) {
      if (!rel.endsWith('/')) {
        res.writeHead(301, { Location: url + '/' }); return res.end()
      }
      file = join(file, 'index.html')
      s = await stat(file).catch(() => null)
    }
    if (!s?.isFile()) {
      // Deliberately an honest 404, like the real prefix (no SPA fallback).
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end('<h1>404</h1>')
    }
    const body = await readFile(file)
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file)] || 'application/octet-stream',
      'Content-Length': body.length,
      'Cache-Control': 'no-store',
    })
    res.end(body)
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end(String(err))
  }
}).listen(PORT, () => {
  console.log(`\n  Arabic   http://localhost:${PORT}${PREFIX}/`)
  console.log(`  English  http://localhost:${PORT}${PREFIX}/en/\n`)
})
