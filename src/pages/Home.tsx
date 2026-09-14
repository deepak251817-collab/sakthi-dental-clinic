import Hero from '../components/home/Hero'
import AssuranceBanner from '../components/home/AssuranceBanner'
import WhyChooseUs from '../components/home/WhyChooseUs'
import TreatmentsPreview from '../components/home/TreatmentsPreview'
import Facilities from '../components/home/Facilities'
import Testimonials from '../components/home/Testimonials'
import FinalCTA from '../components/home/FinalCTA'

export default function Home() {
  return (
    <>
      <Hero />
      <AssuranceBanner />
      <WhyChooseUs />
      <TreatmentsPreview />
      <Facilities />
      <Testimonials />
      <FinalCTA />
    </>
  )
}
