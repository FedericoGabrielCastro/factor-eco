import { api } from './http'

export const sessionService = {
  login: (data: { username: string; password: string }) =>
    api.post('/session/login/', data).then((res) => res.data),
  logout: () => api.post('/session/logout/').then((res) => res.data),
  current: () => api.get('/session/me/').then((res) => res.data),
}
