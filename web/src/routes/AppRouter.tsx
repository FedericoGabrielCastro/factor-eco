import React from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import CartDetailPage from '@/pages/CartDetailPage'
import CartsListPage from '@/pages/CartsListPage'
import CreateCartPage from '@/pages/CreateCartPage'
import LoginPage from '@/pages/LoginPage'
import ProductsPage from '@/pages/ProductsPage'
import PromotionsPage from '@/pages/PromotionsPage'
import VipStatusPage from '@/pages/VipStatusPage'

// PublicOnlyRoute: Only renders children if user is NOT authenticated
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null // Optionally show a loader
  return user ? <Navigate to='/products' replace /> : <>{children}</>
}

// PrivateRoute: Only renders children if user IS authenticated
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null // Optionally show a loader
  return user ? <>{children}</> : <Navigate to='/login' replace />
}

// Main layout with navigation menu, user info, logout button, and simulated date selector
const MainLayout = () => {
  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      <Header />
      <main className='flex-1 p-6'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path='/login'
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path='/products' element={<ProductsPage />} />
        <Route path='/promotions' element={<PromotionsPage />} />
        <Route path='/carts'>
          <Route index element={<CartsListPage />} />
          <Route path='new' element={<CreateCartPage />} />
          <Route path=':id' element={<CartDetailPage />} />
        </Route>
        <Route path='/vip' element={<VipStatusPage />} />
        {/* Default redirect */}
        <Route path='*' element={<Navigate to='/products' replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default AppRouter
