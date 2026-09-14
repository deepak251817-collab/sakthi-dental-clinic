import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
}

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

/**
 * Fade-up entrance wrapper for sections. Automatically respects
 * prefers-reduced-motion via Framer Motion's built-in handling.
 */
export default function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-64px' }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
