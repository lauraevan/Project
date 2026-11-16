import { Link, Outlet } from '@tanstack/react-router'

export function Shell() {
  return (
    <>
      <header className="nav">
        <Link to="/" className="wordmark">
          LUMEN
        </Link>
        <div className="nav-center">
          <nav className="glass nav-pill" aria-label="Primary">
            <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: 'active' }}>
              Home
            </Link>
            <Link to="/series" activeProps={{ className: 'active' }}>
              Series
            </Link>
            <Link to="/films" activeProps={{ className: 'active' }}>
              Films
            </Link>
          </nav>
        </div>
        <div style={{ width: 160 }} />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
