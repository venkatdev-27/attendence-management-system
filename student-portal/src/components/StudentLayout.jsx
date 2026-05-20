import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useTheme } from '../context/ThemeContext'
import { Menu, X, LayoutDashboard, Calendar, User, LogOut, ChevronDown, Sun, Moon, Fingerprint } from 'lucide-react'

const StudentLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout, getFullName } = useAuth()
  const { success } = useToast()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleLogout = () => { logout(); success('Logged out'); navigate('/login') }

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/attendance', icon: Calendar, label: 'Attendance' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed top-3 left-3 z-50 p-2 bg-indigo-500 text-white rounded-lg lg:hidden hover:bg-indigo-600 transition-colors">
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className={`fixed inset-y-0 left-0 z-40 w-60 bg-white dark:bg-slate-800 shadow-xl lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
        <div className="sticky top-0 z-10 p-5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h1 className="text-2xl font-bold gradient-text">AMS</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Student Portal</p>
        </div>
        <nav className="p-4">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${isActive ? 'nav-link-active' : 'nav-link'}`}>
              <item.icon className="w-5 h-5" /> <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
          <div className="mt-4 p-4 badge-primary rounded-lg">
            <div className="flex items-center gap-2"><Fingerprint className="w-5 h-5" /><span className="text-sm font-medium">Mark daily attendance!</span></div>
          </div>
        </nav>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      <div className="lg:ml-60 transition-all duration-300">
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="w-10 lg:hidden"></div>
            <div className="flex items-center gap-4 ml-auto">
              <button onClick={toggleDarkMode} className="icon-btn text-slate-600 dark:text-slate-300">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="icon-btn flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">{user?.firstName?.charAt(0)}</div>
                  <span className="hidden sm:inline">{getFullName()}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {dropdownOpen && (
                  <div className="dropdown absolute right-0 mt-2 w-48 z-50">
                    <NavLink to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}><User className="w-4 h-4" /> Profile</NavLink>
                    <button onClick={handleLogout} className="dropdown-item w-full text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"><LogOut className="w-4 h-4" /> Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export default StudentLayout