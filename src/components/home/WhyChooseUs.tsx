import { Layers, Stethoscope, Users, Wrench } from 'lucide-react'
import AnimatedSection from '../common/AnimatedSection'
import Container from '../common/Container'
import SectionHeading from '../common/SectionHeading'

const reasons = [
  {
    title: 'All-in-One Care',
    description:
      'From general dentistry to specialized treatments, everything under one roof.',
    Icon: Layers,
  },
  {
    title: 'Experienced Doctors',
    description:
      'Our dentists are professionally trained and committed to personalized patient care.',
    Icon: Stethoscope,
  },
  {
    title: 'Patient-Centric Approach',
    description:
      'We prioritize comfort, safety, and transparency in every treatment we offer.',
    Icon: Users,
  },
  {
    title: 'Technology-Driven Services',
    description: 'Modern tools and equipment ensure precision and safety.',
    Icon: Wrench,
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-24" aria-labelledby="why-choose-heading">
      <Container>
        <AnimatedSection>
          <SectionHeading
            title="Why Choose Sakthi Dental Clinic?"
            description="Care that puts your comfort and confidence first — from the moment you walk in."
          />
        </AnimatedSection>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ title, description, Icon }) => (
            <AnimatedSection key={title}>
              <div className="group h-full rounded-3xl border border-primary-100 bg-surface p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-accent transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink-800">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
