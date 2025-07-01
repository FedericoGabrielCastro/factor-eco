import React, { createContext, useContext, useEffect, useState } from 'react'

import { sessionService } from '@/api/sessionService'

type User = {
  id: number
  username: string
  email: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_KEY = 'authUser'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Restore user from localStorage if available
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkAuth = async () => {
    setLoading(true)
    try {
      const data = await sessionService.current()
      setUser(data.user)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    } catch {
      setUser(null)
      localStorage.removeItem(USER_KEY)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await sessionService.login({ username, password })
      await checkAuth()
    } catch (err) {
      setError('Invalid credentials or server error')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await sessionService.logout()
    setUser(null)
    localStorage.removeItem(USER_KEY)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{ user, loading, isLoading, error, login, logout, checkAuth, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
