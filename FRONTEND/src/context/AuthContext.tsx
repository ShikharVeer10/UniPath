import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '../api/client'

interface AuthContextType {
  isAuthenticated: boolean
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName?: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  const isAuthenticated = !!token

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      const response = await authAPI.login(username, password)
      const accessToken = response.data.access_token
      localStorage.setItem('token', accessToken)
      setToken(accessToken)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, fullName?: string) => {
    setLoading(true)
    try {
      await authAPI.register({ email, password, full_name: fullName })
      // Auto login after registration
      await login(email, password)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
