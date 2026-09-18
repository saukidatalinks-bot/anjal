import { Toaster } from 'react-hot-toast'
import PlatformShell from '@/components/PlatformShell'
import { CtaBand, Hero, PricingBand, ProcessBand, ProjectGrid, ServicesGrid } from '@/components/PlatformSections'
import MediaBroadcastSection from '@/components/MediaBroadcastSection'
import { getPlatformData } from '@/lib/platform-data'

export default async function HomePage() {
  const { settings, projects, services, pricingPlans } = await getPlatformData()

  return (
    <PlatformShell settings={settings}>
      <Toaster position="top-right" />
      <Hero settings={settings} />
      <MediaBroadcastSection />
      <ServicesGrid services={services} />
      <ProjectGrid
        projects={projects.slice(0, 4)}
        title="Proof of serious execution."
        intro="A curated view of active platforms, apps, SaaS systems, and digital infrastructure delivered or managed by Anjal Solutions LTD."
      />
      <ProcessBand />
      <PricingBand plans={pricingPlans} />
      <CtaBand settings={settings} />
    </PlatformShell>
  )
}
