import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Users, CheckCircle, XCircle, Loader2, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState(7)
  const [chartData, setChartData] = useState([])
  const { getFullName } = useAuth()

  useEffect(() => { fetchStats() }, [period])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/admin/stats?period=${period}`)
      setStats(response.data.stats)
      
      const data = []
      for (let i = period - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        const present = Math.floor(Math.random() * (stats?.totalStudents || 10)) + 1
        const absent = (stats?.totalStudents || 10) - present
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          present: present,
          absent: absent,
          total: stats?.totalStudents || 10
        })
      }
      setChartData(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const fetchChartData = async () => {
    try {
      const data = []
      for (let i = period - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        
        const present = Math.floor(Math.random() * (stats?.totalStudents || 10)) + 1
        const absent = (stats?.totalStudents || 10) - present
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          present: present,
          absent: absent
        })
      }
      setChartData(data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    if (stats) fetchChartData()
  }, [period, stats])

  if (loading) return <AdminLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 loading-spinner" /></div></AdminLayout>

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Welcome back, {getFullName()}!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Students</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats?.totalStudents || 0}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Present Today</p>
                <p className="text-3xl font-bold text-green-500">{stats?.presentToday || 0}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Absent Today</p>
                <p className="text-3xl font-bold text-red-500">{stats?.absentToday || 0}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                <XCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Attendance Rate</p>
                <p className="text-3xl font-bold text-indigo-500">{stats?.attendanceRate || 0}%</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Attendance Trend</h3>
            <div className="flex gap-2">
              <button onClick={() => setPeriod(7)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === 7 ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>7 Days</button>
              <button onClick={() => setPeriod(15)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === 15 ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>15 Days</button>
              <button onClick={() => setPeriod(30)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === 30 ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>30 Days</button>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  content={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="present" name="Present" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="absent" name="Absent" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Attendance by Work Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'WFH', value: 40, color: '#3b82f6' },
                      { name: 'Hybrid', value: 35, color: '#f59e0b' },
                      { name: 'On-site', value: 25, color: '#10b981' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#10b981" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Recent 5 Days Attendance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={(() => {
                  const data = []
                  for (let i = 4; i >= 0; i--) {
                    const date = new Date()
                    date.setDate(date.getDate() - i)
                    const present = Math.floor(Math.random() * (stats?.totalStudents || 10)) + 1
                    const absent = (stats?.totalStudents || 10) - present
                    data.push({
                      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                      present,
                      absent
                    })
                  }
                  return data
                })()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard