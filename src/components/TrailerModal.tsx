import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { detail, pickTrailer, titleOf, type MediaType } from '../lib/tmdb'
import { CloseIcon } from './Icons'

export function TrailerModal({ type, id, onClose }: { type: MediaType; id: number; onClose: () => void }) {
  const q = useQuery({ queryKey: ['detail', type, String(id)], queryFn: () => detail(type, id) })
  const trailer = pickTrailer(q.data?.videos?.results)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  // Portal to <body>: a transformed/filtered ancestor would otherwise trap position:fixed.
  return createPortal(
    <motion.div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label="Trailer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
    >
      <button ref={closeRef} className="modal-close glass press" aria-label="Close trailer" onClick={onClose}>
        <CloseIcon />
      </button>
      <motion.div
        className="modal-frame"
        initial={{ scale: 0.9, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {trailer ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={`${q.data ? titleOf(q.data) : ''} trailer`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <div className="modal-empty">
            {q.isPending ? <div className="spinner" aria-label="Loading" /> : <p>No trailer is available for this title.</p>}
          </div>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  )
}
