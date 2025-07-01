import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AuthProvider } from '@/context/AuthContext'
import { DateProvider } from '@/context/DateContext'
import AppRouter from '@/routes/AppRouter'

import './app.css'

const queryClient = new QueryClient()

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DateProvider>
            <AppRouter />
          </DateProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
} else {
  console.error('Root element not found')
}
