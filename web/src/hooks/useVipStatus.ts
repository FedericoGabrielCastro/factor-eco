import { useQuery } from '@tanstack/react-query'

import { vipService } from '@/api/vipService'

export const useVipStatus = () => {
  return useQuery({
    queryKey: ['vipStatus'],
    queryFn: vipService.getStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
