import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, type LucideIcon } from 'lucide-react'
import type { Treatment } from '../../data/treatments'
import { cn } from '../../lib/utils'

interface TreatmentCardProps {
  treatment: Treatment
  Icon: LucideIcon
}

/**
 * Treatment card with a gentle "Learn More" expansion revealing the
 * full description, using an accessible disclosure pattern.
 */
export default function TreatmentCard({ treatment, Icon }: TreatmentCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="flex h-full flex-col rounded-3xl border border-primary-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-card">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-slate-800">{treatment.title}</h3>
      <p
        className={cn(
          'mt-2 text-sm leading-relaxed text-slate-500',
          !expanded && 'line-clamp-2',
        )}
      >
        {treatment.description}
      </p>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
      >
        {expanded ? 'Show Less' : 'Learn More'}
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-200', expanded && 'rotate-180')}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="pt-2 text-sm leading-relaxed text-slate-500">
              Call us or fix an appointment — our dentists will explain the procedure, answer your
              questions and plan the treatment around your comfort.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
