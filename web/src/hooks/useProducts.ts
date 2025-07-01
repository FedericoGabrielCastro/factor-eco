import { useQuery } from '@tanstack/react-query'

import { productsService } from '@/api/productsService'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsService.getAll,
  })
}
