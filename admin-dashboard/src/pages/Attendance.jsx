import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import api from '../services/api'
import { useToast } from '../context/ToastContext'
import { Loader2, Search, ChevronLeft, ChevronRight, CheckCircle, XCircle, Calendar } from 'lucide-react'

const Attendance = () => {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('table')
  const [monthAttendance, setMonthAttendance] = useState({})
  const { success, error } = useToast()

  useEffect(() => { fetchAttendance() }, [page, filterDate, filterStatus])
  useEffect(() => { fetchMonthAttendance() }, [currentDate])

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 20 })
      if (filterDate) params.append('date', filterDate)
      if (filterStatus) params.append('status', filterStatus)
      const response = await api.get(`/attendance/all?${params}`)
      setAttendance(response.data.attendance)
    } catch (err) { error('Failed to fetch attendance') }
    finally { setLoading(false) }
  }

  const fetchMonthAttendance = async () => {
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const response = await api.get(`/attendance/all?limit=500`)
      const attendanceMap = {}
      response.data.attendance.forEach(record => {
        const date = new Date(record.date)
        if (date.getFullYear() === year && date.getMonth() + 1 === month) {
          const dateKey = date.toDateString()
          if (!attendanceMap[dateKey]) attendanceMap[dateKey] = { present: 0, absent: 0 }
          attendanceMap[dateKey][record.status]++
        }
      })
      setMonthAttendance(attendanceMap)
    } catch (err) { console.error(err) }
  }

  const updateStatus = async (id, status) => {
    try { await api.put(`/attendance/${id}`, { status }); success('Attendance updated'); fetchAttendance(); fetchMonthAttendance() }
    catch (err) { error(err.response?.data?.message || 'Failed to update') }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    return { daysInMonth: lastDay.getDate(), startingDay: firstDay.getDay() }
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const today = new Date()
  const todayStr = today.toDateString()

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  const filteredAttendance = search
    ? attendance.filter(a => a.studentId?.firstName?.toLowerCase().includes(search.toLowerCase()) || a.studentId?.lastName?.toLowerCase().includes(search.toLowerCase()))
    : attendance

  const days = []
  for (let i = 0; i < startingDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Attendance Management</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Manage all student attendance</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setViewMode('calendar')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
              <Calendar className="w-4 h-4 inline mr-1" /> Calendar
            </button>
            <button onClick={() => setViewMode('table')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
              Table
            </button>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <div className="card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Attendance Calendar</h2>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="icon-btn text-slate-600 dark:text-slate-300"><ChevronLeft className="w-5 h-5" /></button>
                <span className="font-medium text-slate-800 dark:text-white min-w-[160px] text-center">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                <button onClick={nextMonth} className="icon-btn text-slate-600 dark:text-slate-300"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-sm">
              <div className="py-2 font-semibold text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Sun</div>
              <div className="py-2 font-semibold text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Mon</div>
              <div className="py-2 font-semibold text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Tue</div>
              <div className="py-2 font-semibold text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Wed</div>
              <div className="py-2 font-semibold text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Thu</div>
              <div className="py-2 font-semibold text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Fri</div>
              <div className="py-2 font-semibold text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Sat</div>
              
              {days.map((day, index) => {
                if (!day) return <div key={`empty-${index}`} className="p-2 sm:p-3"></div>
                
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                const dateStr = date.toDateString()
                const isToday = dateStr === todayStr
                const isFuture = date > today
                const stats = monthAttendance[dateStr]
                const total = stats ? stats.present + stats.absent : 0
                const presentPercent = total > 0 ? (stats.present / total) * 100 : 0
                const absentPercent = total > 0 ? (stats.absent / total) * 100 : 0
                
                return (
                  <div 
                    key={index} 
                    className={`
                      p-2 sm:p-3 rounded-lg text-center min-h-[80px] sm:min-h-[90px] flex flex-col items-center justify-center transition-all duration-200 cursor-pointer
                      ${isToday ? 'ring-2 ring-indigo-500' : ''}
                      ${isFuture ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-md'}
                    `}
                    onClick={() => !isFuture && setFilterDate(date.toISOString().split('T')[0])}
                  >
                    <div className={`text-base sm:text-lg font-bold mb-1 ${isToday ? 'text-indigo-500' : 'text-slate-700 dark:text-slate-200'}`}>{day}</div>
                    
                    {!isFuture ? (
                      stats && total > 0 ? (
                        <>
                          <div className="w-full max-w-[60px] h-8 rounded-full overflow-hidden flex border border-slate-200 dark:border-slate-600">
                            {stats.present > 0 && (
                              <div 
                                className="h-full bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                                style={{ width: `${presentPercent}%` }}
                              >
                                {stats.present > 0 && <span>{stats.present}</span>}
                              </div>
                            )}
                            {stats.absent > 0 && (
                              <div 
                                className="h-full bg-red-500 flex items-center justify-center text-white text-xs font-bold"
                                style={{ width: `${absentPercent}%` }}
                              >
                                {stats.absent > 0 && <span>{stats.absent}</span>}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <span className="text-green-600 dark:text-green-400 flex items-center gap-0.5"><CheckCircle className="w-3 h-3" />{stats.present}</span>
                            <span className="text-red-600 dark:text-red-400 flex items-center gap-0.5"><XCircle className="w-3 h-3" />{stats.absent}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">No data</div>
                      )
                    ) : (
                      <div className="text-xs text-slate-300 dark:text-slate-600 mt-1">Future</div>
                    )}
                  </div>
                )
              })}
            </div>
            
            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden flex border-2 border-indigo-500">
                  <div className="w-1/2 h-full bg-indigo-500"></div>
                  <div className="w-1/2 h-full bg-transparent"></div>
                </div>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Full Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Full Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden flex border border-slate-300">
                  <div className="w-1/2 h-full bg-green-500"></div>
                  <div className="w-1/2 h-full bg-red-500"></div>
                </div>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Mixed</span>
              </div>
            </div>
          </div>
        ) : null}

        {viewMode === 'table' ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white" />
              </div>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
                <option value="">All Status</option><option value="present">Present</option><option value="absent">Absent</option>
              </select>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Student</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" /></td></tr>
                    : filteredAttendance.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-slate-500 dark:text-slate-400">No records found</td></tr>
                    : filteredAttendance.map((record, index) => (
                      <tr key={index} className="border-t border-slate-100 dark:border-slate-700/50 table-row-hover">
                        <td className="p-4"><div><p className="font-medium text-slate-800 dark:text-white">{record.studentId?.firstName} {record.studentId?.lastName}</p><p className="text-sm text-slate-500 dark:text-slate-400">{record.studentId?.email}</p></div></td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                        <td className="p-4"><span className={`px-3 py-1 rounded-full text-sm font-medium ${record.status === 'present' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>{record.status}</span></td>
                        <td className="p-4">
                          <select value={record.status} onChange={(e) => updateStatus(record._id, e.target.value)} className="text-sm border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
                            <option value="present">Present</option><option value="absent">Absent</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {attendance.length > 0 && (
                <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-700">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-gradient flex items-center gap-1 px-3 py-2 disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Page {page}</span>
                  <button onClick={() => setPage(p => p + 1)} className="btn-gradient flex items-center gap-1 px-3 py-2">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  )
}

export default Attendance