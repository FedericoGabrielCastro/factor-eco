import React, { useState } from 'react'

import { useAuth } from '@/context/AuthContext'

const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(username, password)
  }

  return (
    <div className='from-sky-blue/20 to-mint-green/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4'>
      <div className='w-full max-w-md'>
        {/* Logo/Brand Section */}
        <div className='mb-8 text-center'>
          <div className='bg-sky-blue mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full'>
            <span className='text-2xl font-bold text-white'>FE</span>
          </div>
          <h1 className='mb-2 text-3xl font-bold text-gray-800'>Factor Eco</h1>
          <p className='text-gray-600'>Tu tienda eco-friendly</p>
        </div>

        {/* Login Card */}
        <div className='rounded-2xl border border-gray-100 bg-white p-8 shadow-xl'>
          <div className='mb-6 text-center'>
            <h2 className='mb-2 text-2xl font-bold text-gray-800'>Bienvenido de vuelta</h2>
            <p className='text-gray-500'>Inicia sesión en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>Usuario</label>
              <div className='relative'>
                <input
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='focus:ring-sky-blue w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 transition-all duration-200 focus:border-transparent focus:bg-white focus:ring-2'
                  placeholder='Ingresa tu usuario'
                  required
                />
                <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                  <svg
                    className='h-5 w-5 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>Contraseña</label>
              <div className='relative'>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='focus:ring-sky-blue w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 transition-all duration-200 focus:border-transparent focus:bg-white focus:ring-2'
                  placeholder='Ingresa tu contraseña'
                  required
                />
                <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                  <svg
                    className='h-5 w-5 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                    />
                  </svg>
                </div>
              </div>
            </div>

            {error && (
              <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                <div className='flex'>
                  <svg className='h-5 w-5 text-red-400' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <div className='ml-3'>
                    <p className='text-sm text-red-800'>{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              className='bg-sky-blue hover:bg-sky-blue/90 w-full cursor-pointer rounded-lg px-4 py-3 text-lg font-semibold text-white transition-all duration-200'
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <svg
                    className='mr-3 -ml-1 h-5 w-5 animate-spin text-white'
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
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className='bg-peach-light/30 border-peach-light/50 mt-6 rounded-lg border p-4'>
            <h3 className='mb-2 text-sm font-semibold text-gray-700'>Credenciales de prueba:</h3>
            <div className='space-y-1 text-xs text-gray-600'>
              <p>
                <span className='font-medium'>Usuario:</span> testuser1
              </p>
              <p>
                <span className='font-medium'>Contraseña:</span> testpassword123
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-500'>
            © 2024 Factor Eco. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
