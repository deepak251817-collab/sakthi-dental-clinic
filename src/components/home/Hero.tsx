import { motion } from 'framer-motion'
import { PhoneCall } from 'lucide-react'
import Button from '../common/Button'
import AppointmentButton from '../common/AppointmentButton'

/**
 * Hero. Two-line stacked headline with a lavender rule and normal leading —
 * the type composition itself is the design moment; no pill badge, no
 * floating card, no gradient blob.
 */
export default function Hero() {
  return (
    <section className="relative bg-primary-50">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-20">
          {/* Copy — line-left, rule beside the headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:pt-2"
          >
            <div className="flex gap-5">
              <span aria-hidden="true" className="mt-3 w-0.5 shrink-0 self-stretch bg-primary-600" />
              <h1 className="text-4xl font-bold leading-normal text-ink-800 sm:text-5xl lg:text-[3.3rem]">
                Specialized Dental Care for Women, Children &amp; Families
              </h1>
            </div>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
              Gentle, expert-led dentistry in the heart of Hosur — dental care
              built around comfort for mothers, children and every member of
              the family.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AppointmentButton source="Home hero" />
              <Button href="tel:+919862890897" variant="secondary" size="lg">
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                Emergency Dental Support
              </Button>
            </div>
          </motion.div>

          {/* Imagery — slightly raised against the lavender field */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.12 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl bg-primary-100 shadow-lifted ring-1 ring-primary-200/70 lg:-mt-3 dark:bg-primary-100/40 dark:ring-primary-300/40">
              <img
                src="/images/hero/hero-dental-care.jpg"
                alt="A friendly dental professional welcoming a smiling family at the clinic"
                className="aspect-[4/3] w-full object-cover"
                width={1024}
                height={768}
                loading="eager"
                decoding="async"
                onError={(event) => {
                  const img = event.currentTarget
                  img.onerror = null
                  img.src = '/images/hero/hero-fallback.svg'
                }}
              />
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Gentle, family-friendly care for every visit.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
