import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Eye, EyeOff, GraduationCap, Loader2, Mail, Lock } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(email, password)
      if (user.role !== 'admin') { error('Admin access only'); setLoading(false); return }
      success(`Welcome, ${user.name || user.firstName}!`)
      navigate('/')
    } catch (err) { error(err.response?.data?.message || 'Login failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-2 xs:p-3 sm:p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-56 h-56 xs:w-72 xs:h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 xs:w-72 xs:h-72 bg-accent-500/10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl xs:rounded-3xl border border-white/20 p-4 xs:p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 xs:w-16 xs:h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-7 h-7 xs:w-8 xs:h-8 text-white" />
            </div>
            <h1 className="text-2xl xs:text-3xl font-bold text-white">Admin Login</h1>
            <p className="text-slate-400 text-sm mt-2">Sign in to admin dashboard</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="admin@ams.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 p-4 bg-white/5 rounded-xl text-center">
            <p className="text-sm text-slate-400">Demo: admin@ams.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login