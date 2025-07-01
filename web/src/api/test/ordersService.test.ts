import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ordersService } from '../ordersService'

// Mock the api module
vi.mock('../http', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

// Import the mocked api
import { api } from '../http'

describe('Orders Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all orders', async () => {
      const mockResponse = {
        data: [
          { id: 1, cart_id: 'cart-1', status: 'completed', total: 150.0 },
          { id: 2, cart_id: 'cart-2', status: 'pending', total: 75.5 },
          { id: 3, cart_id: 'cart-3', status: 'completed', total: 200.25 },
        ],
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await ordersService.getAll()

      expect(api.get).toHaveBeenCalledWith('/orders/')
      expect(result).toEqual(mockResponse.data)
    })

    it('should return empty array when no orders exist', async () => {
      const mockResponse = { data: [] as unknown[] }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await ordersService.getAll()

      expect(api.get).toHaveBeenCalledWith('/orders/')
      expect(result).toEqual([])
    })

    it('should handle single order response', async () => {
      const mockResponse = {
        data: [{ id: 1, cart_id: 'cart-1', status: 'completed', total: 100.0 }],
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await ordersService.getAll()

      expect(api.get).toHaveBeenCalledWith('/orders/')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('finalize', () => {
    it('should finalize order with cart ID', async () => {
      const mockResponse = {
        data: {
          id: 1,
          cart_id: 'cart-123',
          status: 'completed',
          total: 150.0,
          created_at: '2024-01-15T10:30:00Z',
        },
      }
      const cartId = 'cart-123'
      ;(api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await ordersService.finalize(cartId)

      expect(api.post).toHaveBeenCalledWith('/orders/create/', { cart_id: cartId })
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle different cart IDs', async () => {
      const mockResponse = {
        data: {
          id: 2,
          cart_id: 'cart-456',
          status: 'completed',
          total: 75.5,
          created_at: '2024-01-16T14:20:00Z',
        },
      }
      const cartId = 'cart-456'
      ;(api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await ordersService.finalize(cartId)

      expect(api.post).toHaveBeenCalledWith('/orders/create/', { cart_id: cartId })
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle numeric cart IDs', async () => {
      const mockResponse = {
        data: {
          id: 3,
          cart_id: '123',
          status: 'completed',
          total: 200.0,
          created_at: '2024-01-17T09:15:00Z',
        },
      }
      const cartId = '123'
      ;(api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await ordersService.finalize(cartId)

      expect(api.post).toHaveBeenCalledWith('/orders/create/', { cart_id: cartId })
      expect(result).toEqual(mockResponse.data)
    })
  })
})
