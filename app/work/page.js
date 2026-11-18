import PlatformShell from '@/components/PlatformShell'
import ProjectShowcaseCarousel from '@/components/ProjectShowcaseCarousel'
import { CtaBand, ProjectGrid } from '@/components/PlatformSections'
import { getPlatformData } from '@/lib/platform-data'

export const revalidate = 300

export const metadata = {
  title: 'Shipped Products & Roadmap | Anjal Solutions LTD',
  description:
    'Explore live products (Sauki Go, My NELFund, Anjal Islamic Library API) and upcoming rollouts (Sauki Mart, Sauki Delivery, Anjal Academy).',
}

export default async function WorkPage() {
  const { settings, projects } = await getPlatformData()

  return (
    <PlatformShell settings={settings}>
      <section className="border-b border-slate-800 bg-slate-950 px-5 py-16 text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">
            Selected Work & Product Ecosystem
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Verified software deployments across mobile, web, and open APIs.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Inspect live applications published on Apple App Store and Google Play alongside our structured API systems and upcoming ecosystem launches.
          </p>
        </div>
      </section>

      <ProjectShowcaseCarousel projects={projects} />

      <ProjectGrid
        projects={projects}
        title="All Platforms & Upcoming Rollouts"
        intro="Every active product and pre-launch suite developed under Anjal Solutions LTD."
        filter="all"
      />

      <CtaBand />
    </PlatformShell>
  )
}
