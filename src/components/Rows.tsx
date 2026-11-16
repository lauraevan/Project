import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { list, type Item } from '../lib/tmdb'
import { MediaCard, type CardVariant } from './MediaCard'
import { ChevronIcon } from './Icons'

interface RowProps {
  title: string
  variant: CardVariant
  path?: string
  params?: Record<string, string>
  items?: Item[]
  eyebrow?: string
}

export function Row({ title, variant, path, params, items, eyebrow }: RowProps) {
  const q = useQuery({
    queryKey: ['list', path, params],
    queryFn: () => list(path!, params),
    enabled: !!path && !items,
  })
  const scroller = useRef<HTMLDivElement>(null)

  const source = items ?? q.data ?? []
  const shown = source
    .filter((i) => (variant === 'wide' ? i.backdrop_path || i.poster_path : i.poster_path || i.backdrop_path))
    .slice(0, variant === 'top10' ? 10 : 20)

  if (items && shown.length === 0) return null

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.82, behavior: 'smooth' })
  }

  return (
    <motion.section
      className="row"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="row-head">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
        </div>
        <div className="row-arrows">
          <button className="glass icon-btn press" aria-label={`Scroll ${title} left`} onClick={() => scrollBy(-1)}>
            <ChevronIcon dir="left" width={18} height={18} />
          </button>
          <button className="glass icon-btn press" aria-label={`Scroll ${title} right`} onClick={() => scrollBy(1)}>
            <ChevronIcon dir="right" width={18} height={18} />
          </button>
        </div>
      </div>
      <div className="scroller" ref={scroller}>
        {q.isPending && !items &&
          Array.from({ length: 8 }, (_, n) => (
            <div key={n} className={`skeleton ${variant === 'wide' ? 'card-wide' : 'card-poster'}`} />
          ))}
        {shown.map((i, n) => (
          <MediaCard key={`${i.id}-${n}`} item={i} variant={variant} rank={n + 1} />
        ))}
        {q.isError && <p className="muted">Couldn&apos;t load this row.</p>}
      </div>
    </motion.section>
  )
}
