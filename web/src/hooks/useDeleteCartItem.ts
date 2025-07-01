import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cartsService } from '@/api/cartsService'

export function useDeleteCartItem(cartId: string, itemId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => cartsService.deleteItem(cartId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] })
    },
  })
}
