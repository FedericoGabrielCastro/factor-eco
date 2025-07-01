import { describe, expect, it } from 'vitest'

import { formatDate } from '../formatDate'

describe('formatDate', () => {
  it('formats a valid date in long Spanish format', () => {
    const result = formatDate('2024-06-01')
    expect(['1 de junio de 2024', '31 de mayo de 2024']).toContain(result)
  })

  it('returns N/A if the date is null', () => {
    expect(formatDate(null as unknown as string)).toBe('N/A')
  })

  it('returns N/A if the date is an empty string', () => {
    expect(formatDate('')).toBe('N/A')
  })

  it('returns N/A if the date is invalid', () => {
    expect(formatDate('invalid-date')).toBe('N/A')
  })
})
