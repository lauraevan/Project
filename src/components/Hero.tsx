import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { genres, img, list, logo, ratingOf, titleOf, typeOf, yearOf } from '../lib/tmdb'
import { useMyList } from '../lib/store'
import { TrailerModal } from './TrailerModal'
import { CheckIcon, InfoIcon, PlayIcon, PlusIcon, StarIcon } from './Icons'
import { FadeImg } from './FadeImg'

const DURATION = 9000
const ease = [0.2, 0.8, 0.2, 1] as const

export function Hero() {
  const trending = useQuery({ queryKey: ['hero'], queryFn: () => list('/trending/all/week') })
  const genreMap = useQuery({ queryKey: ['genres'], queryFn: genres, staleTime: Infinity })
  const items = useMemo(() => (trending.data ?? []).filter((i) => i.backdrop_path).slice(0, 6), [trending.data])
  const [index, setIndex] = useState(0)
  const [trailer, setTrailer] = useState(false)
  const { has, toggle } = useMyList()

  useEffect(() => {
    if (items.length < 2 || trailer) return
    const t = setTimeout(() => setIndex((n) => (n + 1) % items.length), DURATION)
    return () => clearTimeout(t)
  }, [index, items.length, trailer])

  const hero = items[index]
  const type = hero ? typeOf(hero) : 'movie'
  const logoQ = useQuery({
    queryKey: ['logo', type, hero?.id],
    queryFn: () => logo(type, hero!.id),
    enabled: !!hero,
    staleTime: Infinity,
  })

  const { scrollY } = useScroll()
  const parallax = useTransform(scrollY, [0, 900], [0, 180])
  const fade = useTransform(scrollY, [0, 500], [1, 0.2])

  const genreNames = hero ? (hero.genre_ids ?? []).map((g) => genreMap.data?.get(g)).filter(Boolean).slice(0, 2) : []
  const inList = hero ? has(hero) : false

  return (
    <div className="hero">
      <motion.div className="hero-media" style={{ y: parallax }}>
        <AnimatePresence mode="sync">
          {hero && (
            <motion.div
              key={hero.id}
              className="hero-slide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease }}
            >
              <FadeImg src={img(hero.backdrop_path, 'w1280')} className="kenburns" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="hero-side" />
      <div className="hero-fade" />

      {hero && (
        <motion.div className="hero-body" style={{ opacity: fade }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={hero.id}
              className="hero-stack"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.8, ease }}
            >
              <div className="glass chip">
                <span>Trending this week</span>
                <i aria-hidden="true" />
                <span>{type === 'tv' ? 'Series' : 'Film'}</span>
              </div>

              {logoQ.data ? (
                <img className="title-logo" src={img(logoQ.data, 'w500')} alt={titleOf(hero)} />
              ) : (
                <h1 className="display">{titleOf(hero)}</h1>
              )}

              <div className="meta">
                {ratingOf(hero) && (
                  <span className="rating">
                    <StarIcon /> {ratingOf(hero)}
                  </span>
                )}
                {yearOf(hero) && <span>{yearOf(hero)}</span>}
                {genreNames.length > 0 && <span>{genreNames.join(' · ')}</span>}
                <span className="badge">4K</span>
                <span className="badge">Dolby Vision</span>
              </div>

              <p className="lede">{hero.overview}</p>

              <div className="actions">
                <button className="btn btn-primary press" onClick={() => setTrailer(true)}>
                  <PlayIcon width={18} height={18} /> Play trailer
                </button>
                <button
                  className="btn btn-icon glass press"
                  aria-label={inList ? 'Remove from My List' : 'Add to My List'}
                  aria-pressed={inList}
                  onClick={() => toggle(hero)}
                >
                  {inList ? <CheckIcon /> : <PlusIcon />}
                </button>
                <Link
                  to="/title/$type/$id"
                  params={{ type, id: String(hero.id) }}
                  className="btn btn-icon glass press"
                  aria-label={`More about ${titleOf(hero)}`}
                >
                  <InfoIcon />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      {items.length > 1 && (
        <div className="glass dock" role="tablist" aria-label="Featured titles">
          {items.map((f, n) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={n === index}
              aria-label={titleOf(f)}
              className={`dock-item ${n === index ? 'on' : ''}`}
              onClick={() => setIndex(n)}
            >
              <FadeImg src={img(f.backdrop_path, 'w300')} />
              {n === index && (
                <span
                  key={index}
                  className="prog"
                  style={{ animationDuration: `${DURATION}ms`, animationPlayState: trailer ? 'paused' : 'running' }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {trailer && hero && <TrailerModal type={type} id={hero.id} onClose={() => setTrailer(false)} />}
      </AnimatePresence>
    </div>
  )
}
