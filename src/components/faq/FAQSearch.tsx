import { Search } from 'lucide-react'

interface FAQSearchProps {
  query: string
  onChange: (value: string) => void
}

/** Search input filtering FAQs by question and answer text. */
export default function FAQSearch({ query, onChange }: FAQSearchProps) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        type="search"
        role="searchbox"
        value={query}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search dental questions..."
        aria-label="Search dental questions"
        className="w-full rounded-full border border-primary-200 bg-surface py-3 pl-12 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      />
    </div>
  )
}
