import { useState, useEffect } from 'react'
import StudentLayout from '../components/StudentLayout'
import api from '../services/api'
import { useToast } from '../context/ToastContext'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

const Attendance = () => {
  const [attendance, setAttendance] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const { error } = useToast()

  useEffect(() => { fetchAttendance() }, [page])

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/attendance/student?page=${page}&limit=30`)
      setAttendance(data.attendance)
      setStats(data.stats)
    } catch (err) { error('Failed to fetch attendance') }
    finally { setLoading(false) }
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">My Attendance</h1>
          <p className="text-slate-600 dark:text-slate-400">View your attendance history</p>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border"><p className="text-sm text-slate-500">Total Days</p><p className="text-2xl font-bold">{stats.total}</p></div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border"><p className="text-sm text-slate-500">Present</p><p className="text-2xl font-bold text-green-500">{stats.present}</p></div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border"><p className="text-sm text-slate-500">Absent</p><p className="text-2xl font-bold text-red-500">{stats.absent}</p></div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border"><p className="text-sm text-slate-500">Percentage</p><p className="text-2xl font-bold text-indigo-500">{stats.percentage}%</p></div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-slate-500">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan={2} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" /></td></tr>
                : attendance.length === 0 ? <tr><td colSpan={2} className="p-8 text-center text-slate-500">No records found</td></tr>
                : attendance.map((record, index) => (
                  <tr key={index} className="border-t border-slate-100 dark:border-slate-700/50">
                    <td className="p-4 text-slate-600 dark:text-slate-400">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="p-4"><span className={`px-3 py-1 rounded-full text-sm font-medium ${record.status === 'present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{record.status === 'present' ? <CheckCircle className="w-4 h-4 inline mr-1" /> : <XCircle className="w-4 h-4 inline mr-1" />}{record.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}

export default Attendance