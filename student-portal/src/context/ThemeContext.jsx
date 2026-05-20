import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('studentDarkMode')
    const initialDarkMode = saved ? JSON.parse(saved) : false
    setDarkMode(initialDarkMode)
    
    if (initialDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('studentDarkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}