import { MapPin, Navigation } from 'lucide-react'
import Button from '../common/Button'
import AnimatedSection from '../common/AnimatedSection'
import SectionHeading from '../common/SectionHeading'
import Container from '../common/Container'
import { site } from '../../lib/constants'

/**
 * Google Maps directions URL built from the supplied clinic address.
 * No coordinates invented — the search query is the plain text address.
 */
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${site.name}, ${site.address.line1} ${site.address.line2}`,
)}`

const EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  `Sakthi Dental Clinic, ${site.address.line1} ${site.address.line2}`,
)}&output=embed`

/**
 * Clinic location block: address, Get Directions action and an embedded map.
 * Uses Google's keyless /output=embed iframe — no API key is required or used.
 */
export default function LocationSection() {
  return (
    <section className="bg-primary-50/50 py-16 sm:py-20" aria-labelledby="location-heading">
      <AnimatedSection>
        <Container>
          <SectionHeading
            title="Finding the Clinic"
            description="Located in SBM Layout, Anthivadi — central, easy to reach, with hassle-free parking and wheelchair access."
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-5">
            {/* Address card */}
            <div className="flex flex-col justify-between gap-6 rounded-3xl border border-primary-100 bg-surface p-8 shadow-soft lg:col-span-2">
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-accent">
                  <MapPin className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 id="location-heading" className="mt-5 text-xl font-bold text-ink-800">
                  Sakthi Dental Clinic
                </h3>
                <address className="mt-3 space-y-1 text-sm not-italic leading-relaxed text-slate-500">
                  <p>{site.address.line1}</p>
                  <p>{site.address.line2}</p>
                </address>
                <p className="mt-4 text-sm text-slate-500">
                  {site.timings}
                </p>
              </div>
              <Button href={DIRECTIONS_URL} size="lg" className="w-full sm:w-auto">
                <Navigation className="h-4 w-4" aria-hidden="true" />
                Get Directions
                <span className="sr-only"> (opens Google Maps in a new tab)</span>
              </Button>
            </div>

            {/* Map embed */}
            <div className="overflow-hidden rounded-3xl border border-primary-100 bg-surface shadow-soft lg:col-span-3">
              <iframe
                src={EMBED_URL}
                title="Map showing the location of Sakthi Dental Clinic in Hosur"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full sm:h-96 lg:h-full lg:min-h-[24rem]"
              />
            </div>
          </div>
        </Container>
      </AnimatedSection>
    </section>
  )
}
