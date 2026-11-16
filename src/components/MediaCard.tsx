import type { PointerEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { img, titleOf, typeOf, yearOf, ratingOf, type Item } from '../lib/tmdb'
import { FadeImg } from './FadeImg'
import { StarIcon } from './Icons'

// tvOS-style focus: the artwork tilts toward the pointer and a specular highlight follows it.
// Glass is reserved for chrome (nav, controls, panels); the artwork itself stays clean.
function useTilt() {
  return {
    onPointerMove(e: PointerEvent<HTMLElement>) {
      if (e.pointerType !== 'mouse') return
      const el = e.currentTarget
      const art = el.querySelector('.card')
      if (!art) return
      const r = art.getBoundingClientRect()
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
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

interface Props {
  item: Item
  variant: CardVariant
  rank?: number
  /** Show title + year underneath. Defaults on for wide cards. */
  meta?: boolean
}

export function MediaCard({ item, variant, rank, meta }: Props) {
  const tilt = useTilt()
  const type = typeOf(item)
  const wide = variant === 'wide'
  const showMeta = meta ?? wide
  const src = wide ? img(item.backdrop_path ?? item.poster_path, 'w500') : img(item.poster_path ?? item.backdrop_path, 'w342')

  const tile = (
    <Link
      to="/title/$type/$id"
      params={{ type, id: String(item.id) }}
      className={`tile ${wide ? 'tile-wide' : 'tile-poster'}`}
      aria-label={`${titleOf(item)}${yearOf(item) ? `, ${yearOf(item)}` : ''}`}
      {...tilt}
    >
      <div className={`card ${wide ? 'card-wide' : 'card-poster'}`}>
        <FadeImg src={src} />
        <span className="glare" />
        {!wide && !showMeta && (
          <>
            <div className="poster-shade" />
            <span className="poster-title">{titleOf(item)}</span>
          </>
        )}
      </div>
      {showMeta && (
        <div className="tile-meta">
          <span className="tile-title">{titleOf(item)}</span>
          <span className="tile-sub">
            {ratingOf(item) && (
              <>
                <StarIcon width={12} height={12} /> {ratingOf(item)}
              </>
            )}
            {yearOf(item) && <span>{yearOf(item)}</span>}
          </span>
        </div>
      )}
    </Link>
  )

  if (variant !== 'top10') return tile
  return (
    <div className="top-item">
      <span className="rank" aria-hidden="true">
        {rank}
      </span>
      {tile}
    </div>
  )
}
