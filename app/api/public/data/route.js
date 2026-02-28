import { NextResponse } from 'next/server'
import { getDb, initDb, seedDefaults } from '@/lib/db'

export async function GET() {
  try {
    await initDb()
    await seedDefaults()
    const sql = getDb()

    const [settings, projects, services, pricingPlans, pricingFeatures, calcItems] = await Promise.all([
      sql`SELECT key, value FROM settings`,
      sql`SELECT * FROM projects WHERE is_active = true ORDER BY display_order ASC, id ASC`,
      sql`SELECT * FROM services WHERE is_active = true ORDER BY display_order ASC, id ASC`,
      sql`SELECT * FROM pricing_plans WHERE is_active = true ORDER BY display_order ASC, id ASC`,
      sql`SELECT pf.*, pp.name as plan_name FROM pricing_features pf JOIN pricing_plans pp ON pf.plan_id = pp.id ORDER BY pf.plan_id, pf.display_order`,
      sql`SELECT * FROM calculator_items WHERE is_active = true ORDER BY category, display_order ASC`,
    ])

    // Convert settings array to object
    const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]))

    // Attach features to plans
    const plansWithFeatures = pricingPlans.map(plan => ({
      ...plan,
      features: pricingFeatures.filter(f => f.plan_id === plan.id).map(f => f.feature),
    }))

    // Group calc items by category
    const calcByCategory = calcItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {})

    return NextResponse.json({
      settings: settingsMap,
      projects,
      services,
      pricingPlans: plansWithFeatures,
      calculator: calcByCategory,
    })
  } catch (err) {
    console.error('Public data error:', err)
    return NextResponse.json({ error: 'Failed to load site data' }, { status: 500 })
  }
}
