import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'
import FloatingContactBar from './components/contact/FloatingContactBar'
import { AppointmentProvider } from './components/appointment/AppointmentContext'
import Home from './pages/Home'

const About = lazy(() => import('./pages/About'))
const Treatments = lazy(() => import('./pages/Treatments'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Contact = lazy(() => import('./pages/Contact'))
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
  return (
    <MotionConfig reducedMotion="user">
      <AppointmentProvider>
        <div className="flex min-h-screen flex-col bg-white font-sans text-slate-700 antialiased pb-16 lg:pb-0">
          <ScrollToTop />
          <Navbar />
          <main className="flex-1 pt-[68px]">
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/treatments" element={<Treatments />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <FloatingContactBar />
        </div>
      </AppointmentProvider>
    </MotionConfig>
  )
}
