import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User } from '@/types'
import { ROUTES } from '@/constants'
import { Loader2 } from 'lucide-react'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Simulate 1 second loading for the auth placeholder
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('mock_user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isLoading) return

    const isAuthRoute = location.pathname === ROUTES.AUTH

    if (!user && !isAuthRoute) {
      navigate(ROUTES.AUTH, { replace: true })
    } else if (user && isAuthRoute) {
      navigate(ROUTES.HOME, { replace: true })
    }
  }, [user, isLoading, location.pathname, navigate])

  const login = () => {
    const mockUser: User = { id: '1', email: 'vinicius@adapta.org', initials: 'VA' }
    setUser(mockUser)
    localStorage.setItem('mock_user', JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('mock_user')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
