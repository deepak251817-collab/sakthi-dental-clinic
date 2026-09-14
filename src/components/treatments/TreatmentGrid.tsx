import {
  Sparkles,
  Droplets,
  Syringe,
  Smile,
  Anchor,
  Zap,
  ShieldPlus,
  Brain,
  Link2,
  Scan,
  Layers,
  Baby,
  Waves,
  Braces,
  AlignCenterHorizontal,
  type LucideIcon,
} from 'lucide-react'
import type { Treatment } from '../../data/treatments'
import TreatmentCard from './TreatmentCard'

/**
 * Icon per treatment, in the same order as the treatments data file.
 */
const treatmentIcons: LucideIcon[] = [
  Droplets, // Teeth Cleaning & Scaling
  Sparkles, // Tooth Filling
  Syringe, // Tooth Extraction
  Smile, // Artificial Complete Denture
  Anchor, // Dental Implants
  Zap, // Laser Dentistry
  ShieldPlus, // Root Canal Therapy
  Brain, // Wisdom Tooth Extraction
  Link2, // Fixed Partial Denture (Bridge)
  Scan, // Teeth Whitening (Bleaching)
  Layers, // Veneers
  Baby, // Pediatric Dentistry
  Waves, // Flap Surgery
  Braces, // Orthodontic Braces
  AlignCenterHorizontal, // Clear Aligners
]

export default function TreatmentGrid({ items }: { items: Treatment[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((treatment, index) => (
        <TreatmentCard
          key={treatment.title}
          treatment={treatment}
          Icon={treatmentIcons[index % treatmentIcons.length]}
        />
      ))}
    </div>
  )
}
