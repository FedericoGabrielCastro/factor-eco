import React from 'react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { MdDateRange } from 'react-icons/md'

import { useDate } from '@/context/DateContext'
import { usePromotions } from '@/hooks/usePromotions'

interface Promotion {
  id: number
  name: string
  description: string
  discount_amount: number
  start_date: string
  end_date: string
  is_active: boolean
}

const formatDate = (dateStr: string) => {
  // Format date as DD/MM/YYYY
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const PromotionsPage: React.FC = () => {
  const { data, isLoading, error } = usePromotions()
  const { simulatedDate, setSimulatedDate, isSimulated } = useDate()
  const promotions = data?.promotions ?? []

  return (
    <div>
      {/* Simulated date panel as a full-width bar - all UI text in Spanish */}
      <div className='mb-8 w-full'>
        <div className='border-sky-blue flex w-full flex-col gap-3 rounded-none border-2 bg-white/90 p-4 shadow-lg md:flex-row md:items-center md:rounded-xl'>
          <div className='mb-2 flex items-center gap-2 md:mb-0'>
            <FaRegCalendarAlt className='text-sky-blue text-2xl' />
            <span className='text-lg font-semibold'>Fecha simulada</span>
          </div>
          <span className='block flex-1 text-sm text-gray-600'>
            Seleccioná una fecha simulada para ver qué promociones están activas y cómo afectan tu
            carrito. Esto no cambia la fecha real.
          </span>
          <div className='flex w-full flex-col gap-2 sm:flex-row md:w-auto'>
            <input
              type='date'
              className='border-sky-blue focus:ring-sky-blue w-full rounded-lg border px-3 py-2 text-gray-800 focus:ring-2 focus:ring-offset-2 md:w-auto'
              value={simulatedDate || ''}
              onChange={(e) => setSimulatedDate(e.target.value || null)}
            />
          </div>
          {isSimulated && (
            <span className='text-sky-blue bg-sky-blue/10 mt-1 rounded px-2 py-1 text-xs font-bold md:mt-0'>
              Fecha simulada activa
            </span>
          )}
        </div>
      </div>

      <h1 className='mb-4 text-2xl font-bold'>Promociones activas</h1>
      {isLoading ? (
        <div>Cargando promociones...</div>
      ) : error ? (
        <div>Error al cargar promociones</div>
      ) : promotions.length === 0 ? (
        <div className='py-8 text-center text-gray-500'>
          No hay promociones activas para esta fecha
        </div>
      ) : (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {promotions.map((promotion: Promotion) => (
            <div
              key={promotion.id}
              className='border-sky-blue mx-auto flex min-h-[170px] w-full flex-col gap-3 rounded-xl border bg-white p-6 shadow-lg transition-shadow hover:shadow-xl'
            >
              {/* Responsive header: badge before title, perfectly balanced for all breakpoints */}
              <div className='mb-2 flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:justify-start lg:gap-4'>
                {promotion.discount_amount > 0 && (
                  <span className='inline-block min-w-fit rounded-full bg-green-100 px-5 py-1.5 text-center text-base font-bold text-green-800 shadow-sm'>
                    ${promotion.discount_amount} OFF
                  </span>
                )}
                <h3 className='text-sky-blue w-full text-center text-xl leading-tight font-bold lg:text-left'>
                  {promotion.description}
                </h3>
              </div>
              <div className='mt-2 flex flex-col gap-1 text-sm text-gray-600'>
                <div className='flex items-center gap-2'>
                  <MdDateRange className='text-peach-light' />
                  <span>
                    Válida desde:{' '}
                    <span className='font-medium text-gray-800'>
                      {formatDate(promotion.start_date)}
                    </span>
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <MdDateRange className='text-peach-light' />
                  <span>
                    Válida hasta:{' '}
                    <span className='font-medium text-gray-800'>
                      {formatDate(promotion.end_date)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PromotionsPage
