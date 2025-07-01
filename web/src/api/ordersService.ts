import { api } from './http'

export const ordersService = {
  getAll: () => api.get('/orders/').then((res) => res.data),
  finalize: (cartId: string) =>
    api.post('/orders/create/', { cart_id: cartId }).then((res) => res.data),
}
