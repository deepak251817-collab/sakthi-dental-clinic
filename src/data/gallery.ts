export type GalleryCategory = 'Clinic' | 'Treatment' | 'Facilities' | 'Team'

export interface GalleryItem {
  src: string
  alt: string
  title: string
  category: GalleryCategory
}

/**
 * Placeholder illustrations (created for this project, copyright-safe).
 * Replace the files in public/images/gallery/ with the client's real photos
 * — same filenames — and the gallery updates with no code changes.
 */
export const galleryItems: GalleryItem[] = [
  {
    src: '/images/gallery/reception.svg',
    alt: 'Illustration of the clinic reception area',
    title: 'Reception',
    category: 'Clinic',
  },
  {
    src: '/images/gallery/treatment-room.svg',
    alt: 'Illustration of a modern dental treatment room',
    title: 'Treatment Room',
    category: 'Treatment',
  },
  {
    src: '/images/gallery/equipment.svg',
    alt: 'Illustration of modern dental equipment',
    title: 'Modern Equipment',
    category: 'Facilities',
  },
  {
    src: '/images/gallery/waiting-lounge.svg',
    alt: 'Illustration of the comfortable waiting lounge',
    title: 'Waiting Lounge',
    category: 'Facilities',
  },
  {
    src: '/images/gallery/team.svg',
    alt: 'Illustration of the dental care team',
    title: 'Our Care Team',
    category: 'Team',
  },
  {
    src: '/images/gallery/kids-corner.svg',
    alt: 'Illustration of the cheerful kids corner',
    title: "Kids' Corner",
    category: 'Facilities',
  },
]
