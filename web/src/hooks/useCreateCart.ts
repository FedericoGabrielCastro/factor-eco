import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cartsService } from '@/api/cartsService'

export function useCreateCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cartsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts'] })
    },
  })
}
