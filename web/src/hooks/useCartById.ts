import { useQuery } from '@tanstack/react-query'

import { cartsService } from '@/api/cartsService'
import { useDate } from '@/context/DateContext'

export function useCartById(id: string) {
  const { simulatedDate } = useDate()
  return useQuery({
    queryKey: ['cart', id, simulatedDate],
    queryFn: () => cartsService.getById(id),
    enabled: !!id,
  })
}
