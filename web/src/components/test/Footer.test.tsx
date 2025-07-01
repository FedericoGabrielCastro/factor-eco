import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Footer from '../Footer'

describe('Footer Component', () => {
  it('should render the footer with correct data-testid', () => {
    render(<Footer />)

    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('should render the logo with "FE" text', () => {
    render(<Footer />)

    const logoElements = screen.getAllByText('FE')
    expect(logoElements).toHaveLength(1)

    const footerLogo = logoElements[0]
    expect(footerLogo).toBeInTheDocument()
  })

  it('should render copyright text', () => {
    render(<Footer />)

    expect(screen.getByText('Factor Eco © 2024')).toBeInTheDocument()
  })

  it('should have correct CSS classes on footer element', () => {
    render(<Footer />)

    const footer = screen.getByTestId('footer')
    expect(footer).toHaveClass(
      'bg-gradient-to-r',
      'from-sky-blue',
      'to-mint-green',
      'text-white',
      'p-4',
      'text-center',
      'shadow-lg'
    )
  })

  it('should have correct container structure', () => {
    render(<Footer />)

    const container = screen.getByTestId('footer').querySelector('div')
    expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'gap-2')
  })

  it('should have correct logo styling', () => {
    render(<Footer />)

    const logoContainer = screen.getByText('FE').parentElement
    expect(logoContainer).toHaveClass(
      'inline-flex',
      'h-6',
      'w-6',
      'items-center',
      'justify-center',
      'rounded-full',
      'bg-white/20'
    )
  })

  it('should have correct logo text styling', () => {
    render(<Footer />)

    const logoText = screen.getByText('FE')
    expect(logoText).toHaveClass('text-xs', 'font-bold')
  })

  it('should have correct copyright text styling', () => {
    render(<Footer />)

    const copyrightText = screen.getByText('Factor Eco © 2024')
    expect(copyrightText).toHaveClass('font-medium')
  })

  it('should render complete footer content', () => {
    render(<Footer />)

    // Check that all expected elements are present
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByText('FE')).toBeInTheDocument()
    expect(screen.getByText('Factor Eco © 2024')).toBeInTheDocument()
  })

  it('should have proper semantic HTML structure', () => {
    render(<Footer />)

    const footer = screen.getByTestId('footer')
    expect(footer.tagName).toBe('FOOTER')
  })

  it('should be accessible with proper test ID', () => {
    render(<Footer />)

    const footer = screen.getByTestId('footer')
    expect(footer).toBeInTheDocument()
  })
})
