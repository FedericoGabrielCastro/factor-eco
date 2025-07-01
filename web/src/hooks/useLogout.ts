import { useMutation, useQueryClient } from '@tanstack/react-query'

import { sessionService } from '@/api/sessionService'

// Hook to perform logout using React Query mutation
export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: sessionService.logout,
    onSuccess: () => {
      // Invalidate current user cache after logout
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}
