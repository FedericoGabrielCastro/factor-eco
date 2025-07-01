import React from 'react'

import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DateProvider, useDate } from '../DateContext'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock Date
const mockDate = new Date('2024-01-15T10:00:00.000Z')
vi.spyOn(global, 'Date').mockImplementation(() => mockDate)

// Wrapper component for testing
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <DateProvider>{children}</DateProvider>
)

describe('DateContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('DateProvider', () => {
    it('should initialize with today date when no stored date', () => {
      const { result } = renderHook(() => useDate(), { wrapper })

      expect(result.current.simulatedDate).toBe('2024-01-15')
      expect(result.current.isSimulated).toBe(false)
    })

    it('should initialize with stored date from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('2024-12-25')

      const { result } = renderHook(() => useDate(), { wrapper })

      expect(result.current.simulatedDate).toBe('2024-12-25')
      expect(result.current.isSimulated).toBe(true)
    })

    it('should set simulated date and persist to localStorage', async () => {
      const { result } = renderHook(() => useDate(), { wrapper })

      act(() => {
        result.current.setSimulatedDate('2024-06-15')
      })

      expect(result.current.simulatedDate).toBe('2024-06-15')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('simulatedDate', '2024-06-15')
      expect(result.current.isSimulated).toBe(true)
    })

    it('should clear simulated date and remove from localStorage', async () => {
      const { result } = renderHook(() => useDate(), { wrapper })

      act(() => {
        result.current.setSimulatedDate(null)
      })

      expect(result.current.simulatedDate).toBe(null)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('simulatedDate')
      expect(result.current.isSimulated).toBe(false)
    })

    it('should reset to today date', async () => {
      const { result } = renderHook(() => useDate(), { wrapper })

      act(() => {
        result.current.setSimulatedDate('2024-12-25')
      })

      expect(result.current.simulatedDate).toBe('2024-12-25')

      act(() => {
        result.current.resetToToday()
      })

      expect(result.current.simulatedDate).toBe('2024-01-15')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('simulatedDate', '2024-01-15')
      expect(result.current.isSimulated).toBe(false)
    })

    it('should detect simulated date correctly', () => {
      localStorageMock.getItem.mockReturnValue('2024-12-25')

      const { result } = renderHook(() => useDate(), { wrapper })

      expect(result.current.isSimulated).toBe(true)
    })

    it('should detect non-simulated date correctly', () => {
      const { result } = renderHook(() => useDate(), { wrapper })

      expect(result.current.isSimulated).toBe(false)
    })

    it('should handle storage events', async () => {
      const { result } = renderHook(() => useDate(), { wrapper })

      // Simulate storage event
      const storageEvent = new StorageEvent('storage', {
        key: 'simulatedDate',
        newValue: '2024-12-25',
        oldValue: null,
      })

      act(() => {
        window.dispatchEvent(storageEvent)
      })

      await waitFor(() => {
        expect(result.current.simulatedDate).toBe('2024-12-25')
      })
    })

    it('should ignore storage events for different keys', async () => {
      const { result } = renderHook(() => useDate(), { wrapper })

      const initialDate = result.current.simulatedDate

      // Simulate storage event for different key
      const storageEvent = new StorageEvent('storage', {
        key: 'otherKey',
        newValue: 'someValue',
        oldValue: null,
      })

      act(() => {
        window.dispatchEvent(storageEvent)
      })

      expect(result.current.simulatedDate).toBe(initialDate)
    })
  })

  describe('useDate hook', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useDate())
      }).toThrow('useDate must be used within DateProvider')
    })

    it('should provide all required context values', () => {
      const { result } = renderHook(() => useDate(), { wrapper })

      expect(result.current).toHaveProperty('simulatedDate')
      expect(result.current).toHaveProperty('setSimulatedDate')
      expect(result.current).toHaveProperty('resetToToday')
      expect(result.current).toHaveProperty('isSimulated')
    })
  })

  describe('Date formatting', () => {
    it('should format today date correctly', () => {
      const { result } = renderHook(() => useDate(), { wrapper })

      expect(result.current.simulatedDate).toBe('2024-01-15')
    })

    it('should handle different date formats', () => {
      const { result } = renderHook(() => useDate(), { wrapper })

      act(() => {
        result.current.setSimulatedDate('2024-12-31')
      })

      expect(result.current.simulatedDate).toBe('2024-12-31')
      expect(result.current.isSimulated).toBe(true)
    })
  })
})
