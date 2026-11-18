import { unstable_cache } from 'next/cache'
import { getDb } from '@/lib/db'
import { PLATFORM_DATA_TAG } from '@/lib/cache'
import {
  normalizeCacNumber,
  normalizeCompanyAddress,
  normalizeDunsNumber,
  normalizeTinNumber,
  officialEmails,
  officialPhone,
  officialWhatsapp,
  registeredCacNumber,
  registeredDunsNumber,
  registeredOfficeAddress,
  registeredTinNumber,
} from '@/lib/company'

export const fallbackSettings = {
  company_name: 'Anjal Solutions LTD',
  company_tagline: 'Enterprise software, mobile platforms, and digital infrastructure built to last.',
  company_email: officialEmails.general,
  company_email2: officialEmails.secondary,
  company_email3: officialEmails.developer,
  company_phone: officialPhone,
  company_whatsapp: officialWhatsapp,
  company_address: registeredOfficeAddress,
  company_cac: registeredCacNumber,
  company_tin: registeredTinNumber,
  company_duns: registeredDunsNumber,
  hero_badge: `RC: ${registeredCacNumber} · TIN: ${registeredTinNumber} · D-U-N-S: ${registeredDunsNumber}`,
  hero_title: 'Dependable software platforms built for real operations.',
  hero_description:
    'Anjal Solutions LTD engineers production web systems, native iOS & Android applications, fintech infrastructure, and practical AI automation for growing enterprises.',
  hero_tagline: 'Precision architecture. Full client ownership. Built from Damaturu to the world.',
  footer_tagline: 'Enterprise software, mobile platforms, and operational systems engineered in Nigeria.',
}

export const fallbackServices = [
  {
    id: 'anjal-developers',
    name: 'Anjal Developers — Custom Software & Web',
    description:
      'Custom enterprise software engineering, Next.js web platforms, React interfaces, Node.js & PostgreSQL systems, and serverless cloud architecture.',
    icon: 'globe',
    tags: ['Next.js', 'React', 'PostgreSQL', 'Cloud'],
  },
  {
    id: 'mobile-apps',
    name: 'Mobile Applications (iOS & Android)',
    description:
      'Production Flutter & cross-platform apps featuring biometric security, offline recovery, automated delivery queues, and Store release governance.',
    icon: 'smartphone',
    tags: ['Flutter', 'App Store', 'Play Store', 'Biometrics'],
  },
  {
    id: 'restaurant-suite',
    name: 'Restaurant & Ordering Suite',
    description:
      'Menu and dispatch management desktop/web console paired with a customer ordering app for dine-in and delivery across Play Store, App Store, and Web.',
    icon: 'layers',
    tags: ['Menu & POS', 'Dispatch', '₦849,999'],
  },
  {
    id: 'delivery-suite',
    name: 'Delivery & Rider Logistics System',
    description:
      'Desktop dispatch operations paired with dedicated rider and customer ordering apps built for fast urban logistics and settlement.',
    icon: 'briefcase',
    tags: ['Desktop Console', 'Rider App', '₦449,999'],
  },
  {
    id: 'ai-apis',
    name: 'AI Automation & Structured Data APIs',
    description:
      'Practical LLM workflows, natural-language express purchasing, and schema-validated REST APIs engineered for reliable daily throughput.',
    icon: 'sparkles',
    tags: ['AI Workflows', 'FastAPI', 'JSON APIs'],
  },
  {
    id: 'anjal-academy',
    name: 'Anjal Academy & ICT Consulting',
    description:
      'Professional technology education, ICT capacity building, digital skills workshops, and cybersecurity consulting (Academy programs launching soon).',
    icon: 'graduation-cap',
    tags: ['ICT Advisory', 'Cybersecurity', 'Coming Soon'],
  },
]

export const fallbackProjects = [
  {
    id: 'sauki-go',
    slug: 'sauki-go',
    title: 'Sauki Go',
    project_type: 'mobile-app',
    industry: 'Fintech & Utility',
    status: 'LIVE',
    client_name: 'Anjal Solutions LTD',
    role: 'Product architecture, Flutter mobile engineering, cloud retry queues & security',
    summary:
      'Mobile fintech utility platform for instant mobile data bundles, airtime top-ups, and electricity token purchases with biometric authentication, automated transaction recovery, and scheduled top-up workflows.',
    description:
      'Sauki Go delivers instant bill payments, virtual wallet funding, natural-language Express Buy, and automated Cloud Task recovery for transient network outages—strictly engineered as a utility platform on iOS and Android.',
    challenge:
      'Entry-level mobile devices often kill background apps during SMS OTP checks, and upstream telecom APIs suffer brief micro-outages that cause failed purchases.',
    solution:
      'Engineered encrypted 20-minute OTP draft restoration, L1/L2 memory-first caching, pre-LLM local intent parsing, and an HMAC-signed "Send When Online" Cloud Task retry queue with automatic refund safety.',
    outcomes: [
      'Live on Google Play Store & Apple App Store',
      '52.95x faster memory cache reads in VM benchmarks',
      'Automated Cloud Task delivery recovery & biometric PIN gate',
    ],
    tags: ['Flutter', 'Biometrics', 'Cloud Tasks', 'Fintech Utility'],
    url: 'https://saukimart.com/',
    play_store_url: 'https://play.google.com/store/apps/details?id=com.saukimart.go',
    app_store_url: 'https://apps.apple.com/us/app/sauki-go-data-and-commission/id6815456102',
    featured: true,
    media: [
      { id: 'sg-1', url: '/projects/saukigo/1.webp', alt: 'Sauki Go Smart Wallet Home', orientation: 'portrait', is_primary: true },
      { id: 'sg-2', url: '/projects/saukigo/2.webp', alt: 'Sauki AI Express Buy Assistant', orientation: 'portrait', is_primary: false },
      { id: 'sg-3', url: '/projects/saukigo/3.webp', alt: 'Zero-Fee Sauki Wallet Transfer', orientation: 'portrait', is_primary: false },
      { id: 'sg-4', url: '/projects/saukigo/4.webp', alt: 'Verified Transaction Receipt', orientation: 'portrait', is_primary: false },
    ],
  },
  {
    id: 'mynelfund',
    slug: 'mynelfund',
    title: 'My NELFund',
    project_type: 'mobile-app',
    industry: 'Civic Tech & Education',
    status: 'LIVE',
    client_name: 'Independent Civic Initiative',
    role: 'End-to-end iOS & Android Flutter engineering, localization & analytics',
    summary:
      'Independent mobile eligibility guide and 0%-interest loan repayment calculator on Google Play and Apple App Store helping Nigerian tertiary students navigate the Students Loans Act 2024.',
    description:
      'Featured on TVC News Breakfast, My NELFund gives public tertiary students clear eligibility diagnostics, transparent 10% statutory repayment simulations, and searchable policy guidance.',
    challenge:
      'Students across Nigeria lacked clear, offline-friendly clarity on eligibility rules, post-NYSC grace timelines, and monthly repayment impact.',
    solution:
      'Built an Apple HIG Cupertino Flutter app with persistent local loan simulation, Cloud Firestore FAQ sync, and automated widget & integration tests.',
    outcomes: [
      '5,636+ total installs across 41 countries',
      '10,492+ loan repayment calculations & 5,643+ audits',
      '100% crash-free stability across iOS & Android',
    ],
    tags: ['Flutter', 'Cupertino HIG', 'Firebase', 'Open Source'],
    url: 'https://github.com/Abdallahnangere/mynelfund-app',
    play_store_url: 'https://play.google.com/store/apps/details?id=com.mynelfund.app',
    app_store_url: 'https://apps.apple.com/ng/app/my-nelfund/id6809634284',
    featured: true,
    media: [
      { id: 'mn-1', url: '/projects/mynelfund/1.webp', alt: 'My NELFund Program Overview', orientation: 'portrait', is_primary: true },
      { id: 'mn-2', url: '/projects/mynelfund/2.webp', alt: 'NELFUND Eligibility Checker', orientation: 'portrait', is_primary: false },
      { id: 'mn-3', url: '/projects/mynelfund/3.webp', alt: '10% Statutory Repayment Calculator', orientation: 'portrait', is_primary: false },
      { id: 'mn-4', url: '/projects/mynelfund/4.webp', alt: 'Official FAQ Knowledge Base', orientation: 'portrait', is_primary: false },
    ],
  },
  {
    id: 'anjal-islamic-library',
    slug: 'anjal-islamic-library',
    title: 'Anjal Islamic Library API',
    project_type: 'saas',
    industry: 'Structured Data & API',
    status: 'LIVE',
    client_name: 'Anjal Developers Open Ecosystem',
    role: 'Data normalization pipeline, JSON Schema registry & FastAPI engineering',
    summary:
      'Headless, schema-validated Islamic reference dataset and FastAPI JSON API covering Quran, Hadith, Umm al-Qura Hijri dates, and prayer times across all Nigerian LGAs and global cities.',
    description:
      'Built as open developer infrastructure with UTF-8 NFC normalization, SQLite FTS5 full-text search, Draft 2020-12 JSON Schemas, and deterministic JSONL exports.',
    challenge:
      'Global Islamic data APIs frequently lack complete Nigerian local government prayer schedules or clean dual-language full-text search.',
    solution:
      'Constructed a reproducible CSV -> SQLite FTS5 -> JSONL pipeline with SHA-256 manifest verification and sub-50ms serverless API endpoints.',
    outcomes: [
      '6,236 Quran ayahs & 36,512 Hadith entries indexed',
      '55,991 Umm al-Qura Hijri mappings & 836 prayer hubs',
      'OpenAPI 3 documentation & MIT open-source repository',
    ],
    tags: ['Python', 'FastAPI', 'SQLite FTS5', 'JSON Schema'],
    url: 'https://islamiclibrary.anjalventures.com/docs',
    featured: true,
    media: [],
  },
  {
    id: 'sauki-mart',
    slug: 'sauki-mart',
    title: 'Sauki Mart',
    project_type: 'website',
    industry: 'B2B / B2C Commerce',
    status: 'COMING SOON',
    client_name: 'Anjal Solutions LTD',
    role: 'Multi-vendor marketplace engineering, wallet settlement & developer REST APIs',
    summary:
      'A B2B/B2C multi-vendor e-commerce marketplace connecting local Nigerian merchants with retail buyers, complete with vendor storefronts, agent wallet services, and developer REST APIs.',
    description:
      'Launching soon on saukimart.com and native mobile, Sauki Mart unifies verified merchant storefronts, grouped multi-store checkouts, and instant bank/wallet settlement.',
    challenge:
      'Local merchants need reliable digital storefronts paired with verified instant settlement and unified inventory logistics.',
    solution:
      'Built on Next.js, Neon PostgreSQL, Drizzle ORM, and Flutterwave virtual accounts alongside a native Flutter buyer/vendor client.',
    outcomes: [
      'Multi-vendor storefronts & grouped checkout engine',
      'Agent wallet services & developer REST API portal',
      'Currently in final pre-launch rollout (Coming Soon)',
    ],
    tags: ['Coming Soon', 'Marketplace', 'REST APIs', 'Next.js & Flutter'],
    url: 'https://saukimart.com/',
    featured: true,
    media: [
      { id: 'sm-1', url: '/logos/sauki-mart-logo.webp', alt: 'Sauki Mart Online Marketplace Logo', orientation: 'landscape', is_primary: true },
    ],
  },
  {
    id: 'sauki-delivery',
    slug: 'sauki-delivery',
    title: 'Sauki Delivery',
    project_type: 'mobile-app',
    industry: 'Logistics & Dispatch',
    status: 'COMING SOON',
    client_name: 'Anjal Solutions LTD',
    role: 'Desktop dispatch console, rider mobile workflow & customer tracking',
    summary:
      'An on-demand last-mile logistics and motorcycle dispatch network connecting local vendors with doorstep delivery in Damaturu.',
    description:
      'Engineered to give Damaturu merchants predictable same-day dispatch with dedicated rider coordination, customer tracking, and automated settlement.',
    outcomes: [
      'Desktop dispatch console for fleet managers',
      'Rider mobile app & customer delivery updates',
      'Expanding Damaturu merchant fulfilment (Coming Soon)',
    ],
    tags: ['Coming Soon', 'Logistics', 'Rider App', 'Damaturu'],
    featured: true,
    media: [],
  },
  {
    id: 'anjal-academy',
    slug: 'anjal-academy',
    title: 'Anjal Academy',
    project_type: 'website',
    industry: 'Tech Education & Security',
    status: 'COMING SOON',
    client_name: 'Anjal Solutions LTD',
    role: 'Technical curriculum design, workshops & cybersecurity advisory',
    summary:
      'Professional technology education, ICT capacity building, digital skills workshops, and cybersecurity consulting.',
    description:
      'Equipping teams, institutions, and emerging builders across Nigeria with practical engineering training and operational cybersecurity readiness.',
    outcomes: [
      'Practical software & ICT capacity-building tracks',
      'Institutional workshops & cybersecurity consulting',
      'Upcoming cohort & curriculum launch (Coming Soon)',
    ],
    tags: ['Coming Soon', 'ICT Training', 'Cybersecurity', 'Workshops'],
    featured: true,
    media: [],
  },
]

export const fallbackPricingPlans = [
  {
    id: 'plan-1',
    name: 'Launch',
    price: '₦350,000+',
    price_note: 'Corporate websites, institutional portals & landing systems',
    is_featured: false,
    cta_text: 'Start Quote',
    display_order: 1,
    features: [
      'Discovery, architecture & UX wireframes',
      'High-speed responsive Next.js build',
      'Unified EmailJS & database lead capture',
      'Technical SEO, OpenGraph & Core Web Vitals',
      'Full source code & deployment handover',
    ],
  },
  {
    id: 'plan-2',
    name: 'Delivery & Rider System',
    price: '₦449,999',
    price_note: 'Desktop dispatch console + rider app + customer ordering app · Maintenance fees apply',
    is_featured: false,
    cta_text: 'Order Delivery Suite',
    display_order: 2,
    features: [
      'Desktop operations & dispatch management console',
      'Dedicated rider app for trip updates & settlements',
      'Customer ordering & live delivery status app',
      'Play Store, App Store & web rollout readiness',
      'Maintenance fees apply post-deployment',
    ],
  },
  {
    id: 'plan-3',
    name: 'Growth',
    price: '₦550,000+',
    price_note: 'Custom web platforms, mobile apps & integrated cloud dashboards',
    is_featured: true,
    cta_text: 'Build With Us',
    display_order: 3,
    features: [
      'Full-stack architecture & relational database',
      'Role-based admin dashboard & audit logs',
      'Paystack / Flutterwave & third-party APIs',
      'Cloud deployment, SSL & automated backups',
      'Three months post-launch engineering support',
    ],
  },
  {
    id: 'plan-4',
    name: 'E-Commerce / Multi-Vendor Suite',
    price: '₦649,999',
    price_note: 'Multi-vendor marketplace, storefronts, checkout & inventory · Maintenance fees apply',
    is_featured: false,
    cta_text: 'Launch Marketplace',
    display_order: 4,
    features: [
      'Vendor onboarding, storefront & catalog portals',
      'Multi-store grouped cart & Naira payment flows',
      'Automated receipts, order tracking & analytics',
      'Web storefront & mobile-ready commerce APIs',
      'Maintenance fees apply post-deployment',
    ],
  },
  {
    id: 'plan-5',
    name: 'Restaurant & Ordering Suite',
    price: '₦849,999',
    price_note: 'Menu & dispatch console + dine-in/delivery apps (Play Store, App Store & Web) · Maintenance fees apply',
    is_featured: false,
    cta_text: 'Deploy Restaurant Suite',
    display_order: 5,
    features: [
      'Central menu, kitchen & dispatch management system',
      'Customer app for dine-in table & delivery orders',
      'Full Play Store, Apple App Store & Web deployment',
      'Live order notifications, receipts & settlements',
      'Maintenance fees apply post-deployment',
    ],
  },
  {
    id: 'plan-6',
    name: 'Enterprise',
    price: 'Custom',
    price_note: 'Multi-tenant SaaS, AI automation & bespoke enterprise infrastructure',
    is_featured: false,
    cta_text: 'Request Proposal',
    display_order: 6,
    features: [
      'Dedicated technical scoping & solution architecture',
      'Multi-role workflows, RBAC & security hardening',
      'AI orchestration, data pipelines & developer APIs',
      'Custom SLA, monitoring & roadmap partnership',
      '100% intellectual property & repository handover',
    ],
  },
]

export const fallbackCalculator = {
  platform: [
    { id: 'c-p1', category: 'platform', name: 'Launch Corporate Website', base_price: 350000, multiplier: 1.0, display_order: 1, description: 'High-speed Next.js corporate platform with SEO and unified lead capture.' },
    { id: 'c-p2', category: 'platform', name: 'Delivery & Rider System', base_price: 449999, multiplier: 1.0, display_order: 2, description: 'Desktop management & dispatch console plus dedicated rider and customer apps. Maintenance fees apply.' },
    { id: 'c-p3', category: 'platform', name: 'Growth Web Portal / SaaS', base_price: 550000, multiplier: 1.0, display_order: 3, description: 'Custom authenticated web platform, database architecture, and role-based dashboard.' },
    { id: 'c-p4', category: 'platform', name: 'E-Commerce / Multi-Vendor Suite', base_price: 649999, multiplier: 1.0, display_order: 4, description: 'Multi-vendor marketplace, grouped checkout, inventory, and wallet flows. Maintenance fees apply.' },
    { id: 'c-p5', category: 'platform', name: 'Custom Mobile App (iOS & Android)', base_price: 750000, multiplier: 1.0, display_order: 5, description: 'Cross-platform Flutter mobile build prepared for Apple App Store and Google Play.' },
    { id: 'c-p6', category: 'platform', name: 'Restaurant & Ordering Suite', base_price: 849999, multiplier: 1.0, display_order: 6, description: 'Menu & dispatch console plus dine-in and delivery app across Play Store, App Store & Web. Maintenance fees apply.' },
  ],
  scope: [
    { id: 'c-s1', category: 'scope', name: 'Focused MVP Architecture', base_price: 0, multiplier: 1.0, display_order: 1, description: 'Core workflows, essential models, and rapid validation release.' },
    { id: 'c-s2', category: 'scope', name: 'Growth Operations Scale', base_price: 200000, multiplier: 1.0, display_order: 2, description: 'Multi-role dashboards, automated queues, and production analytics.' },
    { id: 'c-s3', category: 'scope', name: 'Enterprise High-Availability Scale', base_price: 650000, multiplier: 1.0, display_order: 3, description: 'Multi-tenant architecture, strict RBAC audit trails, and automated failover.' },
  ],
  design: [
    { id: 'c-d1', category: 'design', name: 'Precision Studio UI System', base_price: 0, multiplier: 1.0, display_order: 1, description: 'Crisp accessible component library aligned to WCAG contrast standards.' },
    { id: 'c-d2', category: 'design', name: 'Bespoke Brand & Motion Identity', base_price: 180000, multiplier: 1.0, display_order: 2, description: 'Custom art direction, iconography, interactive product showcases, and design tokens.' },
  ],
  timeline: [
    { id: 'c-t1', category: 'timeline', name: 'Standard Delivery (4–8 Weeks)', base_price: 0, multiplier: 1.0, display_order: 1, description: 'Structured engineering sprints with weekly milestone reviews.' },
    { id: 'c-t2', category: 'timeline', name: 'Accelerated Sprint (2–4 Weeks)', base_price: 0, multiplier: 1.25, display_order: 2, description: 'Priority parallel engineering allocation for compressed launch targets.' },
    { id: 'c-t3', category: 'timeline', name: 'Flexible Milestone Schedule', base_price: 0, multiplier: 0.9, display_order: 3, description: 'Extended sprint cadence for non-urgent internal modernization.' },
  ],
  support: [
    { id: 'c-sp1', category: 'support', name: 'Full Source & Deployment Handover', base_price: 0, multiplier: 1.0, display_order: 1, description: 'Complete repository transfer, documentation, and launch warranty.' },
    { id: 'c-sp2', category: 'support', name: 'Managed Operations SLA (3 Months)', base_price: 180000, multiplier: 1.0, display_order: 2, description: 'Active server monitoring, dependency updates, and priority engineering response.' },
  ],
  addon: [
    { id: 'c-a1', category: 'addon', name: 'Admin Control Dashboard', base_price: 150000, multiplier: 1.0, display_order: 1, description: 'Manage content, orders, users, and operational records.' },
    { id: 'c-a2', category: 'addon', name: 'Paystack / Flutterwave Payments', base_price: 180000, multiplier: 1.0, display_order: 2, description: 'Verified webhooks, wallet funding, and automated receipt settlement.' },
    { id: 'c-a3', category: 'addon', name: 'AI Workflow & Intent Automation', base_price: 280000, multiplier: 1.0, display_order: 3, description: 'Structured LLM assistants, natural-language checkout, and fallback guards.' },
    { id: 'c-a4', category: 'addon', name: 'Telemetry & Executive Reporting', base_price: 140000, multiplier: 1.0, display_order: 4, description: 'Conversion funnel metrics, SLA logs, and exportable financial summaries.' },
    { id: 'c-a5', category: 'addon', name: 'Push, SMS & Email Notifications', base_price: 95000, multiplier: 1.0, display_order: 5, description: 'Transactional push alerts, EmailJS/SMTP, and WhatsApp notification hooks.' },
  ],
}

export const ECOSYSTEM_DIVISIONS = [
  {
    key: 'sauki-go',
    name: 'Sauki Go',
    status: 'LIVE',
    category: 'Fintech Utility',
    logo: '/logos/sauki-go-mark.webp',
    description:
      'Mobile fintech utility platform for instant mobile data bundles, airtime top-ups, and electricity token purchases. Built with biometric authentication, automated transaction recovery, and scheduled top-up workflows.',
    platforms: 'iOS (Apple App Store) & Android (Google Play Store)',
    href: '/work/sauki-go',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.saukimart.go',
    appStoreUrl: 'https://apps.apple.com/us/app/sauki-go-data-and-commission/id6815456102',
  },
  {
    key: 'mynelfund',
    name: 'My NELFund',
    status: 'LIVE',
    category: 'Civic Utility',
    logo: '/logos/nelfund-mark.webp',
    description:
      'Independent mobile eligibility guide and loan repayment calculator application on Google Play Store and Apple App Store helping Nigerian tertiary students check NELFUND eligibility and simulate repayment timelines.',
    platforms: 'iOS & Android · Featured on TVC News',
    href: '/work/mynelfund',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mynelfund.app',
    appStoreUrl: 'https://apps.apple.com/ng/app/my-nelfund/id6809634284',
  },
  {
    key: 'anjal-developers',
    name: 'Anjal Developers',
    status: 'ACTIVE',
    category: 'Engineering Division',
    description:
      'Custom enterprise software engineering, full-stack web and mobile application development (Next.js, React, Node.js, PostgreSQL, Flutter), serverless cloud architectures, and ICT consulting.',
    platforms: 'Enterprise Web · Mobile · Cloud APIs',
    href: '/services',
  },
  {
    key: 'sauki-mart',
    name: 'Sauki Mart',
    status: 'COMING SOON',
    category: 'E-Commerce Marketplace',
    logo: '/logos/sauki-mart-mark.webp',
    description:
      'A B2B/B2C multi-vendor e-commerce marketplace connecting local Nigerian merchants with retail buyers, complete with vendor storefronts, agent wallet services, and developer REST APIs.',
    platforms: 'saukimart.com · Coming Soon',
    href: '/work/sauki-mart',
  },
  {
    key: 'sauki-delivery',
    name: 'Sauki Delivery',
    status: 'COMING SOON',
    category: 'Last-Mile Logistics',
    description:
      'An on-demand last-mile logistics and motorcycle dispatch network connecting local vendors with doorstep delivery in Damaturu.',
    platforms: 'Damaturu Dispatch · Coming Soon',
    href: '/work/sauki-delivery',
  },
  {
    key: 'anjal-academy',
    name: 'Anjal Academy',
    status: 'COMING SOON',
    category: 'Education & Security',
    description:
      'Professional technology education, ICT capacity building, digital skills workshops, and cybersecurity consulting.',
    platforms: 'Workshops & Advisory · Coming Soon',
    href: '/work/anjal-academy',
  },
]

function normalizeSettings(rawSettings = {}) {
  const settings = { ...fallbackSettings, ...rawSettings }
  if (!settings.company_name || settings.company_name === 'Anjal Ventures') {
    settings.company_name = 'Anjal Solutions LTD'
  }
  settings.company_address = normalizeCompanyAddress(settings.company_address)
  settings.company_cac = normalizeCacNumber(settings.company_cac)
  settings.company_tin = normalizeTinNumber(settings.company_tin)
  settings.company_duns = normalizeDunsNumber(settings.company_duns)
  settings.hero_badge = `RC: ${settings.company_cac} · TIN: ${settings.company_tin} · D-U-N-S: ${settings.company_duns}`
  if (!settings.company_email || settings.company_email.includes('@gmail.com')) {
    settings.company_email = officialEmails.general
  }
  if (!settings.company_email2 || settings.company_email2.includes('@anjal.com')) {
    settings.company_email2 = officialEmails.secondary
  }
  return settings
}

function mergeProjectsWithFallback(dbProjects = [], dbMedia = []) {
  const withMedia = dbProjects.map(project => ({
    ...project,
    media: dbMedia.filter(item => item.project_id === project.id),
  }))

  const bySlug = new Map()
  for (const p of withMedia) {
    const key = String(p.slug || p.id).toLowerCase()
    bySlug.set(key, p)
  }

  for (const fb of fallbackProjects) {
    if (!bySlug.has(fb.slug)) {
      bySlug.set(fb.slug, fb)
    }
  }

  return Array.from(bySlug.values())
}

function normalizeCalculatorMap(items = []) {
  const grouped = {}
  for (const item of items) {
    let key = item.category
    if (key === 'type') key = 'platform'
    if (key === 'scale') key = 'scope'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push({ ...item, category: key })
  }
  if (!grouped.design?.length) grouped.design = fallbackCalculator.design
  if (!grouped.platform?.length) grouped.platform = fallbackCalculator.platform
  if (!grouped.scope?.length) grouped.scope = fallbackCalculator.scope
  if (!grouped.timeline?.length) grouped.timeline = fallbackCalculator.timeline
  if (!grouped.support?.length) grouped.support = fallbackCalculator.support
  if (!grouped.addon?.length) grouped.addon = fallbackCalculator.addon
  return grouped
}

async function fetchPlatformDataUncached() {
  if (!process.env.DATABASE_URL) {
    return {
      settings: fallbackSettings,
      projects: fallbackProjects,
      services: fallbackServices,
      pricingPlans: fallbackPricingPlans,
      calculator: fallbackCalculator,
      testimonials: [],
    }
  }

  try {
    const sql = getDb()
    const [settingsArr, projects, media, services, pricingPlans, pricingFeatures, calcItems, testimonials] =
      await Promise.all([
        sql`SELECT key, value FROM settings`,
        sql`SELECT * FROM projects WHERE is_active = true ORDER BY featured DESC, display_order, id`,
        sql`SELECT * FROM project_media ORDER BY project_id, display_order, id`,
        sql`SELECT * FROM services WHERE is_active = true ORDER BY display_order, id`,
        sql`SELECT * FROM pricing_plans WHERE is_active = true ORDER BY display_order, id`,
        sql`SELECT * FROM pricing_features ORDER BY plan_id, display_order`,
        sql`SELECT * FROM calculator_items WHERE is_active = true ORDER BY category, display_order`,
        sql`SELECT id, name, email, company, role, message, rating FROM testimonials WHERE is_approved = true ORDER BY created_at DESC`,
      ])

    const settings = normalizeSettings(Object.fromEntries(settingsArr.map(s => [s.key, s.value])))

    const hasLegacyPlans =
      !pricingPlans.length ||
      pricingPlans.some(p => String(p.price || '').includes('$'))

    const plansWithFeatures = hasLegacyPlans
      ? fallbackPricingPlans
      : pricingPlans.map(plan => ({
          ...plan,
          features: pricingFeatures.filter(f => f.plan_id === plan.id).map(f => f.feature),
        }))

    const hasLegacyCalc =
      !calcItems.length ||
      calcItems.some(c => Number(c.base_price || 0) > 0 && Number(c.base_price || 0) < 5000)

    const calculator = hasLegacyCalc ? fallbackCalculator : normalizeCalculatorMap(calcItems)

    return {
      settings,
      projects: mergeProjectsWithFallback(projects, media),
      services: services.length ? services : fallbackServices,
      pricingPlans: plansWithFeatures,
      calculator,
      testimonials,
    }
  } catch (err) {
    console.error('[PlatformData] Using verified fallback data:', err?.message || err)
    return {
      settings: fallbackSettings,
      projects: fallbackProjects,
      services: fallbackServices,
      pricingPlans: fallbackPricingPlans,
      calculator: fallbackCalculator,
      testimonials: [],
    }
  }
}

export const getPlatformData = unstable_cache(
  fetchPlatformDataUncached,
  ['platform-data-v3'],
  { tags: [PLATFORM_DATA_TAG], revalidate: 300 }
)
