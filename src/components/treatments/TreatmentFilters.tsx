import { treatmentCategories, type TreatmentCategory } from '../../data/treatments'
import { cn } from '../../lib/utils'

interface TreatmentFiltersProps {
  active: TreatmentCategory | 'All'
  onChange: (category: TreatmentCategory | 'All') => void
}

/**
 * Category filter chips. 'All' is the default; categories are derived from
 * the existing treatment data — nothing invented.
 */
export default function TreatmentFilters({ active, onChange }: TreatmentFiltersProps) {
  const chips: Array<TreatmentCategory | 'All'> = ['All', ...treatmentCategories]

  return (
    <div
      role="group"
      aria-label="Filter treatments by category"
      className="flex flex-wrap gap-2"
    >
      {chips.map((category) => {
        const isActive = category === active
        return (
          <button
            key={category}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(category)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
              isActive
                ? 'bg-primary-600 text-white shadow-soft'
                : 'bg-surface text-slate-600 ring-1 ring-primary-200 hover:bg-primary-50 hover:text-accent',
            )}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
