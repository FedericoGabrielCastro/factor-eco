import { api } from './http'

export const usersService = {
  getVipUsers: () => api.get('/api/users/?vip=true').then((res) => res.data),
  getVipChanges: (month: number, year: number) =>
    api.get(`/users/api/vip_changes/?month=${month}&year=${year}`).then((res) => res.data),
}
