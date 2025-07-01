import React from 'react'
import { FaCrown, FaRegSmileBeam } from 'react-icons/fa'

import { useVipStatus } from '@/hooks/useVipStatus'
import { useVipUsers } from '@/hooks/useVipUsers'
import { formatDate } from '@/utils/formatDate'

interface VipUser {
  id: number
  username: string
}

const VipStatusPage: React.FC = () => {
  const { data: vipStatus, isLoading, error } = useVipStatus()
  const { data: vipUsers, isLoading: loadingUsers, error: errorUsers } = useVipUsers()

  if (isLoading)
    return (
      <div className='text-sky-blue flex flex-col items-center justify-center py-16 text-center text-lg'>
        <FaCrown className='mb-2 animate-bounce text-4xl' />
        Cargando estado VIP...
      </div>
    )
  if (error)
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center text-lg text-red-600'>
        <FaCrown className='mb-2 text-4xl' />
        Error al cargar el estado VIP
      </div>
    )

  const isVip = !!vipStatus?.is_vip
  return (
    <div
      className='mx-auto mt-10 flex max-w-md flex-col items-center rounded-xl bg-white p-8 text-center shadow-lg'
      data-testid='vip-status-page'
    >
      <FaCrown className={`mb-4 text-5xl ${isVip ? 'text-yellow-400' : 'text-gray-400'}`} />
      <h1 className='mb-2 text-3xl font-bold'>Estado de cuenta VIP</h1>
      {isVip ? (
        <>
          <span className='mb-4 inline-block rounded-full bg-yellow-100 px-4 py-1 text-lg font-semibold text-yellow-800'>
            ¡Eres VIP!
          </span>
          <div className='mb-2 text-gray-700'>
            Desde: <span className='font-semibold'>{formatDate(vipStatus.vip_since)}</span>
          </div>
          <div className='mb-6 text-gray-700'>
            Vence: <span className='font-semibold'>{formatDate(vipStatus.vip_expires)}</span>
          </div>
          <div className='mb-2 rounded border-l-4 border-yellow-300 bg-yellow-50 p-4 text-center text-yellow-800'>
            Disfruta de todos los beneficios exclusivos para clientes VIP.
          </div>
        </>
      ) : (
        <>
          <span className='mb-4 inline-block rounded-full bg-gray-200 px-4 py-1 text-lg font-semibold text-gray-700'>
            Cuenta normal
          </span>
          <div className='mb-6 flex flex-col items-center'>
            <FaRegSmileBeam className='text-sky-blue mb-2 text-3xl' />
            <span className='text-gray-600'>
              Aún no eres VIP. ¡Sigue comprando para acceder a beneficios exclusivos!
            </span>
          </div>
        </>
      )}

      {/* Lista de usuarios VIP actuales */}
      <div className='mt-8 w-full'>
        <h2 className='mb-3 text-center text-xl font-bold'>Usuarios VIP actuales</h2>
        {loadingUsers ? (
          <div className='text-sky-blue'>Cargando usuarios VIP...</div>
        ) : errorUsers ? (
          <div className='text-red-600'>Error al cargar usuarios VIP</div>
        ) : (
          <div className='flex flex-wrap justify-center gap-2'>
            {vipUsers && vipUsers.length > 0 ? (
              vipUsers.map((user: VipUser) => (
                <span
                  key={user.id}
                  className='rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800'
                >
                  {user.username}
                </span>
              ))
            ) : (
              <span className='text-gray-500'>No hay usuarios VIP actualmente.</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VipStatusPage
