import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCreateCart } from '@/hooks/useCreateCart'

interface CreatedCart {
  id: string
}

const CreateCartPage: React.FC = () => {
  const [cartType, setCartType] = useState('NORMAL')
  const { mutate: createCart, isPending } = useCreateCart()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createCart(
      { cart_type: cartType },
      {
        onSuccess: (cart: CreatedCart) => {
          navigate(`/carts/${cart.id}`)
        },
      }
    )
  }

  return (
    <div>
      <h1 className='mb-4 text-2xl font-bold'>Create Cart</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='font-medium'>Cart type:</label>
          <select
            value={cartType}
            onChange={(e) => setCartType(e.target.value)}
            className='ml-2 rounded border px-2 py-1'
          >
            <option value='NORMAL'>Normal</option>
            <option value='VIP'>VIP</option>
          </select>
        </div>
        <button
          type='submit'
          className='cursor-pointer rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800'
          disabled={isPending}
        >
          {isPending ? 'Creating...' : 'Create cart'}
        </button>
      </form>
    </div>
  )
}

export default CreateCartPage
