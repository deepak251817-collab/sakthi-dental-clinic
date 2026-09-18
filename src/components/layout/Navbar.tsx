import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { navLinks } from '../../lib/constants'
import { cn } from '../../lib/utils'
import Container from '../common/Container'
import AppointmentButton from '../common/AppointmentButton'
import MobileMenu from './MobileMenu'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Track scroll so the bar gains a distinct background once the user scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-300',
          scrolled || menuOpen
            ? 'bg-white/95 shadow-soft backdrop-blur supports-[backdrop-filter]:bg-white/80'
            : 'bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70',
        )}
      >
        <nav
          aria-label="Main navigation"
          className="flex items-center justify-between py-3"
        >
          <Container className="flex w-full items-center justify-between py-0">
            <Link
              to="/"
              className="flex items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              aria-label="Sakthi Dental Clinic — Home"
            >
              <img src="/images/icons/logo.svg" alt="" className="h-9 w-9" width={36} height={36} />
              <span className="text-lg font-bold text-ink-800">
                Sakthi <span className="text-primary-600">Dental</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-primary-50 hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
                      isActive && 'bg-primary-50 text-primary-700',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <AppointmentButton source="Navbar" size="md" className="ml-3" />
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </Container>
        </nav>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
