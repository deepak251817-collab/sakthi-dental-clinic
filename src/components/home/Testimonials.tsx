import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import AnimatedSection from '../common/AnimatedSection'
import Container from '../common/Container'
import SectionHeading from '../common/SectionHeading'
import { testimonials } from '../../data/testimonials'
import { cn } from '../../lib/utils'

const AUTOPLAY_INTERVAL = 7000

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedMotionRef = useRef(false)

  // Track reduced-motion preference without re-rendering.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = query.matches
    const onChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (paused || reducedMotionRef.current) return
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, AUTOPLAY_INTERVAL)
    return () => window.clearInterval(timer)
  }, [paused])

  const current = testimonials[activeIndex]

  return (
    <section className="bg-primary-50/50 py-20 sm:py-24" aria-labelledby="testimonials-heading">
      <Container>
        <AnimatedSection>
          <SectionHeading
            title="What Our Patients Say"
            description="Kind words from the families we care for."
          />
        </AnimatedSection>

        <AnimatedSection className="mt-12">
          <div
            className="relative mx-auto max-w-3xl"
            role="group"
            aria-roledescription="carousel"
            aria-label="Patient testimonials"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="relative overflow-hidden rounded-3xl border border-primary-100 bg-surface p-8 shadow-card sm:p-12">
              <Quote
                className="absolute right-8 top-8 h-12 w-12 text-primary-100"
                aria-hidden="true"
              />
              <AnimatePresence mode="wait">
                <motion.figure
                  key={activeIndex}
                  initial={{ opacity: 0, x: reducedMotionRef.current ? 0 : 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reducedMotionRef.current ? 0 : -32 }}
                  transition={{ duration: reducedMotionRef.current ? 0.15 : 0.4, ease: 'easeOut' }}
                  aria-live="polite"
                >
                  <div className="flex gap-1" aria-label="Rated 5 out of 5">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="h-5 w-5 fill-amber-400 text-amber-400"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-5 text-lg leading-relaxed text-slate-600 sm:text-xl">
                    “{current.quote}”
                  </blockquote>
                  <figcaption className="mt-6 text-sm font-semibold text-slate-800">
                    — {current.name}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-surface text-accent shadow-soft transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.name}
                    type="button"
                    onClick={() => goTo(index)}
                    className={cn(
                      'h-2.5 w-2.5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
                      index === activeIndex ? 'bg-primary-600' : 'bg-primary-200 hover:bg-primary-300',
                    )}
                    aria-label={`Go to testimonial ${index + 1} of ${testimonials.length}`}
                    aria-current={index === activeIndex}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-surface text-accent shadow-soft transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  )
}
