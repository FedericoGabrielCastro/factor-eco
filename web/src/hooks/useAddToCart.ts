import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cartsService } from '@/api/cartsService'

export function useAddToCart(cart_type: string = 'COMUN') {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ product_id, quantity }: { product_id: number; quantity?: number }) => {
      return cartsService.addItemToActiveCart(product_id, quantity ?? 1, cart_type)
    },
    onSuccess: async () => {
      // Refetch carts and cart details
      await queryClient.invalidateQueries({ queryKey: ['carts'] })
      // Get the active cart after mutation
      const carts: unknown = queryClient.getQueryData([
        'carts',
        { status: 'ACTIVO', type: cart_type },
      ])
      const activeCart = Array.isArray(carts) && carts.length > 0 ? carts[0] : null
      if (activeCart?.id) {
        await queryClient.invalidateQueries({ queryKey: ['cart', activeCart.id] })
      }
    },
  })
}
