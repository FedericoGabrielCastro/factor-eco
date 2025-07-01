import axios from 'axios'

const baseURL = 'http://localhost:8000'

export const api = axios.create({
  baseURL,
  withCredentials: true, // Send cookies with requests
})

// Add CSRF token and simulated date to every request if available
api.interceptors.request.use((config) => {
  // Utility to get a cookie value by name
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
  }
  const csrftoken = getCookie('csrftoken')

  // Add CSRF token to headers for unsafe methods
  if (csrftoken && config.method && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
    if (!config.headers) {
      config.headers = axios.AxiosHeaders.from({})
    }
    config.headers['X-CSRFToken'] = csrftoken
  }

  // Add simulated date as query param for specific routes
  const simulatedDate = localStorage.getItem('simulatedDate')
  if (simulatedDate) {
    const url = config.url || ''
    // Routes that need simulated date (more flexible)
    const dateRoutes = ['/promotions/', '/carts/', '/orders/', '/products/']
    const needsDate = dateRoutes.some((route) => url.includes(route))
    if (needsDate) {
      const separator = url.includes('?') ? '&' : '?'
      config.url = `${url}${separator}fecha=${simulatedDate}`
    }
  }

  return config
})
