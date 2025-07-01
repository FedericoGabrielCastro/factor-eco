import { beforeEach, describe, expect, it, vi } from 'vitest'

import { cartsService } from '../cartsService'

// Mock the api module
vi.mock('../http', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

// Import the mocked api
import { api } from '../http'

describe('Carts Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all carts without parameters', async () => {
      const mockResponse = { data: [{ id: 1, cart_type: 'COMUN' }] }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await cartsService.getAll()

      expect(api.get).toHaveBeenCalledWith('/carts/', { params: undefined })
      expect(result).toEqual(mockResponse.data)
    })

    it('should fetch all carts with parameters', async () => {
      const mockResponse = { data: [{ id: 1, cart_type: 'VIP' }] }
      const params = { status: 'ACTIVO', type: 'VIP' }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await cartsService.getAll(params)

      expect(api.get).toHaveBeenCalledWith('/carts/', { params })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getById', () => {
    it('should fetch cart by ID', async () => {
      const mockResponse = { data: { id: '1', cart_type: 'COMUN' } }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await cartsService.getById('1')

      expect(api.get).toHaveBeenCalledWith('/carts/1/')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('create', () => {
    it('should create a new cart', async () => {
      const mockResponse = { data: { id: '1', cart_type: 'COMUN' } }
      const cartData = { cart_type: 'COMUN' }
      ;(api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await cartsService.create(cartData)

      expect(api.post).toHaveBeenCalledWith('/carts/', cartData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('addItem', () => {
    it('should add item to cart', async () => {
      const mockResponse = { data: { id: '1', product_id: 123, quantity: 2 } }
      const item = { product_id: 123, quantity: 2 }
      ;(api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await cartsService.addItem('1', item)

      expect(api.post).toHaveBeenCalledWith('/carts/1/items/', item)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('updateItem', () => {
    it('should update cart item', async () => {
      const mockResponse = { data: { id: '1', quantity: 3 } }
      const item = { quantity: 3 }
      ;(api.patch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await cartsService.updateItem('1', '1', item)

      expect(api.patch).toHaveBeenCalledWith('/carts/1/items/1/', item)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('deleteItem', () => {
    it('should delete cart item', async () => {
      const mockResponse = { data: { success: true } }
      ;(api.delete as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await cartsService.deleteItem('1', '1')

      expect(api.delete).toHaveBeenCalledWith('/carts/1/items/1/')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('deleteCart', () => {
    it('should delete cart by ID', async () => {
      const mockResponse = { data: { success: true } }
      ;(api.delete as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)

      const result = await cartsService.deleteCart('1')

      expect(api.delete).toHaveBeenCalledWith('/carts/1/')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getOrCreateActiveCart', () => {
    it('should return existing active cart', async () => {
      const existingCarts = [{ id: '1', cart_type: 'COMUN', status: 'ACTIVO' }]
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: existingCarts })

      const result = await cartsService.getOrCreateActiveCart('COMUN')

      expect(api.get).toHaveBeenCalledWith('/carts/', {
        params: { status: 'ACTIVO', type: 'COMUN' },
      })
      expect(result).toEqual(existingCarts[0])
    })

    it('should create new cart if no active cart exists', async () => {
      const emptyCarts: unknown[] = []
      const newCart = { id: '2', cart_type: 'VIP' }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: emptyCarts })
      ;(api.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ data: newCart })

      const result = await cartsService.getOrCreateActiveCart('VIP')

      expect(api.get).toHaveBeenCalledWith('/carts/', { params: { status: 'ACTIVO', type: 'VIP' } })
      expect(api.post).toHaveBeenCalledWith('/carts/', { cart_type: 'VIP' })
      expect(result).toEqual(newCart)
    })

    it('should use COMUN as default cart type', async () => {
      const existingCarts = [{ id: '1', cart_type: 'COMUN', status: 'ACTIVO' }]
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: existingCarts })

      await cartsService.getOrCreateActiveCart()

      expect(api.get).toHaveBeenCalledWith('/carts/', {
        params: { status: 'ACTIVO', type: 'COMUN' },
      })
    })
  })

  describe('addItemToActiveCart', () => {
    it('should add item to existing active cart', async () => {
      const existingCarts = [{ id: '1', cart_type: 'COMUN', status: 'ACTIVO' }]
      const addedItem = { id: '1', product_id: 123, quantity: 2 }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: existingCarts })
      ;(api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: addedItem })

      const result = await cartsService.addItemToActiveCart(123, 2, 'COMUN')

      expect(api.get).toHaveBeenCalledWith('/carts/', {
        params: { status: 'ACTIVO', type: 'COMUN' },
      })
      expect(api.post).toHaveBeenCalledWith('/carts/1/items/', { product_id: 123, quantity: 2 })
      expect(result).toEqual(addedItem)
    })

    it('should create new cart and add item if no active cart exists', async () => {
      const emptyCarts: unknown[] = []
      const newCart = { id: '2', cart_type: 'VIP' }
      const addedItem = { id: '1', product_id: 123, quantity: 1 }
      ;(api.get as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({ data: emptyCarts })
        .mockResolvedValueOnce({ data: newCart })
      ;(api.post as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({ data: newCart })
        .mockResolvedValueOnce({ data: addedItem })

      const result = await cartsService.addItemToActiveCart(123, 1, 'VIP')

      expect(api.get).toHaveBeenCalledWith('/carts/', { params: { status: 'ACTIVO', type: 'VIP' } })
      expect(api.post).toHaveBeenCalledWith('/carts/', { cart_type: 'VIP' })
      expect(api.post).toHaveBeenCalledWith('/carts/2/items/', { product_id: 123, quantity: 1 })
      expect(result).toEqual(addedItem)
    })

    it('should use default values for quantity and cart type', async () => {
      const existingCarts = [{ id: '1', cart_type: 'COMUN', status: 'ACTIVO' }]
      const addedItem = { id: '1', product_id: 123, quantity: 1 }
      ;(api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: existingCarts })
      ;(api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: addedItem })

      await cartsService.addItemToActiveCart(123)

      expect(api.get).toHaveBeenCalledWith('/carts/', {
        params: { status: 'ACTIVO', type: 'COMUN' },
      })
      expect(api.post).toHaveBeenCalledWith('/carts/1/items/', { product_id: 123, quantity: 1 })
    })
  })
})
