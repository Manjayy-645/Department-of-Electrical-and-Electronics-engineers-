import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Users, 
  CreditCard, 
  FileText, 
  Calendar, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Activity,
  Sparkles,
  Award
} from 'lucide-react'

export const metadata = {
  title: 'Admin Overview | EEE Back-Office',
  description: 'Executive management portal for student clearance, financial reconciliation, and departmental directories.',
}

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()
  
  // Fetch stats concurrently
  const [
    { count: studentCount },
    { data: successfulPayments },
    { count: documentCount },
    { count: activityCount }
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('amount').eq('status', 'success'),
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('activities').select('*', { count: 'exact', head: true })
  ])
  
  const totalDues = successfulPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
  const paymentCount = successfulPayments?.length || 0

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-10">
      
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-primary/10">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-2xs bg-accent inline-block" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-widest text-primary/60 font-semibold">
              Executive Administration &bull; Department of Electrical &amp; Electronic Engineering
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            Admin Back-Office Overview
          </h1>
          <p className="font-sans text-xs sm:text-sm text-primary/70 mt-1">
            Real-time telemetry on dues collections, clearance validations, and departmental archives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="px-3 py-1 font-mono text-xs">
            System Live & Online
          </Badge>
        </div>
      </div>
      
      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card variant="default" className="p-6 flex flex-col justify-between hover:border-accent/40 transition-colors">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] font-semibold text-primary/60 uppercase tracking-widest">
                Registered Students
              </span>
              <div className="p-2 bg-primary/5 text-primary rounded-2xs border border-primary/10">
                <GraduationCap size={16} aria-hidden="true" />
              </div>
            </div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-primary">
              {studentCount || 0}
            </p>
            <span className="font-sans text-xs text-primary/60 mt-1 block">
              Active student accounts
            </span>
          </div>
          <div className="pt-4 border-t border-primary/10 mt-4">
            <Link href="/admin/students" className="font-mono text-xs uppercase font-bold text-accent hover:underline flex items-center gap-1">
              <span>View Roster &rarr;</span>
            </Link>
          </div>
        </Card>
        
        <Card variant="default" className="p-6 flex flex-col justify-between hover:border-emerald-600/40 transition-colors">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] font-semibold text-emerald-800 uppercase tracking-widest">
                Total Dues Collected
              </span>
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-2xs border border-emerald-600/25">
                <CreditCard size={16} aria-hidden="true" />
              </div>
            </div>
            <p className="font-mono text-3xl sm:text-4xl font-bold text-emerald-800">
              ₦{totalDues.toLocaleString()}
            </p>
            <span className="font-sans text-xs text-primary/60 mt-1 block">
              {paymentCount} verified clearances
            </span>
          </div>
          <div className="pt-4 border-t border-primary/10 mt-4">
            <Link href="/admin/payments" className="font-mono text-xs uppercase font-bold text-accent hover:underline flex items-center gap-1">
              <span>Audit Financials &rarr;</span>
            </Link>
          </div>
        </Card>
        
        <Card variant="default" className="p-6 flex flex-col justify-between hover:border-primary/40 transition-colors">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] font-semibold text-primary/60 uppercase tracking-widest">
                Active Circulars
              </span>
              <div className="p-2 bg-primary/5 text-primary rounded-2xs border border-primary/10">
                <FileText size={16} aria-hidden="true" />
              </div>
            </div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-primary">
              {documentCount || 0}
            </p>
            <span className="font-sans text-xs text-primary/60 mt-1 block">
              Published PDFs & memos
            </span>
          </div>
          <div className="pt-4 border-t border-primary/10 mt-4">
            <Link href="/admin/documents" className="font-mono text-xs uppercase font-bold text-accent hover:underline flex items-center gap-1">
              <span>Manage Docs &rarr;</span>
            </Link>
          </div>
        </Card>

        <Card variant="default" className="p-6 flex flex-col justify-between hover:border-primary/40 transition-colors">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] font-semibold text-primary/60 uppercase tracking-widest">
                Published Events
              </span>
              <div className="p-2 bg-primary/5 text-primary rounded-2xs border border-primary/10">
                <Calendar size={16} aria-hidden="true" />
              </div>
            </div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-primary">
              {activityCount || 0}
            </p>
            <span className="font-sans text-xs text-primary/60 mt-1 block">
              Symposiums & workshops
            </span>
          </div>
          <div className="pt-4 border-t border-primary/10 mt-4">
            <Link href="/admin/activities" className="font-mono text-xs uppercase font-bold text-accent hover:underline flex items-center gap-1">
              <span>Post Activity &rarr;</span>
            </Link>
          </div>
        </Card>

      </div>
      
      {/* Content Management Highlight Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] to-[#1E3A8A] text-white p-6 sm:p-8 rounded-2xl shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/30 rounded-full text-xs font-mono font-bold text-amber-300">
            <Sparkles size={14} />
            <span>Content Management Suite Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif">
            Full-Spectrum Website Editorial Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Customize the Homepage Hero, active notice banners, departmental principles, degree course outlines, fees, and faculty profiles with immediate front-end revalidation.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link href="/admin/cms">
            <Button variant="primary" size="md" className="gap-2 font-bold shadow-md shadow-blue-500/20">
              <Sparkles size={16} />
              <span>Open CMS Editor</span>
            </Button>
          </Link>
          <Link href="/admin/staff">
            <Button variant="secondary" size="md" className="gap-2 font-bold !border-white/30 !text-white hover:!bg-white/10">
              <Award size={16} />
              <span>Staff Roster</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Operational Module Launchpad */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} className="text-accent" aria-hidden="true" />
          <h2 className="font-serif text-xl font-bold text-primary">
            Back-Office Operations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <Link href="/admin/cms" className="group">
            <Card variant="interactive" className="p-6 h-full flex flex-col justify-between border-blue-200 bg-blue-50/20">
              <div className="space-y-3">
                <div className="w-10 h-10 border border-blue-200 bg-blue-50 rounded-xs flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Sparkles size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-primary">CMS Content Editor</h3>
                  <p className="font-sans text-xs text-primary/65 mt-1">Live edit hero copy, alerts, mission statements, and curriculum.</p>
                </div>
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-blue-600 font-semibold pt-4 block">
                Open CMS &rarr;
              </span>
            </Card>
          </Link>

          <Link href="/admin/staff" className="group">
            <Card variant="interactive" className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 border border-primary/15 bg-primary/5 rounded-xs flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                  <Award size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-primary">Faculty &amp; Staff Roster</h3>
                  <p className="font-sans text-xs text-primary/65 mt-1">Manage academic professors, lecturers, and lab technologists.</p>
                </div>
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold pt-4 block">
                Manage Staff &rarr;
              </span>
            </Card>
          </Link>
          
          <Link href="/admin/payments" className="group">
            <Card variant="interactive" className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 border border-primary/15 bg-primary/5 rounded-xs flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                  <CreditCard size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-primary">Payment Audits</h3>
                  <p className="font-sans text-xs text-primary/65 mt-1">Export transaction ledgers and reconcile dues.</p>
                </div>
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold pt-4 block">
                Audit Table &rarr;
              </span>
            </Card>
          </Link>

          <Link href="/admin/students" className="group">
            <Card variant="interactive" className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 border border-primary/15 bg-primary/5 rounded-xs flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                  <GraduationCap size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-primary">Student Roster</h3>
                  <p className="font-sans text-xs text-primary/65 mt-1">Audit student profiles and manage clearance verification.</p>
                </div>
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold pt-4 block">
                View Roster &rarr;
              </span>
            </Card>
          </Link>

          <Link href="/admin/directory" className="group">
            <Card variant="interactive" className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 border border-primary/15 bg-primary/5 rounded-xs flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                  <Users size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-primary">Faculty Directory</h3>
                  <p className="font-sans text-xs text-primary/65 mt-1">Add or update Deans, HODs, and student executives.</p>
                </div>
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold pt-4 block">
                Manage Directory &rarr;
              </span>
            </Card>
          </Link>

          <Link href="/admin/activities" className="group">
            <Card variant="interactive" className="p-6 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 border border-primary/15 bg-primary/5 rounded-xs flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                  <Calendar size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-primary">Events & Activities</h3>
                  <p className="font-sans text-xs text-primary/65 mt-1">Publish upcoming engineering events and seminars.</p>
                </div>
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold pt-4 block">
                Publish Events &rarr;
              </span>
            </Card>
          </Link>

        </div>
      </div>

    </div>
  )
}
