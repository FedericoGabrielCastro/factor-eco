import { api } from './http'

export const vipService = {
  getStatus: () => api.get('/api/users/vip_status/').then((res) => res.data),
  getChanges: (month: number, year: number) =>
    api.get(`/users/api/vip_changes/?month=${month}&year=${year}`).then((res) => res.data),
}
