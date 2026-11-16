import { Row } from '../components/Rows'

export function Browse({ kind }: { kind: 'movie' | 'tv' }) {
  const rows =
    kind === 'movie'
      ? [
          ['Popular', '/movie/popular'],
          ['Top rated', '/movie/top_rated'],
          ['In theatres', '/movie/now_playing'],
          ['Coming soon', '/movie/upcoming'],
        ]
      : [
          ['Popular', '/tv/popular'],
          ['Top rated', '/tv/top_rated'],
          ['On the air', '/tv/on_the_air'],
        ]

  return (
    <div style={{ paddingTop: 130, paddingBottom: 100 }}>
      <h1 style={{ margin: '0 56px', fontSize: 56, letterSpacing: '-0.04em' }}>{kind === 'movie' ? 'Films' : 'Series'}</h1>
      {rows.map(([title, path], n) => (
        <Row key={path} title={title} path={path} variant={n % 2 === 0 ? 'poster' : 'wide'} />
      ))}
    </div>
  )
}
