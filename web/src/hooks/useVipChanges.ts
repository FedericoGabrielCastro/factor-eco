import { useQuery } from '@tanstack/react-query'

import { usersService } from '@/api/usersService'

export function useVipChanges(month: number, year: number) {
  return useQuery({
    queryKey: ['vipChanges', month, year],
    queryFn: () => usersService.getVipChanges(month, year),
    enabled: !!month && !!year,
  })
}
