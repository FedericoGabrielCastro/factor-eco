import { useQuery } from '@tanstack/react-query'

import { sessionService } from '@/api/sessionService'

// Hook to fetch the current authenticated user using React Query
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: sessionService.current,
    retry: false, // Do not retry on failure (e.g., not authenticated)
  })
}
