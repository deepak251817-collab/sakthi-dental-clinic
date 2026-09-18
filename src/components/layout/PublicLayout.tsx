import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingContactBar from '../contact/FloatingContactBar'
import CookieConsent from '../common/CookieConsent'

/**
 * Layout for the public website: skip link, navbar, footer, floating contact
 * actions and the cookie notice. Admin routes render outside this layout.
 * Rendered output for public routes is identical to the previous single-tree App.
 */
export default function PublicLayout() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary-600 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lifted"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 pt-[68px]">
        <Outlet />
      </main>
      <Footer />
      <FloatingContactBar />
      <CookieConsent />
    </>
  )
}
