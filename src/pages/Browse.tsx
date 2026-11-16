import { Row } from '../components/Rows'
import { Ambient } from '../components/Backdrop'

export function Browse({ kind }: { kind: 'movie' | 'tv' }) {
  const rows: [string, string, 'wide' | 'poster' | 'top10'][] =
    kind === 'movie'
      ? [
          ['Popular', '/movie/popular', 'top10'],
          ['In theatres', '/movie/now_playing', 'wide'],
          ['Top rated', '/movie/top_rated', 'poster'],
          ['Coming soon', '/movie/upcoming', 'wide'],
        ]
      : [
          ['Popular', '/tv/popular', 'top10'],
          ['On the air', '/tv/on_the_air', 'wide'],
          ['Top rated', '/tv/top_rated', 'poster'],
        ]

  return (
    <div className="page">
      <Ambient />
      <header className="page-head">
        <span className="eyebrow">Browse</span>
        <h1 className="display">{kind === 'movie' ? 'Films' : 'Series'}</h1>
      </header>
      {rows.map(([title, path, variant]) => (
        <Row key={path} title={title} path={path} variant={variant} />
      ))}
    </div>
  )
}
