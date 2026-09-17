import { useMemo, useState } from 'react'
import AnimatedSection from '../components/common/AnimatedSection'
import Container from '../components/common/Container'
import PageHero from '../components/common/PageHero'
import AppointmentButton from '../components/common/AppointmentButton'
import TreatmentSearch from '../components/treatments/TreatmentSearch'
import TreatmentFilters from '../components/treatments/TreatmentFilters'
import TreatmentGrid from '../components/treatments/TreatmentGrid'
import { treatments, type TreatmentCategory } from '../data/treatments'
import SEO from '../components/seo/SEO'
import { SearchX } from 'lucide-react'

export default function Treatments() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<TreatmentCategory | 'All'>('All')

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return treatments.filter((treatment) => {
      const matchesCategory = category === 'All' || treatment.category === category
      const matchesQuery =
        normalizedQuery.length === 0 ||
        treatment.title.toLowerCase().includes(normalizedQuery) ||
        treatment.description.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  const hasActiveFilters = query.trim().length > 0 || category !== 'All'

  const clearFilters = () => {
    setQuery('')
    setCategory('All')
  }

  return (
    <>
      <SEO
        title="Dental Treatments in Hosur | Sakthi Dental Clinic"
        description="Explore dental treatments including cleaning, fillings, extraction, implants, orthodontics, pediatric care and more at Sakthi Dental Clinic."
        path="/treatments"
      />
      <PageHero
        title="Our Treatments"
        subtitle="From everyday preventive care to specialized procedures — everything your smile needs, under one roof."
      />

      <section className="py-16 sm:py-20" aria-label="Full treatment list">
        <Container>
          <AnimatedSection>
            {/* Search + filters */}
            <div className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-center">
              <TreatmentSearch query={query} onChange={setQuery} />
              <TreatmentFilters active={category} onChange={setCategory} />
            </div>

            {/* Result count + clear */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
              <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
                {treatments.length} treatments
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {filtered.length > 0 ? (
              <div className="mt-8">
                <TreatmentGrid items={filtered} />
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-primary-100 bg-white px-8 py-16 text-center shadow-soft">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  <SearchX className="h-7 w-7" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-xl font-bold text-slate-800">No treatments found</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Try another search or clear the filters.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Clear Filters
                </button>
              </div>
            )}
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
