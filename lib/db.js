import { neon } from '@neondatabase/serverless'

let sql

export function getDb() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    sql = neon(process.env.DATABASE_URL)
  }
  return sql
}

export async function initDb() {
  const sql = getDb()

  // Settings table (key-value store for all site configuration)
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(255) PRIMARY KEY,
      value TEXT,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

  // Projects portfolio
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      description TEXT,
      url VARCHAR(500),
      status VARCHAR(50) DEFAULT 'LIVE',
      tags TEXT[],
      image_url TEXT,
      emoji VARCHAR(20) DEFAULT '🚀',
      banner_color VARCHAR(20) DEFAULT '#0A1628',
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

  // Service cards (homepage)
  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      name VARCHAR(500) NOT NULL,
      description TEXT,
      icon VARCHAR(20) DEFAULT '🌐',
      tags TEXT[],
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  // Pricing plans
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

  // Calculator service types
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

  // Contact form submissions
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

  // Quotation requests
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

  // Testimonials with approval workflow
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

  return true
}

export async function seedDefaults() {
  const sql = getDb()

  // Seed default settings
  const defaultSettings = {
    company_name: 'Anjal Ventures',
    company_tagline: "Building Africa's Digital Infrastructure",
    company_email: 'anjalventures@gmail.com',
    company_email2: 'contact@anjal.com',
    company_phone: '+234 000 000 0000',
    company_whatsapp: '2348164135836',
    company_address: 'Damaturu, Yobe State, Nigeria',
    company_cac: 'BN 9258709',
    company_tin: '2623553716975',
    hero_badge: 'CAC Registered · BN 9258709 · Active',
    about_text: 'Anjal Ventures is a registered Nigerian technology enterprise delivering world-class digital solutions to businesses, institutions, and organisations across Nigeria and the African continent. Operating under the technical brand Anjal Developers Team, we are headquartered in Damaturu, Yobe State — strategically positioned as a first-mover technology provider in one of Nigeria\'s most digitally underserved regions.',
    emailjs_public_key: '',
    emailjs_service_id: '',
    emailjs_template_id: '',
    footer_tagline: 'We Build Digital Excellence — From Damaturu to the World.',
    meta_description: "Nigeria's premier technology solutions company delivering world-class web development, mobile apps, AI, SaaS and digital transformation services.",
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

  // Check if services already seeded
  const existing = await sql`SELECT COUNT(*) as count FROM services`
  if (parseInt(existing[0].count) > 0) return

  // Seed default services
  const services = [
    { name: 'Web Development & Cloud Infrastructure', description: 'Custom websites, enterprise portals and full-stack web applications built on modern frameworks with serverless cloud backends, SSL security and CDN-delivered performance. From landing pages to complex e-commerce marketplaces.', icon: '🌐', tags: ['React / Next.js', 'AWS / Firebase', 'E-Commerce', 'CMS', 'SSL'], order: 1 },
    { name: 'Android Mobile App Development', description: 'Feature-rich native Android applications with intuitive UX, real-time backend sync, offline capability, and complete Google Play Store setup. Full source code ownership transferred to every client.', icon: '📱', tags: ['Java / Kotlin', 'React Native', 'Offline-First', 'Play Store'], order: 2 },
    { name: 'Enterprise SaaS Products', description: 'Multi-tenant subscription platforms — school management systems, hospital software, HR and payroll platforms. White-label SaaS for resellers with ongoing SLA management and maintenance.', icon: '☁️', tags: ['Multi-Tenant', 'White-Label', 'SLA Support', 'Subscriptions'], order: 3 },
    { name: 'AI & Business Automation', description: 'AI-powered application layers, intelligent workflow automation using n8n and Zapier, data vending API integration, RPA and intelligent document processing systems tailored for African businesses.', icon: '🤖', tags: ['OpenAI APIs', 'n8n / Zapier', 'NLP / Bots', 'RPA'], order: 4 },
    { name: 'Digital Solutions for SMEs', description: 'Complete digital identity setup — domain, hosting, email, payment gateway integration (Paystack), inventory and POS systems, CRM tools, and Google Business analytics setup for growing businesses.', icon: '💼', tags: ['Paystack', 'CRM', 'Inventory', 'Analytics'], order: 5 },
    { name: 'Technology Training Programmes', description: 'Structured bootcamps and workshops covering web development, digital literacy, corporate IT upskilling, freelancing readiness and technology education partnerships with institutions.', icon: '🎓', tags: ['Bootcamps', 'Corporate', 'Certification', 'Freelancing'], order: 6 },
  ]

  for (const s of services) {
    await sql`
      INSERT INTO services (name, description, icon, tags, display_order)
      VALUES (${s.name}, ${s.description}, ${s.icon}, ${s.tags}, ${s.order})
    `
  }

  // Seed default projects
  const projects = [
    { title: 'SaukiMart — Online Marketplace Platform', description: 'A fully operational e-commerce marketplace connecting vendors and buyers across Nigeria, with integrated payment processing, real-time order management, vendor portals, product catalogue management, inventory control and admin analytics dashboard with high-availability SSL-secured cloud hosting.', url: 'https://www.saukimart.online', status: 'LIVE', tags: ['Modern JS Framework', 'Serverless Cloud', 'NoSQL Database', 'Payment Gateway API', 'CDN Media Delivery'], emoji: '🛒', color: '#0A1628', order: 1 },
    { title: 'RamadanBot — AI-Powered Islamic Web Application', description: 'A sophisticated AI-powered web application delivering personalised Islamic guidance and Ramadan resources to Muslim communities worldwide. Features multilingual support, real-time AI responses, personalised context-aware experiences, and zero-downtime serverless infrastructure sustaining global peak-traffic.', url: 'https://www.ramadanbot.app', status: 'LIVE', tags: ['AI LLM Integration', 'Serverless Architecture', 'Multilingual NLP', 'Real-Time APIs', 'Conversational UI'], emoji: '🌙', color: '#112240', order: 2 },
  ]

  for (const p of projects) {
    await sql`
      INSERT INTO projects (title, description, url, status, tags, emoji, banner_color, display_order)
      VALUES (${p.title}, ${p.description}, ${p.url}, ${p.status}, ${p.tags}, ${p.emoji}, ${p.color}, ${p.order})
    `
  }

  // Seed pricing plans
  const plans = [
    { name: 'Starter', price: '$100', note: 'One-time · Perfect for small businesses', featured: false, cta: 'Get Started', order: 1, features: ['Professional 5-page website', 'Mobile responsive design', 'Contact form & Google Maps', 'SSL Security certificate', 'Basic SEO setup', '1 month free support'] },
    { name: 'Business', price: '$350', note: 'One-time · Full business platform', featured: true, cta: 'Get Started', order: 2, features: ['Full e-commerce or web app', 'Payment gateway integration', 'Admin dashboard & CMS', 'Mobile app (Android)', 'Cloud hosting setup', '3 months free support', 'Full source code ownership'] },
    { name: 'Enterprise', price: 'Custom', note: 'Scoped per project · Maximum capability', featured: false, cta: 'Request Quote', order: 3, features: ['Enterprise SaaS platform', 'AI & automation integration', 'Multi-tenant architecture', 'API development & licensing', 'White-label solutions', 'Dedicated SLA support', 'Full infrastructure ownership'] },
  ]

  for (const plan of plans) {
    const result = await sql`
      INSERT INTO pricing_plans (name, price, price_note, is_featured, cta_text, display_order)
      VALUES (${plan.name}, ${plan.price}, ${plan.note}, ${plan.featured}, ${plan.cta}, ${plan.order})
      RETURNING id
    `
    const planId = result[0].id
    for (let i = 0; i < plan.features.length; i++) {
      await sql`
        INSERT INTO pricing_features (plan_id, feature, display_order)
        VALUES (${planId}, ${plan.features[i]}, ${i})
      `
    }
  }

  // Seed calculator items
  const calcItems = [
    // Project types
    { category: 'type', name: 'Standard Website', base_price: 100, multiplier: 1.0, order: 1 },
    { category: 'type', name: 'E-Commerce Store', base_price: 250, multiplier: 1.0, order: 2 },
    { category: 'type', name: 'Web Application', base_price: 350, multiplier: 1.0, order: 3 },
    { category: 'type', name: 'Android Mobile App', base_price: 400, multiplier: 1.0, order: 4 },
    { category: 'type', name: 'SaaS Platform', base_price: 700, multiplier: 1.0, order: 5 },
    { category: 'type', name: 'AI / Automation Tool', base_price: 500, multiplier: 1.0, order: 6 },
    // Scale modifiers
    { category: 'scale', name: 'Small (1–5 pages)', base_price: 0, multiplier: 1.0, order: 1 },
    { category: 'scale', name: 'Medium (6–15 pages)', base_price: 120, multiplier: 1.0, order: 2 },
    { category: 'scale', name: 'Large (Full platform)', base_price: 280, multiplier: 1.0, order: 3 },
    { category: 'scale', name: 'Enterprise (Multi-system)', base_price: 600, multiplier: 1.0, order: 4 },
    // Timeline
    { category: 'timeline', name: 'Standard (4–8 weeks)', base_price: 0, multiplier: 1.0, order: 1 },
    { category: 'timeline', name: 'Rush (1–3 weeks +30%)', base_price: 0, multiplier: 1.3, order: 2 },
    { category: 'timeline', name: 'Flexible (10+ weeks −10%)', base_price: 0, multiplier: 0.9, order: 3 },
    // Support
    { category: 'support', name: 'No ongoing support', base_price: 0, multiplier: 1.0, order: 1 },
    { category: 'support', name: 'Basic (1 month)', base_price: 30, multiplier: 1.0, order: 2 },
    { category: 'support', name: 'Standard (3 months)', base_price: 80, multiplier: 1.0, order: 3 },
    { category: 'support', name: 'Premium (12 months)', base_price: 200, multiplier: 1.0, order: 4 },
    // Add-ons
    { category: 'addon', name: 'Payment Gateway', base_price: 200, multiplier: 1.0, order: 1 },
    { category: 'addon', name: 'Admin Dashboard', base_price: 150, multiplier: 1.0, order: 2 },
    { category: 'addon', name: 'AI Integration', base_price: 250, multiplier: 1.0, order: 3 },
    { category: 'addon', name: 'Email Notifications', base_price: 80, multiplier: 1.0, order: 4 },
    { category: 'addon', name: 'Analytics Dashboard', base_price: 120, multiplier: 1.0, order: 5 },
    { category: 'addon', name: 'Multi-language Support', base_price: 180, multiplier: 1.0, order: 6 },
  ]

  for (const item of calcItems) {
    await sql`
      INSERT INTO calculator_items (category, name, base_price, multiplier, display_order)
      VALUES (${item.category}, ${item.name}, ${item.base_price}, ${item.multiplier}, ${item.order})
    `
  }
}
