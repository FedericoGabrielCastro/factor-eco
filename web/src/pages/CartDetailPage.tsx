import React from 'react'
import { FaPercent, FaShoppingCart } from 'react-icons/fa'
import { FiMinus, FiPlus, FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'

import { useCartById } from '@/hooks/useCartById'
import { useFinalizeOrder } from '@/hooks/useFinalizeOrder'
import { useUpdateCartItemQuantity } from '@/hooks/useUpdateCartItemQuantity'

interface CartItem {
  id: string
  quantity: number
  product: {
    name: string
    price: number
  }
}

interface Discount {
  description: string
  amount?: number
}

interface ApiError {
  response?: {
    data?: {
      error?: string
    }
  }
}

const CartDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: cart, isLoading, error, refetch } = useCartById(id || '')
  const finalizeOrder = useFinalizeOrder()
  const updateQuantity = useUpdateCartItemQuantity()
  const navigate = useNavigate()
  const [updatingItemId, setUpdatingItemId] = React.useState<string | null>(null)

  const isFinalized = cart?.status === 'FINALIZADO'

  const cartTypeLabel =
    cart?.cart_type === 'VIP'
      ? 'Carrito VIP'
      : cart?.cart_type === 'FECHA_ESPECIAL'
        ? 'Carrito Fecha Especial'
        : 'Carrito Regular'

  const handleFinalize = () => {
    if (!cart?.id) return
    finalizeOrder.mutate(cart.id, {
      onSuccess: () => {
        alert('¡Pedido finalizado con éxito!')
        navigate('/orders')
      },
      onError: (err: Error) => {
        const apiError = err as ApiError
        alert(apiError?.response?.data?.error || 'Error al finalizar el pedido')
      },
    })
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (!cart?.id) return
    setUpdatingItemId(itemId)
    updateQuantity.mutate(
      { cartId: cart.id, itemId, quantity: newQuantity },
      {
        onSuccess: () => {
          refetch()
        },
        onSettled: () => setUpdatingItemId(null),
      }
    )
  }

  if (isLoading) return <div className='py-12 text-center text-lg'>Cargando carrito...</div>
  if (error) {
    setTimeout(() => navigate('/productos'), 1500)
    return (
      <div className='py-12 text-center text-red-600'>
        Carrito no encontrado. Redirigiendo a productos...
      </div>
    )
  }
  if (!cart) {
    setTimeout(() => navigate('/productos'), 1500)
    return (
      <div className='py-12 text-center text-gray-500'>
        Carrito no encontrado. Redirigiendo a productos...
      </div>
    )
  }

  // Show a friendly empty cart message if there are no products
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className='mx-auto flex max-w-2xl flex-col items-center justify-center px-2 py-16 sm:px-0'>
        <FaShoppingCart className='text-sky-blue mb-4 text-6xl' />
        <h2 className='mb-2 text-2xl font-bold text-gray-700'>¡Tu carrito está vacío!</h2>
        <p className='mb-6 text-gray-500'>Agrega productos para comenzar tu compra.</p>
        <button
          className='bg-sky-blue hover:bg-sky-blue/90 cursor-pointer rounded-lg px-6 py-3 text-lg font-semibold text-white transition-all duration-200'
          onClick={() => navigate('/productos')}
        >
          Ir a productos
        </button>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-2xl px-2 py-6 sm:px-0'>
      {/* Header with cart icon and type */}
      <div className='mb-6 flex items-center gap-3'>
        <FaShoppingCart className='text-sky-blue text-3xl' />
        <h1 className='text-2xl font-bold'>Carrito #{cart.id}</h1>
        <span className='bg-sky-blue/10 text-sky-blue ml-2 rounded-full px-3 py-1 text-sm font-semibold'>
          {cartTypeLabel}
        </span>
      </div>

      {/* Product items */}
      <ul className='mb-8 space-y-4'>
        {cart.items?.map((item: CartItem) => (
          <li
            key={item.id}
            className='border-sky-blue/30 flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'
          >
            <div className='flex-1'>
              <div className='text-sky-blue mb-1 text-lg font-semibold'>{item.product?.name}</div>
              <div className='text-sm text-gray-500'>
                Precio unitario:{' '}
                <span className='font-medium text-gray-700'>${item.product?.price}</span>
              </div>
              <div className='text-sm text-gray-500'>
                Subtotal:{' '}
                <span className='font-medium text-gray-700'>
                  ${item.product?.price * item.quantity}
                </span>
              </div>
            </div>
            {isFinalized ? (
              <div className='text-lg font-semibold text-gray-700'>Cantidad: {item.quantity}</div>
            ) : (
              <div className='flex items-center justify-center gap-3'>
                {item.quantity > 1 ? (
                  <button
                    className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-red-100 text-red-600 transition-colors duration-200 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50'
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={updatingItemId === item.id}
                    title='Disminuir cantidad'
                  >
                    <FiMinus className='h-4 w-4' />
                  </button>
                ) : (
                  <button
                    className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-red-100 text-red-600 transition-colors duration-200 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50'
                    onClick={() => handleUpdateQuantity(item.id, 0)}
                    disabled={updatingItemId === item.id}
                    title='Eliminar del carrito'
                  >
                    <FiTrash2 className='h-4 w-4' />
                  </button>
                )}
                <div className='bg-sky-blue/10 flex items-center gap-2 rounded-lg px-3 py-2'>
                  <FiShoppingCart className='text-sky-blue h-4 w-4' />
                  <span className='text-sky-blue font-semibold'>{item.quantity}</span>
                </div>
                <button
                  className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-green-100 text-green-600 transition-colors duration-200 hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={updatingItemId === item.id}
                  title='Aumentar cantidad'
                >
                  <FiPlus className='h-4 w-4' />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Discounts applied */}
      {cart.discounts_applied && cart.discounts_applied.length > 0 && (
        <div className='bg-peach-light/10 border-peach-light mb-6 rounded-lg border-l-4 p-4'>
          <div className='text-peach-dark mb-2 flex items-center gap-2 font-semibold'>
            <FaPercent />
            Descuentos aplicados:
          </div>
          <ul className='ml-6 list-disc text-sm'>
            {cart.discounts_applied.map((desc: Discount, idx: number) => (
              <li key={idx} className='mb-1'>
                <span className='text-gray-700'>{desc.description}</span>
                {desc.amount ? (
                  <span className='text-peach-dark ml-2 font-bold'>- ${desc.amount}</span>
                ) : (
                  ''
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Totals */}
      <div className='mb-8'>
        {isFinalized && cart.discounts_applied && cart.discounts_applied.length > 0 && (
          <div className='mb-1 text-base text-gray-400 line-through'>
            Total sin descuentos: ${cart.total}
          </div>
        )}
        <div className='flex items-center gap-3 text-2xl font-bold'>
          Total a pagar:
          <span className='rounded-full bg-green-100 px-4 py-1 text-lg font-bold text-green-800 shadow'>
            ${cart.total_payable ?? cart.total}
          </span>
        </div>
      </div>

      {/* Finalize order button only if not finalized */}
      {!isFinalized && (
        <button
          className='w-full cursor-pointer rounded-lg bg-green-700 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60'
          onClick={handleFinalize}
          disabled={finalizeOrder.isPending}
        >
          {finalizeOrder.isPending ? (
            <span className='flex items-center justify-center gap-2'>
              <svg
                className='mr-2 h-5 w-5 animate-spin text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
              </svg>
              Finalizando...
            </span>
          ) : (
            'Finalizar pedido'
          )}
        </button>
      )}
    </div>
  )
}

export default CartDetailPage
