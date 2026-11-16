import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { detail, img, pickTrailer, titleOf, yearOf, type MediaType } from '../lib/tmdb'
import { Ambient, ErrorNotice } from '../components/Backdrop'
import { Row } from '../components/Rows'

export function TitlePage() {
  const { type, id } = useParams({ from: '/title/$type/$id' })
  const q = useQuery({ queryKey: ['detail', type, id], queryFn: () => detail(type as MediaType, id) })
  const [playing, setPlaying] = useState(false)

  if (q.isError) return <ErrorNotice error={q.error} />
  const d = q.data
  const trailer = pickTrailer(d?.videos?.results)
  const runtime = d?.runtime ?? d?.episode_run_time?.[0]

  return (
    <div className="detail">
      {d?.backdrop_path && (
        <motion.div
          className="hero-img"
          style={{ backgroundImage: `url(${img(d.backdrop_path, 'w1280')})`, opacity: 0.55 }}
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
        />
      )}
      <div className="hero-fade" style={{ height: 700, top: 0, bottom: 'auto', background: 'linear-gradient(180deg, transparent 30%, #000 100%)' }} />
      <Ambient />

      {!d ? (
        <div className="detail-body">
          <div className="skeleton" style={{ height: 90, width: 520, borderRadius: 20 }} />
          <div className="skeleton" style={{ height: 120, width: 640, borderRadius: 20 }} />
        </div>
      ) : (
        <motion.div
          className="detail-body"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="glass chip">
            <span>{type === 'tv' ? 'Series' : 'Film'}</span>
            {yearOf(d) && (<><span aria-hidden="true" style={{ opacity: 0.5 }}>·</span><span>{yearOf(d)}</span></>)}
            {runtime ? (<><span aria-hidden="true" style={{ opacity: 0.5 }}>·</span><span>{runtime} min</span></>) : null}
            {d.genres[0] && (<><span aria-hidden="true" style={{ opacity: 0.5 }}>·</span><span>{d.genres.map((g) => g.name).slice(0, 2).join(', ')}</span></>)}
          </div>
          <h1>{titleOf(d)}</h1>
          {d.tagline && <p className="tagline">{d.tagline}</p>}
          <p className="overview">{d.overview}</p>
          <div className="actions">
            {trailer ? (
              <button className="btn btn-primary press" onClick={() => setPlaying(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 4.5v15a1 1 0 001.5.86l12-7.5a1 1 0 000-1.72l-12-7.5A1 1 0 007 4.5z" />
                </svg>
                Play trailer
              </button>
            ) : (
              <span className="glass chip">No trailer available</span>
            )}
            <Link to="/" className="btn glass press">
              Back home
            </Link>
          </div>
        </motion.div>
      )}

      {d?.credits && d.credits.cast.length > 0 && (
        <section className="row" style={{ marginTop: 80 }}>
          <h2>Cast</h2>
          <div className="cast">
            {d.credits.cast.slice(0, 10).map((c) => (
              <div key={c.id} className="cast-item">
                <div className="cast-photo" style={{ backgroundImage: c.profile_path ? `url(${img(c.profile_path, 'w342')})` : undefined }} />
                <b>{c.name}</b>
                <span>{c.character}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {d && <Row title="More like this" path={`/${type}/${id}/recommendations`} variant="poster" />}
      <div style={{ height: 100 }} />

      <AnimatePresence>
        {playing && trailer && (
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Trailer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlaying(false)}
          >
            <button className="modal-close glass press" aria-label="Close trailer" onClick={() => setPlaying(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <motion.div
              className="modal-frame glass"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
                title={`${titleOf(d!)} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
