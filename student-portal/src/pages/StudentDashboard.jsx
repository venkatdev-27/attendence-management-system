import { useState, useEffect } from 'react'
import StudentLayout from '../components/StudentLayout'
import api from '../services/api'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { Calendar, CheckCircle, Clock, Loader2, TrendingUp, Fingerprint, ChevronLeft, ChevronRight } from 'lucide-react'

const StudentDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [todayMarked, setTodayMarked] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [monthAttendance, setMonthAttendance] = useState({})
  const { success: showSuccess, error: showError } = useToast()

  useEffect(() => { fetchStats(); checkTodayAttendance(); fetchMonthAttendance() }, [])

  const fetchStats = async () => {
    try { const { data } = await api.get('/attendance/stats'); setStats(data.stats) }
    catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const checkTodayAttendance = async () => {
    try {
      const { data } = await api.get('/attendance/student?limit=1')
      if (data.attendance.length > 0) {
        const today = new Date().toDateString()
        const lastRecord = new Date(data.attendance[0].date).toDateString()
        if (today === lastRecord) setTodayMarked(true)
      }
    } catch (err) { console.error(err) }
  }

  const fetchMonthAttendance = async () => {
    try {
      const { data } = await api.get('/attendance/student?page=1&limit=100')
      const attendanceMap = {}
      data.attendance.forEach(record => {
        const date = new Date(record.date).toDateString()
        attendanceMap[date] = record.status
      })
      setMonthAttendance(attendanceMap)
    } catch (err) { console.error(err) }
  }

  const markAttendance = async () => {
    setMarking(true)
    try { await api.post('/attendance/mark'); setTodayMarked(true); showSuccess('Attendance marked!'); fetchStats(); fetchMonthAttendance() }
    catch (err) { showError(err.response?.data?.message || 'Failed to mark') }
    finally { setMarking(false) }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    return { daysInMonth, startingDay }
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const today = new Date()
  const todayStr = today.toDateString()

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  if (loading) return <StudentLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 loading-spinner" /></div></StudentLayout>

  const days = []
  for (let i = 0; i < startingDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
    days.push(date)
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
            Welcome to Attendance Portal
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/25">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-3xl font-bold">{today.getDate()}</div>
              <div className="text-indigo-100">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', year: 'numeric' })}</div>
              <div className="mt-2 text-sm text-indigo-100">
                {todayMarked ? 'Attendance Marked' : 'Mark your attendance'}
              </div>
            </div>
            <button onClick={markAttendance} disabled={todayMarked || marking} className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg ${todayMarked ? 'bg-green-500 hover:bg-green-600' : 'bg-white text-indigo-600 hover:shadow-xl active:scale-95'}`}>
              {marking ? <Loader2 className="w-6 h-6 animate-spin" /> : todayMarked ? 'Marked Present' : <span className="flex items-center gap-2"><Fingerprint className="w-5 h-5" /> Mark Attendance</span>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-slate-500 dark:text-slate-400">Total Days</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{stats?.total || 0}</p></div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center"><Calendar className="w-6 h-6 text-indigo-500" /></div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-slate-500 dark:text-slate-400">Present</p><p className="text-2xl font-bold text-green-500">{stats?.present || 0}</p></div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-500" /></div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-slate-500 dark:text-slate-400">Absent</p><p className="text-2xl font-bold text-red-500">{stats?.absent || 0}</p></div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center"><Clock className="w-6 h-6 text-red-500" /></div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-slate-500 dark:text-slate-400">Attendance %</p><p className="text-2xl font-bold text-accent-500">{stats?.percentage || 0}%</p></div>
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center"><TrendingUp className="w-6 h-6 text-accent-500" /></div>
            </div>
          </div>
        </div>

        <div className="card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Attendance Calendar</h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="icon-btn text-slate-600 dark:text-slate-300"><ChevronLeft className="w-5 h-5" /></button>
              <span className="font-medium text-slate-800 dark:text-white min-w-[140px] text-center">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
              <button onClick={nextMonth} className="icon-btn text-slate-600 dark:text-slate-300"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-sm">
            <div className="py-2 font-semibold text-slate-600 dark:text-slate-300 text-xs sm:text-sm">Sun</div>
            <div className="py-2 font-semibold text-slate-600 dark:text-slate-300 text-xs sm:text-sm">Mon</div>
            <div className="py-2 font-semibold text-slate-600 dark:text-slate-300 text-xs sm:text-sm">Tue</div>
            <div className="py-2 font-semibold text-slate-600 dark:text-slate-300 text-xs sm:text-sm">Wed</div>
            <div className="py-2 font-semibold text-slate-600 dark:text-slate-300 text-xs sm:text-sm">Thu</div>
            <div className="py-2 font-semibold text-slate-600 dark:text-slate-300 text-xs sm:text-sm">Fri</div>
            <div className="py-2 font-semibold text-slate-600 dark:text-slate-300 text-xs sm:text-sm">Sat</div>
            
            {days.map((date, index) => {
              if (!date) return <div key={index} className="p-2 sm:p-3"></div>
              
              const dateStr = date.toDateString()
              const isToday = dateStr === todayStr
              const status = monthAttendance[dateStr]
              const isFuture = date > today
              
              return (
                <div 
                  key={index} 
                  className={`
                    p-2 sm:p-3 rounded-lg text-center min-h-[60px] sm:min-h-[70px] flex flex-col items-center justify-center transition-all duration-200
                    ${isToday ? 'bg-indigo-500 text-white font-bold ring-2 ring-indigo-300' : ''}
                    ${!isFuture && status === 'present' ? 'bg-green-500 text-white font-semibold' : ''}
                    ${!isFuture && status === 'absent' ? 'bg-red-600 text-white font-semibold' : ''}
                    ${isFuture ? 'text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-700/30' : ''}
                    ${!isFuture && !status && !isToday ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600' : ''}
                  `}
                >
                  <div className="text-base sm:text-lg font-bold">{date.getDate()}</div>
                  {!isFuture && status && (
                    <div className="text-xs mt-1 font-medium">
                      {status === 'present' ? 'Present' : 'Absent'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded"></div>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-600 rounded"></div>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-indigo-500 rounded"></div>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Today</span>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}

export default StudentDashboard