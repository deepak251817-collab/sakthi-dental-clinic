import {
  Car,
  MapPin,
  Accessibility,
  UserCheck,
  CalendarDays,
} from 'lucide-react'
import AnimatedSection from '../common/AnimatedSection'
import Container from '../common/Container'
import SectionHeading from '../common/SectionHeading'
import { facilities } from '../../data/facilities'

const facilityIcons = [MapPin, Car, CalendarDays, UserCheck, Accessibility]

export default function Facilities() {
  return (
    <section className="py-20 sm:py-24" aria-labelledby="facilities-heading">
      <Container>
        <AnimatedSection>
          <SectionHeading
            title="Clinic Facilities"
            description="Thoughtful conveniences that make every visit easier for you and your family."
          />
        </AnimatedSection>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {facilities.map((facility, index) => {
            const Icon = facilityIcons[index % facilityIcons.length]
            return (
              <AnimatedSection key={facility.title}>
                <div className="flex h-full flex-col items-center rounded-3xl border border-primary-100 bg-white p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink-800">{facility.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    {facility.description}
                  </p>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
