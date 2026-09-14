import { motion } from 'framer-motion'
import Container from './Container'

interface PageHeroProps {
  title: string
  subtitle?: string
}

/**
 * Soft lavender page header used at the top of inner pages.
 */
export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="bg-gradient-to-b from-primary-50 to-white">
      <Container className="py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg leading-relaxed text-slate-500">{subtitle}</p>
          )}
        </motion.div>
      </Container>
    </section>
  )
}
