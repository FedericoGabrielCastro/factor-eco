import { useQuery } from '@tanstack/react-query'

import { ordersService } from '@/api/ordersService'

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getAll,
  })
}
