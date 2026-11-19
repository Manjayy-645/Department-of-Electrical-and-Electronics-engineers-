import { getStaffMembers } from '@/lib/content/cms'
import { StaffManager } from '@/components/StaffManager'
import Link from 'next/link'
import { Users, Globe, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Faculty & Staff Roster Manager | EEE Back-Office',
  description: 'Manage academic lecturers, professors, and lab technologists in the Department of Electrical & Electronic Engineering.',
}

export default async function AdminStaffPage() {
  const staff = await getStaffMembers()

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-primary/10">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <Users size={16} className="text-accent" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-widest text-primary/60 font-semibold">
              Academic &amp; Technical Personnel Directory
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">
            Faculty &amp; Staff Roster Management
          </h1>
          <p className="font-sans text-xs sm:text-sm text-primary/70 mt-1">
            Add, update qualifications, manage specializations, and maintain contact records for all departmental faculty members.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/staff"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary hover:text-accent font-bold px-3 py-1.5 rounded-lg border border-primary/20 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Globe size={14} />
            <span>View Public Staff Page</span>
            <ArrowRight size={12} />
          </Link>
          <Badge variant="neutral" className="px-3 py-1 font-mono text-xs">
            {staff.length} Staff Listed
          </Badge>
        </div>
      </div>

      {/* Staff Manager Component */}
      <StaffManager initialStaff={staff} />
    </div>
  )
}
