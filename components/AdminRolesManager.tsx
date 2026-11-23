'use client'

import { useState } from 'react'
import { AdminUserRecord } from '@/lib/content/cms'
import { addAdminAction, removeAdminAction } from '@/app/admin/roles/actions'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Key, 
  Mail, 
  User, 
  Shield, 
  Edit3 
} from 'lucide-react'

interface AdminRolesManagerProps {
  initialAdmins: AdminUserRecord[]
}

const ROLE_LABELS: Record<string, string> = {
  technical_director: 'Technical Director',
  pro: 'Public Relations Officer (PRO)',
  editor: 'Editorial & Content Manager',
  admin: 'Department Administrator',
  super_admin: 'Super Administrator',
  staff: 'Academic Staff Administrator',
  hod: 'Head of Department (HOD)'
}

export function AdminRolesManager({ initialAdmins }: AdminRolesManagerProps) {
  const [admins, setAdmins] = useState<AdminUserRecord[]>(initialAdmins)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('admin')

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg)
    setErrorMessage(null)
    setTimeout(() => setSuccessMessage(null), 4000)
  }

  const showError = (msg: string) => {
    setErrorMessage(msg)
    setSuccessMessage(null)
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    const formData = new FormData()
    formData.append('fullName', fullName)
    formData.append('email', email)
    formData.append('role', role)

    const res = await addAdminAction(formData)
    setLoading(false)

    if (res.success && res.data) {
      setAdmins(prev => {
        const idx = prev.findIndex(a => a.userId === res.data!.userId || a.email?.toLowerCase() === email.toLowerCase())
        if (idx >= 0) {
          const updated = [...prev]
          updated[idx] = res.data!
          return updated
        }
        return [...prev, res.data!]
      })
      setFullName('')
      setEmail('')
      setRole('admin')
      showSuccess(`Administrator "${fullName}" granted Full Read & Write CMS power successfully!`)
    } else {
      showError(res.error || 'Failed to grant admin power.')
    }
  }

  const handleRemoveAdmin = async (userId: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke admin permissions for "${name}"?`)) {
      return
    }

    setLoading(true)
    const res = await removeAdminAction(userId)
    setLoading(false)

    if (res.success) {
      setAdmins(prev => prev.filter(a => a.userId !== userId && a.id !== userId))
      showSuccess(`Admin permissions revoked for ${name}.`)
    } else {
      showError(res.error || 'Failed to revoke admin permissions.')
    }
  }

  return (
    <div className="space-y-8">
      {/* Toast Feedback */}
      {successMessage && (
        <div role="status" className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <span className="text-xs text-emerald-700 font-mono">Live in system</span>
        </div>
      )}

      {errorMessage && (
        <div role="alert" className="p-4 bg-red-50 border border-red-300 rounded-xl text-red-900 text-sm flex items-center gap-3 shadow-xs">
          <AlertCircle size={18} className="text-red-600 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Permission Charter Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0A192F] to-[#172A45] text-white border border-blue-900/50 shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-amber-400" />
          <span className="font-mono text-xs uppercase tracking-wider text-amber-300 font-bold">
            Executive Editorial Policy &bull; Universal CMS Read &amp; Write Guarantee
          </span>
        </div>
        <h2 className="text-xl font-bold font-serif text-white">
          Every Registered Administrator Has Full Editorial Authority
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed font-sans">
          All designated administrators—regardless of designation (Technical Director, PRO, Content Editor, Staff Advisor, or General Admin)—are granted full <strong>read and write</strong> access to update, modify, publish, and reset all CMS homepage banners, curriculum pathways, announcements, fees, and faculty profiles.
        </p>
        <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-md bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 flex items-center gap-1.5 font-bold">
            <CheckCircle2 size={13} className="text-emerald-400" /> CMS Content: Read &amp; Write
          </span>
          <span className="px-3 py-1 rounded-md bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 flex items-center gap-1.5 font-bold">
            <CheckCircle2 size={13} className="text-emerald-400" /> Faculty Staff Roster: Read &amp; Write
          </span>
          <span className="px-3 py-1 rounded-md bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 flex items-center gap-1.5 font-bold">
            <CheckCircle2 size={13} className="text-emerald-400" /> Memos &amp; Activities: Read &amp; Write
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Grant Admin Power Form (Cols 1-5) */}
        <div className="lg:col-span-5">
          <Card className="p-6 sm:p-7 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <UserPlus size={18} className="text-blue-600" />
                <h3 className="text-lg font-bold text-[#0A192F]">Grant Admin Powers</h3>
              </div>
              <p className="text-xs text-slate-500">
                Authorize a new or existing university account with back-office access and full CMS read/write powers.
              </p>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <Input
                label="Full Name & Title"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Engr. Dr. A. Johnson"
                required
              />

              <Input
                label="University Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. a.johnson@uniport.edu.ng"
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Administrative Designation &bull; Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-sans border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="admin">Department Administrator (Full Read & Write)</option>
                  <option value="editor">Editorial & Content Manager (Full Read & Write)</option>
                  <option value="technical_director">Technical Director (Full Read & Write)</option>
                  <option value="pro">Public Relations Officer / PRO (Full Read & Write)</option>
                  <option value="super_admin">Super Administrator (Full Read & Write)</option>
                  <option value="staff">Academic Staff Admin (Full Read & Write)</option>
                </select>
              </div>

              {/* Permissions Confirmation Box */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                  <Key size={14} className="text-blue-600" />
                  <span>Granted Permissions Guarantee:</span>
                </div>
                <ul className="text-blue-800 text-[11px] space-y-1 list-disc list-inside">
                  <li>Full <strong>Read &amp; Write</strong> power in CMS Editor</li>
                  <li>Ability to edit and publish all website hero, about, notices, and settings</li>
                  <li>Access to edit Faculty &amp; Staff profiles and specializations</li>
                  <li>Access to departmental directory, event feed, and memos</li>
                </ul>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading || !email || !fullName}
                  className="gap-2 font-bold shadow-sm"
                >
                  <ShieldCheck size={16} />
                  <span>{loading ? 'Authorizing Admin...' : 'Authorize Admin with Read & Write'}</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Active Admin Roster (Cols 6-12) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="font-serif text-lg font-bold text-primary">
                Authorized CMS Administrators ({admins.length})
              </h2>
              <p className="text-xs text-slate-500">
                All administrators listed below possess active read and write privileges on the website.
              </p>
            </div>
            <Badge variant="success" className="font-mono text-xs px-2.5 py-0.5">
              All Active
            </Badge>
          </div>

          <div className="space-y-3">
            {admins.map((admin) => {
              const displayRole = ROLE_LABELS[admin.role] || admin.role
              return (
                <Card key={admin.userId || admin.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-slate-200 hover:border-blue-300 transition-colors">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[#0A192F]">
                        {admin.fullName || 'Admin Officer'}
                      </span>
                      <Badge variant="navy" className="text-[10px] font-mono uppercase">
                        {displayRole}
                      </Badge>
                      <Badge variant="success" className="text-[10px] font-mono uppercase">
                        Read &amp; Write CMS Power
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-sans">
                      <span className="inline-flex items-center gap-1.5 font-mono">
                        <Mail size={12} className="text-slate-400" />
                        {admin.email || 'No email registered'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        Can Edit CMS: Yes
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRemoveAdmin(admin.userId || admin.id, admin.fullName || admin.email || 'Admin')}
                      disabled={loading}
                      className="gap-1.5 text-xs text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 size={14} />
                      <span>Revoke Access</span>
                    </Button>
                  </div>
                </Card>
              )
            })}

            {admins.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white space-y-2">
                <Shield size={32} className="mx-auto text-slate-400 opacity-60" />
                <h4 className="font-bold text-sm text-slate-700">No Administrators Configured</h4>
                <p className="text-xs text-slate-500">Add an administrator using the form to authorize back-office access.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
