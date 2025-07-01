import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ordersService } from '@/api/ordersService'

export function useFinalizeOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cartId: string) => ordersService.finalize(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
