import { site } from '../../lib/constants'

/**
 * schema.org "Dentist" structured data built strictly from the client-supplied
 * facts: name, address, email, phones and opening hours (9 AM – 7 PM, the
 * Contact-page timing).
 *
 * Deliberately omitted (not supplied by the client): geo coordinates,
 * price range, ratings, review counts, awards, social profiles, branches.
 */
export function buildDentistSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: site.name,
    description: site.metaDescription,
    email: site.email,
    telephone: site.phones,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.line1.replace(/,\s*$/, ''),
      addressLocality: 'Hosur',
      addressRegion: 'Tamil Nadu',
      postalCode: '635109',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
  }
}

/**
 * Idempotently inject (or update) a JSON-LD script tag in <head>.
 * Passing null removes the tag.
 */
export function upsertJsonLd(id: string, data: Record<string, unknown> | null): void {
  const existing = document.getElementById(id)
  if (data === null) {
    existing?.remove()
    return
  }
  if (existing) {
    existing.textContent = JSON.stringify(data)
    return
  }
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = id
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}
