import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { Header } from './Header'

describe('Header', () => {
  it('renders with logo', () => {
    renderWithProviders(<Header openModal={() => {}} />)
    expect(screen.getByText('Whisper')).toBeInTheDocument()
  })
})
