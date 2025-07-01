import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cartsService } from '@/api/cartsService'

export function useDeleteCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cartId: string) => cartsService.deleteCart(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts'] })
    },
  })
}
