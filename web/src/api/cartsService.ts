import { api } from './http'

export const cartsService = {
  // Get all carts with optional filters (type, status, fecha)
  getAll: (params?: Record<string, unknown>) =>
    api.get('/carts/', { params }).then((res) => res.data),

  // Get cart by ID
  getById: (id: string) => api.get(`/carts/${id}/`).then((res) => res.data),

  // Create new cart
  create: (data: { cart_type: string; [key: string]: unknown }) =>
    api.post('/carts/', data).then((res) => res.data),

  // Add item to cart
  addItem: (cartId: string, item: { product_id: number; quantity: number }) =>
    api.post(`/carts/${cartId}/items/`, item).then((res) => res.data),

  // Update cart item (PATCH, not PUT)
  updateItem: (cartId: string, itemId: string, item: unknown) =>
    api.patch(`/carts/${cartId}/items/${itemId}/`, item).then((res) => res.data),

  // Delete cart item
  deleteItem: (cartId: string, itemId: string) =>
    api.delete(`/carts/${cartId}/items/${itemId}/`).then((res) => res.data),

  // Delete cart by ID
  deleteCart: (cartId: string) => api.delete(`/carts/${cartId}/`).then((res) => res.data),

  // Get or create active cart (type can be passed, default COMUN)
  async getOrCreateActiveCart(cart_type: string = 'COMUN') {
    // Try to get active cart
    const carts = await this.getAll({ status: 'ACTIVO', type: cart_type })
    if (Array.isArray(carts) && carts.length > 0) {
      return carts[0]
    }
    // If not found, create one
    return this.create({ cart_type })
  },

  // Add item to active cart (creates cart if needed)
  async addItemToActiveCart(product_id: number, quantity: number = 1, cart_type: string = 'COMUN') {
    let carts = await this.getAll({ status: 'ACTIVO', type: cart_type })
    if (Array.isArray(carts) && carts.length > 0) {
      const cart = carts[0]
      return this.addItem(cart.id, { product_id, quantity })
    } else {
      const cart = await this.create({ cart_type })
      return this.addItem(cart.id, { product_id, quantity })
    }
  },
}
