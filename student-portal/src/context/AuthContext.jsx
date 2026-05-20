import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => { const c = useContext(AuthContext); if (!c) throw new Error('useAuth must be used within AuthProvider'); return c }

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('studentToken')
    const userData = localStorage.getItem('studentUser')
    if (token && userData) setUser(JSON.parse(userData))
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('studentToken', data.token)
    localStorage.setItem('studentUser', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData)
    localStorage.setItem('studentToken', data.token)
    localStorage.setItem('studentUser', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('studentToken')
    localStorage.removeItem('studentUser')
    setUser(null)
  }

  const getFullName = () => user ? (user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()) : ''

  return <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, getFullName }}>{children}</AuthContext.Provider>
}