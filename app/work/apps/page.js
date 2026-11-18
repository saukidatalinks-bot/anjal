import PlatformShell from '@/components/PlatformShell'
import { CtaBand, ProjectGrid } from '@/components/PlatformSections'
import { getPlatformData } from '@/lib/platform-data'

export const revalidate = 300

export const metadata = {
  title: 'Mobile Applications Portfolio | Anjal Solutions LTD',
  description:
    'Live iOS and Android applications engineered by Anjal Solutions LTD on Apple App Store and Google Play.',
}

export default async function AppsWorkPage() {
  const { settings, projects } = await getPlatformData()

  return (
    <PlatformShell settings={settings}>
      <section className="border-b border-slate-800 bg-slate-950 px-5 py-16 text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Apple App Store & Google Play
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Production mobile apps built for speed, offline safety, and daily trust.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Including Sauki Go (fintech utility), My NELFund (civic education & calculator), and upcoming Damaturu rider dispatch.
          </p>
        </div>
      </section>

      <ProjectGrid
        projects={projects}
        title="Mobile Application Deployments"
        intro="Cross-platform Flutter iOS and Android systems engineered for operational resilience."
        filter="apps"
      />

      <CtaBand />
    </PlatformShell>
  )
}
