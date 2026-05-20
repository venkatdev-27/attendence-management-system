import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Eye, EyeOff, GraduationCap, Loader2, User, Phone, Mail, Briefcase, Home } from 'lucide-react'

const Register = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', mobile: '', gender: '', emergencyContact: '', designation: '', workType: '', course: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) { error('Passwords do not match'); return }
    if (formData.password.length < 6) { error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(formData)
      success('Account created!')
      navigate('/dashboard')
    } catch (err) { error(err.response?.data?.message || 'Registration failed') }
    finally { setLoading(false) }
  }

  const courses = ['Web Development', 'Data Science', 'Mobile Development', 'UI/UX Design', 'Cloud Computing', 'DevOps', 'Machine Learning', 'Cybersecurity']
  const designations = ['Trainee', 'Junior Developer', 'Developer', 'Senior Developer', 'Team Lead', 'Intern']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative w-full max-w-lg">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-slate-400 mt-2">Join AMS today</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full pl-9 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="First name" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Last name" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-9 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="your@email.com" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Mobile</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full pl-9 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Mobile number" required />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                  <option value="" className="bg-slate-800 text-white">Select Gender</option>
                  <option value="male" className="bg-slate-800 text-white">Male</option>
                  <option value="female" className="bg-slate-800 text-white">Female</option>
                  <option value="other" className="bg-slate-800 text-white">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Emergency Contact</label>
                <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Emergency contact" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Designation</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select name="designation" value={formData.designation} onChange={handleChange} className="w-full pl-9 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                    <option value="" className="bg-slate-800 text-white">Select Designation</option>
                    {designations.map(d => <option key={d} value={d} className="bg-slate-800 text-white">{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Work Type</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select name="workType" value={formData.workType} onChange={handleChange} className="w-full pl-9 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                    <option value="" className="bg-slate-800 text-white">Select Work Type</option>
                    <option value="wfh" className="bg-slate-800 text-white">WFH</option>
                    <option value="hybrid" className="bg-slate-800 text-white">Hybrid</option>
                    <option value="onsite" className="bg-slate-800 text-white">On-site</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Course</label>
              <select name="course" value={formData.course} onChange={handleChange} className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                <option value="" className="bg-slate-800 text-white">Select Course</option>
                {courses.map(c => <option key={c} value={c} className="bg-slate-800 text-white">{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Min 6 characters" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Confirm password" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>
          <div className="mt-6 text-center"><p className="text-slate-400">Already have an account? <Link to="/login" className="text-indigo-400 font-medium">Sign in</Link></p></div>
        </div>
      </div>
    </div>
  )
}

export default Register