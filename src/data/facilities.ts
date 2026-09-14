export interface Facility {
  title: string
  description: string
}

/**
 * Amenities supplied by the client brief.
 * NOTE: the brief has a timing inconsistency — the Home page uses
 * "Doctors available daily" (no specific hours) while the Contact page
 * states 9am–7pm. Both are honoured as instructed.
 */
export const facilities: Facility[] = [
  {
    title: 'Convenient Central Location',
    description: 'Easy to find and reach from anywhere in Hosur.',
  },
  {
    title: 'Hassle-Free Parking',
    description: 'Park with ease while you or your family receive care.',
  },
  {
    title: 'Doctors Available Daily',
    description: 'Dental care is available every day of the week.',
  },
  {
    title: 'Pickup & Drop-Off Support',
    description: 'Assisted travel for patients who need help getting to us.',
  },
  {
    title: 'Wheelchair Access',
    description: 'Step-free access so every patient feels welcome.',
  },
]
