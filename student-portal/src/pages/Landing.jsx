import { Link } from 'react-router-dom'
import { GraduationCap, Users, Calendar, Shield, ArrowRight, CheckCircle } from 'lucide-react'

const Landing = () => {
  const features = [
    { icon: Users, title: 'Student Portal', desc: 'Easy attendance marking and history' },
    { icon: Calendar, title: 'Daily Tracking', desc: 'Mark your daily attendance with one click' },
    { icon: Shield, title: 'Secure Login', desc: 'JWT-based secure authentication' },
    { icon: GraduationCap, title: 'Profile Management', desc: 'View and manage your profile' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-800 dark:text-white">AMS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:text-indigo-500">Login</Link>
          <Link to="/register" className="btn-gradient">Get Started</Link>
        </div>
      </nav>

      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-accent-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-indigo-600">Attendance Made Simple</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-white mb-6">
            Student <span className="gradient-text">Portal</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Mark your daily attendance, view history, and track your attendance percentage effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-gradient flex items-center gap-2 text-lg px-8 py-4">
              Register Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:border-indigo-500">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Features</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border card-hover">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400">© 2024 Attendance Management System</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing