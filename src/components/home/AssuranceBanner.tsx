import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import Container from '../common/Container'

export default function AssuranceBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-64px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="bg-gradient-to-r from-primary-600 to-primary-700"
      aria-label="Clinic assurance"
    >
      <Container className="flex flex-col items-center gap-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <ShieldCheck className="h-7 w-7 text-white" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xl font-bold text-white">You are always in safe hands.</p>
            <p className="mt-1 text-primary-100">We are ready to help, anytime.</p>
          </div>
        </div>
        <img
          src="/images/banners/assurance-banner.jpg"
          alt="Calm, modern treatment room at Sakthi Dental Clinic"
          className="hidden h-24 w-40 rounded-2xl object-cover shadow-card lg:block"
          width={160}
          height={96}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            const img = event.currentTarget
            img.onerror = null
            img.style.display = 'none'
          }}
        />
      </Container>
    </motion.section>
  )
}
