// Production server for hosts like Render: serves the built app and the /api/tmdb proxy.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { GET } from './api/tmdb.js'

const dist = fileURLToPath(new URL('./dist', import.meta.url))
const port = Number(process.env.PORT) || 3000

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
}

async function serveFile(res, file, immutable) {
  const body = await readFile(file)
  res.writeHead(200, {
    'Content-Type': types[extname(file)] ?? 'application/octet-stream',
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  res.end(body)
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)

    if (url.pathname === '/api/tmdb') {
      if (req.method !== 'GET') { res.writeHead(405).end(); return }
      const r = await GET(new Request(url))
      res.writeHead(r.status, Object.fromEntries(r.headers))
      res.end(Buffer.from(await r.arrayBuffer()))
      return
    }

    const safe = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '')
    const file = join(dist, safe)
    if (file.startsWith(dist) && (await stat(file).then((s) => s.isFile()).catch(() => false))) {
      return await serveFile(res, file, safe.startsWith('/assets/'))
    }
    await serveFile(res, join(dist, 'index.html'), false) // SPA fallback
  } catch (err) {
    console.error(err)
    res.writeHead(500, { 'Content-Type': 'application/json' }).end('{"error":"Server error"}')
  }
}).listen(port, () => console.log(`Lumen listening on :${port}`))
