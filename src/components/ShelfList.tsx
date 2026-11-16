import { useEffect, useRef, useState } from 'react'
import { Row } from './Rows'
import type { Shelf } from '../lib/shelves'

// Renders shelves progressively: a few up front, more as the reader nears the bottom.
export function ShelfList({ shelves, initial = 6, step = 3 }: { shelves: Shelf[]; initial?: number; step?: number }) {
  const [count, setCount] = useState(initial)
  const end = useRef<HTMLDivElement>(null)
  const done = count >= shelves.length

  useEffect(() => {
    const el = end.current
    if (!el || done) return
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setCount((c) => Math.min(c + step, shelves.length)),
      { rootMargin: '700px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [count, done, step, shelves.length])

  return (
    <>
      {shelves.slice(0, count).map((s) => (
        <Row key={`${s.path}-${s.title}`} {...s} />
      ))}
      {!done && <div ref={end} className="more" aria-hidden="true" />}
    </>
  )
}
