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

/**
 * Icon per treatment, keyed by title so lookups stay correct regardless of
 * array order — one shared mapping for the home preview and full directory.
 */
const treatmentIconMap: Record<string, LucideIcon> = {
  'Teeth Cleaning & Scaling': Droplets,
  'Tooth Filling': Sparkles,
  'Tooth Extraction': Syringe,
  'Artificial Complete Denture': Smile,
  'Dental Implants': Anchor,
  'Laser Dentistry': Zap,
  'Root Canal Therapy': ShieldPlus,
  'Wisdom Tooth Extraction': Brain,
  'Fixed Partial Denture (Bridge)': Link2,
  'Teeth Whitening (Bleaching)': Scan,
  Veneers: Layers,
  'Pediatric Dentistry': Baby,
  'Flap Surgery': Waves,
  'Orthodontic Braces': Braces,
  'Clear Aligners': AlignCenterHorizontal,
}

export function iconForTreatment(title: string): LucideIcon {
  return treatmentIconMap[title] ?? Sparkles
}
