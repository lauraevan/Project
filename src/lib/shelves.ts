// Shelf definitions. Rows beyond the first few load lazily as you scroll (see ShelfList).
import type { CardVariant } from '../components/MediaCard'

export interface Shelf {
  title: string
  variant: CardVariant
  path: string
  params?: Record<string, string>
  eyebrow?: string
}

const discover = (kind: 'movie' | 'tv', genre: string, extra: Record<string, string> = {}) => ({
  path: `/discover/${kind}`,
  params: { with_genres: genre, sort_by: 'popularity.desc', 'vote_count.gte': '200', ...extra },
})

export const HOME_SHELVES: Shelf[] = [
  { title: 'Top 10 this week', variant: 'top10', path: '/trending/all/week', eyebrow: 'Trending' },
  { title: 'Popular films', variant: 'poster', path: '/movie/popular' },
  { title: 'Top rated series', variant: 'wide', path: '/tv/top_rated', eyebrow: 'Critically acclaimed' },
  { title: 'In theatres', variant: 'poster', path: '/movie/now_playing', eyebrow: 'Now playing' },
  { title: 'On the air', variant: 'wide', path: '/tv/on_the_air', eyebrow: 'New episodes' },
  { title: 'Science fiction', variant: 'poster', ...discover('movie', '878') },
  { title: 'Crime series', variant: 'wide', ...discover('tv', '80') },
  { title: 'Laugh out loud', variant: 'poster', ...discover('movie', '35') },
  { title: 'Action and adventure', variant: 'wide', ...discover('movie', '28') },
  { title: 'Animation', variant: 'poster', ...discover('movie', '16') },
  { title: 'Documentaries', variant: 'wide', ...discover('tv', '99') },
  { title: 'Mystery and thriller', variant: 'poster', ...discover('movie', '53') },
  { title: 'Horror', variant: 'wide', ...discover('movie', '27') },
  { title: 'Family night', variant: 'poster', ...discover('movie', '10751') },
  { title: 'Romance', variant: 'wide', ...discover('movie', '10749') },
  { title: 'Sci-fi and fantasy series', variant: 'poster', ...discover('tv', '10765') },
  { title: 'Kids and animation', variant: 'wide', ...discover('tv', '16') },
  { title: 'Coming soon', variant: 'poster', path: '/movie/upcoming', eyebrow: 'In cinemas soon' },
  { title: 'Trending films today', variant: 'wide', path: '/trending/movie/day' },
  { title: 'Trending series today', variant: 'poster', path: '/trending/tv/day' },
]

export const MOVIE_SHELVES: Shelf[] = [
  { title: 'Popular', variant: 'top10', path: '/movie/popular' },
  { title: 'In theatres', variant: 'wide', path: '/movie/now_playing' },
  { title: 'Top rated', variant: 'poster', path: '/movie/top_rated' },
  { title: 'Coming soon', variant: 'wide', path: '/movie/upcoming' },
  { title: 'Action and adventure', variant: 'poster', ...discover('movie', '28') },
  { title: 'Science fiction', variant: 'wide', ...discover('movie', '878') },
  { title: 'Comedy', variant: 'poster', ...discover('movie', '35') },
  { title: 'Thriller', variant: 'wide', ...discover('movie', '53') },
  { title: 'Animation', variant: 'poster', ...discover('movie', '16') },
  { title: 'Horror', variant: 'wide', ...discover('movie', '27') },
  { title: 'Drama', variant: 'poster', ...discover('movie', '18') },
  { title: 'Family', variant: 'wide', ...discover('movie', '10751') },
  { title: 'Romance', variant: 'poster', ...discover('movie', '10749') },
  { title: 'Fantasy', variant: 'wide', ...discover('movie', '14') },
  { title: 'Documentary', variant: 'poster', ...discover('movie', '99') },
]

export const TV_SHELVES: Shelf[] = [
  { title: 'Popular', variant: 'top10', path: '/tv/popular' },
  { title: 'On the air', variant: 'wide', path: '/tv/on_the_air' },
  { title: 'Top rated', variant: 'poster', path: '/tv/top_rated' },
  { title: 'Crime', variant: 'wide', ...discover('tv', '80') },
  { title: 'Drama', variant: 'poster', ...discover('tv', '18') },
  { title: 'Sci-fi and fantasy', variant: 'wide', ...discover('tv', '10765') },
  { title: 'Comedy', variant: 'poster', ...discover('tv', '35') },
  { title: 'Action and adventure', variant: 'wide', ...discover('tv', '10759') },
  { title: 'Mystery', variant: 'poster', ...discover('tv', '9648') },
  { title: 'Animation', variant: 'wide', ...discover('tv', '16') },
  { title: 'Documentary', variant: 'poster', ...discover('tv', '99') },
  { title: 'Kids', variant: 'wide', ...discover('tv', '10762') },
]
