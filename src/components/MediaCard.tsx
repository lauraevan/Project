import type { PointerEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { img, titleOf, typeOf, yearOf, ratingOf, type Item } from '../lib/tmdb'
import { FadeImg } from './FadeImg'
import { StarIcon } from './Icons'

// tvOS-style focus: the card tilts toward the pointer and a specular highlight follows it.
function useTilt() {
  return {
    onPointerMove(e: PointerEvent<HTMLElement>) {
      if (e.pointerType !== 'mouse') return
      const el = e.currentTarget
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      el.style.setProperty('--ry', `${(px - 0.5) * 11}deg`)
      el.style.setProperty('--rx', `${(0.5 - py) * 11}deg`)
      el.style.setProperty('--gx', `${px * 100}%`)
      el.style.setProperty('--gy', `${py * 100}%`)
    },
    onPointerLeave(e: PointerEvent<HTMLElement>) {
      const el = e.currentTarget
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    },
  }
}

export type CardVariant = 'wide' | 'poster' | 'top10'

export function MediaCard({ item, variant, rank }: { item: Item; variant: CardVariant; rank?: number }) {
  const tilt = useTilt()
  const type = typeOf(item)
  const wide = variant === 'wide'
  const src = wide ? img(item.backdrop_path ?? item.poster_path, 'w500') : img(item.poster_path ?? item.backdrop_path, 'w342')

  const card = (
    <Link
      to="/title/$type/$id"
      params={{ type, id: String(item.id) }}
      className={`card tilt ${wide ? 'card-wide' : 'card-poster'}`}
      aria-label={`${titleOf(item)}${yearOf(item) ? `, ${yearOf(item)}` : ''}`}
      {...tilt}
    >
      <FadeImg src={src} />
      <span className="glare" />
      {wide ? (
        <div className="glass card-cap">
          <span className="cap-title">{titleOf(item)}</span>
          <span className="cap-meta">
            {ratingOf(item) && (
              <>
                <StarIcon /> {ratingOf(item)}
              </>
            )}
            {yearOf(item) && <span>{yearOf(item)}</span>}
          </span>
        </div>
      ) : (
        <>
          <div className="poster-shade" />
          <span className="poster-title">{titleOf(item)}</span>
        </>
      )}
    </Link>
  )

  if (variant !== 'top10') return card
  return (
    <div className="top-item">
      <span className="rank" aria-hidden="true">
        {rank}
      </span>
      {card}
    </div>
  )
}
