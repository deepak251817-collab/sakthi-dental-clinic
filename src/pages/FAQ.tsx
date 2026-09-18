import { useMemo, useState } from 'react'
import { SearchX } from 'lucide-react'
import AnimatedSection from '../components/common/AnimatedSection'
import Container from '../components/common/Container'
import PageHero from '../components/common/PageHero'
import AppointmentButton from '../components/common/AppointmentButton'
import FAQSearch from '../components/faq/FAQSearch'
import FAQItem from '../components/faq/FAQItem'
import { faqs } from '../data/faqs'
import SEO from '../components/seo/SEO'

export default function FAQ() {
  const [query, setQuery] = useState('')

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (normalizedQuery.length === 0) return faqs
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(normalizedQuery) ||
        faq.answer.toLowerCase().includes(normalizedQuery),
    )
  }, [query])

  const isSearching = query.trim().length > 0

  return (
    <>
      <SEO
        title="Dental FAQs | Sakthi Dental Clinic"
        description="Find answers to common dental questions about scaling, fillings, braces, wisdom teeth, implants and oral hygiene."
        path="/faq"
      />
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Clear answers to the questions patients ask us most often."
      />

      <section className="py-16 sm:py-20" aria-label="Frequently asked questions">
        <Container>
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <FAQSearch query={query} onChange={setQuery} />
            </AnimatedSection>

            <div className="mt-8 space-y-4" aria-live="polite">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <AnimatedSection key={faq.question} delay={Math.min(index * 0.04, 0.3)}>
                    <FAQItem faq={faq} defaultOpen={index === 0 && !isSearching} />
                  </AnimatedSection>
                ))
              ) : (
                <div className="rounded-2xl border border-primary-100 bg-white px-8 py-14 text-center shadow-soft">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <SearchX className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-xl font-bold text-ink-800">
                    No matching questions found.
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Try different words — or ask us directly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>

          <AnimatedSection className="mt-12 text-center">
            <p className="mb-5 text-slate-500">
              Have a question that isn't answered here? We are happy to help.
            </p>
            <AppointmentButton source="FAQ page" />
          </AnimatedSection>
        </Container>
      </section>
    </>
  )
}
