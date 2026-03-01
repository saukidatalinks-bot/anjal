import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import HeroEnhanced from '@/components/HeroEnhanced'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import StatsSection from '@/components/StatsSection'
import EnhancedCTA from '@/components/EnhancedCTA'
import CaseStudies from '@/components/CaseStudies'
import ProcessTimeline from '@/components/ProcessTimeline'
import FAQSection from '@/components/FAQSection'
import MarqueeBanner from '@/components/MarqueeBanner'
import About from '@/components/About'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import Pricing from '@/components/Pricing'
import EstimatorAndQuotation from '@/components/EstimatorAndQuotation'
import Contact from '@/components/Contact'
import { Footer, WhatsAppButton } from '@/components/Footer'
import { getDb, initDb, seedDefaults } from '@/lib/db'

async function getSiteData() {
  try {
    await initDb()
    await seedDefaults()
    const sql = getDb()

    const [settingsArr, projects, services, pricingPlans, pricingFeatures, calcItems] = await Promise.all([
      sql`SELECT key, value FROM settings`,
      sql`SELECT * FROM projects WHERE is_active = true ORDER BY display_order, id`,
      sql`SELECT * FROM services WHERE is_active = true ORDER BY display_order, id`,
      sql`SELECT * FROM pricing_plans WHERE is_active = true ORDER BY display_order, id`,
      sql`SELECT * FROM pricing_features ORDER BY plan_id, display_order`,
      sql`SELECT * FROM calculator_items WHERE is_active = true ORDER BY category, display_order`,
    ])

    const settings = Object.fromEntries(settingsArr.map(s => [s.key, s.value]))

    const plansWithFeatures = pricingPlans.map(p => ({
      ...p,
      features: pricingFeatures.filter(f => f.plan_id === p.id).map(f => f.feature),
    }))

    const calculator = calcItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {})

    return { settings, projects, services, pricingPlans: plansWithFeatures, calculator }
  } catch (err) {
    console.error('Failed to load site data:', err)
    return { settings: {}, projects: [], services: [], pricingPlans: [], calculator: {} }
  }
}

export default async function HomePage() {
  const { settings, projects, services, pricingPlans, calculator } = await getSiteData()

  return (
    <>
      <Toaster position="top-right" toastOptions={{ className: 'font-sans text-sm' }} />
      <Navbar settings={settings} />
      <HeroEnhanced />
      <StatsSection />
      <TestimonialsCarousel />
      <CaseStudies />
      <ProcessTimeline />
      <MarqueeBanner services={services} />
      <About settings={settings} />
      <Services services={services} />
      <Portfolio projects={projects} />
      <Pricing plans={pricingPlans} settings={settings} />
      <FAQSection />
      <EnhancedCTA />
      <EstimatorAndQuotation settings={settings} calculator={calculator} />
      <Contact settings={settings} services={services} />
      <Footer settings={settings} />
      <WhatsAppButton settings={settings} />
    </>
  )
}
