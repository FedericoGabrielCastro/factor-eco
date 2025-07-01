import { useQuery } from '@tanstack/react-query'

import { promotionsService } from '@/api/promotionsService'
import { useDate } from '@/context/DateContext'

export const usePromotions = () => {
  const { simulatedDate } = useDate()
  return useQuery({
    queryKey: ['promotions', simulatedDate],
    queryFn: () => promotionsService.getPromotionsByDate(simulatedDate),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const usePromotionsByDate = (date?: string) => {
  return useQuery({
    queryKey: ['promotions', date],
    queryFn: () => promotionsService.getPromotionsByDate(date),
    enabled: !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
