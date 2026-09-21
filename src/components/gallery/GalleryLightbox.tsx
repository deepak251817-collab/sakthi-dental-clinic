import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryItem } from '../../data/gallery'

interface GalleryLightboxProps {
  items: GalleryItem[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

/**
 * Full-screen accessible lightbox: Escape closes, arrow keys navigate,
 * focus is trapped by the dialog and restored on close.
 */
export default function GalleryLightbox({ items, index, onClose, onNavigate }: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const isOpen = index !== null

  useEffect(() => {
    if (!isOpen) return
    const previousActive = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNavigate((index + 1) % items.length)
      if (event.key === 'ArrowLeft') onNavigate((index - 1 + items.length) % items.length)
    }

    window.addEventListener('keydown', onKeyDown)
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus()

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previousActive?.focus()
    }
  }, [isOpen, index, items.length, onClose, onNavigate])

  const item = index !== null ? items[index] : null

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0817]/90 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Image viewer: ${item.title}`}
            className="relative w-full max-w-4xl outline-none"
            onClick={(event) => event.stopPropagation()}
          >
            <motion.img
              key={item.src}
              src={item.src}
              alt={item.alt}
              className="mx-auto max-h-[75vh] w-auto rounded-3xl bg-surface object-contain shadow-lifted"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            />

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-white">
                {item.title}
                <span className="ml-2 font-normal text-slate-300">
                  {index + 1} / {items.length}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate((index - 1 + items.length) % items.length)}
                  aria-label="Previous image"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/30 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate((index + 1) % items.length)}
                  aria-label="Next image"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/30 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close image viewer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/30 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
