import AnimatedSection from '../components/common/AnimatedSection'
import AppointmentButton from '../components/common/AppointmentButton'
import Container from '../components/common/Container'
import PageHero from '../components/common/PageHero'
import TreatmentGrid from '../components/treatments/TreatmentGrid'
import { treatments } from '../data/treatments'

export default function Treatments() {
  return (
    <>
      <PageHero
        title="Our Treatments"
        subtitle="From everyday preventive care to specialized procedures — everything your smile needs, under one roof."
      />

      <section className="py-16 sm:py-20" aria-label="Full treatment list">
        <Container>
          <AnimatedSection>
            <TreatmentGrid items={treatments} />
          </AnimatedSection>

          <AnimatedSection className="mt-14 text-center">
            <p className="mb-5 text-slate-500">
              Not sure which treatment you need? Our dentists will guide you.
            </p>
            <AppointmentButton source="Treatments page" />
          </AnimatedSection>
        </Container>
      </section>
    </>
  )
}
