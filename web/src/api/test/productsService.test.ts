import { beforeEach, describe, expect, it, vi } from 'vitest'

import { productsService } from '../productsService'

// Mock the api module
vi.mock('../http', () => ({
  api: {
    get: vi.fn(),
  },
}))

// Import the mocked api
import { api } from '../http'

describe('Products Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all products', async () => {
      const mockResponse = {
        data: [
          { id: 1, name: 'Product 1', price: 10.99 },
          { id: 2, name: 'Product 2', price: 20.5 },
          { id: 3, name: 'Product 3', price: 15.75 },
        ],
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await productsService.getAll()

      expect(api.get).toHaveBeenCalledWith('/products/')
      expect(result).toEqual(mockResponse.data)
    })

    it('should return empty array when no products exist', async () => {
      const mockResponse = { data: [] as unknown[] }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await productsService.getAll()

      expect(api.get).toHaveBeenCalledWith('/products/')
      expect(result).toEqual([])
    })

    it('should handle single product response', async () => {
      const mockResponse = {
        data: [{ id: 1, name: 'Single Product', price: 25.0 }],
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await productsService.getAll()

      expect(api.get).toHaveBeenCalledWith('/products/')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getById', () => {
    it('should fetch product by ID', async () => {
      const mockResponse = {
        data: { id: 1, name: 'Product 1', price: 10.99, description: 'Test product' },
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await productsService.getById(1)

      expect(api.get).toHaveBeenCalledWith('/products/1/')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle different product IDs', async () => {
      const mockResponse = {
        data: { id: 5, name: 'Product 5', price: 50.0, category: 'Electronics' },
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await productsService.getById(5)

      expect(api.get).toHaveBeenCalledWith('/products/5/')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle large product IDs', async () => {
      const mockResponse = {
        data: { id: 999, name: 'Premium Product', price: 199.99, featured: true },
      }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await productsService.getById(999)

      expect(api.get).toHaveBeenCalledWith('/products/999/')
      expect(result).toEqual(mockResponse.data)
    })
  })
})
