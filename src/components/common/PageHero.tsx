import Container from './Container'

interface PageHeroProps {
  title: string
  subtitle?: string
}

/**
 * Inner-page header. Static (no entrance animation), left-aligned to match
 * the homepage hero, with the same lavender rule beside the display text.
 */
export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="bg-primary-50">
      <Container className="py-14 sm:py-16">
        <div className="max-w-3xl">
          <div className="flex gap-5">
            <span aria-hidden="true" className="mt-2 w-0.5 shrink-0 self-stretch bg-primary-600" />
            <h1 className="text-3xl font-bold leading-normal text-ink-800 sm:text-4xl lg:text-[2.75rem]">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-500">{subtitle}</p>
          )}
        </div>
      </Container>
    </section>
  )
}
