import { api } from './http'

export const promotionsService = {
  // Get active promotions for current simulated date
  getActivePromotions: () => api.get('/promotions/special-dates/').then((res) => res.data),

  // Get promotions by date (optional override)
  getPromotionsByDate: (date?: string) => {
    const url = date ? `/promotions/special-dates/?fecha=${date}` : '/promotions/special-dates/'
    return api.get(url).then((res) => res.data)
  },

  // Get promotion details
  getPromotionById: (id: number) =>
    api.get(`/promotions/special-dates/${id}/`).then((res) => res.data),
}
