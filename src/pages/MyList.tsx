import { Link } from '@tanstack/react-router'
import { useMyList } from '../lib/store'
import { MediaCard } from '../components/MediaCard'
import { Ambient } from '../components/Backdrop'

export function MyList() {
  const { items } = useMyList()
  return (
    <div className="page">
      <Ambient />
      <header className="page-head">
        <span className="eyebrow">Saved on this device</span>
        <h1 className="display">My List</h1>
      </header>
      <div className="grid-wrap">
        {items.length === 0 ? (
          <div className="glass empty">
            <h2>Nothing here yet</h2>
            <p>Tap the + on any title to save it. Your list stays on this device.</p>
            <Link to="/" className="btn btn-primary press">
              Browse Lumen
            </Link>
          </div>
        ) : (
          <div className="grid">
            {items.map((i) => (
              <MediaCard key={`${i.media_type}-${i.id}`} item={i} variant="poster" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
