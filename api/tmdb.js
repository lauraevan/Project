// Server-side proxy for TMDB so the token stays secret. Used as a Vercel function (/api/tmdb)
// and by server.mjs on Render.
// Usage: /api/tmdb?path=/trending/all/week&language=en-US

const ALLOWED = [
  /^\/trending\/(all|movie|tv)\/(day|week)$/,
  /^\/(movie|tv)\/(popular|top_rated|now_playing|upcoming|on_the_air)$/,
  /^\/(movie|tv)\/\d+$/,
  /^\/(movie|tv)\/\d+\/(videos|credits|similar|recommendations|images)$/,
  /^\/tv\/\d+\/season\/\d+$/,
  /^\/search\/(multi|movie|tv)$/,
  /^\/discover\/(movie|tv)$/,
  /^\/genre\/(movie|tv)\/list$/,
]

export async function GET(request) {
  const token = process.env.TMDB_TOKEN
  if (!token) return json({ error: 'TMDB_TOKEN is not configured' }, 500)

  const incoming = new URL(request.url)
  const path = incoming.searchParams.get('path') ?? ''
  if (!ALLOWED.some((re) => re.test(path))) return json({ error: 'Path not allowed' }, 400)

  const upstream = new URL(`https://api.themoviedb.org/3${path}`)
  for (const [k, v] of incoming.searchParams) if (k !== 'path') upstream.searchParams.set(k, v)

  const res = await fetch(upstream, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
