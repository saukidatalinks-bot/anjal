import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getDb } from '@/lib/db'

export async function GET() {
  const sql = getDb()
  const plans = await sql`SELECT * FROM pricing_plans ORDER BY display_order, id`
  const features = await sql`SELECT * FROM pricing_features ORDER BY plan_id, display_order`
  return NextResponse.json(plans.map(p => ({
    ...p,
    features: features.filter(f => f.plan_id === p.id).map(f => ({ id: f.id, feature: f.feature, display_order: f.display_order }))
  })))
}

export async function POST(request) {
  try {
    const sql = getDb()
    const { name, price, price_note, is_featured, cta_text, display_order, features } = await request.json()
    const result = await sql`
      INSERT INTO pricing_plans (name, price, price_note, is_featured, cta_text, display_order)
      VALUES (${name}, ${price}, ${price_note||null}, ${is_featured||false}, ${cta_text||'Get Started'}, ${display_order||0})
      RETURNING *
    `
    const planId = result[0].id
    if (features?.length) {
      for (let i = 0; i < features.length; i++) {
        await sql`INSERT INTO pricing_features (plan_id, feature, display_order) VALUES (${planId}, ${features[i]}, ${i})`
      }
    }
    // Revalidate homepage to show new pricing plan
    revalidatePath('/', 'layout')
    return NextResponse.json({ ...result[0], features: features || [] }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
