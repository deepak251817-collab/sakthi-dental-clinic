import Hero from '../components/home/Hero'
import AssuranceBanner from '../components/home/AssuranceBanner'
import WhyChooseUs from '../components/home/WhyChooseUs'
import TreatmentsPreview from '../components/home/TreatmentsPreview'
import Facilities from '../components/home/Facilities'
import Testimonials from '../components/home/Testimonials'
import FinalCTA from '../components/home/FinalCTA'
import SEO from '../components/seo/SEO'

export default function Home() {
  return (
    <>
      <SEO
        title="Sakthi Dental Clinic | Dental Care for Women, Children & Families"
        description="Discover compassionate, expert-led dental care for women, children and families at Sakthi Dental Clinic in Hosur."
        path="/"
      />
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
