import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  Globe,
  Layers,
  Lock,
  MonitorSmartphone,
  Rocket,
  ShieldCheck,
  Smartphone,
  Terminal,
  Zap,
} from 'lucide-react'
import PlatformShell from '@/components/PlatformShell'
import { CtaBand } from '@/components/PlatformSections'
import { getPlatformData } from '@/lib/platform-data'
import { getDb } from '@/lib/db'
import ProjectStoreBadges from '@/components/StoreBadges'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params)
  const targetSlug = decodeURIComponent(String(resolvedParams?.slug || '')).toLowerCase().trim()
  const { projects } = await getPlatformData()
  let project = projects.find(item => {
    const s = String(item.slug || '').toLowerCase().trim()
    const id = String(item.id || '').trim()
    return s === targetSlug || id === targetSlug
  })

  if (!project) {
    try {
      const sql = getDb()
      const rows = await sql`
        SELECT * FROM projects
        WHERE is_active = true
          AND (lower(slug) = ${targetSlug} OR id::text = ${targetSlug})
        LIMIT 1
      `
      if (rows && rows[0]) {
        project = rows[0]
      }
    } catch (e) {
      console.error('generateMetadata db fallback error:', e)
    }
  }

  return {
    title: project ? `${project.title} - Architectural Case Study | Anjal Solutions LTD` : 'Project Case Study | Anjal Solutions LTD',
    description:
      project?.summary ||
      project?.description ||
      'Production digital product architectural case study by Anjal Solutions LTD.',
  }
}

export default async function ProjectDetailPage({ params }) {
  const resolvedParams = await Promise.resolve(params)
  const targetSlug = decodeURIComponent(String(resolvedParams?.slug || '')).toLowerCase().trim()

  const { settings, projects } = await getPlatformData()
  let project = projects.find(item => {
    const s = String(item.slug || '').toLowerCase().trim()
    const id = String(item.id || '').trim()
    return s === targetSlug || id === targetSlug
  })

  // Direct database query fallback if not found in platform data
  if (!project) {
    try {
      const sql = getDb()
      const rows = await sql`
        SELECT * FROM projects
        WHERE is_active = true
          AND (lower(slug) = ${targetSlug} OR id::text = ${targetSlug})
        LIMIT 1
      `
      if (rows && rows[0]) {
        const media = await sql`
          SELECT * FROM project_media
          WHERE project_id = ${rows[0].id}
          ORDER BY display_order, id
        `
        project = { ...rows[0], media }
      }
    } catch (e) {
      console.error('Direct fallback query error for project:', e)
    }
  }

  // Ensure media array is populated if empty
  if (project && (!project.media || project.media.length === 0)) {
    try {
      const sql = getDb()
      const media = await sql`
        SELECT * FROM project_media
        WHERE project_id = ${project.id}
        ORDER BY display_order, id
      `
      if (media && media.length > 0) {
        project = { ...project, media }
      }
    } catch (e) {
      console.error('Error fetching project media fallback:', e)
    }
  }

  let nextProject = null
  if (projects.length > 0 && project) {
    const currentIndex = projects.findIndex(p => p.id === project.id)
    if (currentIndex >= 0) {
      nextProject = projects[(currentIndex + 1) % projects.length]
    } else {
      nextProject = projects[0]
    }
  }

  if (!project) {
    return (
      <PlatformShell settings={settings}>
        <section className="px-5 py-32 lg:px-8 bg-slate-50 min-h-[70vh] flex items-center justify-center">
          <div className="mx-auto max-w-xl text-center">
            <MonitorSmartphone className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Project Specification Not Found</h1>
            <p className="mt-3 text-sm text-slate-600">The requested portfolio system or case study could not be located.</p>
            <Link
              href="/work"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Portfolio Directory
            </Link>
          </div>
        </section>
      </PlatformShell>
    )
  }

  const media = project.media || []
  const portrait = media.filter(item => item.orientation === 'portrait')
  const landscape = media.filter(item => item.orientation !== 'portrait')
  const primary = media.find(item => item.is_primary) || media[0]
  const isApp = project.project_type === 'mobile-app'

  return (
    <PlatformShell settings={settings}>
      {/* Breadcrumb Navigation */}
      <nav className="border-b border-white/10 bg-slate-950 px-5 py-3.5 text-xs text-white/50 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <Link href="/work" className="hover:text-white transition-colors">
            Portfolio
          </Link>
          <span>/</span>
          <Link
            href={isApp ? '/work/apps' : '/work/websites'}
            className="hover:text-white transition-colors uppercase font-mono text-[11px]"
          >
            {project.project_type || 'Platform'}
          </Link>
          <span>/</span>
          <span className="text-white font-medium truncate max-w-xs sm:max-w-md">{project.title}</span>
        </div>
      </nav>

      {/* Monumental Hero & Project Action Bar */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 px-5 pt-16 pb-24 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-950/30 via-slate-950 to-slate-950" />
        <div className="relative mx-auto max-w-7xl">
          {/* Status & Industry Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {project.status || 'Active in Production'}
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/70">
              {project.project_type || 'System Platform'}
            </span>
            {project.industry && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
                Industry: {project.industry}
              </span>
            )}
          </div>

          <h1 className="mt-8 max-w-5xl text-4xl font-semibold leading-[1.06] tracking-tight md:text-6xl lg:text-7xl">
            {project.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75 md:text-xl">
            {project.summary || project.description}
          </p>

          {/* Action Bar (Live Platform, Store Badges, and Scoping) */}
          <div className="mt-10 flex flex-wrap items-center gap-3.5 border-t border-white/10 pt-8">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-blue-50"
              >
                <span>Visit Live Platform</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}

            <ProjectStoreBadges
              appStoreUrl={project.app_store_url}
              playStoreUrl={project.play_store_url}
            />

            <Link
              href={`/quote?service=${encodeURIComponent(project.project_type || 'Platform')}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
            >
              <span>Commission Similar System</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* High-Resolution Device Canvas Showcase */}
          <div className="mt-14 overflow-hidden rounded-3xl border border-white/15 bg-slate-900/90 shadow-2xl backdrop-blur-xs">
            {isApp ? (
              /* Realistic Multi-Device Smartphone Staging */
              <div className="p-8 md:p-14 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4 text-xs font-mono text-white/40">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-emerald-400" />
                    <span>Native iOS & Android Architecture</span>
                  </div>
                  <span>High-Fidelity Interface Screens</span>
                </div>

                {portrait.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
                    {portrait.slice(0, 4).map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="relative overflow-hidden rounded-2xl border-2 border-white/20 bg-black shadow-2xl"
                      >
                        {/* Simulated Phone Top Island */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-3.5 w-16 bg-black rounded-full z-10 border border-white/10" />
                        <div className="relative aspect-[9/19.5]">
                          <img
                            src={item.url}
                            alt={item.alt || `${project.title} Screen ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : primary?.url ? (
                  <div className="mx-auto max-w-sm overflow-hidden rounded-3xl border-4 border-white/20 bg-black shadow-2xl">
                    <img src={primary.url} alt={project.title} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-72 items-center justify-center text-white/30">
                    <Smartphone className="h-16 w-16" />
                  </div>
                )}
              </div>
            ) : (
              /* High-Fidelity Browser Canvas */
              <div>
                <div className="flex items-center justify-between border-b border-white/10 bg-slate-950 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500/90" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/90" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/90" />
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-1 font-mono text-xs text-white/60">
                    <Lock className="h-3 w-3 text-emerald-400" />
                    <span>{project.url ? project.url.replace(/^https?:\/\//, '') : `${project.slug}.anjal.ng`}</span>
                  </div>
                  <div className="w-12" />
                </div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  {primary?.url ? (
                    <img
                      src={primary.url}
                      alt={primary.alt || project.title}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/40">
                      <MonitorSmartphone className="h-20 w-20" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Architectural Deep Dive & System Specification */}
      <section className="bg-white px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Left Column: Structured Architectural Breakdown */}
          <div className="space-y-16">
            {/* 01. Strategic Context & Challenge */}
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">Pillar 01</span>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  Problem & Scope
                </span>
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Strategic Challenge & Operational Requirements
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                {project.challenge ||
                  'The engagement required a reliable digital product foundation engineered to support rapid transaction throughput, intuitive customer onboarding, and scalable administrative governance without accumulating architectural debt.'}
              </p>
            </div>

            {/* 02. Architectural Solution */}
            <div className="border-t border-slate-100 pt-12">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">Pillar 02</span>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  System Design
                </span>
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Engineered Architecture & Implementation
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                {project.solution || project.description}
              </p>

              {/* Architecture Decision Highlights */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                    <Database className="h-4 w-4 text-blue-600" />
                    Data Architecture
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Rigorous relational database normalization, indexed query plans, and automated transactional rollbacks for zero data loss.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Security & Compliance
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Encrypted session tokens, strict role-based access controls (RBAC), and sanitization pipelines on all external inputs.
                  </p>
                </div>
              </div>
            </div>

            {/* 03. Measurable Outcomes */}
            {(project.outcomes || []).length > 0 && (
              <div className="border-t border-slate-100 pt-12">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">Pillar 03</span>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    Verified Outcomes
                  </span>
                </div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                  Operational & Commercial Impact
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.outcomes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold text-slate-800 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* National Media Coverage (TVC News Broadcast) */}
            {(project.slug === 'mynelfund' || project.id === 'mynelfund' || String(project.title || '').toLowerCase().includes('nelfund')) && (
              <div className="border-t border-slate-100 pt-12">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">Media Spotlight</span>
                  <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700">
                    TVC News Broadcast
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                  National Broadcast Feature: TVC News Breakfast
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Abdullahi Adam Usman (student at Ahmadu Bello University, Zaria and Co-Founder of Anjal Solutions LTD) explains the engineering and purpose of My NELFund as an independent companion app for Nigerian tertiary students.
                </p>
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-md">
                  <div className="relative aspect-video w-full">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src="https://www.youtube-nocookie.com/embed/_WaaxLj82_A?si=Y9uXoW0cTRMtY_ZB"
                      title="TVC News Breakfast: NELFund Beneficiary Develops App for Students"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Additional Project Media Gallery */}
            {media.length > 1 && (
              <div className="border-t border-slate-100 pt-12">
                <h3 className="text-xl font-semibold text-slate-950 mb-6">Interface Gallery & Assets</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {media.map((item, idx) => (
                    <div key={item.id || idx} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xs">
                      <div className={`relative ${item.orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                        <img src={item.url} alt={item.alt || project.title} className="h-full w-full object-cover" />
                      </div>
                      {item.alt && (
                        <div className="p-3 bg-white text-[11px] font-mono text-slate-500 truncate">
                          {item.alt}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Technical Specification Sheet */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">System Specifications</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">Technical Sheet</h3>

              <div className="mt-6 space-y-4 text-sm">
                {[
                  ['Client', project.client_name || 'Confidential Enterprise'],
                  ['Industry Sector', project.industry || 'Technology & Digital Infrastructure'],
                  ['Studio Role', project.role || 'Full-Stack Architecture & Engineering'],
                  ['Current Status', project.status || 'Live in Production'],
                  ['Target Platform', isApp ? 'iOS (App Store) & Android (Play Store)' : 'Web Platform & Cloud Infrastructure'],
                ].map(([label, val]) => (
                  <div key={label} className="border-b border-slate-200/80 pb-3 last:border-0 last:pb-0">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
                    <span className="mt-1 block font-semibold text-slate-900">{val}</span>
                  </div>
                ))}
              </div>

              {/* Technologies Applied */}
              {(project.tags || []).length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Technology Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map(t => (
                      <span
                        key={t}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs font-semibold text-slate-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Store Releases */}
              {(project.app_store_url || project.play_store_url) && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Official App Store Releases
                  </span>
                  <div className="space-y-2.5">
                    {project.app_store_url && (
                      <a
                        href={project.app_store_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-900 hover:border-slate-950 transition"
                      >
                        <span className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Apple App Store
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    )}
                    {project.play_store_url && (
                      <a
                        href={project.play_store_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-900 hover:border-slate-950 transition"
                      >
                        <span className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-emerald-600" />
                          Google Play Store
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Next Project Bridge */}
            {nextProject && (
              <Link
                href={`/work/${nextProject.slug || nextProject.id}`}
                className="group block rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Next Case Study</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 text-slate-950" />
                </div>
                <h4 className="mt-3 text-lg font-semibold text-slate-950 group-hover:text-blue-600 transition-colors">
                  {nextProject.title}
                </h4>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {nextProject.summary || nextProject.description}
                </p>
              </Link>
            )}

            {/* Quick Consultation Card */}
            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Commission Anjal Solutions</span>
              <h4 className="mt-2 text-xl font-semibold">Have a similar product vision?</h4>
              <p className="mt-2 text-xs leading-relaxed text-white/60">
                Discuss technical feasibility, architecture recommendations, and fixed-price scope with our team.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-blue-50"
              >
                Contact Engineering Team
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand settings={settings} />
    </PlatformShell>
  )
}
