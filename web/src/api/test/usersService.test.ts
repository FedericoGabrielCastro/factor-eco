import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usersService } from '../usersService'

// Mock the api module
vi.mock('../http', () => ({
  api: {
    get: vi.fn(),
  },
}))

// Import the mocked api
import { api } from '../http'

describe('Users Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getVipUsers', () => {
    it('should fetch VIP users', async () => {
      const mockResponse = {
        data: [
          { id: 1, username: 'vip_user1', vip: true },
          { id: 2, username: 'vip_user2', vip: true },
        ],
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await usersService.getVipUsers()

      expect(api.get).toHaveBeenCalledWith('/api/users/?vip=true')
      expect(result).toEqual(mockResponse.data)
    })
    it('should return empty array when no VIP users exist', async () => {
      const mockResponse = { data: [] as unknown[] }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await usersService.getVipUsers()

      expect(api.get).toHaveBeenCalledWith('/api/users/?vip=true')
      expect(result).toEqual([])
    })
  })

  describe('getVipChanges', () => {
    it('should fetch VIP changes for specific month and year', async () => {
      const mockResponse = {
        data: [
          { id: 1, user_id: 123, change_type: 'upgrade', date: '2024-01-15' },
          { id: 2, user_id: 456, change_type: 'downgrade', date: '2024-01-20' },
        ],
      }
      const month = 1
      const year = 2024
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await usersService.getVipChanges(month, year)

      expect(api.get).toHaveBeenCalledWith('/users/api/vip_changes/?month=1&year=2024')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle different month and year combinations', async () => {
      const mockResponse = {
        data: [{ id: 1, user_id: 789, change_type: 'upgrade', date: '2023-12-01' }],
      }
      const month = 12
      const year = 2023
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await usersService.getVipChanges(month, year)

      expect(api.get).toHaveBeenCalledWith('/users/api/vip_changes/?month=12&year=2023')
      expect(result).toEqual(mockResponse.data)
    })
    it('should return empty array when no VIP changes exist for period', async () => {
      const mockResponse = { data: [] as unknown[] }
      const month = 6
      const year = 2024
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await usersService.getVipChanges(month, year)

      expect(api.get).toHaveBeenCalledWith('/users/api/vip_changes/?month=6&year=2024')
      expect(result).toEqual([])
    })
  })
})
