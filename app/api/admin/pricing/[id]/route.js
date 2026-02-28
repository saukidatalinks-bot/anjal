import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getDb } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const sql = getDb()
    const [plan] = await sql`SELECT * FROM pricing_plans WHERE id = ${params.id}`
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }
    const features = await sql`SELECT * FROM pricing_features WHERE plan_id = ${params.id} ORDER BY display_order`
    return NextResponse.json({ ...plan, features: features.map(f => f.feature) })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const sql = getDb()
    const { name, price, price_note, is_featured, cta_text, display_order, is_active, features } = await request.json()
    const result = await sql`
      UPDATE pricing_plans SET name=${name}, price=${price}, price_note=${price_note||null},
        is_featured=${is_featured||false}, cta_text=${cta_text||'Get Started'},
        display_order=${display_order||0}, is_active=${is_active!==false}
      WHERE id = ${params.id} RETURNING *
    `
    // Replace features
    await sql`DELETE FROM pricing_features WHERE plan_id = ${params.id}`
    if (features?.length) {
      for (let i = 0; i < features.length; i++) {
        await sql`INSERT INTO pricing_features (plan_id, feature, display_order) VALUES (${params.id}, ${features[i]}, ${i})`
      }
    }
    // Revalidate homepage to show updated pricing
    revalidatePath('/', 'layout')
    return NextResponse.json({ ...result[0], features: features || [] })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const sql = getDb()
    await sql`DELETE FROM pricing_plans WHERE id = ${params.id}`
    // Revalidate homepage to remove pricing plan
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
