import { useQuery } from '@tanstack/react-query'

import { usersService } from '@/api/usersService'

export function useVipUsers() {
  return useQuery({
    queryKey: ['vipUsers'],
    queryFn: usersService.getVipUsers,
  })
}
