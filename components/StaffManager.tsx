'use client'

import { useState } from 'react'
import { StaffMember } from '@/lib/content/default-content'
import {
  saveStaffMemberAction,
  deleteStaffMemberAction,
  resetStaffAction
} from '@/app/admin/staff/actions'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  MapPin,
  GraduationCap,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  RotateCcw
} from 'lucide-react'

interface StaffManagerProps {
  initialStaff: StaffMember[]
}

export function StaffManager({ initialStaff }: StaffManagerProps) {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [search, setSearch] = useState('')
  const [cadreFilter, setCadreFilter] = useState<'all' | 'professor' | 'lecturer' | 'technologist'>('all')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form Fields
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [cadre, setCadre] = useState<'professor' | 'lecturer' | 'technologist'>('lecturer')
  const [categoryLabel, setCategoryLabel] = useState('')
  const [qualificationsText, setQualificationsText] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [focusArea, setFocusArea] = useState<'power' | 'telecom' | 'control' | 'electronics' | 'general'>('general')
  const [email, setEmail] = useState('')
  const [office, setOffice] = useState('')
  const [biography, setBiography] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)

  const openAddModal = () => {
    setEditingStaff(null)
    setName('')
    setTitle('')
    setCadre('lecturer')
    setCategoryLabel('Lecturer II')
    setQualificationsText('')
    setSpecialization('')
    setFocusArea('general')
    setEmail('')
    setOffice('')
    setBiography('')
    setPhotoUrl('')
    setDisplayOrder(staff.length + 1)
    setIsModalOpen(true)
  }

  const openEditModal = (member: StaffMember) => {
    setEditingStaff(member)
    setName(member.name)
    setTitle(member.title)
    setCadre(member.cadre)
    setCategoryLabel(member.categoryLabel)
    setQualificationsText(member.qualifications.join('\n'))
    setSpecialization(member.specialization)
    setFocusArea(member.focusArea)
    setEmail(member.email)
    setOffice(member.office)
    setBiography(member.biography || '')
    setPhotoUrl(member.photo_url || '')
    setDisplayOrder(member.display_order || 0)
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    if (editingStaff) {
      formData.set('id', editingStaff.id)
    }

    const res = await saveStaffMemberAction(formData)
    setLoading(false)

    if (res.success && res.data) {
      const saved = res.data
      if (editingStaff) {
        setStaff(staff.map(s => s.id === saved.id ? saved : s))
        setMessage({ type: 'success', text: `Profile for ${saved.name} updated successfully.` })
      } else {
        setStaff([...staff, saved])
        setMessage({ type: 'success', text: `${saved.name} added to staff roster.` })
      }
      setIsModalOpen(false)
      setTimeout(() => setMessage(null), 4000)
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save staff member.' })
    }
  }

  const handleDelete = async (id: string, staffName: string) => {
    if (!confirm(`Are you sure you want to remove ${staffName} from the department staff roster?`)) {
      return
    }

    setLoading(true)
    const res = await deleteStaffMemberAction(id)
    setLoading(false)

    if (res.success) {
      setStaff(staff.filter(s => s.id !== id))
      setMessage({ type: 'success', text: `${staffName} removed from roster.` })
      setTimeout(() => setMessage(null), 4000)
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to delete.' })
    }
  }

  const handleReset = async () => {
    if (!confirm('Are you sure you want to restore the official default UniPort faculty staff roster? Any custom additions will be reset.')) {
      return
    }
    setLoading(true)
    const res = await resetStaffAction()
    setLoading(false)
    if (res.success) {
      window.location.reload()
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to reset staff.' })
    }
  }

  const filteredStaff = staff.filter((m) => {
    const matchesCadre = cadreFilter === 'all' || m.cadre === cadreFilter
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.specialization.toLowerCase().includes(search.toLowerCase())
    return matchesCadre && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      {message && (
        <div
          role="status"
          className={`p-4 rounded-xl text-sm flex items-center justify-between shadow-xs border ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {message.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-600" />
            ) : (
              <AlertCircle size={18} className="text-red-600" />
            )}
            <span className="font-semibold">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs opacity-60 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, title, or specialization..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
          />
        </div>

        {/* Cadre Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'professor', 'lecturer', 'technologist'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setCadreFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                cadreFilter === filter
                  ? 'bg-[#0A192F] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter === 'all' ? 'All Cadres' : filter === 'professor' ? 'Professors' : filter === 'lecturer' ? 'Lecturers' : 'Technologists'}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-xs text-slate-600 hover:text-red-600"
            title="Restore default roster"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset Defaults</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={openAddModal}
            className="gap-1.5 font-bold shadow-xs whitespace-nowrap"
          >
            <Plus size={16} />
            <span>Add Staff Profile</span>
          </Button>
        </div>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.map((member) => (
          <Card key={member.id} className="p-5 flex flex-col justify-between hover:border-blue-300 transition-colors bg-white">
            <div className="space-y-4">
              {/* Header with Photo / Avatar */}
              <div className="flex items-start gap-3.5">
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg border border-blue-200 shadow-2xs shrink-0">
                    {member.name.split(' ').map(n => n[0]).filter(Boolean).slice(-2).join('')}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 mb-1">
                    {member.categoryLabel || member.cadre}
                  </span>
                  <h3 className="text-sm font-bold text-[#0A192F] leading-tight truncate" title={member.name}>
                    {member.name}
                  </h3>
                  <p className="text-xs text-blue-700 font-medium truncate mt-0.5" title={member.title}>
                    {member.title}
                  </p>
                </div>
              </div>

              {/* Specialization & Focus Area */}
              <div className="space-y-1.5 text-xs">
                <p className="text-slate-600 line-clamp-2 leading-relaxed">
                  <strong>Focus:</strong> {member.specialization}
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <Badge variant="gold" className="text-[10px] uppercase font-mono">
                    {member.focusArea}
                  </Badge>
                  {member.qualifications && member.qualifications.length > 0 && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      {member.qualifications[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Office & Email */}
              <div className="space-y-1 text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                {member.office && (
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <span>{member.office}</span>
                  </div>
                )}
                {member.email && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail size={12} className="text-slate-400 shrink-0" />
                    <span>{member.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => openEditModal(member)}
                className="gap-1 text-xs py-1 px-2.5 h-auto"
              >
                <Edit size={13} />
                <span>Edit</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleDelete(member.id, member.name)}
                className="gap-1 text-xs py-1 px-2.5 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </Button>
            </div>
          </Card>
        ))}

        {filteredStaff.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white p-8">
            <Users size={32} className="mx-auto text-slate-400 mb-2" />
            <p className="font-bold text-slate-800">No staff members match your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the filter or click &quot;Add Staff Profile&quot; to create a new profile.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-base text-[#0A192F]">
                  {editingStaff ? `Edit Profile: ${editingStaff.name}` : 'Add New Faculty Staff Member'}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in academic qualifications, contact details, and laboratory specialization.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name with Honorific"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Engr. Prof. Emmanuel N. Ekwue"
                  required
                />

                <Input
                  label="Academic Title / Role"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Professor & Head of Department"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Faculty Cadre
                  </label>
                  <select
                    name="cadre"
                    value={cadre}
                    onChange={(e) => setCadre(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
                    required
                  >
                    <option value="professor">Professor / Reader</option>
                    <option value="lecturer">Lecturer (Senior / I / II)</option>
                    <option value="technologist">Technologist / Lab Officer</option>
                  </select>
                </div>

                <Input
                  label="Category Label"
                  name="categoryLabel"
                  value={categoryLabel}
                  onChange={(e) => setCategoryLabel(e.target.value)}
                  placeholder="e.g. Professor, Lecturer I"
                  required
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Focus Discipline
                  </label>
                  <select
                    name="focusArea"
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
                  >
                    <option value="power">Power Systems & Machines</option>
                    <option value="telecom">Telecommunications & RF</option>
                    <option value="electronics">Electronics & Embedded</option>
                    <option value="control">Control & Automation</option>
                    <option value="general">General Engineering</option>
                  </select>
                </div>
              </div>

              <Input
                label="Primary Research Specialization"
                name="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Wireless Communications, 5G/6G Propagation Modeling"
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Academic Qualifications & Professional Affiliations (One per line)
                </label>
                <textarea
                  name="qualifications"
                  rows={3}
                  value={qualificationsText}
                  onChange={(e) => setQualificationsText(e.target.value)}
                  placeholder="Ph.D. Electrical Engineering (Imperial College London)&#10;M.Eng. Power Systems (UniPort)&#10;Fellow, Nigerian Society of Engineers (FNSE)&#10;Registered Engineer (COREN)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs leading-relaxed font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Institutional Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. emmanuel.ekwue@uniport.edu.ng"
                  required
                />

                <Input
                  label="Campus Office / Lab Room"
                  name="office"
                  value={office}
                  onChange={(e) => setOffice(e.target.value)}
                  placeholder="e.g. HOD Office, EEE Block Room 201"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Short Academic Biography
                </label>
                <textarea
                  name="biography"
                  rows={2}
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  placeholder="Brief summary of research experience and teaching background..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Profile Photo Upload
                  </label>
                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <Input
                  label="Or External Photo URL"
                  name="photo_url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://... /photo.jpg"
                />
              </div>

              <input type="hidden" name="display_order" value={displayOrder} />

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={loading}
                  className="font-bold gap-2"
                >
                  {loading ? 'Saving...' : editingStaff ? 'Save Changes' : 'Add Staff Member'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
