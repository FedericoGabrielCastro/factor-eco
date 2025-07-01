import React from 'react'

import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sessionService } from '@/api/sessionService'

import { AuthProvider, useAuth } from '../AuthContext'

// Mock sessionService
vi.mock('@/api/sessionService', () => ({
  sessionService: {
    login: vi.fn(),
    logout: vi.fn(),
    current: vi.fn(),
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Wrapper component for testing
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    // Default mock for sessionService.current to avoid real errors
    ;(sessionService.current as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Not authenticated')
    )
    ;(sessionService.login as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Not implemented')
    )
    ;(sessionService.logout as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true })
  })

  describe('AuthProvider', () => {
    it('should initialize with no user when no stored user', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toBe(null)
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('should initialize with stored user from localStorage', async () => {
      const storedUser = { id: 1, username: 'testuser', email: 'test@example.com' }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedUser))
      ;(sessionService.current as ReturnType<typeof vi.fn>).mockResolvedValue({ user: storedUser })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toEqual(storedUser)
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('should handle login successfully', async () => {
      const user = { id: 1, username: 'testuser', email: 'test@example.com' }
      ;(sessionService.login as ReturnType<typeof vi.fn>).mockResolvedValue({ user })
      ;(sessionService.current as ReturnType<typeof vi.fn>).mockResolvedValue({ user })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.login('testuser', 'password123')
      })

      expect(sessionService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      })
      expect(sessionService.current).toHaveBeenCalled()
      expect(result.current.user).toEqual(user)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.error).toBe(null)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('authUser', JSON.stringify(user))
    })

    it('should handle login failure', async () => {
      ;(sessionService.login as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Invalid credentials')
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        try {
          await result.current.login('testuser', 'wrongpassword')
        } catch {
          // Expected to throw
        }
      })

      expect(sessionService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'wrongpassword',
      })
      expect(result.current.error).toBe('Invalid credentials or server error')
      expect(result.current.user).toBe(null)
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should handle logout successfully', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.logout()
      })

      expect(sessionService.logout).toHaveBeenCalled()
      expect(result.current.user).toBe(null)
      expect(result.current.isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('authUser')
    })

    it('should check authentication on mount', async () => {
      const user = { id: 1, username: 'testuser', email: 'test@example.com' }
      ;(sessionService.current as ReturnType<typeof vi.fn>).mockResolvedValue({ user })

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.loading).toBe(true)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(sessionService.current).toHaveBeenCalled()
      expect(result.current.user).toEqual(user)
      expect(result.current.isAuthenticated).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('authUser', JSON.stringify(user))
    })

    it('should handle authentication check failure', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.loading).toBe(true)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(sessionService.current).toHaveBeenCalled()
      expect(result.current.user).toBe(null)
      expect(result.current.isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('authUser')
    })

    it('should handle loading states correctly', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.loading).toBe(true)
      expect(result.current.isLoading).toBe(false)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Test isLoading during login
      const loginPromise = new Promise((resolve) => setTimeout(resolve, 100))
      ;(sessionService.login as ReturnType<typeof vi.fn>).mockImplementation(() => loginPromise)

      act(() => {
        result.current.login('testuser', 'password123')
      })

      expect(result.current.isLoading).toBe(true)
    })

    it('should clear error on successful login', async () => {
      const user = { id: 1, username: 'testuser', email: 'test@example.com' }

      // First, simulate a failed login to set an error
      ;(sessionService.login as ReturnType<typeof vi.fn>)
        .mockRejectedValueOnce(new Error('Invalid credentials'))
        .mockResolvedValueOnce({ user })
      ;(sessionService.current as ReturnType<typeof vi.fn>).mockResolvedValue({ user })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // First login attempt - should fail and set error
      await act(async () => {
        try {
          await result.current.login('testuser', 'wrongpassword')
        } catch {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe('Invalid credentials or server error')

      // Second login attempt - should succeed and clear error
      await act(async () => {
        await result.current.login('testuser', 'password123')
      })

      expect(result.current.error).toBe(null)
    })
  })

  describe('useAuth hook', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useAuth())
      }).toThrow('useAuth must be used within AuthProvider')
    })

    it('should provide all required context values', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current).toHaveProperty('user')
      expect(result.current).toHaveProperty('loading')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('login')
      expect(result.current).toHaveProperty('logout')
      expect(result.current).toHaveProperty('checkAuth')
      expect(result.current).toHaveProperty('isAuthenticated')
    })
  })

  describe('User state management', () => {
    it('should handle different user types', async () => {
      const adminUser = { id: 2, username: 'admin', email: 'admin@example.com' }
      ;(sessionService.current as ReturnType<typeof vi.fn>).mockResolvedValue({ user: adminUser })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toEqual(adminUser)
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('should handle null user correctly', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toBe(null)
      expect(result.current.isAuthenticated).toBe(false)
    })
  })
})
