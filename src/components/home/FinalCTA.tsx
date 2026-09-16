import { ArrowRight } from 'lucide-react'
import AnimatedSection from '../common/AnimatedSection'
import Button from '../common/Button'
import AppointmentButton from '../common/AppointmentButton'
import Container from '../common/Container'

export default function FinalCTA() {
  return (
    <section className="py-20 sm:py-24" aria-labelledby="final-cta-heading">
      <Container>
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-primary-800 px-6 py-16 text-center shadow-lifted sm:px-12 lg:px-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            />
            <h2
              id="final-cta-heading"
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
            >
              Your Smile Deserves the Best Care
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-100">
              Book a visit today — our team will take the time to understand your needs and plan
              comfortable, personalized treatment.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <AppointmentButton
                source="Final CTA"
                variant="onDark"
                className="bg-white text-primary-700 hover:bg-primary-50 focus-visible:outline-white"
              />
              <Button
                to="/treatments"
                size="lg"
                className="bg-transparent text-white ring-1 ring-white/40 hover:bg-white/10 focus-visible:outline-white"
              >
                Explore Treatments
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  )
}
