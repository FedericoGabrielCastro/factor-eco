import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuth } from '@/context/AuthContext'

import Header from '../Header'

// Mock useAuth hook
vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
})

describe('Header Component', () => {
  const mockLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    window.location.href = ''
  })

  describe('when user is authenticated', () => {
    beforeEach(() => {
      ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
        logout: mockLogout,
      })
    })

    it('should render user information', () => {
      render(<Header />)

      expect(screen.getByText('testuser')).toBeInTheDocument()
      expect(screen.queryByText('No conectado')).not.toBeInTheDocument()
    })

    it('should render logout button', () => {
      render(<Header />)

      const logoutButton = screen.getByText('Cerrar sesión')
      expect(logoutButton).toBeInTheDocument()
      expect(logoutButton).toHaveClass('bg-red-600')
    })

    it('should handle logout click', async () => {
      render(<Header />)

      const logoutButton = screen.getByText('Cerrar sesión')
      fireEvent.click(logoutButton)

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1)
      })

      expect(window.location.href).toBe('/login')
    })

    it('should render all navigation links', () => {
      render(<Header />)

      expect(screen.getByText('Productos')).toBeInTheDocument()
      expect(screen.getByText('Promos')).toBeInTheDocument()
      expect(screen.getByText('Carritos')).toBeInTheDocument()
      expect(screen.getByText('VIP')).toBeInTheDocument()
    })

    it('should have correct navigation links with proper hrefs', () => {
      render(<Header />)

      const productosLink = screen.getByText('Productos')
      const promosLink = screen.getByText('Promos')
      const carritosLink = screen.getByText('Carritos')
      const vipLink = screen.getByText('VIP')

      expect(productosLink).toHaveAttribute('href', '/products')
      expect(promosLink).toHaveAttribute('href', '/promotions')
      expect(carritosLink).toHaveAttribute('href', '/carts')
      expect(vipLink).toHaveAttribute('href', '/vip')
    })

    it('should render logo with correct text', () => {
      render(<Header />)

      const logoElements = screen.getAllByText('FE')
      expect(logoElements).toHaveLength(1) // Only header logo since we're not rendering Footer

      // Check the header logo
      const headerLogo = logoElements[0]
      expect(headerLogo).toBeInTheDocument()
    })

    it('should have correct data-testid', () => {
      render(<Header />)

      expect(screen.getByTestId('header')).toBeInTheDocument()
    })

    it('should have correct CSS classes', () => {
      render(<Header />)

      const header = screen.getByTestId('header')
      expect(header).toHaveClass('bg-gradient-to-r', 'from-sky-blue', 'to-mint-green', 'text-white')
    })
  })

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
        user: null,
        logout: mockLogout,
      })
    })

    it('should render "No conectado" message', () => {
      render(<Header />)

      expect(screen.getByText('No conectado')).toBeInTheDocument()
      expect(screen.queryByText('testuser')).not.toBeInTheDocument()
    })

    it('should not render logout button', () => {
      render(<Header />)

      expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument()
    })

    it('should still render all navigation links', () => {
      render(<Header />)

      expect(screen.getByText('Productos')).toBeInTheDocument()
      expect(screen.getByText('Promos')).toBeInTheDocument()
      expect(screen.getByText('Carritos')).toBeInTheDocument()
      expect(screen.getByText('VIP')).toBeInTheDocument()
    })

    it('should render logo even when not authenticated', () => {
      render(<Header />)

      const logoElements = screen.getAllByText('FE')
      expect(logoElements).toHaveLength(1) // Only header logo since we're not rendering Footer
    })
  })

  describe('navigation links', () => {
    beforeEach(() => {
      ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
        logout: mockLogout,
      })
    })

    it('should have hover effects on navigation links', () => {
      render(<Header />)

      const productosLink = screen.getByText('Productos')
      expect(productosLink).toHaveClass(
        'hover:text-peach-light',
        'transition-colors',
        'duration-200'
      )
    })

    it('should have proper font weight on navigation links', () => {
      render(<Header />)

      const productosLink = screen.getByText('Productos')
      expect(productosLink).toHaveClass('font-medium')
    })
  })

  describe('user info section', () => {
    beforeEach(() => {
      ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
        logout: mockLogout,
      })
    })

    it('should display username with correct styling', () => {
      render(<Header />)

      const username = screen.getByText('testuser')
      expect(username).toHaveClass('font-semibold')
    })

    it('should display "No conectado" with italic styling when not authenticated', () => {
      ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
        user: null,
        logout: mockLogout,
      })

      render(<Header />)

      const notConnected = screen.getByText('No conectado')
      expect(notConnected).toHaveClass('italic')
    })
  })

  describe('logout functionality', () => {
    beforeEach(() => {
      ;(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
        logout: mockLogout,
      })
    })

    it('should call logout and redirect to login page', async () => {
      render(<Header />)

      const logoutButton = screen.getByText('Cerrar sesión')
      fireEvent.click(logoutButton)

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1)
      })

      expect(window.location.href).toBe('/login')
    })

    it('should have correct button styling', () => {
      render(<Header />)

      const logoutButton = screen.getByText('Cerrar sesión')
      expect(logoutButton).toHaveClass(
        'bg-red-600',
        'hover:bg-red-700',
        'text-white',
        'px-4',
        'py-2',
        'rounded',
        'cursor-pointer',
        'transition-colors'
      )
    })
  })
})
