import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sessionService } from '../sessionService'

// Mock the api module
vi.mock('../http', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

// Import the mocked api
import { api } from '../http'

describe('Session Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const mockResponse = {
        data: {
          user: { id: 1, username: 'testuser' },
          token: 'valid-token',
        },
      }
      const loginData = { username: 'testuser', password: 'password123' }
      ;(api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await sessionService.login(loginData)

      expect(api.post).toHaveBeenCalledWith('/session/login/', loginData)
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle login with different credentials', async () => {
      const mockResponse = {
        data: {
          user: { id: 2, username: 'admin' },
          token: 'admin-token',
        },
      }
      const loginData = { username: 'admin', password: 'adminpass' }
      ;(api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await sessionService.login(loginData)

      expect(api.post).toHaveBeenCalledWith('/session/login/', loginData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockResponse = {
        data: { success: true, message: 'Logged out successfully' },
      }
      ;(api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await sessionService.logout()

      expect(api.post).toHaveBeenCalledWith('/session/logout/')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle logout response', async () => {
      const mockResponse = {
        data: { success: true },
      }
      ;(api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await sessionService.logout()

      expect(api.post).toHaveBeenCalledWith('/session/logout/')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('current', () => {
    it('should get current user session', async () => {
      const mockResponse = {
        data: {
          user: { id: 1, username: 'testuser', email: 'test@example.com' },
          isAuthenticated: true,
        },
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await sessionService.current()

      expect(api.get).toHaveBeenCalledWith('/session/me/')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle unauthenticated session', async () => {
      const mockResponse = {
        data: {
          user: null as unknown,
          isAuthenticated: false,
        },
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await sessionService.current()

      expect(api.get).toHaveBeenCalledWith('/session/me/')
      expect(result).toEqual(mockResponse.data)
    })
  })
})
