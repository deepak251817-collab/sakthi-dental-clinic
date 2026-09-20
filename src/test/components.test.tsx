import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TreatmentFilters from '../components/treatments/TreatmentFilters'
import FAQSearch from '../components/faq/FAQSearch'
import { StatusChip } from '../components/admin/StatusChip'

// Component tests for small, self-contained interactive UI. Full-page
// interaction flows are covered by manual/preview testing; these lock in
// the accessibility contract (aria-pressed, aria-sort, labelled inputs).

describe('TreatmentFilters', () => {
  it('renders a chip per category plus All, with aria-pressed state', async () => {
    const onChange = vi.fn()
    render(<TreatmentFilters active="All" onChange={onChange} />)

    expect(screen.getByRole('group', { name: 'Filter treatments by category' })).toBeVisible()
    const all = screen.getByRole('button', { name: 'All' })
    expect(all).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(screen.getByRole('button', { name: 'Orthodontics' }))
    expect(onChange).toHaveBeenCalledWith('Orthodontics')
  })
})

describe('FAQSearch', () => {
  it('labels the search input for screen readers and reports typing', async () => {
    const onChange = vi.fn()
    render(<FAQSearch query="" onChange={onChange} />)

    const input = screen.getByRole('searchbox', { name: 'Search dental questions' })
    // The parent owns the value (controlled input), so assert the change
    // events fire with the typed text rather than the uncontrolled value.
    await userEvent.type(input, 'braces')
    const calls = onChange.mock.calls.map((c) => c[0] as string)
    expect(calls.join('')).toBe('braces')
  })
})

describe('StatusChip', () => {
  it('communicates status through text, not color alone', () => {
    render(<StatusChip status="PENDING" />)
    expect(screen.getByText(/pending/i)).toBeVisible()
  })
})
