import { useState } from 'react'
import { Eye, HeartPulse, Target } from 'lucide-react'
import AnimatedSection from '../components/common/AnimatedSection'
import AppointmentButton from '../components/common/AppointmentButton'
import Container from '../components/common/Container'
import PageHero from '../components/common/PageHero'
import SectionHeading from '../components/common/SectionHeading'
import DoctorCard from '../components/doctors/DoctorCard'
import DoctorModal from '../components/doctors/DoctorModal'
import { doctors, type Doctor } from '../data/doctors'
import SEO from '../components/seo/SEO'

const founderJourney = [
  {
    title: 'Graduated in 2000',
    description:
      'Dr. Anupriya began her dental journey after graduating in 2000, building a strong clinical foundation from the very start.',
  },
  {
    title: 'Six Years at Mathura Clinic',
    description:
      'Six formative years at Mathura Clinic shaped her calm, patient-first approach to everyday dental care.',
  },
  {
    title: 'Founded Sakthi Dental Clinic in 2004',
    description:
      'In 2004 she founded Sakthi Dental Clinic in Hosur to bring personalized, comfortable dentistry to her own community.',
  },
  {
    title: 'Primary Health Center Service',
    description:
      'A long-standing service association with the Primary Health Center at Chandara Hospital reflects her commitment to accessible care.',
  },
]

export default function About() {
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(null)

  return (
    <>
      <SEO
        title="About Sakthi Dental Clinic | Dr. Anupriya & Team"
        description="Learn about Sakthi Dental Clinic, Dr. Anupriya, the dental team, mission and vision in Hosur."
        path="/about"
      />
      <PageHero
        title="Get to Know Dr. Anupriya"
        subtitle="Your Trusted Partner in Dental Care"
      />

      {/* Founder story */}
      <section className="py-16 sm:py-20" aria-labelledby="founder-story">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-5">
            <AnimatedSection className="lg:col-span-2">
              <div className="rounded-3xl border border-primary-100 bg-white p-8 text-center shadow-card">
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-primary-100 text-4xl font-bold text-primary-700">
                  A
                </div>
                <h2 className="mt-5 text-xl font-bold text-ink-800">Dr. Anupriya</h2>
                <p className="mt-1 text-sm font-semibold text-primary-700">
                  Founder, Sakthi Dental Clinic
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  Over 20 years of dental expertise, with a focus on personalized, comfortable
                  care for every patient.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection className="lg:col-span-3" delay={0.1}>
              <h2 id="founder-story" className="text-2xl font-bold text-ink-800 sm:text-3xl">
                A Journey of Care Since 2000
              </h2>
              <p className="mt-4 leading-relaxed text-slate-500">
                With over 20 years of expertise, Dr. Anupriya has dedicated her career to making
                dentistry feel less intimidating and more human. She believes great dental care
                starts with listening — understanding each patient's concerns before planning
                treatment.
              </p>
              <ol className="mt-8 space-y-5">
                {founderJourney.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink-800">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="bg-primary-50/50 py-16 sm:py-20" aria-label="Mission and vision">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <AnimatedSection>
              <div className="h-full rounded-3xl border border-primary-100 bg-white p-8 shadow-soft sm:p-10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                  <Target className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-2xl font-bold text-ink-800">Our Mission</h2>
                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-500">
                  <li className="flex gap-2.5">
                    <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                    To deliver personalized, compassionate dental services with advanced technology
                    and a focus on patient comfort.
                  </li>
                  <li className="flex gap-2.5">
                    <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                    To keep learning continuously so every patient receives modern, evidence-informed
                    treatment.
                  </li>
                  <li className="flex gap-2.5">
                    <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                    To emphasize preventive care and comprehensive treatment for lifelong oral health.
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="h-full rounded-3xl border border-primary-100 bg-white p-8 shadow-soft sm:p-10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                  <Eye className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-2xl font-bold text-ink-800">Our Vision</h2>
                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-500">
                  <li className="flex gap-2.5">
                    <Eye className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                    To be a trusted name in modern dentistry where patient care always comes first.
                  </li>
                  <li className="flex gap-2.5">
                    <Eye className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                    To embrace innovation and community engagement, spreading preventive awareness
                    across Hosur.
                  </li>
                  <li className="flex gap-2.5">
                    <Eye className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                    To pursue excellence in every treatment, every visit, for every patient.
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* Doctors */}
      <section className="py-16 sm:py-20" aria-labelledby="doctors-heading">
        <Container>
          <AnimatedSection>
            <SectionHeading
              title="Meet Our Doctors"
              description="A dedicated team of dental professionals here to care for your smile."
            />
          </AnimatedSection>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor, index) => (
              <AnimatedSection key={doctor.name} delay={(index % 3) * 0.06}>
                <DoctorCard doctor={doctor} onOpen={setActiveDoctor} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-12 text-center">
            <AppointmentButton source="About page" />
          </AnimatedSection>
        </Container>
      </section>

      <DoctorModal doctor={activeDoctor} onClose={() => setActiveDoctor(null)} />
    </>
  )
}
