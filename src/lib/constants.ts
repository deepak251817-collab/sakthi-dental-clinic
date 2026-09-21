export const site = {
  name: 'Sakthi Dental Clinic',
  title: 'Sakthi Dental Clinic — Official Website',
  tagline: 'Specialized Dental Care for Women, Children & Families',
  description:
    'Responsive modern dental clinic website built for Sakthi Dental Clinic, Hosur as part of the ShadowFox frontend internship project.',
  metaDescription:
    'Discover compassionate, expert-led dental care for women, children and families at Sakthi Dental Clinic in Hosur.',
  url: 'https://sakthidentalclinic.in',
  address: {
    line1: 'B2/8, SBM Layout, Anthivadi,',
    line2: 'Hosur, Tamil Nadu 635109, India',
  },
  email: 'info@sakthidentalclinic.in',
  phones: ['+91 9862890897', '+91 9363298118'],
  timings: 'Sunday to Saturday: 9am to 7pm',
} as const

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Treatments', href: '/treatments' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'FAQs', href: '/faq' },
  { label: 'Contact', href: '/contact' },
] as const

export const footerLinks = {
  quickLinks: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Treatments', href: '/treatments' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    // Discreet entry point for clinic staff — same secondary styling as the
    // other footer links; no admin functions are exposed, only the login page.
    { label: 'Staff Login', href: '/admin/login' },
  ],
  keyTreatments: [
    { label: 'Teeth Cleaning & Scaling', href: '/treatments' },
    { label: 'Tooth Filling', href: '/treatments' },
    { label: 'Tooth Extraction', href: '/treatments' },
    { label: 'Dental Implants', href: '/treatments' },
    { label: 'Orthodontic Braces', href: '/treatments' },
    { label: 'Clear Aligners', href: '/treatments' },
  ],
} as const
