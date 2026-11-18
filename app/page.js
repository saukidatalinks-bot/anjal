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
    'Anjal Solutions LTD (RC: 9854225 · D-U-N-S: 352297161) engineers Sauki Go, My NELFund, enterprise web applications, native mobile platforms, and structured JSON APIs from Nigeria.',
}

export default async function HomePage() {
  const { settings, projects, services, pricingPlans } = await getPlatformData()

  return (
    <PlatformShell settings={settings}>
      <Hero settings={settings} projects={projects} />
      <ProjectShowcaseCarousel projects={projects} />
      <EcosystemBand divisions={ECOSYSTEM_DIVISIONS} />
      <MediaBroadcastSection />
      <ServicesGrid services={services} />
      <ProcessBand />
      <PricingBand pricingPlans={pricingPlans} />
      <CtaBand />
    </PlatformShell>
  )
}
