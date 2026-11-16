import { MOVIE_SHELVES, TV_SHELVES } from '../lib/shelves'
import { ShelfList } from '../components/ShelfList'
import { Ambient } from '../components/Backdrop'

export function Browse({ kind }: { kind: 'movie' | 'tv' }) {
  return (
    <div className="page">
      <Ambient />
      <header className="page-head">
        <span className="eyebrow">Browse</span>
        <h1 className="display">{kind === 'movie' ? 'Films' : 'Series'}</h1>
      </header>
      <ShelfList key={kind} shelves={kind === 'movie' ? MOVIE_SHELVES : TV_SHELVES} />
    </div>
  )
}
