import { ArrowLeft } from 'lucide-react'
import Button from '../components/common/Button'
import Container from '../components/common/Container'
import SEO from '../components/seo/SEO'

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-gradient-to-b from-primary-50 to-white">
      <SEO
        title="Page Not Found | Sakthi Dental Clinic"
        description="The page you're looking for doesn't exist or may have moved."
        noindex
      />
      <Container className="py-20 text-center">
        <h1 className="text-4xl font-bold text-ink-800 sm:text-5xl">Page Not Found</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-slate-500">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button to="/" size="lg">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </Button>
          <Button to="/treatments" variant="secondary" size="lg">
            View Treatments
          </Button>
        </div>
      </Container>
    </section>
  )
}
