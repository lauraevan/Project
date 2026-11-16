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
  genres: { id: number; name: string }[]
  videos?: { results: Video[] }
  credits?: { cast: { id: number; name: string; character: string; profile_path: string | null }[] }
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

export const detail = (type: MediaType, id: string) =>
  tmdb<Detail>(`/${type}/${id}`, { append_to_response: 'videos,credits' })

export const img = (path: string | null, size: 'w342' | 'w500' | 'w780' | 'w1280' | 'original' = 'w780') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : undefined

export const titleOf = (i: Item) => i.title ?? i.name ?? 'Untitled'
export const yearOf = (i: Item) => (i.release_date ?? i.first_air_date ?? '').slice(0, 4)
export const typeOf = (i: Item): MediaType => (i.media_type === 'tv' || (!i.title && i.name) ? 'tv' : 'movie')

export function pickTrailer(videos?: Video[]): Video | undefined {
  const yt = (videos ?? []).filter((v) => v.site === 'YouTube')
  return (
    yt.find((v) => v.type === 'Trailer' && v.official) ??
    yt.find((v) => v.type === 'Trailer') ??
    yt.find((v) => v.type === 'Teaser')
  )
}
