import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { buildDentistSchema, upsertJsonLd } from './components/seo/structuredData'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'
import FloatingContactBar from './components/contact/FloatingContactBar'
import CookieConsent from './components/common/CookieConsent'
import ErrorBoundary from './components/common/ErrorBoundary'
import { AppointmentProvider } from './components/appointment/AppointmentContext'
import Home from './pages/Home'

const About = lazy(() => import('./pages/About'))
const Treatments = lazy(() => import('./pages/Treatments'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Contact = lazy(() => import('./pages/Contact'))
const Gallery = lazy(() => import('./pages/Gallery'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading page">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
    </div>
  )
}

export default function App() {
  // Clinic structured data (Dentist schema) — site-wide, facts from the client brief only.
  useEffect(() => {
    upsertJsonLd('dentist-structured-data', buildDentistSchema())
    return () => upsertJsonLd('dentist-structured-data', null)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <AppointmentProvider>
        <div className="flex min-h-screen flex-col bg-white font-sans text-slate-700 antialiased pb-16 lg:pb-0">
          <ErrorBoundary>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary-600 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lifted"
          >
            Skip to main content
          </a>
          <ScrollToTop />
          <Navbar />
          <main id="main-content" className="flex-1 pt-[68px]">
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/treatments" element={<Treatments />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <FloatingContactBar />
          <CookieConsent />
          </ErrorBoundary>
        </div>
      </AppointmentProvider>
    </MotionConfig>
  )
}
