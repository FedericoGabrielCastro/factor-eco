import { useQuery } from '@tanstack/react-query'

import { cartsService } from '@/api/cartsService'
import { useDate } from '@/context/DateContext'

export function useCarts(filters?: Record<string, unknown>) {
  const { simulatedDate } = useDate()
  const params = { ...filters, fecha: simulatedDate }
  return useQuery({
    queryKey: ['carts', params],
    queryFn: () => cartsService.getAll(params),
  })
}
