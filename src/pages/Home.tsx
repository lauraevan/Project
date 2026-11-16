import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { img, list, titleOf, typeOf, yearOf } from '../lib/tmdb'
import { Row } from '../components/Rows'
import { ErrorNotice } from '../components/Backdrop'

export function Home() {
  const trending = useQuery({ queryKey: ['hero'], queryFn: () => list('/trending/all/week') })
  const featured = (trending.data ?? []).filter((i) => i.backdrop_path).slice(0, 5)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (featured.length < 2) return
    const t = setInterval(() => setIndex((n) => (n + 1) % featured.length), 8000)
    return () => clearInterval(t)
  }, [featured.length])

  if (trending.isError) return <ErrorNotice error={trending.error} />

  const hero = featured[index]

  return (
    <>
      <div className="hero">
        <AnimatePresence mode="sync">
          {hero && (
            <motion.div
              key={hero.id}
              className="hero-img"
              style={{ backgroundImage: `url(${img(hero.backdrop_path, 'w1280')})` }}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
            />
          )}
        </AnimatePresence>
        <div className="hero-side" />
        <div className="hero-fade" />

        {hero && (
          <div className="hero-body">
            <AnimatePresence mode="wait">
              <motion.div
                key={hero.id}
                style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <div className="glass chip">
                  <span>Trending this week</span>
                  <span aria-hidden="true" style={{ opacity: 0.5 }}>·</span>
                  <span>{typeOf(hero) === 'tv' ? 'Series' : 'Film'}</span>
                  {yearOf(hero) && (
                    <>
                      <span aria-hidden="true" style={{ opacity: 0.5 }}>·</span>
                      <span>{yearOf(hero)}</span>
                    </>
                  )}
                </div>
                <h1>{titleOf(hero)}</h1>
                <p className="lede">{hero.overview}</p>
                <div className="actions">
                  <Link
                    to="/title/$type/$id"
                    params={{ type: typeOf(hero), id: String(hero.id) }}
                    className="btn btn-primary press"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M7 4.5v15a1 1 0 001.5.86l12-7.5a1 1 0 000-1.72l-12-7.5A1 1 0 007 4.5z" />
                    </svg>
                    Watch trailer
                  </Link>
                  <Link
                    to="/title/$type/$id"
                    params={{ type: typeOf(hero), id: String(hero.id) }}
                    className="btn glass press"
                  >
                    More info
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {featured.length > 1 && (
          <div className="glass dots" role="tablist" aria-label="Featured titles">
            {featured.map((f, n) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={n === index}
                aria-label={titleOf(f)}
                className={n === index ? 'on' : ''}
                onClick={() => setIndex(n)}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ paddingBottom: 100 }}>
        <Row title="Trending now" path="/trending/all/week" variant="wide" />
        <Row title="Popular films" path="/movie/popular" variant="poster" />
        <Row title="Top rated series" path="/tv/top_rated" variant="poster" />
        <Row title="In theatres" path="/movie/now_playing" variant="wide" />
      </div>
    </>
  )
}
