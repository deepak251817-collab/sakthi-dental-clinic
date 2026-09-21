import { useState } from 'react'
import type { GalleryItem, GalleryCategory } from '../../data/gallery'
import { galleryItems } from '../../data/gallery'
import GalleryImage from './GalleryImage'
import { cn } from '../../lib/utils'

const categories: Array<GalleryCategory | 'All'> = ['All', 'Clinic', 'Treatment', 'Facilities', 'Team']

/**
 * Responsive gallery grid (1 col mobile → 2 sm → 3 lg) with category chips.
 */
export default function GalleryGrid({ onOpen }: { onOpen: (item: GalleryItem) => void }) {
  const [category, setCategory] = useState<GalleryCategory | 'All'>('All')

  const visible =
    category === 'All' ? galleryItems : galleryItems.filter((item) => item.category === category)

  return (
    <div>
      <div role="group" aria-label="Filter gallery by category" className="flex flex-wrap justify-center gap-2">
        {categories.map((option) => {
          const isActive = option === category
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              onClick={() => setCategory(option)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
                isActive
                  ? 'bg-primary-600 text-white shadow-soft'
                  : 'bg-surface text-slate-600 ring-1 ring-primary-200 hover:bg-primary-50 hover:text-accent',
              )}
            >
              {option}
            </button>
          )
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <GalleryImage key={item.src} item={item} onOpen={onOpen} />
        ))}
      </div>
    </div>
  )
}
