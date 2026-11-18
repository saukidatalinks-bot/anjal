import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import PlatformShell from '@/components/PlatformShell'
import { CtaBand } from '@/components/PlatformSections'
import SaukiGoMark from '@/components/SaukiGoMark'
import ProjectStoreBadges from '@/components/StoreBadges'
import { getPlatformData } from '@/lib/platform-data'

export const revalidate = 300

export async function generateStaticParams() {
  const { projects } = await getPlatformData()
  return projects.filter(p => p.slug).map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { projects } = await getPlatformData()
  const project = projects.find(p => p.slug === params.slug || String(p.id) === params.slug)
  if (!project) return { title: 'Project Case Study | Anjal Solutions LTD' }

  return {
    title: `${project.title} | Anjal Solutions LTD`,
    description: project.summary || project.description,
  }
}

export default async function ProjectDetailPage({ params }) {
  const { settings, projects } = await getPlatformData()
  const project = projects.find(p => p.slug === params.slug || String(p.id) === params.slug)

  if (!project) {
    notFound()
  }

  const media = Array.isArray(project.media) ? project.media : []
  const outcomes = Array.isArray(project.outcomes) ? project.outcomes : []
  const tags = Array.isArray(project.tags) ? project.tags : []
  const isComingSoon = String(project.status || '').toUpperCase().includes('COMING')
  const isSaukiGo = project.slug === 'sauki-go'

  return (
    <PlatformShell settings={settings}>
      <section className="border-b border-slate-800 bg-slate-950 px-5 py-14 text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to all projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {isSaukiGo && <SaukiGoMark className="h-11 w-11" />}
            {project.slug === 'mynelfund' && (
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5">
                <img src="/logos/nelfund-mark.webp" alt="My NELFund" width={36} height={36} className="h-full w-full object-contain" />
              </span>
            )}
            {project.slug === 'sauki-mart' && (
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5">
                <img src="/logos/sauki-mart-mark.webp" alt="Sauki Mart" width={36} height={36} className="h-full w-full object-contain" />
              </span>
            )}
            <span
              className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider ${
                isComingSoon ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-slate-950'
              }`}
            >
              {project.status || 'LIVE'}
            </span>
            {project.industry && (
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-slate-300">
                {project.industry}
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {project.description || project.summary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {(project.play_store_url || project.app_store_url) && (
              <ProjectStoreBadges playStoreUrl={project.play_store_url} appStoreUrl={project.app_store_url} />
            )}

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:border-white hover:bg-white/10"
              >
                Visit Platform
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-14 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
          <div className="space-y-8">
            {project.challenge && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Challenge</h2>
                <p className="mt-3 text-base leading-relaxed text-slate-700">{project.challenge}</p>
              </div>
            )}

            {project.solution && (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Architecture & Solution</h2>
                <p className="mt-3 text-base leading-relaxed text-slate-700">{project.solution}</p>
              </div>
            )}

            {outcomes.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-950 p-6 text-white">
                <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Verified Outcomes
                </h2>
                <ul className="mt-4 space-y-3">
                  {outcomes.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-200">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Specifications</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">Organization</dt>
                  <dd className="font-semibold text-slate-950">{project.client_name || 'Anjal Solutions LTD'}</dd>
                </div>
                {project.role && (
                  <div>
                    <dt className="text-xs text-slate-500">Engineering Scope</dt>
                    <dd className="font-semibold text-slate-950">{project.role}</dd>
                  </div>
                )}
                {tags.length > 0 && (
                  <div>
                    <dt className="text-xs text-slate-500">Stack</dt>
                    <dd className="mt-1.5 flex flex-wrap gap-1.5">
                      {tags.map(tag => (
                        <span
                          key={tag}
                          className="rounded border border-slate-200 bg-white px-2.5 py-0.5 font-mono text-[11px] text-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {media.length > 0 && (
        <section className="border-b border-slate-200 bg-slate-50 py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Interface & System Screens</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {media.map(item => (
                <figure
                  key={item.id || item.url}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm"
                >
                  <img
                    src={item.url}
                    alt={item.alt || project.title}
                    width={480}
                    height={360}
                    loading="lazy"
                    decoding="async"
                    className={`h-64 w-full rounded-lg bg-slate-100 ${item.url.includes('/logos/') ? 'p-6 object-contain' : 'object-contain'}`}
                  />
                  {item.alt && <figcaption className="px-2 py-2 text-xs text-slate-600">{item.alt}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </PlatformShell>
  )
}
