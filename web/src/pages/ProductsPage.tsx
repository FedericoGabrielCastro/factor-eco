import React from 'react'
import { FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi'
import { FiTrash2 } from 'react-icons/fi'

import { useActiveCart } from '@/hooks/useActiveCart'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useProducts } from '@/hooks/useProducts'
import { useUpdateCartItemQuantity } from '@/hooks/useUpdateCartItemQuantity'

interface Product {
  id: number
  name: string
  description: string
  price: number
}

interface CartItem {
  id: string
  quantity: number
  product: {
    id: number
    name: string
    price: number
  }
}

// Internal ProductCard component
const ProductCard: React.FC<{
  product: Product
  cartQuantity: number
  cartItemId?: string
  onAddToCart: (productId: number, quantity: number) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  isUpdating: boolean
}> = ({ product, cartQuantity, cartItemId, onAddToCart, onUpdateQuantity, isUpdating }) => {
  const handleIncrement = () => {
    if (cartItemId) {
      onUpdateQuantity(cartItemId, cartQuantity + 1)
    } else {
      onAddToCart(product.id, 1)
    }
  }

  const handleDecrement = () => {
    if (cartItemId && cartQuantity > 1) {
      onUpdateQuantity(cartItemId, cartQuantity - 1)
    }
  }

  const handleDelete = () => {
    if (cartItemId) {
      onUpdateQuantity(cartItemId, 0)
    }
  }

  const handleAddToCart = () => {
    onAddToCart(product.id, 1)
  }

  const isInCart = cartQuantity > 0
  const totalPrice = product.price * cartQuantity

  return (
    <div className='flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg'>
      <div className='flex flex-1 flex-col justify-between p-6'>
        <div>
          <h3 className='mb-2 text-xl font-bold text-gray-800'>{product.name}</h3>
          <p className='mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600'>
            {product.description}
          </p>

          {/* Enhanced price display */}
          <div className='mb-4'>
            <div className='flex items-baseline gap-2'>
              <span className='text-sky-blue text-3xl font-bold'>${product.price}</span>
              {isInCart && (
                <span className='text-sm text-gray-500'>
                  × {cartQuantity} ={' '}
                  <span className='text-mint-green font-semibold'>${totalPrice.toFixed(2)}</span>
                </span>
              )}
            </div>
            {isInCart && (
              <div className='bg-mint-green/20 mt-2 rounded px-2 py-1 text-xs text-gray-500'>
                En carrito: {cartQuantity} {cartQuantity === 1 ? 'producto' : 'productos'}
              </div>
            )}
          </div>
        </div>

        {/* Cart controls */}
        <div className='mt-4'>
          {isInCart ? (
            <div className='flex items-center justify-center gap-3'>
              {cartQuantity > 1 && (
                <button
                  className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-red-100 text-red-600 transition-colors duration-200 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={handleDecrement}
                  disabled={isUpdating}
                  title='Disminuir cantidad'
                >
                  <FiMinus className='h-4 w-4' />
                </button>
              )}
              {cartQuantity === 1 && (
                <button
                  className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-red-100 text-red-600 transition-colors duration-200 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={handleDelete}
                  disabled={isUpdating}
                  title='Eliminar del carrito'
                >
                  <FiTrash2 className='h-4 w-4' />
                </button>
              )}
              <div className='bg-sky-blue/10 flex items-center gap-2 rounded-lg px-3 py-2'>
                <FiShoppingCart className='text-sky-blue h-4 w-4' />
                <span className='text-sky-blue font-semibold'>{cartQuantity}</span>
              </div>
              <button
                className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-green-100 text-green-600 transition-colors duration-200 hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-50'
                onClick={handleIncrement}
                disabled={isUpdating}
                title='Aumentar cantidad'
              >
                <FiPlus className='h-4 w-4' />
              </button>
            </div>
          ) : (
            <button
              className='bg-sky-blue hover:bg-sky-blue/90 focus:ring-sky-blue flex w-full transform cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50'
              onClick={handleAddToCart}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                  <span>Agregando...</span>
                </>
              ) : (
                <>
                  <FiShoppingCart className='h-5 w-5' />
                  <span>Agregar al carrito</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const ProductsPage: React.FC = () => {
  const { data: products, isLoading, error } = useProducts()
  const { data: userData } = useCurrentUser()
  const { cart: activeCart, cartType } = useActiveCart()
  const isVip = userData?.user?.profile?.is_vip

  const [updatingProductId, setUpdatingProductId] = React.useState<number | null>(null)

  const addToCart = useAddToCart(cartType)
  const updateQuantity = useUpdateCartItemQuantity()

  // Create a map of product quantities in cart
  const cartQuantities = React.useMemo(() => {
    const quantities: Record<number, { quantity: number; itemId: string }> = {}
    if (activeCart?.items) {
      activeCart.items.forEach((item: CartItem) => {
        quantities[item.product.id] = {
          quantity: item.quantity,
          itemId: item.id,
        }
      })
    }
    return quantities
  }, [activeCart?.items])

  const handleAddToCart = (productId: number, quantity: number) => {
    setUpdatingProductId(productId)
    addToCart.mutate(
      { product_id: productId, quantity },
      {
        onSettled: () => setUpdatingProductId(null),
      }
    )
  }

  const handleUpdateQuantity = (itemId: string, quantity: number, productId: number) => {
    if (!activeCart?.id) return
    setUpdatingProductId(productId)
    updateQuantity.mutate(
      { cartId: activeCart.id, itemId, quantity },
      {
        onSettled: () => setUpdatingProductId(null),
      }
    )
  }

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='bg-sky-blue mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full'>
            <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-white'></div>
          </div>
          <h2 className='text-xl font-semibold text-gray-700'>Cargando productos...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
            <svg
              className='h-8 w-8 text-red-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h2 className='mb-2 text-xl font-semibold text-gray-700'>Error al cargar productos</h2>
          <p className='text-gray-500'>Por favor, intenta de nuevo más tarde.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='from-sky-blue/5 to-mint-green/5 min-h-screen bg-gradient-to-br'>
      {/* Header Section */}
      <div className='mb-8 text-center'>
        <div className='bg-sky-blue mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full'>
          <svg className='h-8 w-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
            />
          </svg>
        </div>
        <h1 className='mb-2 text-4xl font-bold text-gray-800'>Nuestros Productos</h1>
        <p className='text-lg text-gray-600'>Descubre nuestra colección eco-friendly</p>
        {isVip && (
          <div className='bg-peach-light/30 mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-gray-700'>
            <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                clipRule='evenodd'
              />
            </svg>
            <span className='font-semibold'>Usuario VIP - Descuentos especiales aplicados</span>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {products?.map((product: Product) => {
          const cartItem = cartQuantities[product.id]
          return (
            <ProductCard
              key={product.id}
              product={product}
              cartQuantity={cartItem?.quantity || 0}
              cartItemId={cartItem?.itemId}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={(itemId, quantity) =>
                handleUpdateQuantity(itemId, quantity, product.id)
              }
              isUpdating={updatingProductId === product.id}
            />
          )
        })}
      </div>

      {/* Empty State */}
      {(!products || products.length === 0) && (
        <div className='py-12 text-center'>
          <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
            <svg
              className='h-8 w-8 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
              />
            </svg>
          </div>
          <h2 className='mb-2 text-xl font-semibold text-gray-700'>No hay productos disponibles</h2>
          <p className='text-gray-500'>Pronto tendremos nuevos productos eco-friendly para ti.</p>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
