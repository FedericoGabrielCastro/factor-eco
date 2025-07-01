import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cartsService } from '@/api/cartsService'
import { useDate } from '@/context/DateContext'

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient()
  const { simulatedDate } = useDate()
  return useMutation({
    mutationFn: ({
      cartId,
      itemId,
      quantity,
    }: {
      cartId: string
      itemId: string
      quantity: number
    }) => cartsService.updateItem(cartId, itemId, { quantity }),
    onSuccess: (_, { cartId }) => {
      // Invalidate only the specific cart query with simulatedDate
      queryClient.invalidateQueries({ queryKey: ['cart', cartId, simulatedDate] })
      // Invalidate the carts list as well
      queryClient.invalidateQueries({ queryKey: ['carts'] })
    },
  })
}
