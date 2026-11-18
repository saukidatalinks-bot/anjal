import { neon } from '@neondatabase/serverless'
import {
  officialEmails,
  officialPhone,
  officialWhatsapp,
  registeredCacNumber,
  registeredDunsNumber,
  registeredOfficeAddress,
  registeredTinNumber,
} from '@/lib/company'

let sql
let initPromise

export function getDb() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    sql = neon(process.env.DATABASE_URL)
  }
  return sql
}

export function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

let isInitialized = false
let isSeeded = false

export async function initDb() {
  if (isInitialized) return true
  if (!initPromise) {
    initPromise = runInitDb()
      .then(() => {
        isInitialized = true
        return true
      })
      .catch(err => {
        initPromise = null
        throw err
      })
  }
  return initPromise
}

async function runInitDb() {
  const sql = getDb()

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(255) PRIMARY KEY,
      value TEXT,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      description TEXT,
      url VARCHAR(500),
      status VARCHAR(50) DEFAULT 'LIVE',
      tags TEXT[],
      image_url TEXT,
      emoji VARCHAR(20) DEFAULT 'rocket',
      banner_color VARCHAR(20) DEFAULT '#0A1628',
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug VARCHAR(255)`
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type VARCHAR(40) DEFAULT 'website'`
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS industry VARCHAR(255)`
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_name VARCHAR(255)`
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS role TEXT`
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS summary TEXT`
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge TEXT`
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution TEXT`
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcomes TEXT[]`
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS app_store_url TEXT`
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS play_store_url TEXT`
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false`
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS launched_at DATE`
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug) WHERE slug IS NOT NULL`
  await sql`
    UPDATE projects
    SET slug = lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')) || '-' || id
    WHERE slug IS NULL OR slug = ''
  `

  await sql`
    CREATE TABLE IF NOT EXISTS project_media (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      media_type VARCHAR(40) DEFAULT 'image',
      url TEXT NOT NULL,
      alt TEXT,
      orientation VARCHAR(40) DEFAULT 'landscape',
      display_order INTEGER DEFAULT 0,
      is_primary BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_project_media_project_id ON project_media(project_id)`

  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      name VARCHAR(500) NOT NULL,
      description TEXT,
      icon VARCHAR(20) DEFAULT 'platform',
      tags TEXT[],
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS pricing_plans (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price VARCHAR(100) NOT NULL,
      price_note VARCHAR(255),
      is_featured BOOLEAN DEFAULT false,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      cta_text VARCHAR(100) DEFAULT 'Get Started',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS pricing_features (
      id SERIAL PRIMARY KEY,
      plan_id INTEGER REFERENCES pricing_plans(id) ON DELETE CASCADE,
      feature TEXT NOT NULL,
      display_order INTEGER DEFAULT 0
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS calculator_items (
      id SERIAL PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      name VARCHAR(255) NOT NULL,
      base_price DECIMAL(12,2) DEFAULT 0,
      multiplier DECIMAL(5,3) DEFAULT 1.0,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true
    )
  `
  await sql`ALTER TABLE calculator_items ALTER COLUMN base_price TYPE DECIMAL(14,2)`
  await sql`ALTER TABLE calculator_items ADD COLUMN IF NOT EXISTS description TEXT`

  await sql`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50),
      service VARCHAR(255),
      budget VARCHAR(100),
      message TEXT,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS quotation_requests (
      id SERIAL PRIMARY KEY,
      client_name VARCHAR(255),
      entity_name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50),
      address TEXT,
      selected_items JSONB,
      total_amount DECIMAL(14,2),
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE quotation_requests ALTER COLUMN total_amount TYPE DECIMAL(14,2)`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS reference VARCHAR(80)`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS quote_type VARCHAR(60) DEFAULT 'project'`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS project_title VARCHAR(255)`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS client_payload JSONB DEFAULT '{}'::jsonb`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS proposal_payload JSONB DEFAULT '{}'::jsonb`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS total_naira DECIMAL(14,2)`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'NGN'`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS status VARCHAR(40) DEFAULT 'new'`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS source VARCHAR(80) DEFAULT 'quote-builder'`

  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      company VARCHAR(255),
      role VARCHAR(255),
      message TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      is_approved BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false`

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(40) DEFAULT 'admin',
      is_active BOOLEAN DEFAULT true,
      last_login_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

  return true
}

export const DEFAULT_NAIRA_PLANS = [
  {
    name: 'Launch',
    price: '₦150,000+',
    note: 'Corporate websites, institutional portals & landing systems',
    featured: false,
    cta: 'Start Quote',
    order: 1,
    features: [
      'Discovery, architecture & UX wireframes',
      'High-speed responsive Next.js build',
      'Unified EmailJS & database lead capture',
      'Technical SEO, OpenGraph & Core Web Vitals',
      'Full source code & deployment handover',
    ],
  },
  {
    name: 'Delivery & Rider System',
    price: '₦449,999',
    note: 'Desktop dispatch console + rider app + customer ordering app · Maintenance fees apply',
    featured: false,
    cta: 'Order Delivery Suite',
    order: 2,
    features: [
      'Desktop operations & dispatch management console',
      'Dedicated rider app for trip updates & settlements',
      'Customer ordering & live delivery status app',
      'Play Store, App Store & web rollout readiness',
      'Maintenance fees apply post-deployment',
    ],
  },
  {
    name: 'Growth',
    price: '₦500,000+',
    note: 'Custom web platforms, mobile apps & integrated cloud dashboards',
    featured: true,
    cta: 'Build With Us',
    order: 3,
    features: [
      'Full-stack architecture & relational database',
      'Role-based admin dashboard & audit logs',
      'Paystack / Flutterwave & third-party APIs',
      'Cloud deployment, SSL & automated backups',
      'Three months post-launch engineering support',
    ],
  },
  {
    name: 'E-Commerce / Multi-Vendor Suite',
    price: '₦649,999',
    note: 'Multi-vendor marketplace, storefronts, checkout & inventory · Maintenance fees apply',
    featured: false,
    cta: 'Launch Marketplace',
    order: 4,
    features: [
      'Vendor onboarding, storefront & catalog portals',
      'Multi-store grouped cart & Naira payment flows',
      'Automated receipts, order tracking & analytics',
      'Web storefront & mobile-ready commerce APIs',
      'Maintenance fees apply post-deployment',
    ],
  },
  {
    name: 'Restaurant & Ordering Suite',
    price: '₦849,999',
    note: 'Menu & dispatch console + dine-in/delivery apps (Play Store, App Store & Web) · Maintenance fees apply',
    featured: false,
    cta: 'Deploy Restaurant Suite',
    order: 5,
    features: [
      'Central menu, kitchen & dispatch management system',
      'Customer app for dine-in table & delivery orders',
      'Full Play Store, Apple App Store & Web deployment',
      'Live order notifications, receipts & settlements',
      'Maintenance fees apply post-deployment',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    note: 'Multi-tenant SaaS, AI automation & bespoke enterprise infrastructure',
    featured: false,
    cta: 'Request Proposal',
    order: 6,
    features: [
      'Dedicated technical scoping & solution architecture',
      'Multi-role workflows, RBAC & security hardening',
      'AI orchestration, data pipelines & developer APIs',
      'Custom SLA, monitoring & roadmap partnership',
      '100% intellectual property & repository handover',
    ],
  },
]

export const DEFAULT_NAIRA_CALCULATOR = [
  ['type', 'Corporate Website', 150000, 1, 1, 'Enterprise business website with structured SEO, fast edge caching, and unified lead capture.'],
  ['type', 'Delivery & Rider System', 449999, 1, 2, 'Desktop dispatch management console plus rider and customer ordering apps (maintenance fees apply).'],
  ['type', 'Web Platform / Portal', 500000, 1, 3, 'Authenticated full-stack web platform with relational PostgreSQL database and admin console.'],
  ['type', 'E-Commerce / Multi-Vendor Suite', 649999, 1, 4, 'Multi-vendor marketplace with seller portals, checkout, payments, and order management (maintenance fees apply).'],
  ['type', 'Restaurant & Ordering Suite', 849999, 1, 5, 'Menu & dispatch console plus customer dine-in/delivery app deployed across Play Store, App Store & Web (maintenance fees apply).'],
  ['type', 'Custom Mobile App (iOS & Android)', 750000, 1, 6, 'Production Flutter / React Native app with backend APIs and App Store / Google Play release support.'],
  ['type', 'SaaS Platform', 1200000, 1, 7, 'Multi-tenant subscription-ready SaaS product with billing, RBAC, and telemetry.'],
  ['scale', 'Focused MVP', 0, 1, 1, 'Core workflow and launch-ready production scope.'],
  ['scale', 'Growth Scale', 200000, 1, 2, 'Expanded workflows, external integrations, and operational controls.'],
  ['scale', 'Enterprise Scale', 650000, 1, 3, 'High-concurrency architecture, audit logging, and multi-department governance.'],
  ['timeline', 'Standard delivery', 0, 1, 1, 'Balanced discovery, design, engineering, and QA cadence.'],
  ['timeline', 'Accelerated delivery', 0, 1.25, 2, 'Priority engineering sprint with compressed launch window.'],
  ['timeline', 'Flexible delivery', 0, 0.9, 3, 'Extended delivery schedule with cost efficiency.'],
  ['support', 'Launch handover', 0, 1, 1, 'Standard 30-day warranty and full source repository handover.'],
  ['support', 'Managed Operations SLA', 150000, 1, 2, 'Ongoing platform monitoring, maintenance, and priority engineering updates.'],
  ['addon', 'Admin Control Dashboard', 150000, 1, 1, 'Manage content, orders, users, and operational records.'],
  ['addon', 'Paystack / Flutterwave Payments', 180000, 1, 2, 'Verified webhooks, virtual accounts, wallets, and instant receipts.'],
  ['addon', 'AI Workflow & Assistant', 280000, 1, 3, 'Intelligent support chat, document automation, and LLM orchestration.'],
  ['addon', 'Telemetry & Reporting', 140000, 1, 4, 'Operational KPIs, exportable reports, and analytics pipelines.'],
  ['addon', 'Push & Email Notifications', 95000, 1, 5, 'FCM mobile push, EmailJS/SMTP, and WhatsApp notification workflows.'],
]

async function countRows(sql, tableName) {
  if (tableName === 'services') return (await sql`SELECT COUNT(*)::int AS count FROM services`)[0]?.count || 0
  if (tableName === 'projects') return (await sql`SELECT COUNT(*)::int AS count FROM projects`)[0]?.count || 0
  if (tableName === 'pricing_plans') return (await sql`SELECT COUNT(*)::int AS count FROM pricing_plans`)[0]?.count || 0
  if (tableName === 'calculator_items') return (await sql`SELECT COUNT(*)::int AS count FROM calculator_items`)[0]?.count || 0
  throw new Error(`Unsupported count table: ${tableName}`)
}

export async function seedDefaults({ forceRefreshPricing = false } = {}) {
  if (isSeeded && !forceRefreshPricing) return true
  const sql = getDb()

  const defaultSettings = {
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
    about_text:
      'ANJAL SOLUTIONS LTD is a Private Company Limited by Shares registered in Nigeria under CAMA 2020 (RC 9854225), operating as the incorporated corporate successor to Anjal Ventures (RC 9258709) and Sauki Data Links (SMEDAN ID: SUID-9914-4253-4924-5237).',
    emailjs_public_key: '',
    emailjs_service_id: '',
    emailjs_template_id: '',
    footer_tagline: 'Enterprise software, mobile platforms, and operational systems engineered in Nigeria.',
    meta_description:
      'Anjal Solutions LTD (RC 9854225, TIN 2623598796685, D-U-N-S 352297161) engineers custom web platforms, iOS & Android apps, restaurant & delivery systems, and cloud infrastructure.',
    exchange_rate: '1400',
  }

  for (const [key, value] of Object.entries(defaultSettings)) {
    await sql`
      INSERT INTO settings (key, value) VALUES (${key}, ${value})
      ON CONFLICT (key) DO NOTHING
    `
  }

  await sql`
    INSERT INTO settings (key, value, updated_at) VALUES ('company_duns', ${registeredDunsNumber}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = ${registeredDunsNumber}, updated_at = NOW()
  `
  await sql`
    UPDATE settings
    SET value = ${defaultSettings.hero_badge}, updated_at = NOW()
    WHERE key = 'hero_badge' AND value NOT LIKE '%D-U-N-S%'
  `

  if ((await countRows(sql, 'services')) === 0) {
    const services = [
      {
        name: 'Anjal Developers — Custom Software & Web',
        description:
          'Enterprise web platforms, portals, and full-stack cloud systems engineered with Next.js, React, Node.js, and PostgreSQL for sub-second speed and clean ownership.',
        icon: 'globe',
        tags: ['Next.js', 'React', 'Node.js', 'PostgreSQL'],
        order: 1,
      },
      {
        name: 'Mobile Engineering (iOS & Android)',
        description:
          'Production Flutter & React Native applications with biometric authentication, offline caching, automated transaction recovery, and App Store / Google Play release.',
        icon: 'smartphone',
        tags: ['Flutter', 'iOS App Store', 'Google Play', 'Biometrics'],
        order: 2,
      },
      {
        name: 'Restaurant & Dispatch Suites',
        description:
          'End-to-end menu, kitchen, and dispatch management systems paired with dine-in and delivery apps across Play Store, App Store, and Web.',
        icon: 'layers',
        tags: ['Menu & POS', 'Dispatch', 'Multi-Platform'],
        order: 3,
      },
      {
        name: 'Delivery & Rider Logistics Systems',
        description:
          'Desktop dispatch management paired with dedicated rider and customer ordering apps built for fast urban fulfilment and settlement.',
        icon: 'briefcase',
        tags: ['Desktop Console', 'Rider App', 'Live Tracking'],
        order: 4,
      },
      {
        name: 'AI Automation & Data APIs',
        description:
          'Practical LLM integrations, document intelligence, structured dataset pipelines, and REST APIs designed for reliable daily throughput.',
        icon: 'sparkles',
        tags: ['AI Workflows', 'FastAPI', 'REST APIs', 'Automation'],
        order: 5,
      },
      {
        name: 'ICT Consulting & Training (Anjal Academy)',
        description:
          'Institutional ICT advisory, cybersecurity consulting, and upcoming capacity-building programs under Anjal Academy.',
        icon: 'graduation-cap',
        tags: ['Consulting', 'Cybersecurity', 'Coming Soon'],
        order: 6,
      },
    ]
    for (const s of services) {
      await sql`
        INSERT INTO services (name, description, icon, tags, display_order)
        VALUES (${s.name}, ${s.description}, ${s.icon}, ${s.tags}, ${s.order})
      `
    }
  }

  const existingPlans = await sql`SELECT id, price FROM pricing_plans`
  const needsNairaMigration =
    forceRefreshPricing ||
    existingPlans.length === 0 ||
    existingPlans.some(p => String(p.price || '').includes('$'))

  if (needsNairaMigration) {
    await sql`DELETE FROM pricing_plans`
    for (const plan of DEFAULT_NAIRA_PLANS) {
      const result = await sql`
        INSERT INTO pricing_plans (name, price, price_note, is_featured, cta_text, display_order)
        VALUES (${plan.name}, ${plan.price}, ${plan.note}, ${plan.featured}, ${plan.cta}, ${plan.order})
        RETURNING id
      `
      for (let i = 0; i < plan.features.length; i++) {
        await sql`
          INSERT INTO pricing_features (plan_id, feature, display_order)
          VALUES (${result[0].id}, ${plan.features[i]}, ${i})
        `
      }
    }
  }

  const existingCalc = await sql`SELECT id, base_price FROM calculator_items`
  const needsNairaCalc =
    forceRefreshPricing ||
    existingCalc.length === 0 ||
    existingCalc.some(c => Number(c.base_price || 0) > 0 && Number(c.base_price || 0) < 5000)

  if (needsNairaCalc) {
    await sql`DELETE FROM calculator_items`
    for (const item of DEFAULT_NAIRA_CALCULATOR) {
      await sql`
        INSERT INTO calculator_items (category, name, base_price, multiplier, display_order, description)
        VALUES (${item[0]}, ${item[1]}, ${item[2]}, ${item[3]}, ${item[4]}, ${item[5]})
      `
    }
  }

  isSeeded = true
  return true
}
