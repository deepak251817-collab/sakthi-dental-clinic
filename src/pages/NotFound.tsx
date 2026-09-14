import { ArrowLeft } from 'lucide-react'
import Button from '../components/common/Button'
import Container from '../components/common/Container'

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-gradient-to-b from-primary-50 to-white">
      <Container className="py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
          404 — Page not found
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">
          This page seems to have wandered off
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-slate-500">
          The page you are looking for doesn't exist or may have moved. Let's get you back to a
          familiar smile.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button to="/" size="lg">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </Button>
          <Button to="/contact" variant="secondary" size="lg">
            Contact Us
          </Button>
        </div>
      </Container>
    </section>
  )
}
