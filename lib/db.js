import { neon } from '@neondatabase/serverless'

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
    initPromise = runInitDb().then(() => {
      isInitialized = true
      return true
    }).catch(err => {
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
    INSERT INTO project_media (project_id, media_type, url, alt, orientation, display_order, is_primary)
    SELECT p.id, 'image', p.image_url, p.title, 'landscape', 0, true
    FROM projects p
    WHERE p.image_url IS NOT NULL
      AND p.image_url <> ''
      AND NOT EXISTS (
        SELECT 1 FROM project_media pm WHERE pm.project_id = p.id AND pm.url = p.image_url
      )
  `

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
      base_price DECIMAL(10,2) DEFAULT 0,
      multiplier DECIMAL(5,3) DEFAULT 1.0,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true
    )
  `
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
      total_amount DECIMAL(10,2),
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS reference VARCHAR(80)`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS quote_type VARCHAR(60) DEFAULT 'project'`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS project_title VARCHAR(255)`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS client_payload JSONB DEFAULT '{}'::jsonb`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS proposal_payload JSONB DEFAULT '{}'::jsonb`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS total_naira DECIMAL(14,2)`
  await sql`ALTER TABLE quotation_requests ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD'`
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

  await sql`
    CREATE TABLE IF NOT EXISTS app_presets (
      id SERIAL PRIMARY KEY,
      preset_key VARCHAR(120) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(120),
      description TEXT,
      base_price DECIMAL(10,2) DEFAULT 0,
      accent_color VARCHAR(20) DEFAULT '#2563EB',
      preview_config JSONB DEFAULT '{}'::jsonb,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS app_features (
      id SERIAL PRIMARY KEY,
      preset_id INTEGER REFERENCES app_presets(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      group_name VARCHAR(120) DEFAULT 'Core',
      price DECIMAL(10,2) DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_app_features_preset_name ON app_features (preset_id, name)`

  await sql`
    CREATE TABLE IF NOT EXISTS app_studio_submissions (
      id SERIAL PRIMARY KEY,
      reference VARCHAR(80),
      preset_key VARCHAR(120),
      app_name VARCHAR(255),
      client_name VARCHAR(255),
      company VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50),
      logo_url TEXT,
      configuration JSONB DEFAULT '{}'::jsonb,
      selected_features JSONB DEFAULT '[]'::jsonb,
      total_amount DECIMAL(10,2) DEFAULT 0,
      total_naira DECIMAL(14,2),
      status VARCHAR(40) DEFAULT 'new',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

    return true
}

async function countRows(sql, tableName) {
  let result
  if (tableName === 'services') result = await sql`SELECT COUNT(*)::int AS count FROM services`
  else if (tableName === 'projects') result = await sql`SELECT COUNT(*)::int AS count FROM projects`
  else if (tableName === 'pricing_plans') result = await sql`SELECT COUNT(*)::int AS count FROM pricing_plans`
  else if (tableName === 'calculator_items') result = await sql`SELECT COUNT(*)::int AS count FROM calculator_items`
  else throw new Error(`Unsupported count table: ${tableName}`)
  return result[0]?.count || 0
}

export async function seedDefaults() {
  if (isSeeded) return true
  const sql = getDb()

  const defaultSettings = {
    company_name: 'Anjal Solutions LTD',
    company_tagline: 'Software and digital platforms built for real operations',
    company_email: 'contact@anjalventures.com',
    company_email2: 'office@anjalsolutionsltd.com',
    company_phone: '+234 816 413 5836',
    company_whatsapp: '2348164135836',
    company_address: 'No. 4, Kolomi Ali Street, Njiwaji Layout Sabon Fegi, Damaturu, Yobe State, Nigeria',
    company_cac: '9854225',
    company_tin: '2623598796685',
    hero_badge: 'RC: 9854225 · TIN: 2623598796685',
    hero_title: 'We build software and digital platforms that businesses rely on.',
    hero_description: 'From custom web platforms and mobile applications to business management systems and practical automation, Anjal Solutions LTD turns real business ideas into dependable digital products. Built and maintained from Nigeria.',
    hero_tagline: 'Simple to use. Built to last. Ready to grow.',
    about_text: 'Anjal Solutions LTD (formerly Anjal Ventures) is an incorporated Nigerian technology company. We build practical, dependable digital systems, mobile apps, and business platforms for companies, institutions, and growing teams.',
    emailjs_public_key: '',
    emailjs_service_id: '',
    emailjs_template_id: '',
    footer_tagline: 'Dependable digital products from Damaturu to the world.',
    meta_description: 'Anjal Solutions LTD builds custom websites, mobile applications, business platforms, and practical digital solutions for Nigerian businesses and international clients.',
    exchange_rate: '1400',
    stats_smes: '42',
    stats_undigitised: '70',
    stats_starting_price: '100',
    stats_services: '6',
  }

  for (const [key, value] of Object.entries(defaultSettings)) {
    await sql`
      INSERT INTO settings (key, value) VALUES (${key}, ${value})
      ON CONFLICT (key) DO NOTHING
    `
  }

  await sql`
    UPDATE settings
    SET value = 'Anjal Solutions LTD', updated_at = NOW()
    WHERE key = 'company_name'
      AND (value = 'Anjal Ventures' OR value IS NULL OR value = '')
  `

  await sql`
    UPDATE settings
    SET value = ${defaultSettings.company_address}, updated_at = NOW()
    WHERE key = 'company_address'
      AND (value LIKE '%MJG%' OR value = 'Damaturu, Yobe State, Nigeria' OR value IS NULL)
  `

  await sql`
    UPDATE settings
    SET value = '9854225', updated_at = NOW()
    WHERE key = 'company_cac'
      AND (value = '9258709' OR value LIKE 'BN%' OR value LIKE 'BN %' OR value IS NULL OR value = '')
  `

  await sql`
    UPDATE settings
    SET value = '2623598796685', updated_at = NOW()
    WHERE key = 'company_tin'
      AND (value = '2623553716975' OR value IS NULL OR value = '')
  `

  await sql`
    UPDATE settings
    SET value = ${defaultSettings.hero_badge}, updated_at = NOW()
    WHERE key = 'hero_badge'
      AND (value LIKE '%9258709%' OR value LIKE '%BN%' OR value LIKE '%D-U-N-S%' OR value LIKE '%352294840%')
  `

  await sql`
    DELETE FROM settings WHERE key = 'company_duns'
  `

  await sql`
    UPDATE settings
    SET value = 'contact@anjalventures.com', updated_at = NOW()
    WHERE key = 'company_email'
      AND (value = 'anjalventures@gmail.com' OR value LIKE '%@gmail.com')
  `

  await sql`
    UPDATE settings
    SET value = 'office@anjalsolutionsltd.com', updated_at = NOW()
    WHERE key = 'company_email2'
      AND (value = 'contact@anjal.com' OR value LIKE '%@anjal.com' OR value = 'developers@anjalventures.com' OR value IS NULL OR value = '')
  `

  if (await countRows(sql, 'services') === 0) {
    const services = [
      { name: 'Web Platforms', description: 'Corporate websites, portals, e-commerce systems, dashboards, and full-stack platforms designed for speed, clarity, and long-term maintainability.', icon: 'globe', tags: ['Next.js', 'Cloud', 'CMS', 'E-commerce'], order: 1 },
      { name: 'Mobile App Development', description: 'Android and cross-platform mobile applications with product strategy, user flows, API integration, releases, and post-launch support.', icon: 'smartphone', tags: ['Android', 'React Native', 'APIs', 'Play Store'], order: 2 },
      { name: 'SaaS and Internal Systems', description: 'Multi-tenant SaaS products, admin dashboards, workflow systems, school, hospital, HR, logistics, and finance platforms.', icon: 'layers', tags: ['SaaS', 'Dashboards', 'Multi-tenant'], order: 3 },
      { name: 'AI and Automation', description: 'AI-enabled workflows, chat assistants, business automation, document intelligence, and API orchestration for operational teams.', icon: 'sparkles', tags: ['AI', 'Automation', 'n8n', 'OpenAI'], order: 4 },
      { name: 'Digital Operations for SMEs', description: 'Payment, inventory, CRM, analytics, domain, hosting, email, and operational tooling for businesses moving from manual to digital.', icon: 'briefcase', tags: ['Payments', 'CRM', 'POS', 'Analytics'], order: 5 },
      { name: 'Technology Training', description: 'Bootcamps, corporate upskilling, digital literacy, and practical product-building programs for institutions and teams.', icon: 'graduation-cap', tags: ['Training', 'Workshops', 'Mentorship'], order: 6 },
    ]
    for (const s of services) {
      await sql`
        INSERT INTO services (name, description, icon, tags, display_order)
        VALUES (${s.name}, ${s.description}, ${s.icon}, ${s.tags}, ${s.order})
      `
    }
  }

  if (await countRows(sql, 'projects') === 0) {
    const projects = [
      {
        title: 'SaukiMart Online Marketplace',
        slug: 'saukimart-online-marketplace',
        description: 'A live marketplace connecting vendors and buyers with payment processing, order management, vendor portals, product catalogues, inventory, and admin analytics.',
        url: 'https://www.saukimart.online',
        status: 'LIVE',
        tags: ['Marketplace', 'Payments', 'Vendor Portal', 'Analytics'],
        project_type: 'website',
        industry: 'Commerce',
        client_name: 'SaukiMart',
        role: 'Product strategy, web platform engineering, cloud deployment',
        outcomes: ['Vendor onboarding flow', 'Secure checkout', 'Admin reporting'],
        featured: true,
        order: 1,
      },
      {
        title: 'RamadanBot AI Web Application',
        slug: 'ramadanbot-ai-web-application',
        description: 'An AI-powered Islamic web application delivering personalized guidance and Ramadan resources with multilingual support and production serverless infrastructure.',
        url: 'https://www.ramadanbot.app',
        status: 'LIVE',
        tags: ['AI', 'Serverless', 'Multilingual', 'Conversational UI'],
        project_type: 'saas',
        industry: 'AI and Community',
        client_name: 'RamadanBot',
        role: 'AI product architecture and full-stack implementation',
        outcomes: ['Real-time AI responses', 'Global access', 'Scalable infrastructure'],
        featured: true,
        order: 2,
      },
    ]
    for (const p of projects) {
      await sql`
        INSERT INTO projects (title, slug, description, url, status, tags, project_type, industry, client_name, role, outcomes, featured, display_order)
        VALUES (${p.title}, ${p.slug}, ${p.description}, ${p.url}, ${p.status}, ${p.tags}, ${p.project_type}, ${p.industry}, ${p.client_name}, ${p.role}, ${p.outcomes}, ${p.featured}, ${p.order})
      `
    }
  }

  if (await countRows(sql, 'pricing_plans') === 0) {
    const plans = [
      { name: 'Launch', price: '$100+', note: 'For professional websites and landing systems', featured: false, cta: 'Start a Quote', order: 1, features: ['Discovery and sitemap', 'Responsive interface', 'Contact and lead capture', 'Analytics-ready structure', 'Basic SEO foundations'] },
      { name: 'Growth', price: '$350+', note: 'For apps, portals, commerce, and dashboards', featured: true, cta: 'Build With Us', order: 2, features: ['Product architecture', 'Admin dashboard', 'Payment/API integration', 'Cloud deployment', 'Three months support'] },
      { name: 'Enterprise', price: 'Custom', note: 'For SaaS, automation, and multi-system builds', featured: false, cta: 'Request Proposal', order: 3, features: ['Technical scoping', 'Multi-role workflows', 'Data and API architecture', 'SLA support options', 'Roadmap partnership'] },
    ]
    for (const plan of plans) {
      const result = await sql`
        INSERT INTO pricing_plans (name, price, price_note, is_featured, cta_text, display_order)
        VALUES (${plan.name}, ${plan.price}, ${plan.note}, ${plan.featured}, ${plan.cta}, ${plan.order})
        RETURNING id
      `
      for (let i = 0; i < plan.features.length; i++) {
        await sql`INSERT INTO pricing_features (plan_id, feature, display_order) VALUES (${result[0].id}, ${plan.features[i]}, ${i})`
      }
    }
  }

  if (await countRows(sql, 'calculator_items') === 0) {
    const calcItems = [
      ['type', 'Corporate Website', 100, 1, 1, 'Premium business website with brand, content, contact, and conversion sections.'],
      ['type', 'E-commerce Platform', 300, 1, 2, 'Catalogues, checkout, payments, orders, inventory, and admin tools.'],
      ['type', 'Web Application', 450, 1, 3, 'Authenticated web app with dashboards, workflows, and database-backed features.'],
      ['type', 'Mobile Application', 500, 1, 4, 'Android or cross-platform app with backend and release support.'],
      ['type', 'SaaS Platform', 900, 1, 5, 'Multi-role or multi-tenant product with subscription-ready architecture.'],
      ['scale', 'Focused MVP', 0, 1, 1, 'Core workflow and launch-ready scope.'],
      ['scale', 'Growth Build', 180, 1, 2, 'Expanded workflows, integrations, and admin control.'],
      ['scale', 'Enterprise System', 700, 1, 3, 'Advanced roles, reporting, integrations, and governance.'],
      ['timeline', 'Standard delivery', 0, 1, 1, 'Balanced discovery, design, build, and QA cadence.'],
      ['timeline', 'Accelerated delivery', 0, 1.3, 2, 'Priority timeline with compressed delivery cycle.'],
      ['timeline', 'Flexible delivery', 0, 0.9, 3, 'Longer delivery window with cost efficiency.'],
      ['support', 'Launch support', 0, 1, 1, 'Standard post-launch handoff.'],
      ['support', 'Growth support', 100, 1, 2, 'Priority support and small improvements after launch.'],
      ['support', 'Managed support', 300, 1, 3, 'Ongoing monitoring, maintenance, and roadmap support.'],
      ['addon', 'Admin Dashboard', 150, 1, 1, 'Manage content, users, records, and workflows.'],
      ['addon', 'Payment Integration', 200, 1, 2, 'Paystack, wallet, billing, or invoice flows.'],
      ['addon', 'AI Assistant', 300, 1, 3, 'AI chat, document, recommendation, or automation layer.'],
      ['addon', 'Analytics Dashboard', 160, 1, 4, 'Operational metrics, charts, and reports.'],
      ['addon', 'Notifications', 100, 1, 5, 'Email, SMS, WhatsApp, or in-app notifications.'],
    ]
    for (const item of calcItems) {
      await sql`
        INSERT INTO calculator_items (category, name, base_price, multiplier, display_order, description)
        VALUES (${item[0]}, ${item[1]}, ${item[2]}, ${item[3]}, ${item[4]}, ${item[5]})
      `
    }
  }

  await seedAppStudioDefaults(sql)
  isSeeded = true
  return true
}

async function seedAppStudioDefaults(sql) {
  const presets = [
    {
      key: 'vtu-data-selling',
      name: 'VTU Data Selling App',
      category: 'Finance and utilities',
      description: 'A wallet-first app for airtime, data, electricity, cable TV, transaction history, and customer self-service.',
      base: 650,
      color: '#2563EB',
      order: 1,
      preview: {
        layout: 'vtu',
        services: ['Airtime', 'Data', 'Electricity', 'Cable TV'],
        bank: 'Sterling Bank',
        accountNumber: '9032145680',
        balance: 'NGN 125,400',
      },
      features: [
        ['Wallet funding', 'Core wallet balance, funding notices, and transaction state.', 'Wallet', 120],
        ['Airtime purchase', 'Buy airtime for all major networks.', 'Services', 80],
        ['Data bundles', 'Sell network data bundles with order tracking.', 'Services', 120],
        ['Electricity bills', 'Meter payment flow with token display.', 'Services', 130],
        ['Cable TV bills', 'DSTV, GOtv, and Startimes payment flow.', 'Services', 120],
        ['Admin settlement dashboard', 'Track revenue, users, commissions, and failures.', 'Admin', 220],
      ],
    },
    {
      key: 'marketplace',
      name: 'Marketplace App',
      category: 'Commerce',
      description: 'A buyer-seller marketplace with catalogues, carts, checkout, vendor management, and order fulfilment.',
      base: 780,
      color: '#0F766E',
      order: 2,
      preview: { layout: 'commerce', services: ['Browse', 'Cart', 'Orders', 'Vendors'] },
      features: [
        ['Vendor accounts', 'Vendor onboarding, stores, and product management.', 'Commerce', 180],
        ['Checkout and payments', 'Cart, address, payment, and receipt flow.', 'Commerce', 220],
        ['Order tracking', 'Order states, notifications, and fulfilment.', 'Operations', 150],
      ],
    },
    {
      key: 'booking',
      name: 'Booking App',
      category: 'Services',
      description: 'Appointment booking, schedules, availability, payments, reminders, and staff workflows.',
      base: 520,
      color: '#7C3AED',
      order: 3,
      preview: { layout: 'booking', services: ['Book', 'Calendar', 'Pay', 'Reminders'] },
      features: [
        ['Calendar availability', 'Slots, staff availability, and blocked dates.', 'Scheduling', 140],
        ['Deposits', 'Booking deposits and payment confirmation.', 'Payments', 160],
        ['Reminders', 'Email, SMS, or WhatsApp reminders.', 'Automation', 100],
      ],
    },
    {
      key: 'education',
      name: 'Education App',
      category: 'Learning',
      description: 'Courses, lessons, assessments, student portals, payments, and admin reporting.',
      base: 700,
      color: '#D97706',
      order: 4,
      preview: { layout: 'learning', services: ['Courses', 'Lessons', 'Tests', 'Progress'] },
      features: [
        ['Course library', 'Manage course modules and learning content.', 'Learning', 180],
        ['Assessments', 'Quizzes, results, and certificates.', 'Learning', 140],
        ['Student dashboard', 'Progress, profile, and payment status.', 'Portal', 160],
      ],
    },
    {
      key: 'health',
      name: 'Healthcare App',
      category: 'Health',
      description: 'Patient intake, appointments, records, reminders, and clinic administration.',
      base: 850,
      color: '#DC2626',
      order: 5,
      preview: { layout: 'health', services: ['Patients', 'Visits', 'Records', 'Care'] },
      features: [
        ['Patient records', 'Structured patient profiles and visit history.', 'Clinical', 220],
        ['Appointment queue', 'Booking, check-in, and clinic queue management.', 'Operations', 150],
        ['Care reminders', 'Follow-up reminders and patient messages.', 'Automation', 100],
      ],
    },
    {
      key: 'custom-saas',
      name: 'Custom SaaS Platform',
      category: 'SaaS',
      description: 'A custom subscription-ready platform with roles, dashboards, workflow logic, and analytics.',
      base: 1100,
      color: '#111827',
      order: 6,
      preview: { layout: 'saas', services: ['Dashboard', 'Teams', 'Billing', 'Reports'] },
      features: [
        ['Multi-role access', 'Owner, admin, team, and customer permissions.', 'Platform', 220],
        ['Subscription-ready billing', 'Plan, invoice, and entitlement foundations.', 'Billing', 260],
        ['Analytics reporting', 'Usage, revenue, and operational reporting.', 'Insights', 220],
      ],
    },
  ]

  for (const preset of presets) {
    const result = await sql`
      INSERT INTO app_presets (preset_key, name, category, description, base_price, accent_color, preview_config, display_order)
      VALUES (${preset.key}, ${preset.name}, ${preset.category}, ${preset.description}, ${preset.base}, ${preset.color}, ${JSON.stringify(preset.preview)}::jsonb, ${preset.order})
      ON CONFLICT (preset_key) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        description = EXCLUDED.description,
        base_price = EXCLUDED.base_price,
        accent_color = EXCLUDED.accent_color,
        preview_config = EXCLUDED.preview_config,
        display_order = EXCLUDED.display_order,
        updated_at = NOW()
      RETURNING id
    `
    const presetId = result[0].id
    for (let i = 0; i < preset.features.length; i++) {
      const [name, description, group, price] = preset.features[i]
      await sql`
        INSERT INTO app_features (preset_id, name, description, group_name, price, display_order)
        VALUES (${presetId}, ${name}, ${description}, ${group}, ${price}, ${i})
        ON CONFLICT (preset_id, name) DO UPDATE SET
          description = EXCLUDED.description,
          group_name = EXCLUDED.group_name,
          price = EXCLUDED.price,
          display_order = EXCLUDED.display_order
      `
    }
  }
}
