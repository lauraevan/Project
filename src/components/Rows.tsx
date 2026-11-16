import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { img, list, titleOf, typeOf, yearOf, type Item } from '../lib/tmdb'

export function Row({
  title,
  path,
  variant,
  params,
}: {
  title: string
  path: string
  variant: 'wide' | 'poster'
  params?: Record<string, string>
}) {
  const q = useQuery({ queryKey: ['list', path, params], queryFn: () => list(path, params) })
  const items = (q.data ?? []).filter((i) => (variant === 'wide' ? i.backdrop_path : i.poster_path))

  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="scroller">
        {q.isPending &&
          Array.from({ length: 6 }, (_, n) => (
            <div key={n} className={`skeleton ${variant === 'wide' ? 'card-wide' : 'card-poster'}`} />
          ))}
        {items.map((i) => (
          <Card key={i.id} item={i} variant={variant} />
        ))}
        {q.isError && <p style={{ color: 'var(--fg-dim)' }}>Couldn&apos;t load this row.</p>}
      </div>
    </section>
  )
}

function Card({ item, variant }: { item: Item; variant: 'wide' | 'poster' }) {
  const type = typeOf(item)
  const to = { to: '/title/$type/$id' as const, params: { type, id: String(item.id) } }
  if (variant === 'wide') {
    return (
      <Link {...to} className="card-wide lift" style={{ backgroundImage: `url(${img(item.backdrop_path, 'w500')})` }}>
        <div className="glass card-cap">
          <span>{titleOf(item)}</span>
          <span>{yearOf(item)}</span>
        </div>
      </Link>
    )
  }
  return (
    <Link {...to} className="card-poster lift" style={{ backgroundImage: `url(${img(item.poster_path, 'w342')})` }}>
      <div className="poster-shade" />
      <span className="poster-title">{titleOf(item)}</span>
    </Link>
  )
}
