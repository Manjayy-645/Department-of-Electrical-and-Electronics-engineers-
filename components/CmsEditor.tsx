'use client'

import { useState } from 'react'
import {
  SiteContentData,
  HeroContent,
  AnnouncementContent,
  AboutContent,
  ProgrammesContent,
  SiteSettingsContent
} from '@/lib/content/default-content'
import {
  saveHeroSectionAction,
  saveAnnouncementAction,
  saveAboutAction,
  saveProgrammesAction,
  saveSettingsAction,
  resetSectionAction
} from '@/app/admin/cms/actions'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import {
  Sparkles,
  Megaphone,
  Compass,
  GraduationCap,
  Settings,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
  Plus,
  Trash2,
  HelpCircle,
  ShieldCheck
} from 'lucide-react'

interface CmsEditorProps {
  initialContent: SiteContentData
}

export function CmsEditor({ initialContent }: CmsEditorProps) {
  const [activeTab, setActiveTab] = useState<'hero' | 'announcement' | 'about' | 'programmes' | 'settings'>('hero')
  
  // Section state
  const [hero, setHero] = useState<HeroContent>(initialContent.hero)
  const [announcement, setAnnouncement] = useState<AnnouncementContent>(initialContent.announcement)
  const [about, setAbout] = useState<AboutContent>(initialContent.about)
  const [aboutParagraphsText, setAboutParagraphsText] = useState(
    initialContent.about.heritageParagraphs.join('\n\n')
  )
  const [programmes, setProgrammes] = useState<ProgrammesContent>(initialContent.programmes)
  const [settings, setSettings] = useState<SiteSettingsContent>(initialContent.settings)

  // Status feedback
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg)
    setErrorMessage(null)
    setTimeout(() => setSuccessMessage(null), 4000)
  }

  const showError = (msg: string) => {
    setErrorMessage(msg)
    setSuccessMessage(null)
  }

  // Save Handlers
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await saveHeroSectionAction(hero)
    setLoading(false)
    if (res.success) {
      showSuccess('Homepage Hero & Statistics updated successfully!')
    } else {
      showError(res.error || 'Failed to update Hero section.')
    }
  }

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await saveAnnouncementAction(announcement)
    setLoading(false)
    if (res.success) {
      showSuccess('Announcement Banner updated successfully!')
    } else {
      showError(res.error || 'Failed to update Announcement.')
    }
  }

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const paragraphs = aboutParagraphsText.split('\n\n').map(p => p.trim()).filter(Boolean)
    const payload = {
      ...about,
      heritageParagraphs: paragraphs,
      missionTitle: about.mission.title,
      missionDescription: about.mission.description,
      visionTitle: about.vision.title,
      visionDescription: about.vision.description,
      coreValuesTitle: about.coreValues.title,
      coreValuesDescription: about.coreValues.description,
    }
    const res = await saveAboutAction(payload)
    setLoading(false)
    if (res.success) {
      showSuccess('About Department & Principles updated successfully!')
    } else {
      showError(res.error || 'Failed to update About section.')
    }
  }

  const handleSaveProgrammes = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await saveProgrammesAction(programmes)
    setLoading(false)
    if (res.success) {
      showSuccess('Academic Programmes & Specializations updated successfully!')
    } else {
      showError(res.error || 'Failed to update Programmes section.')
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await saveSettingsAction(settings)
    setLoading(false)
    if (res.success) {
      showSuccess('Site Settings, Contact & Footer updated successfully!')
    } else {
      showError(res.error || 'Failed to update Settings.')
    }
  }

  const handleResetSection = async (section: keyof SiteContentData) => {
    if (!confirm(`Are you sure you want to reset the ${section.toUpperCase()} section back to default institutional values?`)) {
      return
    }
    setLoading(true)
    const res = await resetSectionAction(section)
    setLoading(false)
    if (res.success) {
      window.location.reload()
    } else {
      showError(res.error || 'Failed to reset section.')
    }
  }

  const tabs = [
    { id: 'hero', label: 'Hero & Stats', icon: Sparkles, desc: 'Homepage banner & numbers' },
    { id: 'announcement', label: 'Notice Banner', icon: Megaphone, desc: 'Top broadcast alert' },
    { id: 'about', label: 'About & Principles', icon: Compass, desc: 'Mission, vision & heritage' },
    { id: 'programmes', label: 'Programmes & Options', icon: GraduationCap, desc: 'B.Eng pathways & curriculum' },
    { id: 'settings', label: 'Settings & Footer', icon: Settings, desc: 'Motto, contact & dues' },
  ] as const

  return (
    <div className="space-y-8">
      {/* Toast notifications */}
      {successMessage && (
        <div role="status" className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-sm flex items-center justify-between shadow-xs transition-all animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <span className="text-xs text-emerald-700 font-mono">Live on site</span>
        </div>
      )}

      {errorMessage && (
        <div role="alert" className="p-4 bg-red-50 border border-red-300 rounded-xl text-red-900 text-sm flex items-center gap-3 shadow-xs">
          <AlertCircle size={18} className="text-red-600 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Editor Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1 text-xs text-slate-500 font-sans">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span className="font-semibold text-slate-700">Live Back-Office Editorial Suite</span>
          <span className="text-slate-300 hidden sm:inline">&bull;</span>
          <span className="text-emerald-700 font-mono font-bold flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md text-[11px]">
            <ShieldCheck size={13} className="text-emerald-600" /> Full Read &amp; Write Active for All Admins
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">
          All modifications sync live to Supabase &amp; public pages
        </span>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`p-3.5 rounded-xl text-left transition-all flex flex-col justify-between min-h-[82px] border ${
                  isActive
                    ? 'bg-[#0A192F] text-white border-[#0A192F] shadow-sm'
                    : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs sm:text-sm">{tab.label}</span>
                  <Icon size={16} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
                </div>
                <span className={`text-[11px] mt-1 line-clamp-1 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                  {tab.desc}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* TAB 1: HERO & STATISTICS */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHero} className="space-y-8">
          {/* Live Preview Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-card">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
                <Eye size={14} /> Live Front-End Preview
              </span>
              <span className="text-[11px] text-slate-400">Homepage Top Fold</span>
            </div>

            <div className="space-y-4 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/60 border border-blue-400/40 rounded-full text-xs font-mono font-bold text-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                {hero.badge || 'Official Departmental Portal'}
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {hero.title || 'Department of Electrical & Electronics Engineering'}
                <span className="block text-blue-400 font-bold text-lg sm:text-2xl mt-1">
                  {hero.titleHighlight || 'University of Port Harcourt'}
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                {hero.description}
              </p>

              <div className="pt-2 flex flex-wrap gap-2.5">
                <span className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs">
                  {hero.primaryCtaText} &rarr;
                </span>
                <span className="px-4 py-2 bg-white/10 text-white rounded-lg text-xs font-bold border border-white/20">
                  {hero.secondaryCtaText}
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-[#0A192F]">Hero Headlines & Lead Copy</h3>
              <p className="text-xs text-slate-500">Configure the primary welcome heading seen by students, faculty, and visiting researchers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Institutional Badge Text"
                value={hero.badge}
                onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                placeholder="e.g. Official Departmental Portal • UniPort"
                required
              />

              <Input
                label="Main Department Headline"
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                placeholder="e.g. Department of Electrical & Electronics Engineering"
                required
              />

              <Input
                label="University Highlight Line"
                value={hero.titleHighlight}
                onChange={(e) => setHero({ ...hero, titleHighlight: e.target.value })}
                placeholder="e.g. University of Port Harcourt"
                required
              />

              <Input
                label="Campus / Faculty Subtitle"
                value={hero.subtitle}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                placeholder="e.g. Faculty of Engineering • Choba Park Campus"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Welcome Lead Paragraph
              </label>
              <textarea
                rows={3}
                value={hero.description}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-sans border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
                placeholder="Brief institutional introduction..."
                required
              />
            </div>

            {/* CTA Buttons */}
            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-sm font-bold text-[#0A192F] mb-4">Call-To-Action (CTA) Navigation Buttons</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Input
                    label="Primary CTA Button Label"
                    value={hero.primaryCtaText}
                    onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })}
                    required
                  />
                  <Input
                    label="Primary CTA Target Link"
                    value={hero.primaryCtaLink}
                    onChange={(e) => setHero({ ...hero, primaryCtaLink: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    label="Secondary CTA Button Label"
                    value={hero.secondaryCtaText}
                    onChange={(e) => setHero({ ...hero, secondaryCtaText: e.target.value })}
                    required
                  />
                  <Input
                    label="Secondary CTA Target Link"
                    value={hero.secondaryCtaLink}
                    onChange={(e) => setHero({ ...hero, secondaryCtaLink: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    label="Tertiary Text Link Label"
                    value={hero.tertiaryCtaText}
                    onChange={(e) => setHero({ ...hero, tertiaryCtaText: e.target.value })}
                    required
                  />
                  <Input
                    label="Tertiary Text Link Target"
                    value={hero.tertiaryCtaLink}
                    onChange={(e) => setHero({ ...hero, tertiaryCtaLink: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Statistics Matrix */}
            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-sm font-bold text-[#0A192F] mb-4">Institutional Statistics Matrix</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 bg-slate-50 border-slate-200 space-y-3">
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">Metric 1 (Disciplines)</span>
                  <Input
                    label="Metric Value"
                    value={hero.stat1Value}
                    onChange={(e) => setHero({ ...hero, stat1Value: e.target.value })}
                    placeholder="7"
                    required
                  />
                  <Input
                    label="Metric Label"
                    value={hero.stat1Label}
                    onChange={(e) => setHero({ ...hero, stat1Label: e.target.value })}
                    placeholder="Accredited Disciplines"
                    required
                  />
                </Card>

                <Card className="p-4 bg-slate-50 border-slate-200 space-y-3">
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">Metric 2 (Community)</span>
                  <Input
                    label="Metric Value"
                    value={hero.stat2Value}
                    onChange={(e) => setHero({ ...hero, stat2Value: e.target.value })}
                    placeholder="4,500+"
                    required
                  />
                  <Input
                    label="Metric Label"
                    value={hero.stat2Label}
                    onChange={(e) => setHero({ ...hero, stat2Label: e.target.value })}
                    placeholder="Undergraduates & Postgraduates"
                    required
                  />
                </Card>

                <Card className="p-4 bg-slate-50 border-slate-200 space-y-3">
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">Metric 3 (Session Status)</span>
                  <Input
                    label="Status Highlight"
                    value={hero.stat3Status}
                    onChange={(e) => setHero({ ...hero, stat3Status: e.target.value })}
                    placeholder="2025/2026 First Semester Active"
                    required
                  />
                  <Input
                    label="Metric Label"
                    value={hero.stat3Label}
                    onChange={(e) => setHero({ ...hero, stat3Label: e.target.value })}
                    placeholder="Current Session Status"
                    required
                  />
                </Card>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleResetSection('hero')}
                className="gap-1.5 text-xs text-slate-600 hover:text-red-600"
              >
                <RotateCcw size={14} />
                <span>Reset to Default</span>
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="gap-2 shadow-sm font-bold w-full sm:w-auto"
              >
                <Save size={16} />
                <span>{loading ? 'Saving Changes...' : 'Save Hero & Stats'}</span>
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 2: ANNOUNCEMENT NOTICE BAR */}
      {activeTab === 'announcement' && (
        <form onSubmit={handleSaveAnnouncement} className="space-y-8">
          {/* Live Preview Card */}
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-600 font-bold">
              <Eye size={14} /> Live Notice Bar Simulation
            </span>

            {announcement.enabled ? (
              <div className="bg-[#0A192F] text-white py-3.5 px-4 sm:px-6 rounded-xl border border-blue-900/50 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="p-1 bg-amber-500 text-slate-950 rounded font-bold shrink-0">
                    <Megaphone size={14} />
                  </span>
                  <p className="font-sans font-medium text-slate-200">
                    <strong className="font-mono uppercase text-amber-400 mr-1.5 font-bold">
                      {announcement.badge}
                    </strong>
                    {announcement.message}
                  </p>
                </div>
                {announcement.linkText && (
                  <span className="font-mono text-amber-400 underline uppercase text-[11px] font-bold whitespace-nowrap">
                    {announcement.linkText}
                  </span>
                )}
              </div>
            ) : (
              <div className="p-6 bg-slate-100 rounded-xl border border-slate-200 text-center text-xs text-slate-500 italic">
                Notice strip is currently disabled. Toggle &quot;Enable Announcement Strip&quot; below to broadcast it to all site visitors.
              </div>
            )}
          </div>

          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0A192F]">Official Department Notice Strip</h3>
                <p className="text-xs text-slate-500">Displays a prominent, high-priority official advisory across the top fold of the website.</p>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
                <input
                  type="checkbox"
                  checked={announcement.enabled}
                  onChange={(e) => setAnnouncement({ ...announcement, enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-800">
                  {announcement.enabled ? 'Banner Active (Visible)' : 'Banner Inactive (Hidden)'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-1">
                <Input
                  label="Notice Badge Label"
                  value={announcement.badge}
                  onChange={(e) => setAnnouncement({ ...announcement, badge: e.target.value })}
                  placeholder="e.g. Important Notice:"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Action Button / Link Label"
                  value={announcement.linkText}
                  onChange={(e) => setAnnouncement({ ...announcement, linkText: e.target.value })}
                  placeholder="e.g. Access Academic Timetable →"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Notice Announcement Body
              </label>
              <textarea
                rows={3}
                value={announcement.message}
                onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-sans border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
                placeholder="Write the circular or notice text to display to all students..."
                required
              />
            </div>

            <Input
              label="Action Target URL (Route)"
              value={announcement.linkUrl}
              onChange={(e) => setAnnouncement({ ...announcement, linkUrl: e.target.value })}
              placeholder="e.g. /documents or /portal/dues"
            />

            {/* Actions Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleResetSection('announcement')}
                className="gap-1.5 text-xs text-slate-600 hover:text-red-600"
              >
                <RotateCcw size={14} />
                <span>Reset to Default</span>
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="gap-2 shadow-sm font-bold w-full sm:w-auto"
              >
                <Save size={16} />
                <span>{loading ? 'Saving Changes...' : 'Save Announcement'}</span>
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 3: ABOUT & PRINCIPLES */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="space-y-8">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-[#0A192F]">Mission, Vision &amp; Core Values</h3>
              <p className="text-xs text-slate-500">Edit the foundational charter presented on the About page and Department Overview.</p>
            </div>

            {/* Triad Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mission */}
              <Card className="p-5 bg-blue-50/40 border-blue-200 space-y-3">
                <span className="font-mono text-xs font-bold uppercase text-blue-800">1. Mission Statement</span>
                <Input
                  label="Mission Title"
                  value={about.mission.title}
                  onChange={(e) => setAbout({
                    ...about,
                    mission: { ...about.mission, title: e.target.value }
                  })}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Mission Text
                  </label>
                  <textarea
                    rows={4}
                    value={about.mission.description}
                    onChange={(e) => setAbout({
                      ...about,
                      mission: { ...about.mission, description: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md leading-relaxed"
                    required
                  />
                </div>
              </Card>

              {/* Vision */}
              <Card className="p-5 bg-amber-50/40 border-amber-200 space-y-3">
                <span className="font-mono text-xs font-bold uppercase text-amber-800">2. Vision Statement</span>
                <Input
                  label="Vision Title"
                  value={about.vision.title}
                  onChange={(e) => setAbout({
                    ...about,
                    vision: { ...about.vision, title: e.target.value }
                  })}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Vision Text
                  </label>
                  <textarea
                    rows={4}
                    value={about.vision.description}
                    onChange={(e) => setAbout({
                      ...about,
                      vision: { ...about.vision, description: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md leading-relaxed"
                    required
                  />
                </div>
              </Card>

              {/* Core Values */}
              <Card className="p-5 bg-emerald-50/40 border-emerald-200 space-y-3">
                <span className="font-mono text-xs font-bold uppercase text-emerald-800">3. Core Values</span>
                <Input
                  label="Values Title"
                  value={about.coreValues.title}
                  onChange={(e) => setAbout({
                    ...about,
                    coreValues: { ...about.coreValues, title: e.target.value }
                  })}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Values Text
                  </label>
                  <textarea
                    rows={4}
                    value={about.coreValues.description}
                    onChange={(e) => setAbout({
                      ...about,
                      coreValues: { ...about.coreValues, description: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md leading-relaxed"
                    required
                  />
                </div>
              </Card>
            </div>

            {/* Homepage Narrative Section */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h4 className="text-sm font-bold text-[#0A192F]">Homepage Guiding Principles &amp; Narrative Box</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Narrative Badge"
                  value={about.homeNarrativeBadge}
                  onChange={(e) => setAbout({ ...about, homeNarrativeBadge: e.target.value })}
                  required
                />
                <Input
                  label="Narrative Heading"
                  value={about.homeNarrativeTitle}
                  onChange={(e) => setAbout({ ...about, homeNarrativeTitle: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Narrative Text Paragraph
                </label>
                <textarea
                  rows={3}
                  value={about.homeNarrativeText}
                  onChange={(e) => setAbout({ ...about, homeNarrativeText: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-sans border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* About Page Heritage Section */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h4 className="text-sm font-bold text-[#0A192F]">About Page Heritage &amp; Accreditation Narrative</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Heritage Badge"
                  value={about.heritageBadge}
                  onChange={(e) => setAbout({ ...about, heritageBadge: e.target.value })}
                  required
                />
                <Input
                  label="Heritage Heading"
                  value={about.heritageTitle}
                  onChange={(e) => setAbout({ ...about, heritageTitle: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Heritage Story Paragraphs (Separate distinct paragraphs with a blank line)
                </label>
                <textarea
                  rows={6}
                  value={aboutParagraphsText}
                  onChange={(e) => setAboutParagraphsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-sans border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed font-mono"
                  placeholder="Paragraph 1...&#10;&#10;Paragraph 2...&#10;&#10;Paragraph 3..."
                  required
                />
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleResetSection('about')}
                className="gap-1.5 text-xs text-slate-600 hover:text-red-600"
              >
                <RotateCcw size={14} />
                <span>Reset to Default</span>
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="gap-2 shadow-sm font-bold w-full sm:w-auto"
              >
                <Save size={16} />
                <span>{loading ? 'Saving Changes...' : 'Save About & Principles'}</span>
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 4: PROGRAMMES & PATHWAYS */}
      {activeTab === 'programmes' && (
        <form onSubmit={handleSaveProgrammes} className="space-y-8">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-[#0A192F]">Degree Charter &amp; Academic Overview</h3>
              <p className="text-xs text-slate-500">Manage degree parameters, accreditation certifications, and curriculum descriptions.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Accreditation Badge"
                value={programmes.headerBadge}
                onChange={(e) => setProgrammes({ ...programmes, headerBadge: e.target.value })}
                required
              />
              <Input
                label="Degree Title"
                value={programmes.degreeType}
                onChange={(e) => setProgrammes({ ...programmes, degreeType: e.target.value })}
                required
              />
              <Input
                label="Duration"
                value={programmes.duration}
                onChange={(e) => setProgrammes({ ...programmes, duration: e.target.value })}
                required
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Programmes Page Title"
                value={programmes.title}
                onChange={(e) => setProgrammes({ ...programmes, title: e.target.value })}
                required
              />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Degree Description
                </label>
                <textarea
                  rows={3}
                  value={programmes.description}
                  onChange={(e) => setProgrammes({ ...programmes, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-sans border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* Option Pathway A: Power Systems */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <h4 className="text-base font-bold text-[#0A192F]">Option Pathway A: Power Systems &amp; Electrical Machines</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Option Title"
                  value={programmes.optionA.title}
                  onChange={(e) => setProgrammes({
                    ...programmes,
                    optionA: { ...programmes.optionA, title: e.target.value }
                  })}
                  required
                />
                <Input
                  label="Pathway Badge Label"
                  value={programmes.optionA.pathwayLabel}
                  onChange={(e) => setProgrammes({
                    ...programmes,
                    optionA: { ...programmes.optionA, pathwayLabel: e.target.value }
                  })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Pathway A Description
                </label>
                <textarea
                  rows={2}
                  value={programmes.optionA.description}
                  onChange={(e) => setProgrammes({
                    ...programmes,
                    optionA: { ...programmes.optionA, description: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 text-xs font-sans border border-slate-300 rounded-lg text-slate-900 leading-relaxed"
                  required
                />
              </div>

              {/* Courses list */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="font-mono text-xs font-bold text-slate-700 block">Core 400L &amp; 500L Specialized Courses:</span>
                {programmes.optionA.courses.map((course, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={course.code}
                      onChange={(e) => {
                        const updated = [...programmes.optionA.courses]
                        updated[idx].code = e.target.value
                        setProgrammes({ ...programmes, optionA: { ...programmes.optionA, courses: updated } })
                      }}
                      className="w-32 px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white font-mono font-bold"
                      placeholder="Code"
                    />
                    <input
                      type="text"
                      value={course.title}
                      onChange={(e) => {
                        const updated = [...programmes.optionA.courses]
                        updated[idx].title = e.target.value
                        setProgrammes({ ...programmes, optionA: { ...programmes.optionA, courses: updated } })
                      }}
                      className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                      placeholder="Course Title"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Laboratory Facilities Description
                </label>
                <textarea
                  rows={2}
                  value={programmes.optionA.laboratoryFacilities}
                  onChange={(e) => setProgrammes({
                    ...programmes,
                    optionA: { ...programmes.optionA, laboratoryFacilities: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 text-xs font-sans border border-slate-300 rounded-lg text-slate-900 leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* Option Pathway B: Telecommunications */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <h4 className="text-base font-bold text-[#0A192F]">Option Pathway B: Electronics &amp; Telecommunications</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Option Title"
                  value={programmes.optionB.title}
                  onChange={(e) => setProgrammes({
                    ...programmes,
                    optionB: { ...programmes.optionB, title: e.target.value }
                  })}
                  required
                />
                <Input
                  label="Pathway Badge Label"
                  value={programmes.optionB.pathwayLabel}
                  onChange={(e) => setProgrammes({
                    ...programmes,
                    optionB: { ...programmes.optionB, pathwayLabel: e.target.value }
                  })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Pathway B Description
                </label>
                <textarea
                  rows={2}
                  value={programmes.optionB.description}
                  onChange={(e) => setProgrammes({
                    ...programmes,
                    optionB: { ...programmes.optionB, description: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 text-xs font-sans border border-slate-300 rounded-lg text-slate-900 leading-relaxed"
                  required
                />
              </div>

              {/* Courses list */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="font-mono text-xs font-bold text-slate-700 block">Core 400L &amp; 500L Specialized Courses:</span>
                {programmes.optionB.courses.map((course, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={course.code}
                      onChange={(e) => {
                        const updated = [...programmes.optionB.courses]
                        updated[idx].code = e.target.value
                        setProgrammes({ ...programmes, optionB: { ...programmes.optionB, courses: updated } })
                      }}
                      className="w-32 px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white font-mono font-bold"
                      placeholder="Code"
                    />
                    <input
                      type="text"
                      value={course.title}
                      onChange={(e) => {
                        const updated = [...programmes.optionB.courses]
                        updated[idx].title = e.target.value
                        setProgrammes({ ...programmes, optionB: { ...programmes.optionB, courses: updated } })
                      }}
                      className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                      placeholder="Course Title"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Laboratory Facilities Description
                </label>
                <textarea
                  rows={2}
                  value={programmes.optionB.laboratoryFacilities}
                  onChange={(e) => setProgrammes({
                    ...programmes,
                    optionB: { ...programmes.optionB, laboratoryFacilities: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 text-xs font-sans border border-slate-300 rounded-lg text-slate-900 leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* 5-Year Curriculum Timeline */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h4 className="text-base font-bold text-[#0A192F]">5-Year Curriculum Progression Timeline</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {programmes.curriculumProgression.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-2">
                    <span className="font-mono text-xs font-bold text-amber-700 block">
                      Year {item.yearNumber} ({item.level})
                    </span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const list = [...programmes.curriculumProgression]
                        list[idx].title = e.target.value
                        setProgrammes({ ...programmes, curriculumProgression: list })
                      }}
                      className="w-full px-2 py-1 text-xs font-bold border border-slate-300 rounded bg-white"
                      placeholder="Title"
                    />
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) => {
                        const list = [...programmes.curriculumProgression]
                        list[idx].description = e.target.value
                        setProgrammes({ ...programmes, curriculumProgression: list })
                      }}
                      className="w-full px-2 py-1 text-[11px] border border-slate-300 rounded bg-white leading-relaxed"
                      placeholder="Details"
                    />
                    <input
                      type="text"
                      value={item.badge}
                      onChange={(e) => {
                        const list = [...programmes.curriculumProgression]
                        list[idx].badge = e.target.value
                        setProgrammes({ ...programmes, curriculumProgression: list })
                      }}
                      className="w-full px-2 py-1 text-[10px] font-mono border border-slate-300 rounded bg-white"
                      placeholder="Badge"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleResetSection('programmes')}
                className="gap-1.5 text-xs text-slate-600 hover:text-red-600"
              >
                <RotateCcw size={14} />
                <span>Reset to Default</span>
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="gap-2 shadow-sm font-bold w-full sm:w-auto"
              >
                <Save size={16} />
                <span>{loading ? 'Saving Changes...' : 'Save Programmes'}</span>
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 5: SITE SETTINGS & FOOTER */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-8">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-[#0A192F]">Department Identity, Contacts &amp; Dues</h3>
              <p className="text-xs text-slate-500">Global configurations for institutional contact info, department motto, official dues fees, and active academic session.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Official Department Motto"
                value={settings.motto}
                onChange={(e) => setSettings({ ...settings, motto: e.target.value })}
                placeholder="e.g. Powering Innovation, Engineering the Future"
                required
              />

              <Input
                label="Current Academic Session"
                value={settings.academicSession}
                onChange={(e) => setSettings({ ...settings, academicSession: e.target.value })}
                placeholder="e.g. 2025/2026"
                required
              />

              <Input
                label="Departmental Dues Clearance Amount"
                value={settings.duesAmount}
                onChange={(e) => setSettings({ ...settings, duesAmount: e.target.value })}
                placeholder="e.g. ₦5,000"
                required
              />

              <Input
                label="Official Department Email Address"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="e.g. eee.dept@uniport.edu.ng"
                type="email"
                required
              />

              <Input
                label="Department Helpline / Phone Number"
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                placeholder="e.g. +234 803 123 4567"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Physical Campus Office Address
              </label>
              <textarea
                rows={2}
                value={settings.physicalAddress}
                onChange={(e) => setSettings({ ...settings, physicalAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-sans border border-slate-300 rounded-lg text-slate-900 leading-relaxed"
                placeholder="Department location on campus..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Footer Institutional Charter Summary
              </label>
              <textarea
                rows={3}
                value={settings.footerDescription}
                onChange={(e) => setSettings({ ...settings, footerDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-sans border border-slate-300 rounded-lg text-slate-900 leading-relaxed"
                required
              />
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleResetSection('settings')}
                className="gap-1.5 text-xs text-slate-600 hover:text-red-600"
              >
                <RotateCcw size={14} />
                <span>Reset to Default</span>
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="gap-2 shadow-sm font-bold w-full sm:w-auto"
              >
                <Save size={16} />
                <span>{loading ? 'Saving Changes...' : 'Save Settings & Footer'}</span>
              </Button>
            </div>
          </Card>
        </form>
      )}
    </div>
  )
}
