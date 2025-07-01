import axios from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(),
    AxiosHeaders: {
      from: vi.fn((headers) => headers),
    },
  },
}))

// Mock document.cookie and localStorage
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
})

Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
})

describe('HTTP Service', () => {
  let mockAxiosInstance: any

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks()

    // Create mock axios instance
    mockAxiosInstance = {
      interceptors: {
        request: {
          use: vi.fn(),
        },
      },
    }
    ;(axios.create as any).mockReturnValue(mockAxiosInstance)

    // Re-import to trigger the interceptors setup
    vi.resetModules()
    await import('../http')
  })

  afterEach(() => {
    // Clean up
    document.cookie = ''
    vi.clearAllMocks()
  })

  describe('axios.create', () => {
    it('should create axios instance with correct baseURL', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:8000',
        withCredentials: true,
      })
    })

    it('should set withCredentials to true', () => {
      const callArgs = (axios.create as any).mock.calls[0][0]
      expect(callArgs.withCredentials).toBe(true)
    })
  })

  describe('request interceptor', () => {
    let interceptorCallback: any

    beforeEach(() => {
      // Get the interceptor callback
      interceptorCallback = mockAxiosInstance.interceptors.request.use.mock.calls[0][0]
    })

    it('should add CSRF token for POST requests', () => {
      // Set up cookie
      document.cookie = 'csrftoken=test-csrf-token'

      const config = {
        method: 'post',
        url: '/test/',
        headers: {},
      }

      const result = interceptorCallback(config)

      expect(result.headers['X-CSRFToken']).toBe('test-csrf-token')
    })

    it('should add CSRF token for PUT requests', () => {
      document.cookie = 'csrftoken=test-csrf-token'

      const config = {
        method: 'put',
        url: '/test/',
        headers: {},
      }

      const result = interceptorCallback(config)

      expect(result.headers['X-CSRFToken']).toBe('test-csrf-token')
    })

    it('should add CSRF token for PATCH requests', () => {
      document.cookie = 'csrftoken=test-csrf-token'

      const config = {
        method: 'patch',
        url: '/test/',
        headers: {},
      }

      const result = interceptorCallback(config)

      expect(result.headers['X-CSRFToken']).toBe('test-csrf-token')
    })

    it('should add CSRF token for DELETE requests', () => {
      document.cookie = 'csrftoken=test-csrf-token'

      const config = {
        method: 'delete',
        url: '/test/',
        headers: {},
      }

      const result = interceptorCallback(config)

      expect(result.headers['X-CSRFToken']).toBe('test-csrf-token')
    })

    it('should not add CSRF token for GET requests', () => {
      document.cookie = 'csrftoken=test-csrf-token'

      const config = {
        method: 'get',
        url: '/test/',
        headers: {},
      }

      const result = interceptorCallback(config)

      expect(result.headers['X-CSRFToken']).toBeUndefined()
    })

    it('should create headers object if not present', () => {
      document.cookie = 'csrftoken=test-csrf-token'

      const config = {
        method: 'post',
        url: '/test/',
      }

      const result = interceptorCallback(config)

      expect(result.headers).toBeDefined()
      expect(result.headers['X-CSRFToken']).toBe('test-csrf-token')
    })

    it('should not add CSRF token if cookie is not present', () => {
      const config = {
        method: 'post',
        url: '/test/',
        headers: {},
      }

      const result = interceptorCallback(config)

      expect(result.headers['X-CSRFToken']).toBeUndefined()
    })

    it('should add simulated date to promotions route', () => {
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('2024-01-15'),
      }
      Object.defineProperty(window, 'localStorage', {
        writable: true,
        value: mockLocalStorage,
      })

      const config = {
        method: 'get',
        url: '/promotions/',
      }

      const result = interceptorCallback(config)

      expect(result.url).toBe('/promotions/?fecha=2024-01-15')
    })

    it('should add simulated date to carts route', () => {
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('2024-01-15'),
      }
      Object.defineProperty(window, 'localStorage', {
        writable: true,
        value: mockLocalStorage,
      })

      const config = {
        method: 'get',
        url: '/carts/',
      }

      const result = interceptorCallback(config)

      expect(result.url).toBe('/carts/?fecha=2024-01-15')
    })

    it('should add simulated date to orders route', () => {
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('2024-01-15'),
      }
      Object.defineProperty(window, 'localStorage', {
        writable: true,
        value: mockLocalStorage,
      })

      const config = {
        method: 'get',
        url: '/orders/',
      }

      const result = interceptorCallback(config)

      expect(result.url).toBe('/orders/?fecha=2024-01-15')
    })

    it('should add simulated date to products route', () => {
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('2024-01-15'),
      }
      Object.defineProperty(window, 'localStorage', {
        writable: true,
        value: mockLocalStorage,
      })

      const config = {
        method: 'get',
        url: '/products/',
      }

      const result = interceptorCallback(config)

      expect(result.url).toBe('/products/?fecha=2024-01-15')
    })

    it('should append simulated date with & if URL already has query params', () => {
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('2024-01-15'),
      }
      Object.defineProperty(window, 'localStorage', {
        writable: true,
        value: mockLocalStorage,
      })

      const config = {
        method: 'get',
        url: '/promotions/?existing=param',
      }

      const result = interceptorCallback(config)

      expect(result.url).toBe('/promotions/?existing=param&fecha=2024-01-15')
    })

    it('should not add simulated date to non-date routes', () => {
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('2024-01-15'),
      }
      Object.defineProperty(window, 'localStorage', {
        writable: true,
        value: mockLocalStorage,
      })

      const config = {
        method: 'get',
        url: '/users/',
      }

      const result = interceptorCallback(config)

      expect(result.url).toBe('/users/')
    })

    it('should not add simulated date if localStorage is empty', () => {
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue(null),
      }
      Object.defineProperty(window, 'localStorage', {
        writable: true,
        value: mockLocalStorage,
      })

      const config = {
        method: 'get',
        url: '/promotions/',
      }

      const result = interceptorCallback(config)

      expect(result.url).toBe('/promotions/')
    })
  })
})
