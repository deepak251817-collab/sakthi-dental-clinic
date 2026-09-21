import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { site } from '../../lib/constants'

const infoItems = [
  {
    Icon: MapPin,
    label: 'Address',
    lines: [site.address.line1, site.address.line2],
    href: 'https://maps.google.com/?q=Sakthi+Dental+Clinic+Hosur',
    linkLabel: 'View on Google Maps',
  },
  {
    Icon: Mail,
    label: 'Email',
    lines: [site.email],
    href: `mailto:${site.email}`,
    linkLabel: site.email,
  },
  {
    Icon: Phone,
    label: 'Phone',
    lines: [site.phones[0], site.phones[1]],
    href: `tel:${site.phones[0].replace(/\s/g, '')}`,
    linkLabel: `${site.phones[0]} / ${site.phones[1]}`,
  },
  {
    Icon: Clock,
    label: 'Timings',
    lines: [site.timings],
  },
]

export default function ContactInfo() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-7 shadow-card sm:p-9">
        <h2 className="text-xl font-bold text-white">Reach us</h2>
        <p className="mt-1.5 text-sm text-primary-100">
          We are happy to help — visit, call or write to us.
        </p>

        <ul className="mt-7 space-y-6">
          {infoItems.map(({ Icon, label, lines, href, linkLabel }) => (
            <li key={label} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Icon className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-primary-100">{label}</h3>
                {lines.map((line) => (
                  <p key={line} className="mt-0.5 text-sm leading-relaxed text-white">
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noreferrer' : undefined}
                        className="transition-colors hover:text-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        {linkLabel}
                      </a>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-primary-100 bg-surface p-6 shadow-soft">
        <h3 className="text-sm font-semibold text-ink-800">Find us on the map</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          We are located in SBM Layout, Anthivadi — easy to reach from anywhere in Hosur, with
          hassle-free parking and wheelchair access.
        </p>
        <a
          href="https://maps.google.com/?q=Sakthi+Dental+Clinic+Hosur"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
          Open in Google Maps
        </a>
      </div>
    </div>
  )
}
