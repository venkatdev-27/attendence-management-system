import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative modal-content bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full ${sizes[size]} animate-slide-up`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">{title}</h2>
          <button onClick={onClose} className="icon-btn text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

export default Modal