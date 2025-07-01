import React from 'react'
import { FaEye, FaShoppingCart, FaTrashAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import { useCarts } from '@/hooks/useCarts'
import { useDeleteCart } from '@/hooks/useDeleteCart'

interface Cart {
  id: string
  cart_type: string
  status: string
  subtotal: number
  total_payable: number
}

const typeBadge = (type: string) => {
  if (type === 'VIP')
    return (
      <span className='ml-2 rounded bg-yellow-50 px-2 py-0.5 text-xs font-semibold text-yellow-700'>
        VIP
      </span>
    )
  if (type === 'FECHA_ESPECIAL')
    return (
      <span className='bg-peach-light/10 text-peach-dark ml-2 rounded px-2 py-0.5 text-xs font-semibold'>
        Fecha especial
      </span>
    )
  return (
    <span className='bg-sky-blue/10 text-sky-blue ml-2 rounded px-2 py-0.5 text-xs font-semibold'>
      Regular
    </span>
  )
}

const statusBadge = (status: string) => {
  if (status === 'FINALIZADO')
    return (
      <span className='ml-2 rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700'>
        Finalizado
      </span>
    )
  if (status === 'ACTIVO')
    return (
      <span className='bg-sky-blue/10 text-sky-blue ml-2 rounded px-2 py-0.5 text-xs font-semibold'>
        Activo
      </span>
    )
  return (
    <span className='ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700'>
      {status}
    </span>
  )
}

const CartsListPage: React.FC = () => {
  const { data, isLoading, error } = useCarts()
  const carts = data ?? []
  const navigate = useNavigate()
  const deleteCart = useDeleteCart()

  if (isLoading)
    return (
      <div className='flex flex-col items-center gap-2 py-12 text-center text-lg'>
        <FaShoppingCart className='text-sky-blue animate-bounce text-3xl' />
        Cargando carritos...
      </div>
    )
  if (error)
    return (
      <div className='flex flex-col items-center gap-2 py-12 text-center text-red-600'>
        <FaShoppingCart className='text-3xl text-red-400' />
        Error al cargar los carritos
      </div>
    )

  return (
    <div className='w-full px-4 py-6' data-testid='carts-list-page'>
      {/* Header left-aligned, full width */}
      <div className='mb-4 flex w-full items-center gap-2'>
        <FaShoppingCart className='text-sky-blue text-2xl' />
        <h1 className='text-xl font-bold'>Mis carritos</h1>
        <span className='bg-sky-blue/10 text-sky-blue ml-2 rounded px-2 py-0.5 text-xs font-medium'>
          {carts.length} carritos
        </span>
      </div>
      <ul className='w-full divide-y divide-gray-200'>
        {carts.map((cart: Cart) => {
          const isFinalized = cart.status === 'FINALIZADO'
          const hasDiscount = cart.total_payable !== cart.subtotal
          return (
            <li key={cart.id} className='flex w-full flex-col py-4 sm:flex-row sm:items-center'>
              <div className='min-w-0 flex-1'>
                <div className='mb-1 flex items-center gap-2'>
                  <span className='text-sky-blue font-semibold'>Carrito #{cart.id}</span>
                  {typeBadge(cart.cart_type)}
                  {statusBadge(cart.status)}
                </div>
                <div className='flex flex-wrap gap-4 text-sm text-gray-700'>
                  <span>
                    Subtotal: <span className='font-medium text-gray-900'>${cart.subtotal}</span>
                  </span>
                  <span>
                    Total:{' '}
                    <span
                      className={`font-semibold ${hasDiscount ? 'text-gray-400 line-through' : 'text-green-800'}`}
                    >
                      ${cart.subtotal}
                    </span>
                  </span>
                  {hasDiscount && (
                    <span className='ml-2 rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700'>
                      Pagar: ${cart.total_payable}
                    </span>
                  )}
                </div>
              </div>
              <div className='mt-3 flex gap-2 sm:mt-0 sm:ml-4'>
                <button
                  className='flex cursor-pointer items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700'
                  onClick={() => navigate(`/carts/${cart.id}`)}
                >
                  <FaEye /> Ver
                </button>
                {!isFinalized && (
                  <>
                    <button
                      className='flex cursor-pointer items-center gap-2 rounded bg-red-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-700'
                      onClick={() => {
                        if (window.confirm('¿Estás seguro que deseas eliminar este carrito?')) {
                          deleteCart.mutate(cart.id)
                        }
                      }}
                      disabled={deleteCart.isPending}
                    >
                      <FaTrashAlt /> Eliminar
                    </button>
                  </>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default CartsListPage
