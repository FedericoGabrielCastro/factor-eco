import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className='from-sky-blue to-mint-green bg-gradient-to-r p-4 text-center text-white shadow-lg'>
      <div className='flex items-center justify-center gap-2'>
        <div className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20'>
          <span className='text-xs font-bold'>FE</span>
        </div>
        <span className='font-medium'>Factor Eco &copy; 2024</span>
      </div>
    </footer>
  )
}

export default Footer
