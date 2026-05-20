import { useLocation } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, Shield } from 'lucide-react'

const Profile = () => {
  const location = useLocation()
  const { user, getFullName } = useAuth()

  const infoFields = [
    { icon: User, label: 'Name', value: getFullName() },
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: Phone, label: 'Mobile', value: user?.mobile },
    { icon: Shield, label: 'Role', value: user?.role },
  ]

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold text-white">{user?.firstName?.charAt(0) || user?.name?.charAt(0)}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{getFullName()}</h1>
          <p className="text-slate-600 dark:text-slate-400 capitalize">{user?.role} Account</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Personal Information</h2>
          <div className="space-y-3">
            {infoFields.map((field, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <field.icon className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{field.label}</p>
                  <p className="font-medium text-slate-800 dark:text-white">{field.value || '-'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </AdminLayout>
  )
}

export default Profile