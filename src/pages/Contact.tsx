import Container from '../components/common/Container'
import PageHero from '../components/common/PageHero'
import ContactForm from '../components/contact/ContactForm'
import ContactInfo from '../components/contact/ContactInfo'

export default function Contact() {
  return (
    <>
      <PageHero
        title="We would love to hear from you"
        subtitle="Questions, concerns or ready to book? Reach out — our team will be glad to help."
      />

      <section className="py-16 sm:py-20" aria-label="Contact details and form">
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <ContactForm />
            <ContactInfo />
          </div>
        </Container>
      </section>
    </>
  )
}
