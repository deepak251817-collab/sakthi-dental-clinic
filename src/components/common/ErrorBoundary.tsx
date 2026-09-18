import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Phone, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Catches unexpected render errors anywhere below it so one broken
 * component can never blank the whole site. Shows a brand-styled
 * fallback with recovery actions instead.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Surfaced for debugging only — no metrics or error-reporting service is configured.
    console.error('Unhandled UI error:', error, info.componentStack)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[70vh] items-center bg-gradient-to-b from-primary-50 to-white">
          <div className="mx-auto w-full max-w-xl px-6 py-20 text-center">
            <h1 className="text-4xl font-bold text-ink-800">
              We're sorry for the interruption
            </h1>
            <p className="mx-auto mt-4 text-lg text-slate-500">
              Please refresh the page. If the problem persists, call the clinic and we'll help
              you directly.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.location.assign('/')}
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Back to Home
              </button>
              <a
                href="tel:+919862890897"
                className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call the clinic
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
