import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import Modal from '../components/Modal'
import api from '../services/api'
import { useToast } from '../context/ToastContext'
import { Loader2, Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

const Students = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(null)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', mobile: '', gender: '', emergencyContact: '', designation: '', workType: '', course: '', password: '' })
  const { success, error } = useToast()

  useEffect(() => { fetchStudents() }, [page, search])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/students?page=${page}&limit=10&search=${search}`)
      setStudents(response.data.students)
      setPagination(response.data.pagination)
    } catch (err) { error('Failed to fetch students') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editMode) { await api.put(`/students/${editMode}`, formData); success('Student updated') }
      else { await api.post('/students', formData); success('Student created') }
      setModalOpen(false)
      setEditMode(null)
      setFormData({ firstName: '', lastName: '', email: '', mobile: '', gender: '', emergencyContact: '', designation: '', workType: '', course: '', password: '' })
      fetchStudents()
    } catch (err) { error(err.response?.data?.message || 'Operation failed') }
  }

  const handleEdit = (student) => {
    setEditMode(student._id)
    setFormData({ firstName: student.firstName || '', lastName: student.lastName || '', email: student.email, mobile: student.mobile || '', gender: student.gender || '', emergencyContact: student.emergencyContact || '', designation: student.designation || '', workType: student.workType || '', course: student.course || '', password: '' })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return
    try { await api.delete(`/students/${id}`); success('Student deleted'); fetchStudents() }
    catch (err) { error(err.response?.data?.message || 'Failed to delete') }
  }

  const openAddModal = () => { setEditMode(null); setFormData({ firstName: '', lastName: '', email: '', mobile: '', gender: '', emergencyContact: '', designation: '', workType: '', course: '', password: '' }); setModalOpen(true) }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const courses = ['Web Development', 'Data Science', 'Mobile Development', 'UI/UX Design', 'Cloud Computing', 'DevOps', 'Machine Learning', 'Cybersecurity']
  const designations = ['Trainee', 'Junior Developer', 'Developer', 'Senior Developer', 'Team Lead', 'Intern']
  const workTypes = { wfh: 'WFH', hybrid: 'Hybrid', onsite: 'On-site' }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Student Management</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Manage all registered students</p>
          </div>
          <button onClick={openAddModal} className="btn-gradient flex items-center gap-2 py-2.5 px-6">
            <Plus className="w-5 h-5" /> Add Student
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="input-field pl-12" />
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Student</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:table-cell">Contact</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Designation</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400 hidden lg:table-cell">Work</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="w-6 h-6 loading-spinner mx-auto" /></td></tr>
                : students.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">No students found</td></tr>
                : students.map((student, index) => (
                  <tr key={index} className="border-t border-slate-100 dark:border-slate-700/50 table-row-hover">
                    <td className="p-4">
                      <div><p className="font-medium text-slate-800 dark:text-white">{student.firstName} {student.lastName}</p><p className="text-sm text-slate-500 dark:text-slate-400">{student.email}</p><p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">{student.course}</p></div>
                    </td>
                    <td className="p-4 hidden sm:table-cell"><p className="text-sm text-slate-600 dark:text-slate-400">{student.mobile}</p></td>
                    <td className="p-4 hidden md:table-cell text-sm text-slate-600 dark:text-slate-400">{student.designation}</td>
                    <td className="p-4 hidden lg:table-cell"><span className="badge badge-primary">{workTypes[student.workType]}</span></td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(student)} className="icon-btn icon-btn-primary"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(student._id)} className="icon-btn icon-btn-danger"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-700">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-gradient flex items-center gap-1 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400">Page {page} of {pagination.pages}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= pagination.pages} className="btn-gradient flex items-center gap-1 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editMode ? 'Edit Student' : 'Add Student'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" required placeholder="Enter first name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" required placeholder="Enter last name" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required disabled={editMode} placeholder="Enter email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Mobile</label>
              <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="input-field" required placeholder="Enter mobile number" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="input-field" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Emergency Contact</label>
              <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="input-field" required placeholder="Emergency contact" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Designation</label>
              <select name="designation" value={formData.designation} onChange={handleChange} className="input-field" required>
                <option value="">Select Designation</option>
                {designations.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Work Type</label>
              <select name="workType" value={formData.workType} onChange={handleChange} className="input-field" required>
                <option value="">Select Work Type</option>
                <option value="wfh">WFH</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Course</label>
            <select name="course" value={formData.course} onChange={handleChange} className="input-field" required>
              <option value="">Select Course</option>
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {!editMode && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" required minLength={6} placeholder="Enter password (min 6 chars)" />
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" className="btn-gradient flex-1">{editMode ? 'Update Student' : 'Create Student'}</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  )
}

export default Students