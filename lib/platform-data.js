import { getDb, initDb, seedDefaults } from '@/lib/db'
import { normalizeCompanyAddress, normalizeCacNumber, registeredOfficeAddress } from '@/lib/company'

export const fallbackSettings = {
  company_name: 'Anjal Solutions LTD',
  company_tagline: 'Software and digital platforms built to work.',
  company_email: 'contact@anjalventures.com',
  company_email2: 'office@anjalsolutionsltd.com',
  company_phone: '+234 816 413 5836',
  company_whatsapp: '2348164135836',
  company_address: registeredOfficeAddress,
  company_cac: '9854225',
  company_tin: '2623598796685',
  footer_tagline: 'Dependable digital products built from Damaturu for Nigeria and beyond.',
  exchange_rate: '1400',
}

export const fallbackServices = [
  { id: 'web', name: 'Web Platforms', description: 'Premium websites, portals, commerce systems, dashboards, and full-stack cloud platforms.', icon: 'globe', tags: ['Next.js', 'Cloud', 'Commerce'] },
  { id: 'apps', name: 'Mobile Apps', description: 'Android and cross-platform apps with product strategy, APIs, release support, and admin systems.', icon: 'smartphone', tags: ['Android', 'React Native', 'APIs'] },
  { id: 'saas', name: 'SaaS Systems', description: 'Multi-role SaaS products, workflow platforms, subscriptions, and operational dashboards.', icon: 'layers', tags: ['SaaS', 'Dashboards', 'Automation'] },
  { id: 'ai', name: 'AI Automation', description: 'AI assistants, workflow automation, document intelligence, and API orchestration.', icon: 'sparkles', tags: ['AI', 'n8n', 'OpenAI'] },
]

export const fallbackCalculator = {
  type: [
    { id: 'type-web', category: 'type', name: 'Corporate Website', base_price: 100, multiplier: 1, description: 'Premium company website.' },
    { id: 'type-app', category: 'type', name: 'Mobile Application', base_price: 500, multiplier: 1, description: 'App plus backend foundations.' },
    { id: 'type-saas', category: 'type', name: 'SaaS Platform', base_price: 900, multiplier: 1, description: 'Multi-role product platform.' },
  ],
  scale: [
    { id: 'scale-mvp', category: 'scale', name: 'Focused MVP', base_price: 0, multiplier: 1 },
    { id: 'scale-growth', category: 'scale', name: 'Growth Build', base_price: 180, multiplier: 1 },
  ],
  timeline: [
    { id: 'timeline-standard', category: 'timeline', name: 'Standard delivery', base_price: 0, multiplier: 1 },
    { id: 'timeline-fast', category: 'timeline', name: 'Accelerated delivery', base_price: 0, multiplier: 1.3 },
  ],
  support: [
    { id: 'support-launch', category: 'support', name: 'Launch support', base_price: 0, multiplier: 1 },
    { id: 'support-growth', category: 'support', name: 'Growth support', base_price: 100, multiplier: 1 },
  ],
  addon: [
    { id: 'addon-admin', category: 'addon', name: 'Admin Dashboard', base_price: 150, multiplier: 1 },
    { id: 'addon-payment', category: 'addon', name: 'Payment Integration', base_price: 200, multiplier: 1 },
    { id: 'addon-ai', category: 'addon', name: 'AI Assistant', base_price: 300, multiplier: 1 },
  ],
}

export async function getPlatformData() {
  try {
    await initDb()
    await seedDefaults()
    const sql = getDb()

    const [settingsArr, projects, media, services, pricingPlans, pricingFeatures, calcItems, testimonials, appPresets, appFeatures] = await Promise.all([
      sql`SELECT key, value FROM settings`,
      sql`SELECT * FROM projects WHERE is_active = true ORDER BY featured DESC, display_order, id`,
      sql`SELECT * FROM project_media ORDER BY project_id, display_order, id`,
      sql`SELECT * FROM services WHERE is_active = true ORDER BY display_order, id`,
      sql`SELECT * FROM pricing_plans WHERE is_active = true ORDER BY display_order, id`,
      sql`SELECT * FROM pricing_features ORDER BY plan_id, display_order`,
      sql`SELECT * FROM calculator_items WHERE is_active = true ORDER BY category, display_order`,
      sql`SELECT id, name, email, company, role, message, rating FROM testimonials WHERE is_approved = true ORDER BY created_at DESC`,
      sql`SELECT * FROM app_presets WHERE is_active = true ORDER BY display_order, id`,
      sql`SELECT * FROM app_features WHERE is_active = true ORDER BY preset_id, display_order, id`,
    ])

    const settings = { ...fallbackSettings, ...Object.fromEntries(settingsArr.map(s => [s.key, s.value])) }
    if (!settings.company_name || settings.company_name === 'Anjal Ventures') {
      settings.company_name = 'Anjal Solutions LTD'
    }
    settings.company_address = normalizeCompanyAddress(settings.company_address)
    settings.company_cac = normalizeCacNumber(settings.company_cac)
    if (!settings.company_tin || settings.company_tin === '2623553716975') {
      settings.company_tin = '2623598796685'
    }
    if (!settings.company_email || settings.company_email.includes('@gmail.com')) {
      settings.company_email = 'contact@anjalventures.com'
    }
    if (!settings.company_email2 || settings.company_email2.includes('@anjal.com') || settings.company_email2 === settings.company_email || settings.company_email2 === 'developers@anjalventures.com') {
      settings.company_email2 = 'office@anjalsolutionsltd.com'
    }
    const projectsWithMedia = projects.map(project => ({
      ...project,
      media: media.filter(item => item.project_id === project.id),
    }))
    const plansWithFeatures = pricingPlans.map(plan => ({
      ...plan,
      features: pricingFeatures.filter(f => f.plan_id === plan.id).map(f => f.feature),
    }))
    const calculator = calcItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {})
    const appStudio = appPresets.map(preset => ({
      ...preset,
      features: appFeatures.filter(feature => feature.preset_id === preset.id),
    }))

    return {
      settings,
      projects: projectsWithMedia,
      services,
      pricingPlans: plansWithFeatures,
      calculator,
      testimonials,
      appStudio,
    }
  } catch (err) {
    console.error('Failed to load platform data:', err)
    return {
      settings: fallbackSettings,
      projects: [],
      services: fallbackServices,
      pricingPlans: [],
      calculator: fallbackCalculator,
      testimonials: [],
      appStudio: [],
    }
  }
}
