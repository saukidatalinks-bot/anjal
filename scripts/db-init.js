// scripts/db-init.js
// Run with: node scripts/db-init.js
// This script initializes the Neon database tables and seeds default data.

require('dotenv').config({ path: '.env.local' })

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not set in .env.local')
    process.exit(1)
  }

  console.log('🔗 Connecting to Neon database...')

  const { neon } = require('@neondatabase/serverless')
  const sql = neon(process.env.DATABASE_URL)

  console.log('📦 Creating tables...')

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
      emoji VARCHAR(20) DEFAULT '🚀',
      banner_color VARCHAR(20) DEFAULT '#0A1628',
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `
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

  console.log('✅ All tables created successfully!')
  console.log('')
  console.log('🌱 Seeding defaults will happen automatically on first admin login.')
  console.log('')
  console.log('🚀 Next steps:')
  console.log('   1. Run: npm run dev')
  console.log('   2. Visit: http://localhost:3000/admin/login')
  console.log('   3. Password: value of ADMIN_PASSWORD in .env.local')
  console.log('')
  process.exit(0)
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
