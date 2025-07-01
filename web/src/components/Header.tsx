import React from 'react'

import { useAuth } from '@/context/AuthContext'

const Header: React.FC = () => {
  const { user, logout } = useAuth()

  // Handle logout click
  const handleLogout = async () => {
    await logout()
    window.location.href = '/login' // Force redirect after logout
  }

  return (
    <header className='from-sky-blue to-mint-green flex flex-col gap-2 bg-gradient-to-r p-4 text-white shadow-lg'>
      {/* User info and logout button */}
      <div className='mb-2 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20'>
            <span className='text-sm font-bold'>FE</span>
          </div>
          <div>
            {user ? (
              <span className='font-semibold'>{user.username}</span>
            ) : (
              <span className='italic'>No conectado</span>
            )}
          </div>
        </div>
        {user && (
          <button
            className='ml-4 cursor-pointer rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700'
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        )}
      </div>

      {/* Navigation menu */}
      <div className='flex items-center justify-between'>
        <nav className='flex gap-6'>
          <a
            href='/products'
            className='hover:text-peach-light font-medium transition-colors duration-200'
          >
            Productos
          </a>
          <a
            href='/promotions'
            className='hover:text-peach-light font-medium transition-colors duration-200'
          >
            Promos
          </a>
          <a
            href='/carts'
            className='hover:text-peach-light font-medium transition-colors duration-200'
          >
            Carritos
          </a>
          <a
            href='/vip'
            className='hover:text-peach-light font-medium transition-colors duration-200'
          >
            VIP
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
