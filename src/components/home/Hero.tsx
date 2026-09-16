import { motion } from 'framer-motion'
import { HeartHandshake, PhoneCall } from 'lucide-react'
import Button from '../common/Button'
import AppointmentButton from '../common/AppointmentButton'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
      {/* Soft decorative blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary-100/70 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="mb-4 inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
              Sakthi Dental Clinic · Hosur
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-800 sm:text-5xl lg:text-[3.4rem]">
              Specialized Dental Care for Women, Children &amp; Families
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-500">
              Experience compassionate, expert-led dental services tailored to your needs, all in
              a modern and welcoming environment.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AppointmentButton source="Home hero" />
              <Button href="tel:+919862890897" variant="secondary" size="lg">
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                Emergency Dental Support
              </Button>
            </div>
          </motion.div>

          {/* Imagery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl shadow-lifted">
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

            {/* Small floating card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
              className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-card sm:left-8"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">Gentle, family-friendly care</p>
                <p className="text-xs text-slate-500">for every visit</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
