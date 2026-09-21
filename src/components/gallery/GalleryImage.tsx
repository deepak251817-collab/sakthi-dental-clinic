import type { GalleryItem } from '../../data/gallery'

interface GalleryImageProps {
  item: GalleryItem
  onOpen: (item: GalleryItem) => void
}

/** Single gallery tile: lazy-loaded image with category badge. */
export default function GalleryImage({ item, onOpen }: GalleryImageProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`View larger image: ${item.title}`}
      className="group relative block w-full overflow-hidden rounded-3xl border border-primary-100 bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
    >
      <img
        src={item.src}
        alt={item.alt}
        width={800}
        height={600}
        loading="lazy"
        decoding="async"
        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-3 py-1 text-xs font-semibold text-accent shadow-soft backdrop-blur">
        {item.category}
      </span>
      <span className="absolute inset-x-3 bottom-3 rounded-2xl bg-surface/90 px-4 py-2.5 text-sm font-semibold text-slate-800 opacity-0 shadow-soft backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        {item.title}
      </span>
    </button>
  )
}
