import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import AppRouter from '../AppRouter'

// Default: unauthenticated
vi.mock('@/context/AuthContext', () => {
  return {
    useAuth: () => ({ user: null as null, loading: false }),
  }
})

describe('AppRouter', () => {
  it('renders login page for unauthenticated users', async () => {
    window.history.pushState({}, '', '/login')
    render(<AppRouter />)
    await waitFor(() => {
      expect(screen.getByText(/Inicia sesión en tu cuenta/i)).toBeInTheDocument()
    })
  })

  it('redirects unauthenticated users from private routes to login', async () => {
    window.history.pushState({}, '', '/products')
    render(<AppRouter />)
    await waitFor(() => {
      expect(screen.getByText(/Inicia sesión en tu cuenta/i)).toBeInTheDocument()
    })
  })

  it('renders 404 fallback to products for unknown routes', async () => {
    window.history.pushState({}, '', '/unknown-route')
    render(<AppRouter />)
    await waitFor(() => {
      expect(screen.getByText(/Inicia sesión en tu cuenta/i)).toBeInTheDocument()
    })
  })
})

// Authenticated user coverage for MainLayout
vi.doMock('@/context/AuthContext', () => {
  return {
    useAuth: () => ({ user: { username: 'testuser1' }, loading: false }),
  }
})
