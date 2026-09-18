import { cn } from '../../lib/utils'

interface SectionHeadingProps {
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

/**
 * Section heading. Deliberately has no eyebrow/label slot: labels above
 * headings repeated what the heading already said, so they were removed
 * rather than restyled.
 */
export default function SectionHeading({
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      <h2 className="text-3xl font-bold text-ink-700 sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-slate-500">{description}</p>
      )}
    </div>
  )
}
