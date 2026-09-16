import { useState } from 'react'
import AnimatedSection from '../components/common/AnimatedSection'
import Container from '../components/common/Container'
import PageHero from '../components/common/PageHero'
import AppointmentButton from '../components/common/AppointmentButton'
import GalleryGrid from '../components/gallery/GalleryGrid'
import GalleryLightbox from '../components/gallery/GalleryLightbox'
import { galleryItems, type GalleryItem } from '../data/gallery'

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <PageHero
        title="Our Clinic Gallery"
        subtitle="A look inside Sakthi Dental Clinic — the spaces, technology and team that care for your smile."
      />

      <section className="py-16 sm:py-20" aria-label="Clinic gallery">
        <Container>
          <AnimatedSection>
            <GalleryGrid onOpen={(item: GalleryItem) =>
              setLightboxIndex(galleryItems.findIndex((entry) => entry.src === item.src))
            } />
          </AnimatedSection>

          <AnimatedSection className="mt-14 text-center">
            <p className="mb-5 text-slate-500">
              Want to see the clinic in person? We would love to show you around.
            </p>
            <AppointmentButton source="Gallery page" />
          </AnimatedSection>
        </Container>
      </section>

      <GalleryLightbox
        items={galleryItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  )
}
