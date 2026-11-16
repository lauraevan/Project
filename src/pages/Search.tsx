import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { search } from '../lib/tmdb'
import { MediaCard } from '../components/MediaCard'
import { Ambient } from '../components/Backdrop'
import { SearchIcon } from '../components/Icons'

export function SearchPage() {
  const { q } = useSearch({ from: '/search' })
  const navigate = useNavigate()
  const [text, setText] = useState(q)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => input.current?.focus(), [])

  // Debounce typing into the URL so results are shareable and Back works.
  useEffect(() => {
    const t = setTimeout(() => {
      if (text !== q) navigate({ to: '/search', search: { q: text }, replace: true })
    }, 280)
    return () => clearTimeout(t)
  }, [text, q, navigate])

  const query = q.trim()
  const results = useQuery({ queryKey: ['search', query], queryFn: () => search(query), enabled: query.length > 1 })

  return (
    <div className="page">
      <Ambient />
      <header className="page-head">
        <span className="eyebrow">Search</span>
        <label className="glass search-box">
          <SearchIcon width={26} height={26} />
          <input
            ref={input}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Films, series, people…"
            aria-label="Search films and series"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
      </header>

      <div className="grid-wrap">
        {query.length <= 1 && <p className="muted center">Start typing to search the catalog.</p>}
        {results.isPending && query.length > 1 && (
          <div className="grid">
            {Array.from({ length: 12 }, (_, n) => (
              <div key={n} className="skeleton card-poster" />
            ))}
          </div>
        )}
        {results.isError && <p className="muted center">Search failed. Try again in a moment.</p>}
        {results.data && results.data.length === 0 && <p className="muted center">No results for “{query}”.</p>}
        {results.data && results.data.length > 0 && (
          <motion.div className="grid" initial="hide" animate="show" variants={{ show: { transition: { staggerChildren: 0.03 } } }}>
            {results.data.map((i) => (
              <motion.div
                key={`${i.media_type}-${i.id}`}
                variants={{ hide: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <MediaCard item={i} variant="poster" meta />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
