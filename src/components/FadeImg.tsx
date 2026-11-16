import { useState, type CSSProperties } from 'react'

// Image that fades in once loaded, so rows never "pop". Falls back to a plain tile when there's no src.
export function FadeImg({ src, alt = '', className = '', style }: { src?: string; alt?: string; className?: string; style?: CSSProperties }) {
  const [ready, setReady] = useState(false)
  if (!src) return null
  return (
    <img
      ref={(el) => {
        if (el?.complete && el.naturalWidth > 0 && !ready) setReady(true)
      }}
      className={`media ${ready ? 'ready' : ''} ${className}`}
      style={style}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      onLoad={() => setReady(true)}
    />
  )
}
