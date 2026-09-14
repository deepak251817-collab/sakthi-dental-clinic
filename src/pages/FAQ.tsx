import AnimatedSection from '../components/common/AnimatedSection'
import Button from '../components/common/Button'
import Container from '../components/common/Container'
import PageHero from '../components/common/PageHero'
import FAQItem from '../components/faq/FAQItem'
import { faqs } from '../data/faqs'

export default function FAQ() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Clear answers to the questions patients ask us most often."
      />

      <section className="py-16 sm:py-20" aria-label="Frequently asked questions">
        <Container>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <AnimatedSection key={faq.question} delay={Math.min(index * 0.04, 0.3)}>
                <FAQItem faq={faq} defaultOpen={index === 0} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-12 text-center">
            <p className="mb-5 text-slate-500">
              Have a question that isn't answered here? We are happy to help.
            </p>
            <Button to="/contact" size="lg">
              Fix an Appointment
            </Button>
          </AnimatedSection>
        </Container>
      </section>
    </>
  )
}
