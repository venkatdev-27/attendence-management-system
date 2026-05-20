import { Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'

const NotFound = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
    <div className="text-center">
      <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">404</h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">Page not found</p>
      <Link to="/" className="btn-gradient inline-flex items-center gap-2">
        <Home className="w-5 h-5" /> Go Home
      </Link>
    </div>
  </div>
)

export default NotFound