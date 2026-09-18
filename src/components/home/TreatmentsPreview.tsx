import { ArrowRight, Smile, Sparkles, Braces, Droplets, Syringe, Scan } from 'lucide-react'
import AnimatedSection from '../common/AnimatedSection'
import Button from '../common/Button'
import Container from '../common/Container'
import SectionHeading from '../common/SectionHeading'

const previewTreatments = [
  {
    title: 'Tooth Extraction',
    description: 'Safe and painless removal of impacted or decayed teeth.',
    Icon: Syringe,
  },
  {
    title: 'Artificial Complete Denture',
    description: 'Full mouth replacement to restore confidence and function.',
    Icon: Smile,
  },
  {
    title: 'Tooth Filling',
    description: 'Composite fillings for cavity treatment and tooth restoration.',
    Icon: Sparkles,
  },
  {
    title: 'Teeth Cleaning or Scaling',
    description: 'Preventive care to remove plaque and protect gums.',
    Icon: Droplets,
  },
  {
    title: 'Bleaching',
    description: 'Cosmetic whitening treatments for a brighter smile.',
    Icon: Scan,
  },
  {
    title: 'Orthodontic Treatment',
    description: 'Braces and aligners to straighten and align teeth.',
    Icon: Braces,
  },
]

export default function TreatmentsPreview() {
  return (
    <section className="bg-primary-50/50 py-20 sm:py-24" aria-labelledby="treatments-preview-heading">
      <Container>
        <AnimatedSection>
          <SectionHeading
            title="Explore Our Services"
            description="Everyday and specialized dental treatments, delivered with gentle, expert care."
          />
        </AnimatedSection>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewTreatments.map(({ title, description, Icon }) => (
            <AnimatedSection key={title}>
              <div className="group h-full rounded-3xl border border-primary-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-card">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink-800">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-12 text-center">
          <Button to="/treatments" variant="secondary" size="lg">
            View Full List of Treatments
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </AnimatedSection>
      </Container>
    </section>
  )
}
