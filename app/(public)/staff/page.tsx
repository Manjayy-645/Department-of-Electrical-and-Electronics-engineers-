import type { Metadata } from 'next'
import Link from 'next/link'
import { GraduationCap, Award, BookOpen, Mail, MapPin, Search, Cpu, Zap, Radio, Wrench, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Names of Staff and Qualifications | Department of Electrical & Electronic Engineering',
  description: 'Academic and technical staff profile, qualifications (Ph.D., M.Eng), and specializations in the Department of Electrical & Electronic Engineering, University of Port Harcourt.',
}

import { getStaffMembers } from '@/lib/content/cms'
import { StaffMember } from '@/lib/content/default-content'

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const resolvedParams = await searchParams
  const cadreFilter = resolvedParams.cadre || 'all'
  const query = (resolvedParams.q || '').toLowerCase().trim()

  const staffData = await getStaffMembers()

  const filteredStaff = staffData.filter((staff) => {
    const matchesCadre = cadreFilter === 'all' || staff.cadre === cadreFilter
    const matchesQuery = 
      !query ||
      staff.name.toLowerCase().includes(query) ||
      staff.specialization.toLowerCase().includes(query) ||
      staff.title.toLowerCase().includes(query) ||
      staff.qualifications.some(q => q.toLowerCase().includes(query))
    return matchesCadre && matchesQuery
  })

  const profCount = staffData.filter(s => s.cadre === 'professor').length
  const lecturerCount = staffData.filter(s => s.cadre === 'lecturer').length
  const techCount = staffData.filter(s => s.cadre === 'technologist').length

  const getAreaIcon = (area: StaffMember['focusArea']) => {
    switch(area) {
      case 'power': return <Zap size={16} className="text-amber-500" />
      case 'telecom': return <Radio size={16} className="text-blue-500" />
      case 'electronics': return <Cpu size={16} className="text-emerald-500" />
      case 'control': return <Wrench size={16} className="text-purple-500" />
      default: return <GraduationCap size={16} className="text-primary" />
    }
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header Banner */}
      <div className="bg-white border-b border-primary/10 py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 border border-primary/20 bg-amber-50 text-amber-900 px-3 py-1 rounded-sm text-xs font-bold tracking-wide mb-4 uppercase">
            <ShieldCheck size={14} className="text-amber-600" /> Department of Electrical &amp; Electronic Engineering
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary mb-4 leading-tight">
            Names of Staff and Qualifications
          </h1>
          <p className="text-primary/75 text-lg max-w-3xl leading-relaxed font-sans mb-8">
            Meet the distinguished professors, doctoral researchers, seasoned lecturers, and laboratory technologists 
            powering world-class engineering education and research at the University of Port Harcourt.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl pt-4 border-t border-primary/10">
            <div className="p-3 bg-primary/5 rounded-md border border-primary/10">
              <span className="block text-2xl font-bold font-serif text-primary">{staffData.length}</span>
              <span className="text-xs text-primary/70 font-medium">Total Listed Staff</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
              <span className="block text-2xl font-bold font-serif text-amber-900">{profCount}</span>
              <span className="text-xs text-amber-800 font-medium">Professors &amp; Readers</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <span className="block text-2xl font-bold font-serif text-blue-900">{lecturerCount}</span>
              <span className="text-xs text-blue-800 font-medium">Lecturers &amp; Ph.D. Fellows</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-md border border-emerald-200">
              <span className="block text-2xl font-bold font-serif text-emerald-900">{techCount}</span>
              <span className="text-xs text-emerald-800 font-medium">Laboratory Technologists</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Cadre Filter Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-10 pb-6 border-b border-primary/10">
          
          {/* Filter Pills */}
          <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide snap-x">
            <Link
              href={`/staff?cadre=all${query ? `&q=${query}` : ''}`}
              className={`px-4 py-2 text-sm font-semibold rounded-md whitespace-nowrap snap-start transition-all border min-h-[44px] flex items-center justify-center ${
                cadreFilter === 'all'
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-white text-primary/80 hover:bg-primary/5 border-primary/20'
              }`}
            >
              All Staff ({staffData.length})
            </Link>
            <Link
              href={`/staff?cadre=professor${query ? `&q=${query}` : ''}`}
              className={`px-4 py-2 text-sm font-semibold rounded-md whitespace-nowrap snap-start transition-all border min-h-[44px] flex items-center justify-center ${
                cadreFilter === 'professor'
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-white text-primary/80 hover:bg-primary/5 border-primary/20'
              }`}
            >
              Professors ({profCount})
            </Link>
            <Link
              href={`/staff?cadre=lecturer${query ? `&q=${query}` : ''}`}
              className={`px-4 py-2 text-sm font-semibold rounded-md whitespace-nowrap snap-start transition-all border min-h-[44px] flex items-center justify-center ${
                cadreFilter === 'lecturer'
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-white text-primary/80 hover:bg-primary/5 border-primary/20'
              }`}
            >
              Lecturers ({lecturerCount})
            </Link>
            <Link
              href={`/staff?cadre=technologist${query ? `&q=${query}` : ''}`}
              className={`px-4 py-2 text-sm font-semibold rounded-md whitespace-nowrap snap-start transition-all border min-h-[44px] flex items-center justify-center ${
                cadreFilter === 'technologist'
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-white text-primary/80 hover:bg-primary/5 border-primary/20'
              }`}
            >
              Lab Technologists ({techCount})
            </Link>
          </div>

          {/* Search Bar */}
          <form method="GET" action="/staff" className="flex items-center gap-2 max-w-md w-full">
            <input type="hidden" name="cadre" value={cadreFilter} />
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none" />
              <input 
                type="text" 
                name="q"
                defaultValue={query}
                placeholder="Search name, qualification, or field..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-primary/20 rounded-md text-sm text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <Button type="submit" variant="primary" className="!px-4 !py-2 shrink-0">
              Search
            </Button>
          </form>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((staff) => (
            <Card key={staff.id} className="p-6 flex flex-col justify-between hover:border-accent transition-all duration-300 bg-white group shadow-xs">
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  {staff.photo_url ? (
                    <img 
                      src={staff.photo_url} 
                      alt={staff.name} 
                      className="w-12 h-12 rounded-lg object-cover border border-primary/20 shrink-0 shadow-2xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-amber-50 group-hover:border-amber-300 transition-colors">
                      {getAreaIcon(staff.focusArea)}
                    </div>
                  )}
                  <div className="text-right">
                    <Badge 
                      variant={staff.cadre === 'professor' ? 'gold' : staff.cadre === 'lecturer' ? 'electric' : 'neutral'}
                    >
                      {staff.categoryLabel}
                    </Badge>
                  </div>
                </div>

                {/* Name & Title */}
                <h3 className="text-xl font-bold font-serif text-primary mb-1 group-hover:text-primary-light transition-colors leading-snug">
                  {staff.name}
                </h3>
                <p className="text-accent-dark text-sm font-semibold mb-4 flex items-center gap-1.5">
                  <BookOpen size={14} className="shrink-0" />
                  {staff.title}
                </p>

                {/* Specialization Box */}
                <div className="bg-primary/5 rounded-md p-3.5 border border-primary/10 mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                    <Cpu size={12} className="text-accent" /> Specialization
                  </div>
                  <p className="text-xs font-medium text-primary/85 leading-relaxed font-sans">
                    {staff.specialization}
                  </p>
                </div>

                {/* Qualifications Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary/70 uppercase tracking-wider mb-2">
                    <Award size={13} className="text-amber-600" /> Academic Qualifications &amp; Registrations
                  </div>
                  <ul className="space-y-1.5 text-xs font-sans text-primary/80">
                    {staff.qualifications.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-accent font-bold mt-0.5">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Office & Email */}
              <div className="pt-4 border-t border-primary/10 space-y-2 text-xs font-sans text-primary/70 mt-auto">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary/50 shrink-0" />
                  <span className="truncate">{staff.office}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-accent-dark shrink-0" />
                  <a href={`mailto:${staff.email}`} className="text-primary/80 hover:text-accent-dark hover:underline truncate">
                    {staff.email}
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <Card className="text-center py-16 border-dashed border-primary/20 bg-white">
            <GraduationCap size={48} className="mx-auto text-primary/30 mb-3" />
            <h3 className="text-xl font-serif text-primary mb-2">No Staff Profiles Found</h3>
            <p className="text-primary/60 text-sm max-w-md mx-auto mb-6 font-sans">
              No staff members matched your current filter criteria "{query}". Try resetting the search or exploring other cadres.
            </p>
            <Link href="/staff">
              <Button variant="secondary">Reset Filters</Button>
            </Link>
          </Card>
        )}

        {/* Academic Consultation CTA */}
        <div className="mt-16 bg-[#0A192F] text-white rounded-2xl p-8 sm:p-10 border border-blue-900/40 shadow-card relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl relative z-10">
            <span className="bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider inline-block mb-3">
              Academic Advising &amp; Research
            </span>
            <h2 className="text-2xl sm:text-3xl text-white font-extrabold mb-2 tracking-tight">
              Connect With Academic Advisors
            </h2>
            <p className="text-slate-300 text-sm font-sans leading-relaxed">
              Undergraduate and postgraduate students can book laboratory consultations, final-year project supervision, 
              or academic guidance directly with departmental staff advisors during scheduled office hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 relative z-10">
            <Link href="/programmes" className="w-full sm:w-auto">
              <Button variant="gold" fullWidth className="font-bold">
                View Programmes
              </Button>
            </Link>
            <Link href="/documents" className="w-full sm:w-auto">
              <Button variant="primary" fullWidth className="font-bold">
                Timetables Hub
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
