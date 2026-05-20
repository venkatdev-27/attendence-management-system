import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/AdminDashboard'
import Students from './pages/Students'
import Attendance from './pages/Attendance'
import Profile from './pages/Profile'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/students" element={<AdminRoute><Students /></AdminRoute>} />
              <Route path="/attendance" element={<AdminRoute><Attendance /></AdminRoute>} />
              <Route path="/profile" element={<AdminRoute><Profile /></AdminRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App