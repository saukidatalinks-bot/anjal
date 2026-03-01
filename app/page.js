import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import HeroEnhanced from '@/components/HeroEnhanced'
import StatsSection from '@/components/StatsSection'  
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import TestimonialSubmission from '@/components/TestimonialSubmission'
import ProcessTimeline from '@/components/ProcessTimeline'
import MarqueeBanner from '@/components/MarqueeBanner'
import About from '@/components/About'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import Pricing from '@/components/Pricing'
import FAQSection from '@/components/FAQSection'
import EnhancedCTA from '@/components/EnhancedCTA'
import EstimatorAndQuotation from '@/components/EstimatorAndQuotation'
import Contact from '@/components/Contact'
import { Footer, WhatsAppButton } from '@/components/Footer'
import { getDb, initDb, seedDefaults } from '@/lib/db'

async function getSiteData() {
  try {
    await initDb()
    await seedDefaults()
    const sql = getDb()

    const [settingsArr, projects, services, pricingPlans, pricingFeatures, calcItems, testimonials] = await Promise.all([
      sql`SELECT key, value FROM settings`,
      sql`SELECT * FROM projects WHERE is_active = true ORDER BY display_order, id`,
      sql`SELECT * FROM services WHERE is_active = true ORDER BY display_order, id`,
      sql`SELECT * FROM pricing_plans WHERE is_active = true ORDER BY display_order, id`,
      sql`SELECT * FROM pricing_features ORDER BY plan_id, display_order`,
      sql`SELECT * FROM calculator_items WHERE is_active = true ORDER BY category, display_order`,
      sql`SELECT id, name, email, company, role, message, rating FROM testimonials WHERE is_approved = true ORDER BY created_at DESC`,
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

    console.log(`[HomePage] Loaded ${testimonials.length} approved testimonials`)
    if (testimonials.length > 0) {
      console.log('[HomePage] Sample testimonial:', testimonials[0])
    }

    return { settings, projects, services, pricingPlans: plansWithFeatures, calculator, testimonials }
  } catch (err) {
    console.error('Failed to load site data:', err)
    return { settings: {}, projects: [], services: [], pricingPlans: [], calculator: {}, testimonials: [] }
  }
}

export default async function HomePage() {
  const { settings, projects, services, pricingPlans, calculator, testimonials } = await getSiteData()

  return (
    <>
      <Toaster position="top-right" toastOptions={{ className: 'font-sans text-sm' }} />
      <Navbar settings={settings} />
      <HeroEnhanced />
      <StatsSection />
      <TestimonialsCarousel testimonials={testimonials} />
      <ProcessTimeline />
      <MarqueeBanner services={services} />
      <About settings={settings} />
      <Services services={services} />
      <Portfolio projects={projects} />
      <Pricing plans={pricingPlans} settings={settings} />
      <FAQSection />
      <EnhancedCTA />
      <TestimonialSubmission />
      <EstimatorAndQuotation settings={settings} calculator={calculator} />
      <Contact settings={settings} services={services} />
      <Footer settings={settings} />
      <WhatsAppButton settings={settings} />
    </>
  )
}
