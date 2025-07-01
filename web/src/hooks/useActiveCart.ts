import { useCarts } from './useCarts'
import { useCurrentUser } from './useCurrentUser'
import { usePromotions } from './usePromotions'

export function useActiveCart() {
  const { data: userData } = useCurrentUser()
  const isVip = userData?.user?.profile?.is_vip
  const { data: promotionsData } = usePromotions()
  const hasSpecialDatePromo = (promotionsData?.promotions ?? []).length > 0

  // Determine cart type based on VIP status and special date promotion
  let cartType: 'VIP' | 'FECHA_ESPECIAL' | 'COMUN' = 'COMUN'
  if (isVip) {
    cartType = 'VIP'
  } else if (hasSpecialDatePromo) {
    cartType = 'FECHA_ESPECIAL'
  }

  // Get all active carts for the user (filtered by simulated date)
  const { data: carts, isLoading, error } = useCarts({ status: 'ACTIVO' })
  // Find the active cart of the determined type
  const activeCart = carts?.find((cart: { cart_type: string }) => cart.cart_type === cartType)

  return {
    cart: activeCart,
    isLoading,
    error,
    cartType,
  }
}
