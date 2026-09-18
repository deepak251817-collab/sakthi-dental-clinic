import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { buildDentistSchema, upsertJsonLd } from './components/seo/structuredData'
import ScrollToTop from './components/layout/ScrollToTop'
import CookieConsent from './components/common/CookieConsent'
import ErrorBoundary from './components/common/ErrorBoundary'
import PublicLayout from './components/layout/PublicLayout'
import RequireAdminAuth from './components/admin/RequireAdminAuth'
import { AppointmentProvider } from './components/appointment/AppointmentContext'
import Home from './pages/Home'

const About = lazy(() => import('./pages/About'))
const Treatments = lazy(() => import('./pages/Treatments'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Contact = lazy(() => import('./pages/Contact'))
const Gallery = lazy(() => import('./pages/Gallery'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

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
        <ScrollToTop />
        <ErrorBoundary>
          <div className="flex min-h-screen flex-col bg-white font-sans text-slate-700 antialiased pb-16 lg:pb-0">
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/treatments" element={<Treatments />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route
                  path="/admin/login"
                  element={
                    <div className="min-h-screen bg-white font-sans text-slate-700 antialiased">
                      <Suspense fallback={<RouteFallback />}>
                        <AdminLogin />
                      </Suspense>
                    </div>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <RequireAdminAuth>
                      <div className="min-h-screen bg-white font-sans text-slate-700 antialiased">
                        <Suspense fallback={<RouteFallback />}>
                          <AdminDashboard />
                        </Suspense>
                      </div>
                    </RequireAdminAuth>
                  }
                />
              </Routes>
            </Suspense>
            <CookieConsent />
          </div>
        </ErrorBoundary>
      </AppointmentProvider>
    </MotionConfig>
  )
}
