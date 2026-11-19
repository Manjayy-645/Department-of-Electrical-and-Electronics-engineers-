import { getAllSiteContent } from '@/lib/content/cms'
import { CmsEditor } from '@/components/CmsEditor'
import Link from 'next/link'
import { Sparkles, Globe, ArrowRight, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Content Management System (CMS) | EEE Back-Office',
  description: 'Edit every important section on the public website including Hero banners, announcements, guiding principles, degree pathways, and site settings.',
}

export default async function AdminCmsPage() {
  const content = await getAllSiteContent()

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-primary/10">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <Sparkles size={16} className="text-accent" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-widest text-primary/60 font-semibold">
              Content Management System &bull; Live Editorial Suite
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">
            Website Content &amp; Section Manager
          </h1>
          <p className="font-sans text-xs sm:text-sm text-primary/70 mt-1">
            Real-time control over all institutional messaging, announcement bars, curriculum pathways, and department settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary hover:text-accent font-bold px-3 py-1.5 rounded-lg border border-primary/20 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Globe size={14} />
            <span>View Live Site</span>
            <ArrowRight size={12} />
          </Link>
          <Badge variant="success" className="px-3 py-1 font-mono text-xs">
            Auto-Revalidation On
          </Badge>
        </div>
      </div>

      {/* Main CMS Editor */}
      <CmsEditor initialContent={content} />
    </div>
  )
}
