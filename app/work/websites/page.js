import PlatformShell from '@/components/PlatformShell'
import { CtaBand, ProjectGrid } from '@/components/PlatformSections'
import { getPlatformData } from '@/lib/platform-data'

export const revalidate = 300

export const metadata = {
  title: 'Web Platforms & Structured APIs | Anjal Solutions LTD',
  description:
    'High-speed web applications, FastAPI open datasets, and multi-vendor cloud infrastructure built by Anjal Solutions LTD.',
}

export default async function WebsitesWorkPage() {
  const { settings, projects } = await getPlatformData()

  return (
    <PlatformShell settings={settings}>
      <section className="border-b border-slate-800 bg-slate-950 px-5 py-16 text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">
            Web Systems, SaaS & APIs
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Cloud web architectures, developer APIs, and marketplace platforms.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Designed around fast server rendering, deterministic schema validation, and clear operator dashboards.
          </p>
        </div>
      </section>

      <ProjectGrid
        projects={projects}
        title="Web Platforms, APIs & Academy"
        intro="Verified developer infrastructure alongside upcoming Sauki Mart and Anjal Academy platforms."
        filter="websites"
      />

      <CtaBand />
    </PlatformShell>
  )
}
