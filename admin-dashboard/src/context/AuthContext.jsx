import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const userData = localStorage.getItem('adminUser')
    if (token && userData) setUser(JSON.parse(userData))
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { token, user } = response.data
    localStorage.setItem('adminToken', token)
    localStorage.setItem('adminUser', JSON.stringify(user))
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setUser(null)
  }

  const getFullName = () => user ? (user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()) : ''

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, getFullName }}>
      {children}
    </AuthContext.Provider>
  )
}