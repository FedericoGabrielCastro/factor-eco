import { beforeEach, describe, expect, it, vi } from 'vitest'

import { promotionsService } from '../promotionsService'

// Mock the api module
vi.mock('../http', () => ({
  api: {
    get: vi.fn(),
  },
}))

// Import the mocked api
import { api } from '../http'

describe('Promotions Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getActivePromotions', () => {
    it('should fetch active promotions for current date', async () => {
      const mockResponse = {
        data: [
          { id: 1, name: 'Black Friday', active: true },
          { id: 2, name: 'Cyber Monday', active: true },
        ],
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await promotionsService.getActivePromotions()

      expect(api.get).toHaveBeenCalledWith('/promotions/special-dates/')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getPromotionsByDate', () => {
    it('should fetch promotions without date parameter', async () => {
      const mockResponse = {
        data: [{ id: 1, name: 'Black Friday', active: true }],
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await promotionsService.getPromotionsByDate()

      expect(api.get).toHaveBeenCalledWith('/promotions/special-dates/')
      expect(result).toEqual(mockResponse.data)
    })

    it('should fetch promotions with specific date parameter', async () => {
      const mockResponse = {
        data: [{ id: 1, name: 'Christmas Sale', active: true }],
      }
      const date = '2024-12-25'
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await promotionsService.getPromotionsByDate(date)

      expect(api.get).toHaveBeenCalledWith('/promotions/special-dates/?fecha=2024-12-25')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getPromotionById', () => {
    it('should fetch promotion by ID', async () => {
      const mockResponse = {
        data: { id: 1, name: 'Black Friday', active: true, discount: 20 },
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await promotionsService.getPromotionById(1)

      expect(api.get).toHaveBeenCalledWith('/promotions/special-dates/1/')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle different promotion IDs', async () => {
      const mockResponse = {
        data: { id: 5, name: 'Summer Sale', active: false, discount: 15 },
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await promotionsService.getPromotionById(5)

      expect(api.get).toHaveBeenCalledWith('/promotions/special-dates/5/')
      expect(result).toEqual(mockResponse.data)
    })
  })
})
