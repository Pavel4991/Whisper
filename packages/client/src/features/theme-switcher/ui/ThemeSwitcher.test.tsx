import { describe, it, expect, afterEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderWithProviders, matchMediaMock } from '@/test/test-utils'
import { ThemeSwitcher } from './ThemeSwitcher'

const STORAGE_KEY = 'mantine-color-scheme-value'

const getColorScheme = () => document.documentElement.getAttribute('data-mantine-color-scheme')

describe('ThemeSwitcher', () => {
  afterEach(() => localStorage.removeItem(STORAGE_KEY))

  it('renders toggle button', () => {
    renderWithProviders(<ThemeSwitcher />)

    expect(screen.getByRole('button', { name: 'Переключить тему' })).toBeInTheDocument()
  })

  it('switches color scheme from light to dark and back', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ThemeSwitcher />)
    const button = screen.getByRole('button', { name: 'Переключить тему' })

    expect(getColorScheme()).toBe('light')
    expect(screen.getByTestId('theme-icon-moon')).toBeInTheDocument()

    await user.click(button)

    expect(getColorScheme()).toBe('dark')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark')
    expect(screen.getByTestId('theme-icon-sun')).toBeInTheDocument()

    await user.click(button)

    expect(getColorScheme()).toBe('light')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light')
    expect(screen.getByTestId('theme-icon-moon')).toBeInTheDocument()
  })

  it('restores saved color scheme', () => {
    localStorage.setItem(STORAGE_KEY, 'dark')

    renderWithProviders(<ThemeSwitcher />)

    expect(getColorScheme()).toBe('dark')
  })

  it('switches to light on first click when system prefers dark', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('matchMedia', matchMediaMock(true))

    renderWithProviders(<ThemeSwitcher />)

    expect(getColorScheme()).toBe('dark')

    await user.click(screen.getByRole('button', { name: 'Переключить тему' }))

    expect(getColorScheme()).toBe('light')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light')
  })
})
