import { beforeEach, describe, expect, it, vi } from 'vitest'

import { vipService } from '../vipService'

// Mock the api module
vi.mock('../http', () => ({
  api: {
    get: vi.fn(),
  },
}))

// Import the mocked api
import { api } from '../http'

describe('VIP Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getStatus', () => {
    it('should fetch VIP status', async () => {
      const mockResponse = {
        data: {
          is_vip: true,
          vip_level: 'gold',
          expires_at: '2024-12-31T23:59:59Z',
        },
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await vipService.getStatus()

      expect(api.get).toHaveBeenCalledWith('/api/users/vip_status/')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle non-VIP status', async () => {
      const mockResponse = {
        data: {
          is_vip: false,
          vip_level: null as null,
          expires_at: null as null,
        },
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await vipService.getStatus()

      expect(api.get).toHaveBeenCalledWith('/api/users/vip_status/')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle different VIP levels', async () => {
      const mockResponse = {
        data: {
          is_vip: true,
          vip_level: 'platinum',
          expires_at: '2024-06-30T23:59:59Z',
        },
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await vipService.getStatus()

      expect(api.get).toHaveBeenCalledWith('/api/users/vip_status/')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getChanges', () => {
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

      const result = await vipService.getChanges(month, year)

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

      const result = await vipService.getChanges(month, year)

      expect(api.get).toHaveBeenCalledWith('/users/api/vip_changes/?month=12&year=2023')
      expect(result).toEqual(mockResponse.data)
    })
    it('should return empty array when no VIP changes exist for period', async () => {
      const mockResponse = { data: [] as any[] }
      const month = 6
      const year = 2024
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await vipService.getChanges(month, year)

      expect(api.get).toHaveBeenCalledWith('/users/api/vip_changes/?month=6&year=2024')
      expect(result).toEqual([])
    })

    it('should handle single digit months', async () => {
      const mockResponse = {
        data: [{ id: 1, user_id: 111, change_type: 'upgrade', date: '2024-03-05' }],
      }
      const month = 3
      const year = 2024
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await vipService.getChanges(month, year)

      expect(api.get).toHaveBeenCalledWith('/users/api/vip_changes/?month=3&year=2024')
      expect(result).toEqual(mockResponse.data)
    })
  })
})
