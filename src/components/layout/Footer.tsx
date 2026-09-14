import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, Phone, Youtube } from 'lucide-react'
import { footerLinks, site } from '../../lib/constants'
import Container from '../common/Container'

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com', Icon: Facebook },
  { label: 'YouTube', href: 'https://youtube.com', Icon: Youtube },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-primary-100 bg-primary-50/60">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & contact */}
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/images/icons/logo.svg" alt="" className="h-9 w-9" width={36} height={36} />
              <span className="text-lg font-bold tracking-tight text-slate-800">
                Sakthi <span className="text-primary-600">Dental</span>
              </span>
            </div>
            <address className="mt-4 space-y-1 text-sm not-italic leading-relaxed text-slate-500">
              <p>{site.address.line1}</p>
              <p>{site.address.line2}</p>
            </address>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  <Mail className="h-4 w-4 text-primary-600" aria-hidden="true" />
                  {site.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${site.phones[0].replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  <Phone className="h-4 w-4 text-primary-600" aria-hidden="true" />
                  {site.phones[0]} / {site.phones[1]}
                </a>
              </p>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer quick links">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-800">
              Quick Links
            </h2>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Key treatments */}
          <nav aria-label="Footer key treatments">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-800">
              Key Treatments
            </h2>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.keyTreatments.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-800">
              Follow Us
            </h2>
            <ul className="mt-4 flex gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-600 shadow-soft transition-colors hover:bg-primary-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-100 pt-6">
          <p className="text-center text-sm text-slate-500">
            © {year} Sakthi Dental Clinic. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
