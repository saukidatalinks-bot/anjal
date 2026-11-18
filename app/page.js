import PlatformShell from '@/components/PlatformShell'
import ProjectShowcaseCarousel from '@/components/ProjectShowcaseCarousel'
import MediaBroadcastSection from '@/components/MediaBroadcastSection'
import {
  CtaBand,
  EcosystemBand,
  Hero,
  PricingBand,
  ProcessBand,
  ServicesGrid,
} from '@/components/PlatformSections'
import { ECOSYSTEM_DIVISIONS, getPlatformData } from '@/lib/platform-data'

export const revalidate = 300

export const metadata = {
  title: 'Anjal Solutions LTD | Enterprise Software, Mobile Apps & Digital Systems',
  description:
    'Software built to run your business without friction. Custom web platforms, iOS & Android apps, and payment infrastructure engineered in Nigeria (RC: 9854225 · D-U-N-S: 352297161).',
}

export default async function HomePage() {
  const { settings, projects, services, pricingPlans } = await getPlatformData()

  return (
    <PlatformShell settings={settings}>
      <Hero settings={settings} />
      <MediaBroadcastSection />
      <ProjectShowcaseCarousel projects={projects} />
      <EcosystemBand divisions={ECOSYSTEM_DIVISIONS} />
      <ServicesGrid services={services} />
      <ProcessBand />
      <PricingBand pricingPlans={pricingPlans} />
      <CtaBand />
    </PlatformShell>
  )
}
