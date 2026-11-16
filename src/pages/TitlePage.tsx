import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { detail, img, logo, ratingOf, season, titleOf, yearOf, type Detail, type MediaType } from '../lib/tmdb'
import { useMyList, useRecent } from '../lib/store'
import { Ambient, ErrorNotice } from '../components/Backdrop'
import { Row } from '../components/Rows'
import { TrailerModal } from '../components/TrailerModal'
import { FadeImg } from '../components/FadeImg'
import { CheckIcon, PlayIcon, PlusIcon, StarIcon } from '../components/Icons'

const ease = [0.2, 0.8, 0.2, 1] as const
type Tab = 'episodes' | 'related' | 'details'

export function TitlePage() {
  const { type: rawType, id } = useParams({ from: '/title/$type/$id' })
  const type: MediaType = rawType === 'tv' ? 'tv' : 'movie'
  const q = useQuery({ queryKey: ['detail', type, id], queryFn: () => detail(type, id) })
  const logoQ = useQuery({ queryKey: ['logo', type, Number(id)], queryFn: () => logo(type, Number(id)), staleTime: Infinity })
  const [playing, setPlaying] = useState(false)
  const [tab, setTab] = useState<Tab>(type === 'tv' ? 'episodes' : 'related')
  const { has, toggle } = useMyList()
  const recent = useRecent()
  const d = q.data

  useEffect(() => {
    if (d) recent.push(d)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d?.id])

  useEffect(() => setTab(type === 'tv' ? 'episodes' : 'related'), [type, id])

  if (q.isError) return <ErrorNotice error={q.error} />

  const runtime = d?.runtime ?? d?.episode_run_time?.[0]
  const inList = d ? has(d) : false
  const tabs: [Tab, string][] = [
    ...(type === 'tv' ? ([['episodes', 'Episodes']] as [Tab, string][]) : []),
    ['related', 'Related'],
    ['details', 'Details'],
  ]

  return (
    <div className="detail">
      <div className="t-hero">
        {d?.backdrop_path && (
          <motion.div
            className="hero-media"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease }}
          >
            <FadeImg src={img(d.backdrop_path, 'w1280')} className="kenburns" />
          </motion.div>
        )}
        <div className="hero-side" />
        <div className="hero-fade" />

        <div className="hero-body">
          {!d ? (
            <div className="hero-stack">
              <div className="skeleton" style={{ height: 96, width: 'min(520px, 80vw)', borderRadius: 24 }} />
              <div className="skeleton" style={{ height: 24, width: 'min(380px, 70vw)', borderRadius: 12 }} />
            </div>
          ) : (
            <motion.div className="hero-stack" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
              <div className="glass chip">
                <span>{type === 'tv' ? 'Series' : 'Film'}</span>
                {d.genres[0] && (
                  <>
                    <i aria-hidden="true" />
                    <span>{d.genres.slice(0, 2).map((g) => g.name).join(' · ')}</span>
                  </>
                )}
              </div>

              {logoQ.data ? <img className="title-logo" src={img(logoQ.data, 'w500')} alt={titleOf(d)} /> : <h1 className="display">{titleOf(d)}</h1>}
              {d.tagline && <p className="tagline">{d.tagline}</p>}

              <div className="meta">
                {ratingOf(d) && (
                  <span className="rating">
                    <StarIcon /> {ratingOf(d)}
                  </span>
                )}
                {yearOf(d) && <span>{yearOf(d)}</span>}
                {runtime ? <span>{Math.floor(runtime / 60) ? `${Math.floor(runtime / 60)}h ` : ''}{runtime % 60}m</span> : null}
                {d.number_of_seasons ? <span>{d.number_of_seasons} season{d.number_of_seasons > 1 ? 's' : ''}</span> : null}
                <span className="badge">4K</span>
                <span className="badge">Dolby Vision</span>
                <span className="badge">Atmos</span>
              </div>

              <p className="lede">{d.overview}</p>

              <div className="actions">
                <button className="btn btn-primary press" onClick={() => setPlaying(true)}>
                  <PlayIcon width={18} height={18} /> Play trailer
                </button>
                <button
                  className="btn glass press"
                  aria-pressed={inList}
                  onClick={() => toggle(d)}
                >
                  {inList ? <CheckIcon /> : <PlusIcon />} {inList ? 'In My List' : 'My List'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="rows" style={{ marginTop: 0 }}>
        <Ambient />
        <div className="tabs-wrap">
          <div className="glass tabs" role="tablist" aria-label="Title sections">
            {tabs.map(([key, label]) => (
              <button key={key} role="tab" aria-selected={tab === key} className="tab" onClick={() => setTab(key)}>
                {tab === key && <motion.span layoutId="tab-active" className="tab-active" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                <span className="tab-label">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${id}-${tab}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease }}
          >
            {tab === 'episodes' && d && <Episodes d={d} />}
            {tab === 'related' && (
              <>
                <Row title="More like this" variant="poster" path={`/${type}/${id}/recommendations`} />
                <Row title="Similar" variant="wide" path={`/${type}/${id}/similar`} />
              </>
            )}
            {tab === 'details' && d && <Details d={d} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>{playing && d && <TrailerModal type={type} id={d.id} onClose={() => setPlaying(false)} />}</AnimatePresence>
    </div>
  )
}

function Episodes({ d }: { d: Detail }) {
  const seasons = (d.seasons ?? []).filter((s) => s.season_number > 0)
  const [n, setN] = useState(seasons[0]?.season_number ?? 1)
  const eps = useQuery({ queryKey: ['season', d.id, n], queryFn: () => season(d.id, n) })

  return (
    <section className="block">
      <div className="block-head">
        <h2>Episodes</h2>
        {seasons.length > 0 && (
          <label className="glass select">
            <span className="sr">Season</span>
            <select value={n} onChange={(e) => setN(Number(e.target.value))}>
              {seasons.map((s) => (
                <option key={s.season_number} value={s.season_number}>
                  {s.name || `Season ${s.season_number}`}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="episodes">
        {eps.isPending && Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton ep" />)}
        {eps.isError && <p className="muted">Couldn&apos;t load episodes.</p>}
        {eps.data?.map((e, i) => (
          <motion.article
            key={e.id}
            className="glass ep"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: Math.min(i, 8) * 0.04 }}
          >
            <div className="ep-still">
              <FadeImg src={img(e.still_path ?? d.backdrop_path, 'w500')} />
            </div>
            <div className="ep-body">
              <div className="ep-top">
                <h3>
                  {e.episode_number}. {e.name}
                </h3>
                {e.runtime ? <span>{e.runtime}m</span> : null}
              </div>
              <p>{e.overview || 'No synopsis available yet.'}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function Details({ d }: { d: Detail }) {
  const cast = d.credits?.cast.slice(0, 18) ?? []
  return (
    <section className="block">
      <div className="details-grid">
        <div className="glass panel">
          <h2>About</h2>
          <p>{d.overview}</p>
          <div className="chips">
            {d.genres.map((g) => (
              <span key={g.id} className="glass chip">
                {g.name}
              </span>
            ))}
          </div>
        </div>
        <div className="glass panel">
          <h2>Information</h2>
          <dl>
            {yearOf(d) && (<><dt>Released</dt><dd>{yearOf(d)}</dd></>)}
            {d.status && (<><dt>Status</dt><dd>{d.status}</dd></>)}
            {d.original_language && (<><dt>Language</dt><dd>{d.original_language.toUpperCase()}</dd></>)}
            {d.vote_count ? (<><dt>Rating</dt><dd>{ratingOf(d)} from {d.vote_count.toLocaleString()} votes</dd></>) : null}
            <dt>Video</dt><dd>4K · Dolby Vision</dd>
            <dt>Audio</dt><dd>Dolby Atmos</dd>
          </dl>
        </div>
      </div>
      {cast.length > 0 && (
        <>
          <h2 style={{ margin: '48px 0 20px' }}>Cast</h2>
          <div className="cast">
            {cast.map((c) => (
              <div key={c.id} className="cast-item">
                <div className="cast-photo">
                  <FadeImg src={img(c.profile_path, 'w185')} />
                </div>
                <b>{c.name}</b>
                <span>{c.character}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
