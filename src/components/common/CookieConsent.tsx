import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cookie, Link2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'sdc-cookie-consent'

type ConsentChoice = 'accepted' | 'declined'

/** Read the stored preference defensively (private-mode browsers can throw). */
function getStoredConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'accepted' || value === 'declined' ? value : null
  } catch {
    return null
  }
}

function storeConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    // Storage unavailable — the banner simply reappears next visit.
  }
}

/**
 * Subtle privacy notice shown until the visitor makes a choice.
 * No analytics or tracking is loaded — this only records the visitor's
 * preference locally, as prepared consent UI for a future analytics integration.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (getStoredConsent() === null) {
      setVisible(true)
    }
  }, [])

  const choose = (choice: ConsentChoice) => {
    storeConsent(choice)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="region"
          aria-label="Privacy notice"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-[4.5rem] left-4 right-4 z-30 sm:left-6 sm:right-auto sm:max-w-md lg:bottom-6"
        >
          <div className="rounded-3xl border border-primary-100 bg-white p-5 shadow-lifted">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                <Cookie className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-800">We value your privacy</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  We use cookies to improve your browsing experience. See our{' '}
                  <Link
                    to="/privacy-policy"
                    className="inline-flex items-center gap-0.5 font-semibold text-primary-700 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-rounded focus-visible:outline-primary-600"
                  >
                    Privacy Policy
                    <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => choose('accepted')}
                className="flex-1 rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => choose('declined')}
                className="flex-1 rounded-full border border-primary-200 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
