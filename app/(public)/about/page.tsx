import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Award, Zap, Shield, BookOpen, Users, Compass, ArrowRight, CheckCircle2 } from 'lucide-react'
import { getSiteSection } from '@/lib/content/cms'

export const metadata = {
  title: 'About the Department | Electrical & Electronics Engineering UniPort',
  description: 'Learn about the history, academic charter, laboratories, and pedagogical vision of the Department of Electrical & Electronics Engineering at the University of Port Harcourt.',
}

export default async function AboutPage() {
  const about = await getSiteSection('about')

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-white py-16 sm:py-20 border-b border-slate-200 circuit-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50 text-blue-900 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider mb-4 uppercase">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            {about.badge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A192F] mb-4 tracking-tight">
            {about.pageTitle}
          </h1>
          <p className="text-slate-600 max-w-3xl text-lg font-sans leading-relaxed">
            {about.pageSubtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Mission, Vision, Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-8 bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-200 shadow-2xs">
                <Compass size={24} />
              </div>
              <h2 className="font-bold text-xl text-[#0A192F] mb-3">{about.mission.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {about.mission.description}
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 border border-amber-200 shadow-2xs">
                <Zap size={24} />
              </div>
              <h2 className="font-bold text-xl text-[#0A192F] mb-3">{about.vision.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {about.vision.description}
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-200 shadow-2xs">
                <Shield size={24} />
              </div>
              <h2 className="font-bold text-xl text-[#0A192F] mb-3">{about.coreValues.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {about.coreValues.description}
              </p>
            </div>
          </Card>
        </div>

        {/* Department Overview */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 shadow-card">
          <div className="max-w-4xl space-y-6">
            <div className="inline-block border border-blue-200 bg-blue-50 text-blue-800 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
              {about.heritageBadge}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F]">
              {about.heritageTitle}
            </h2>
            <div className="space-y-4 text-slate-600 font-sans leading-relaxed text-base font-normal">
              {about.heritageParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link href="/programmes">
                <Button variant="primary" className="font-bold shadow-sm shadow-blue-600/30">
                  Explore Programmes
                </Button>
              </Link>
              <Link href="/staff">
                <Button variant="secondary" className="font-bold">
                  View Academic Faculty
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
