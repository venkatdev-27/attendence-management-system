import StudentLayout from '../components/StudentLayout'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, Shield, Briefcase, Home } from 'lucide-react'

const Profile = () => {
  const { user, getFullName } = useAuth()

  const genderLabel = { male: 'Male', female: 'Female', other: 'Other', 'prefer-not-to-say': 'Prefer not to say' }
  const workTypeLabel = { wfh: 'Work From Home', hybrid: 'Hybrid', onsite: 'On-site' }

  const infoFields = [
    { icon: User, label: 'Full Name', value: getFullName() },
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: Phone, label: 'Mobile', value: user?.mobile },
    { icon: Phone, label: 'Emergency Contact', value: user?.emergencyContact },
    { icon: User, label: 'Gender', value: genderLabel[user?.gender] },
    { icon: Briefcase, label: 'Designation', value: user?.designation },
    { icon: Home, label: 'Work Type', value: workTypeLabel[user?.workType] },
  ]

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold text-white">{user?.firstName?.charAt(0)}</span>
          </div>
          <h1 className="text-2xl font-bold">{getFullName()}</h1>
          <p className="text-slate-600 capitalize">Student Account</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="space-y-3">
            {infoFields.map((field, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center"><field.icon className="w-5 h-5 text-indigo-500" /></div>
                <div><p className="text-sm text-slate-500">{field.label}</p><p className="font-medium">{field.value || '-'}</p></div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </StudentLayout>
  )
}

export default Profile