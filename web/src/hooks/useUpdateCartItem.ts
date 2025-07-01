import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cartsService } from '@/api/cartsService'

interface UpdateCartItemData {
  quantity: number
}

export function useUpdateCartItem(cartId: string, itemId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (item: UpdateCartItemData) => cartsService.updateItem(cartId, itemId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] })
      queryClient.invalidateQueries({ queryKey: ['carts'] })
    },
  })
}
