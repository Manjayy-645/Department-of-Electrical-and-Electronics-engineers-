import { getAllAdmins } from '@/lib/content/cms'
import { AdminRolesManager } from '@/components/AdminRolesManager'
import Link from 'next/link'
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin Roles & Editorial Permissions | EEE Back-Office',
  description: 'Manage back-office administrator roles and guarantee full read and write power for all editors on the CMS.',
}

export default async function AdminRolesPage() {
  const admins = await getAllAdmins()

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-primary/10">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <ShieldCheck size={16} className="text-accent" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-widest text-primary/60 font-semibold">
              Security &bull; Role-Based Access Control (RBAC)
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">
            Administrator Roles &amp; Editorial Permissions
          </h1>
          <p className="font-sans text-xs sm:text-sm text-primary/70 mt-1">
            Authorize new back-office personnel, assign institutional roles, and verify that all administrators have full read and write editorial power on the CMS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/cms"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary hover:text-accent font-bold px-3 py-1.5 rounded-lg border border-primary/20 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Sparkles size={14} />
            <span>Open CMS Editor</span>
            <ArrowRight size={12} />
          </Link>
          <Badge variant="success" className="px-3 py-1 font-mono text-xs">
            Full Read &amp; Write Active
          </Badge>
        </div>
      </div>

      {/* Main Admin Roles Component */}
      <AdminRolesManager initialAdmins={admins} />
    </div>
  )
}
