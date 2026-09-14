export interface Treatment {
  title: string
  description: string
}

/**
 * All 15 treatments and their descriptions are supplied verbatim by the client brief.
 */
export const treatments: Treatment[] = [
  {
    title: 'Teeth Cleaning & Scaling',
    description:
      'Professional cleaning and scaling to gently remove plaque and tartar build-up, keeping your gums healthy and your smile fresh.',
  },
  {
    title: 'Tooth Filling',
    description:
      'Durable, tooth-coloured fillings that restore teeth damaged by cavities or minor fractures while blending naturally with your smile.',
  },
  {
    title: 'Tooth Extraction',
    description:
      'Safe and painless removal of impacted or decayed teeth, performed with careful attention to your comfort throughout the procedure.',
  },
  {
    title: 'Artificial Complete Denture',
    description:
      'Full mouth replacement to restore confidence and function, custom crafted for a comfortable, natural-looking fit.',
  },
  {
    title: 'Dental Implants',
    description:
      'A modern, long-lasting solution to replace missing teeth, restoring the look, feel and function of natural teeth.',
  },
  {
    title: 'Laser Dentistry',
    description:
      'Minimally invasive laser procedures for gum care and soft-tissue treatments, designed for greater comfort and faster healing.',
  },
  {
    title: 'Root Canal Therapy',
    description:
      'A gentle, precise treatment to save an infected or badly decayed tooth, relieving pain while preserving your natural smile.',
  },
  {
    title: 'Wisdom Tooth Extraction',
    description:
      'Careful assessment and removal of troublesome wisdom teeth, with clear guidance and attentive aftercare for smooth recovery.',
  },
  {
    title: 'Fixed Partial Denture (Bridge)',
    description:
      'A fixed solution that "bridges" the gap left by missing teeth, anchored securely to neighbouring teeth for a complete smile.',
  },
  {
    title: 'Teeth Whitening (Bleaching)',
    description:
      'Cosmetic whitening treatments for a brighter smile, safely lightening stains and discolouration under professional supervision.',
  },
  {
    title: 'Veneers',
    description:
      'Thin, custom-made shells bonded to the front of teeth to improve shape, shade and symmetry for a polished, confident look.',
  },
  {
    title: 'Pediatric Dentistry',
    description:
      'Gentle, child-friendly dental care that keeps young smiles healthy and helps children feel safe and positive about visiting the dentist.',
  },
  {
    title: 'Flap Surgery',
    description:
      'A periodontal procedure to treat advanced gum disease, allowing the gums to heal and reattach firmly to healthy teeth.',
  },
  {
    title: 'Orthodontic Braces',
    description:
      'Braces to straighten and align teeth, correcting bites and giving patients of all ages a healthier, more confident smile.',
  },
  {
    title: 'Clear Aligners',
    description:
      'Nearly invisible, removable aligners that gradually straighten teeth — a discreet and convenient alternative to braces.',
  },
]
