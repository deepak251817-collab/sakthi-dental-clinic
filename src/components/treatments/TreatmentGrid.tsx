import type { Treatment } from '../../data/treatments'
import TreatmentCard from './TreatmentCard'
import { iconForTreatment } from './iconForTreatment'

export default function TreatmentGrid({ items }: { items: Treatment[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((treatment) => (
        <TreatmentCard
          key={treatment.title}
          treatment={treatment}
          Icon={iconForTreatment(treatment.title)}
        />
      ))}
    </div>
  )
}
