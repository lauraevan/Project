import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { SearchIcon } from './Icons'
import { useMyList } from '../lib/store'

const tabs = [
  { to: '/', label: 'Home', exact: true },
  { to: '/series', label: 'Series' },
  { to: '/films', label: 'Films' },
  { to: '/list', label: 'My List' },
] as const

export function Shell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const { items } = useMyList()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // "/" jumps to search, like most streaming apps.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(t.tagName)) {
        e.preventDefault()
        navigate({ to: '/search', search: { q: '' } })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  useEffect(() => window.scrollTo({ top: 0 }), [pathname])

  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="wordmark" aria-label="Lumen home">
          LUMEN
        </Link>
        <nav className="glass nav-pill" aria-label="Primary">
          {tabs.map((t) => (
            <Link key={t.to} to={t.to} activeOptions={{ exact: 'exact' in t }} className="nav-link">
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="nav-active"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="nav-label">
                    {t.label}
                    {t.to === '/list' && items.length > 0 && <b className="count">{items.length}</b>}
                  </span>
                </>
              )}
            </Link>
          ))}
        </nav>
        <div className="nav-right">
          <Link to="/search" search={{ q: '' }} className="glass icon-btn press" aria-label="Search (press /)">
            <SearchIcon width={19} height={19} />
          </Link>
        </div>
      </header>

      <motion.main
        id="main"
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Outlet />
      </motion.main>

      <footer className="footer">
        <span>Lumen</span>
        <span>
          Catalog data and artwork from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
        </span>
      </footer>
    </>
  )
}
