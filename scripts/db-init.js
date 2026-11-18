// scripts/db-init.js
// Run with: node scripts/db-init.js
// Initializes Neon PostgreSQL tables and seeds/migrates Anjal Solutions LTD defaults.

const fs = require('fs')
const path = require('path')

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex <= 0) continue
    const key = trimmed.slice(0, eqIndex).trim()
    let val = trimmed.slice(eqIndex + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) {
      process.env[key] = val
    }
  }
}

async function main() {
  loadEnvLocal()

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in .env.local or environment')
    process.exit(1)
  }

  const { initDb, seedDefaults } = await import('../lib/db.js')
  console.log('Connecting to Neon PostgreSQL and initializing schema...')
  await initDb()
  console.log('Seeding Naira pricing plans, calculator items, and corporate settings...')
  await seedDefaults({ forceRefreshPricing: true })
  console.log('Database initialized and synced successfully.')
}

main().catch(err => {
  console.error('Database initialization failed:', err)
  process.exit(1)
})
