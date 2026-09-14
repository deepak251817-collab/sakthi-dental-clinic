import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { FAQ } from '../../data/faqs'
import { cn } from '../../lib/utils'

interface FAQItemProps {
  faq: FAQ
  defaultOpen?: boolean
}

/**
 * Single accordion row built with semantic button + aria-expanded.
 */
export default function FAQItem({ faq, defaultOpen = false }: FAQItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()
  const buttonId = useId()

  return (
    <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-soft">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-slate-800 transition-colors hover:bg-primary-50/60 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600"
        >
          {faq.question}
          <ChevronDown
            className={cn(
              'h-5 w-5 shrink-0 text-primary-600 transition-transform duration-200',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-sm leading-relaxed text-slate-500">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
