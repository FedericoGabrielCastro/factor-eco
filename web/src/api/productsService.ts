import { api } from './http'

export const productsService = {
  getAll: () => api.get('/products/').then((res) => res.data),
  getById: (id: number) => api.get(`/products/${id}/`).then((res) => res.data),
}
