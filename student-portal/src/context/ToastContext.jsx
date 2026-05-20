import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

const ToastContext = createContext()

export const useToast = () => { const c = useContext(ToastContext); if (!c) throw new Error('useToast must be used within ToastProvider'); return c }

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const colors = { success: 'bg-green-500', error: 'bg-red-500', warning: 'bg-amber-500', info: 'bg-indigo-500' }
  const icons = { success: CheckCircle, error: XCircle, warning: AlertCircle, info: AlertCircle }

  return (
    <ToastContext.Provider value={{ success: (m) => addToast(m, 'success'), error: (m) => addToast(m, 'error'), warning: (m) => addToast(m, 'warning') }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => {
          const Icon = icons[toast.type]
          return (
            <div key={toast.id} className={`${colors[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up min-w-[280px]`}>
              <Icon className="w-5 h-5" />
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              <button onClick={() => setToasts(p => p.filter(t => t.id !== toast.id))}><X className="w-4 h-4" /></button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}