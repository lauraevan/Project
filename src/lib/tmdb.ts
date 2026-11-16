// TMDB client. All requests go through /api/tmdb, which adds the secret token server-side.

export type MediaType = 'movie' | 'tv'

export interface Item {
  id: number
  media_type?: string
  title?: string
  name?: string
  overview: string
  backdrop_path: string | null
  poster_path: string | null
  vote_average: number
  release_date?: string
  first_air_date?: string
  genre_ids?: number[]
}

export interface Video {
  key: string
  site: string
  type: string
  name: string
  official: boolean
}

export interface Detail extends Item {
  tagline?: string
  runtime?: number
  episode_run_time?: number[]
  number_of_seasons?: number
  vote_count?: number
  status?: string
  original_language?: string
  genres: { id: number; name: string }[]
  seasons?: { season_number: number; name: string; episode_count: number }[]
  videos?: { results: Video[] }
  credits?: { cast: { id: number; name: string; character: string; profile_path: string | null }[] }
}

export interface Episode {
  id: number
  episode_number: number
  name: string
  overview: string
  still_path: string | null
  runtime: number | null
  air_date: string | null
}

export async function tmdb<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const qs = new URLSearchParams({ path, language: 'en-US', ...params })
  const res = await fetch(`/api/tmdb?${qs}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? body.status_message ?? `TMDB request failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

export const list = (path: string, params: Record<string, string> = {}) =>
  tmdb<{ results: Item[] }>(path, params).then((r) => r.results)

export const detail = (type: MediaType, id: string | number) =>
  tmdb<Detail>(`/${type}/${id}`, { append_to_response: 'videos,credits' })

export const season = (id: string | number, n: number) =>
  tmdb<{ episodes: Episode[] }>(`/tv/${id}/season/${n}`).then((r) => r.episodes)

export const search = (query: string) =>
  tmdb<{ results: Item[] }>('/search/multi', { query, include_adult: 'false' }).then((r) =>
    r.results.filter((i) => i.media_type !== 'person' && (i.poster_path || i.backdrop_path)),
  )

export async function genres(): Promise<Map<number, string>> {
  const [m, t] = await Promise.all([
    tmdb<{ genres: { id: number; name: string }[] }>('/genre/movie/list'),
    tmdb<{ genres: { id: number; name: string }[] }>('/genre/tv/list'),
  ])
  return new Map([...m.genres, ...t.genres].map((g) => [g.id, g.name]))
}

// Best English title-treatment logo (transparent PNG), if the title has one.
export async function logo(type: MediaType, id: number): Promise<string | null> {
  const r = await tmdb<{ logos: { file_path: string; iso_639_1: string | null; vote_average: number }[] }>(
    `/${type}/${id}/images`,
    { include_image_language: 'en,null' },
  )
  const best = r.logos
    .filter((l) => l.file_path && !l.file_path.endsWith('.svg'))
    .sort((a, b) => Number(b.iso_639_1 === 'en') - Number(a.iso_639_1 === 'en') || b.vote_average - a.vote_average)[0]
  return best?.file_path ?? null
}

type Size = 'w185' | 'w300' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original'
export const img = (path: string | null | undefined, size: Size = 'w780') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : undefined

export const titleOf = (i: Item) => i.title ?? i.name ?? 'Untitled'
export const yearOf = (i: Item) => (i.release_date ?? i.first_air_date ?? '').slice(0, 4)
export const typeOf = (i: Item): MediaType => (i.media_type === 'tv' || (!i.title && i.name) ? 'tv' : 'movie')
export const ratingOf = (i: Item) => (i.vote_average > 0 ? i.vote_average.toFixed(1) : '')

export function pickTrailer(videos?: Video[]): Video | undefined {
  const yt = (videos ?? []).filter((v) => v.site === 'YouTube')
  return (
    yt.find((v) => v.type === 'Trailer' && v.official) ??
    yt.find((v) => v.type === 'Trailer') ??
    yt.find((v) => v.type === 'Teaser')
  )
}
